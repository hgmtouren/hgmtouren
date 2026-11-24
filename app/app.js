/* =========================================================
   HGM Resultat – mobilapp för att föra in score på banan.
   Allt sparas lokalt i telefonen (localStorage) tills en
   gemensam databas kopplas på. Se README för nästa steg.
   ========================================================= */
(function () {
  const H = window.HGM;
  const KEY_ACTIVE = "hgm.active", KEY_ROUNDS = "hgm.rounds", KEY_COURSES = "hgm.courses";
  const DEFAULT_PAR = [4, 4, 3, 5, 4, 4, 3, 4, 5, 4, 3, 4, 5, 4, 4, 3, 4, 5];
  const DEFAULT_IDX = [7, 1, 15, 11, 3, 9, 17, 5, 13, 8, 16, 2, 12, 4, 10, 18, 6, 14];

  const $view = document.getElementById("view");
  const $sub = document.getElementById("top-sub"), $main = document.getElementById("top-main");
  const $menu = document.getElementById("btn-menu");
  const $sheet = document.getElementById("sheet"), $sheetBg = document.getElementById("sheet-bg");
  const $toast = document.getElementById("toast");

  /* ── Lagring (tål privat läge där localStorage kan saknas) ── */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { toast("Kunde inte spara i telefonen"); } },
    del(k) { try { localStorage.removeItem(k); } catch {} }
  };

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const img = id => `../assets/img/spelare/${H.byId(id).img}.jpg`;
  const nick = id => H.byId(id).nick;
  const fmtName = id => (H.formats.find(f => f.id === id) || {}).name || id;
  const today = () => new Date().toISOString().slice(0, 10);
  const sum = a => a.reduce((s, v) => s + (v || 0), 0);

  let round = store.get(KEY_ACTIVE, null);
  let draft = null; // under uppstart
  const save = () => store.set(KEY_ACTIVE, round);

  /* ── Beräkningar ── */
  // Antal extraslag på ett hål. Plushandicap (negativ) ger tillbaka slag på de lättaste hålen.
  const received = (hcp, idx) => hcp >= 0
    ? Math.floor(hcp / 18) + (idx <= hcp % 18 ? 1 : 0)
    : (idx > 18 + hcp ? -1 : 0);
  function stats(r, pid) {
    const p = r.players.find(x => x.id === pid), s = r.scores[pid];
    let gross = 0, par = 0, rec = 0, pts = 0, played = 0;
    s.forEach((v, i) => {
      if (v == null) return;
      const st = received(p.hcp, r.index[i]);
      played++; gross += v; par += r.par[i]; rec += st;
      pts += Math.max(0, r.par[i] + st - v + 2);
    });
    return { gross, net: gross - rec, toPar: gross - par, netToPar: gross - rec - par, pts, played,
      out: sum(s.slice(0, 9)), in: sum(s.slice(9)) };
  }
  const rel = n => n === 0 ? "E" : (n > 0 ? "+" + n : "−" + Math.abs(n));
  function cls(v, par) {
    if (v == null) return "empty";
    const d = v - par;
    return d <= -2 ? "eagle" : d === -1 ? "birdie" : d === 0 ? "par" : d === 1 ? "bogey" : "double";
  }
  function leaderboard(r) {
    const rows = r.players.map(p => ({ id: p.id, hcp: p.hcp, ...stats(r, p.id) }));
    if (r.format === "stableford") rows.sort((a, b) => b.pts - a.pts || a.net - b.net);
    else rows.sort((a, b) => a.netToPar - b.netToPar || b.pts - a.pts);
    return rows;
  }

  /* ── UI-hjälp ── */
  function toast(msg) {
    $toast.textContent = msg; $toast.hidden = false;
    clearTimeout(toast.t); toast.t = setTimeout(() => $toast.hidden = true, 2200);
  }
  function sheet(html, bind) {
    $sheet.innerHTML = html; $sheet.hidden = false; $sheetBg.hidden = false;
    if (bind) bind($sheet);
  }
  function closeSheet() { $sheet.hidden = true; $sheetBg.hidden = true; }
  $sheetBg.addEventListener("click", closeSheet);
  function header(sub, main, menu) { $sub.textContent = sub; $main.textContent = main; $menu.hidden = !menu; }
  const vibrate = () => { try { navigator.vibrate && navigator.vibrate(8); } catch {} };
  const ICON = {
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7M16 6l-4-4-4 4M12 2v14"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    card: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 10h18M9 4v16"/></svg>'
  };

  /* =======================================================
     VY: Start
     ======================================================= */
  function viewHome() {
    header("HGM Touren " + H.season, "Resultat", false);
    const rounds = store.get(KEY_ROUNDS, []);
    $view.innerHTML = `
      ${round ? `
        <button class="card item" id="resume" style="margin-bottom:14px">
          <div class="grow"><b>${esc(round.course)}</b><small>${fmtName(round.format)} · ${round.players.map(p => nick(p.id)).join(", ")}</small></div>
          <span class="pill live">● Pågår</span>
        </button>` : ""}
      <div class="hero-card">
        <small style="color:var(--accent);font-weight:700;letter-spacing:.1em;font-size:.72rem">NY RUNDA</small>
        <h2>Dags att slå ut?</h2>
        <p>Välj bana, spelform och vilka som går i bollen. Sedan knappar du in slagen hål för hål.</p>
        <button class="btn btn-accent" id="new">${ICON.plus} Starta ny runda</button>
      </div>
      <span class="label">Sparade rundor</span>
      <div class="list">
        ${rounds.length ? rounds.slice().reverse().map((r, i) => {
          const lb = leaderboard(r)[0];
          return `<button class="card item" data-open="${rounds.length - 1 - i}">
            <div class="grow"><b>${esc(r.course)}</b><small>${r.date} · ${fmtName(r.format)} · ${r.players.length} spelare</small></div>
            <span class="pill">🏆 ${nick(lb.id)}</span></button>`;
        }).join("") : `<div class="card item"><small>Inga sparade rundor än. De dyker upp här när du avslutat en runda.</small></div>`}
      </div>`;
    document.getElementById("new").onclick = () => {
      if (round && !confirm("Du har en pågående runda. Vill du kasta den och starta en ny?")) return;
      draft = { course: "", date: today(), format: "netto", players: [], par: DEFAULT_PAR.slice(), index: DEFAULT_IDX.slice() };
      viewSetup();
    };
    const r = document.getElementById("resume"); if (r) r.onclick = () => viewHole();
    $view.querySelectorAll("[data-open]").forEach(b => b.onclick = () => viewCard(store.get(KEY_ROUNDS, [])[+b.dataset.open], true));
  }

  /* =======================================================
     VY: Ny runda
     ======================================================= */
  function viewSetup() {
    header("Ny runda", "Inställningar", false);
    const courses = store.get(KEY_COURSES, {});
    const ranked = H.ranked();
    $view.innerHTML = `
      <span class="label" style="margin-top:4px">Bana & datum</span>
      <input class="field" id="course" list="courses" placeholder="T.ex. Araslöv" value="${esc(draft.course)}" autocomplete="off">
      <datalist id="courses">${Object.keys(courses).map(c => `<option value="${esc(c)}">`).join("")}</datalist>
      <div style="height:10px"></div>
      <input class="field" id="date" type="date" value="${draft.date}">

      <span class="label">Spelform</span>
      <div class="formats">${H.formats.map(f => `
        <button class="opt ${draft.format === f.id ? "on" : ""}" data-fmt="${f.id}"><span class="radio"></span>
        <span><b>${f.name}</b><small>${f.desc}</small></span></button>`).join("")}</div>

      <span class="label">Spelare i bollen <span id="cnt" style="color:var(--ink)"></span></span>
      <div class="roster">${ranked.map(p => `
        <button class="pick" data-pid="${p.id}"><span class="n"></span><img src="${img(p.id)}" alt=""><b>${esc(p.nick)}</b></button>`).join("")}</div>

      <div id="hcp-wrap"></div>
      <div class="dock"><div class="dock-inner">
        <button class="btn btn-line sq" id="cancel" aria-label="Tillbaka">${ICON.left}</button>
        <button class="btn btn-dark" id="start">Starta rundan</button>
      </div></div>`;

    const courseEl = document.getElementById("course");
    courseEl.oninput = () => {
      draft.course = courseEl.value;
      const c = courses[courseEl.value.trim()];
      if (c) { draft.par = c.par.slice(); draft.index = c.index.slice(); toast("Banans par & index hämtade"); }
    };
    document.getElementById("date").onchange = e => draft.date = e.target.value;
    $view.querySelectorAll("[data-fmt]").forEach(b => b.onclick = () => {
      draft.format = b.dataset.fmt;
      $view.querySelectorAll("[data-fmt]").forEach(x => x.classList.toggle("on", x === b));
    });
    $view.querySelectorAll("[data-pid]").forEach(b => b.onclick = () => {
      const id = b.dataset.pid, i = draft.players.findIndex(p => p.id === id);
      if (i >= 0) draft.players.splice(i, 1); else draft.players.push({ id, hcp: lastHcp(id) });
      vibrate(); refreshPicks();
    });
    document.getElementById("cancel").onclick = () => { draft = null; viewHome(); };
    document.getElementById("start").onclick = () => {
      draft.course = courseEl.value.trim();
      if (!draft.course) { toast("Skriv in vilken bana ni spelar"); courseEl.focus(); return; }
      if (!draft.players.length) { toast("Välj minst en spelare"); return; }
      round = { id: Date.now().toString(36), ...draft, scores: {}, cur: 0, started: new Date().toISOString() };
      round.players.forEach(p => round.scores[p.id] = Array(18).fill(null));
      draft = null; save(); viewHole();
    };
    refreshPicks();
  }
  function lastHcp(id) {
    const rs = store.get(KEY_ROUNDS, []);
    for (let i = rs.length - 1; i >= 0; i--) { const p = rs[i].players.find(x => x.id === id); if (p) return p.hcp; }
    return 18;
  }
  function refreshPicks() {
    $view.querySelectorAll("[data-pid]").forEach(b => {
      const i = draft.players.findIndex(p => p.id === b.dataset.pid);
      b.classList.toggle("on", i >= 0); b.querySelector(".n").textContent = i + 1;
    });
    document.getElementById("cnt").textContent = draft.players.length ? `· ${draft.players.length} valda` : "";
    document.getElementById("hcp-wrap").innerHTML = draft.players.length ? `
      <span class="label">Spelhandicap (antal slag)</span>
      <div class="hcp-list">${draft.players.map(p => `
        <div class="card hcp"><img src="${img(p.id)}" alt=""><b>${esc(nick(p.id))}</b>
        <input type="number" inputmode="numeric" min="-10" max="54" value="${p.hcp}" data-hcp="${p.id}" aria-label="Handicap ${esc(nick(p.id))}"></div>`).join("")}</div>` : "";
    $view.querySelectorAll("[data-hcp]").forEach(inp => inp.oninput = () => {
      const p = draft.players.find(x => x.id === inp.dataset.hcp); p.hcp = parseInt(inp.value, 10) || 0;
    });
  }

  /* =======================================================
     VY: Hål för hål
     ======================================================= */
  function viewHole() {
    const r = round, h = r.cur, par = r.par[h];
    header(`${r.course} · ${fmtName(r.format)}`, `Hål ${h + 1}`, true);
    $view.innerHTML = `
      <div class="holes" id="holes">${r.par.map((_, i) => {
        const done = r.players.every(p => r.scores[p.id][i] != null);
        return `<button class="hdot ${i === h ? "cur" : done ? "done" : ""}" data-go="${i}">${i + 1}</button>`;
      }).join("")}</div>

      <div class="card holehead">
        <div class="num">${h + 1}<small>${h < 9 ? "Ut" : "In"}</small></div>
        <div class="meta">
          <button class="meta-btn" id="set-par"><small>Par</small><b>${par}</b></button>
          <button class="meta-btn" id="set-idx"><small>Index</small><b>${r.index[h]}</b></button>
        </div>
      </div>

      <div class="scores">${r.players.map(p => {
        const v = r.scores[p.id][h], st = stats(r, p.id), extra = received(p.hcp, r.index[h]);
        return `<div class="card score">
          <img src="${img(p.id)}" alt="">
          <div class="who"><b>${esc(nick(p.id))}${extra ? ` <span style="color:var(--muted);font-weight:500">${"•".repeat(extra)}</span>` : ""}</b>
            <small>${st.played ? `${st.gross} slag · ${rel(st.netToPar)} netto · ${st.pts} p` : `Hcp ${p.hcp}`}</small></div>
          <div class="stepper">
            <button class="step" data-dec="${p.id}" aria-label="Minska">−</button>
            <button class="val ${cls(v, par)}" data-num="${p.id}">${v ?? "–"}</button>
            <button class="step" data-inc="${p.id}" aria-label="Öka">+</button>
          </div></div>`;
      }).join("")}</div>
      <p style="text-align:center;color:var(--muted);font-size:.8rem;margin-top:14px">Prickarna visar extraslag på hålet. Tryck på siffran för att välja direkt.</p>

      <div class="dock"><div class="dock-inner">
        <button class="btn btn-line sq" id="prev" ${h === 0 ? "disabled" : ""} aria-label="Föregående hål">${ICON.left}</button>
        <button class="btn btn-line sq" id="card" aria-label="Scorekort">${ICON.card}</button>
        <button class="btn btn-dark" id="next">${h === 17 ? "Visa resultat" : `Nästa hål →`}</button>
      </div></div>`;

    const setScore = (pid, v) => { r.scores[pid][h] = v; save(); vibrate(); viewHole(); };
    $view.querySelectorAll("[data-inc]").forEach(b => b.onclick = () => {
      const v = r.scores[b.dataset.inc][h]; setScore(b.dataset.inc, v == null ? par : Math.min(15, v + 1));
    });
    $view.querySelectorAll("[data-dec]").forEach(b => b.onclick = () => {
      const v = r.scores[b.dataset.dec][h]; setScore(b.dataset.dec, v == null ? par - 1 : Math.max(1, v - 1));
    });
    $view.querySelectorAll("[data-num]").forEach(b => b.onclick = () => {
      const pid = b.dataset.num, cur = r.scores[pid][h];
      sheet(`<h3>${esc(nick(pid))} · hål ${h + 1}</h3>
        <div class="numpad">${Array.from({ length: 12 }, (_, i) => i + 1).map(n => `<button class="${n === cur ? "on" : ""}" data-n="${n}">${n}</button>`).join("")}
        <button data-n="" style="grid-column:span 4;font-size:1rem">Rensa</button></div>`, s => {
        s.querySelectorAll("[data-n]").forEach(x => x.onclick = () => { closeSheet(); setScore(pid, x.dataset.n ? +x.dataset.n : null); });
      });
    });
    $view.querySelectorAll("[data-go]").forEach(b => b.onclick = () => { r.cur = +b.dataset.go; save(); viewHole(); });
    document.getElementById("set-par").onclick = () => sheet(`<h3>Par på hål ${h + 1}</h3>
      <div class="numpad">${[3, 4, 5, 6].map(n => `<button class="${n === par ? "on" : ""}" data-p="${n}">${n}</button>`).join("")}</div>`,
      s => s.querySelectorAll("[data-p]").forEach(x => x.onclick = () => { r.par[h] = +x.dataset.p; save(); closeSheet(); viewHole(); }));
    document.getElementById("set-idx").onclick = () => sheet(`<h3>Index (svårighet) hål ${h + 1}</h3>
      <div class="numpad">${Array.from({ length: 18 }, (_, i) => i + 1).map(n => `<button class="${n === r.index[h] ? "on" : ""}" data-i="${n}">${n}</button>`).join("")}</div>`,
      s => s.querySelectorAll("[data-i]").forEach(x => x.onclick = () => { r.index[h] = +x.dataset.i; save(); closeSheet(); viewHole(); }));
    document.getElementById("prev").onclick = () => { r.cur--; save(); viewHole(); };
    document.getElementById("card").onclick = () => viewCard(r, false);
    document.getElementById("next").onclick = () => {
      if (h === 17) return viewCard(r, false);
      r.cur++; save(); viewHole(); window.scrollTo(0, 0);
    };
    const cur = document.querySelector(".hdot.cur"); if (cur) cur.scrollIntoView({ inline: "center", block: "nearest" });
  }

  $menu.onclick = () => {
    if (!round) return;
    sheet(`<h3>Rundan</h3><div class="list">
      <button class="card item" data-a="card"><div class="grow"><b>Scorekort & ledartavla</b></div></button>
      <button class="card item" data-a="finish"><div class="grow"><b>Avsluta & spara rundan</b><small>Sparas i telefonen</small></div></button>
      <button class="card item" data-a="home"><div class="grow"><b>Till startsidan</b><small>Rundan ligger kvar och kan återupptas</small></div></button>
      <button class="card item" data-a="discard"><div class="grow"><b style="color:var(--double)">Kasta rundan</b></div></button>
    </div>`, s => s.querySelectorAll("[data-a]").forEach(b => b.onclick = () => {
      closeSheet();
      const a = b.dataset.a;
      if (a === "card") viewCard(round, false);
      if (a === "finish") finish();
      if (a === "home") viewHome();
      if (a === "discard" && confirm("Kasta rundan? Alla inslagna resultat försvinner.")) { round = null; store.del(KEY_ACTIVE); viewHome(); }
    }));
  };

  function finish() {
    const missing = round.players.some(p => round.scores[p.id].some(v => v == null));
    if (missing && !confirm("Alla hål är inte ifyllda. Spara ändå?")) return;
    const rounds = store.get(KEY_ROUNDS, []);
    rounds.push({ ...round, finished: new Date().toISOString() });
    store.set(KEY_ROUNDS, rounds);
    const courses = store.get(KEY_COURSES, {});
    courses[round.course] = { par: round.par, index: round.index };
    store.set(KEY_COURSES, courses);
    const saved = round; round = null; store.del(KEY_ACTIVE);
    toast("Rundan är sparad ✓");
    viewCard(saved, true);
  }

  /* =======================================================
     VY: Scorekort / ledartavla
     ======================================================= */
  function viewCard(r, archived, tab = "lb") {
    header(`${r.course} · ${r.date}`, archived ? "Resultat" : "Ställning", !archived);
    const lb = leaderboard(r);
    const stab = r.format === "stableford";
    const cell = (v, par) => { if (v == null) return "<td>·</td>"; const d = v - par; return `<td class="${d <= -2 ? "e" : d === -1 ? "b" : d >= 2 ? "d" : ""}">${v}</td>`; };
    const half = (from) => r.par.slice(from, from + 9);
    $view.innerHTML = `
      <div class="tabs"><button class="tab ${tab === "lb" ? "on" : ""}" data-tab="lb">Ledartavla</button><button class="tab ${tab === "sc" ? "on" : ""}" data-tab="sc">Scorekort</button></div>
      ${tab === "lb" ? `
        <div class="lb">${lb.map((x, i) => `
          <div class="card lb-row"><span class="pos">${i + 1}</span><img src="${img(x.id)}" alt="">
            <div class="grow"><b>${esc(nick(x.id))}</b><br><small>${x.gross} brutto · hcp ${x.hcp} · ${x.played}/18 hål</small></div>
            <div class="big">${stab ? `<b>${x.pts}</b><small>poäng</small>` : `<b>${rel(x.netToPar)}</b><small>${x.net} netto</small>`}</div>
          </div>`).join("")}</div>
        <p style="color:var(--muted);font-size:.82rem;margin-top:10px">Sorterat på ${stab ? "poäng (Stableford)" : "nettoresultat mot par"}.</p>`
      : `
        ${[0, 9].map(from => `
          <div class="sc-wrap" style="margin-bottom:12px"><table class="sc">
            <tr><th>${from ? "In" : "Ut"}</th>${half(from).map((_, i) => `<th>${from + i + 1}</th>`).join("")}<th>Σ</th></tr>
            <tr class="par"><td>Par</td>${half(from).map(p => `<td>${p}</td>`).join("")}<td class="sum">${sum(half(from))}</td></tr>
            ${r.players.map(p => { const s = r.scores[p.id].slice(from, from + 9);
              return `<tr><td>${esc(nick(p.id))}</td>${s.map((v, i) => cell(v, r.par[from + i])).join("")}<td class="sum">${sum(s) || "·"}</td></tr>`; }).join("")}
          </table></div>`).join("")}`}

      <div class="notice">ℹ️ <span>Resultaten sparas i den här telefonen. Inskickning till hemsidans tabell kopplas på när databasen är på plats – tills dess kan ni dela scorekortet.</span></div>

      <div class="dock"><div class="dock-inner">
        <button class="btn btn-line sq" id="back" aria-label="Tillbaka">${ICON.left}</button>
        <button class="btn btn-line sq" id="share" aria-label="Dela">${ICON.share}</button>
        ${archived ? `<button class="btn btn-dark" id="home">Klar</button>` : `<button class="btn btn-accent" id="finish">Avsluta & spara</button>`}
      </div></div>`;

    $view.querySelectorAll("[data-tab]").forEach(b => b.onclick = () => viewCard(r, archived, b.dataset.tab));
    document.getElementById("back").onclick = () => archived ? viewHome() : viewHole();
    document.getElementById("share").onclick = () => share(r);
    const f = document.getElementById("finish"); if (f) f.onclick = finish;
    const hm = document.getElementById("home"); if (hm) hm.onclick = viewHome;
  }

  async function share(r) {
    const lb = leaderboard(r), stab = r.format === "stableford";
    const text = [`⛳ HGM Touren – ${r.course}, ${r.date}`, `${fmtName(r.format)}`, "",
      ...lb.map((x, i) => `${i + 1}. ${nick(x.id)} – ${stab ? x.pts + " p" : rel(x.netToPar) + " netto (" + x.net + ")"} · ${x.gross} brutto`),
      "", "hgmtouren.se"].join("\n");
    try {
      if (navigator.share) { await navigator.share({ text }); return; }
      await navigator.clipboard.writeText(text); toast("Kopierat – klistra in i chatten");
    } catch (e) { if (e && e.name !== "AbortError") prompt("Kopiera texten:", text); }
  }

  /* Start */
  round ? viewHole() : viewHome();

  /* Offline-stöd */
  if ("serviceWorker" in navigator && location.protocol === "https:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
