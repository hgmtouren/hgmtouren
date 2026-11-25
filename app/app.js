/* =========================================================
   HGM Resultat – rapportera rundans totaler från mobilen.
   Per spelare och runda: netto, Lilla Rundan, puttar,
   närmast hål och längsta drive.
   Allt sparas lokalt i telefonen (localStorage) tills en
   gemensam databas kopplas på. Se README för nästa steg.
   ========================================================= */
(function () {
  const H = window.HGM;
  const KEY_ACTIVE = "hgm.report", KEY_SAVED = "hgm.reports";

  /* Vad som rapporteras per spelare. best: "low" = lägst vinner, "high" = högst vinner, "sum" = antal */
  const FIELDS = [
    { id: "netto", name: "Nettoscore",    hint: "Slag efter handicap · lägst vinner", start: 72, best: "low",  short: "Netto" },
    { id: "lilla", name: "Lilla Rundan",  hint: "Poäng sista 6 hålen · högst vinner",  start: 12, best: "high", short: "LR" },
    { id: "putt",  name: "Puttar",        hint: "Totalt antal · lägst vinner",         start: 32, best: "low",  short: "Putt" },
    { id: "nh",    name: "Närmast hål",   hint: "Antal vinster denna runda",           start: 0,  best: "sum",  short: "NH" },
    { id: "ld",    name: "Längsta drive", hint: "Antal vinster denna runda",           start: 0,  best: "sum",  short: "LD" }
  ];

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
  const today = () => new Date().toISOString().slice(0, 10);

  let rep = store.get(KEY_ACTIVE, null);
  const save = () => store.set(KEY_ACTIVE, rep);

  /* ── UI-hjälp ── */
  function toast(msg) { $toast.textContent = msg; $toast.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => $toast.hidden = true, 2200); }
  function sheet(html, bind) { $sheet.innerHTML = html; $sheet.hidden = false; $sheetBg.hidden = false; bind && bind($sheet); }
  function closeSheet() { $sheet.hidden = true; $sheetBg.hidden = true; }
  /* Egen bekräftelseruta (webbläsarens confirm() fungerar inte överallt) */
  function ask(msg, okLabel, danger) {
    return new Promise(res => {
      sheet(`<h3>${esc(msg)}</h3><div class="dock-inner" style="margin-top:8px">
        <button class="btn btn-line" id="ask-no">Avbryt</button>
        <button class="btn ${danger ? "btn-danger" : "btn-dark"}" id="ask-yes">${esc(okLabel)}</button></div>`, s => {
        s.querySelector("#ask-no").onclick = () => { closeSheet(); res(false); };
        s.querySelector("#ask-yes").onclick = () => { closeSheet(); res(true); };
      });
    });
  }
  $sheetBg.addEventListener("click", closeSheet);
  function header(sub, main, menu) { $sub.textContent = sub; $main.textContent = main; $menu.hidden = !menu; }
  const vibrate = () => { try { navigator.vibrate && navigator.vibrate(8); } catch {} };
  const ICON = {
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7M16 6l-4-4-4 4M12 2v14"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>'
  };

  const complete = e => e.netto != null && e.lilla != null && e.putt != null;

  /* Dagens vinnare per kategori (delade placeringar tas med) */
  function winners(r) {
    const out = {};
    FIELDS.forEach(f => {
      const vals = r.entries.filter(e => e[f.id] != null && (f.best !== "sum" || e[f.id] > 0));
      if (!vals.length) { out[f.id] = null; return; }
      const best = f.best === "low" ? Math.min(...vals.map(e => e[f.id])) : Math.max(...vals.map(e => e[f.id]));
      out[f.id] = { value: best, ids: f.best === "sum" ? vals.map(e => e.id) : vals.filter(e => e[f.id] === best).map(e => e.id) };
    });
    return out;
  }
  const byNetto = r => [...r.entries].sort((a, b) => (a.netto ?? 999) - (b.netto ?? 999));

  /* =======================================================
     VY: Start
     ======================================================= */
  function viewHome() {
    header("HGM Touren", "Resultat", false);
    const saved = store.get(KEY_SAVED, []);
    $view.innerHTML = `
      ${rep ? `
        <button class="card item" id="resume" style="margin-bottom:14px">
          <div class="grow"><b>${rep.season || ""} ${esc(rep.round)} · ${esc(rep.course)}</b><small>${rep.entries.map(e => nick(e.id)).join(", ")}</small></div>
          <span class="pill live">● Pågår</span>
        </button>` : ""}
      <div class="hero-card">
        <small style="color:var(--accent);font-weight:700;letter-spacing:.1em;font-size:.72rem">RAPPORTERA</small>
        <h2>Rundan klar?</h2>
        <p>Välj omgång och spelare, och fyll i netto, Lilla Rundan, puttar, närmast hål och längsta drive.</p>
        <button class="btn btn-accent" id="new">${ICON.plus} Rapportera runda</button>
      </div>
      <span class="label">Sparade rapporter</span>
      <div class="list">
        ${saved.length ? saved.map((r, i) => ({ r, i })).reverse().map(({ r, i }) => {
          const w = byNetto(r)[0];
          return `<button class="card item" data-open="${i}">
            <div class="grow"><b>${r.season || ""} ${esc(r.round)} · ${esc(r.course)}</b><small>${r.date} · ${r.entries.length} spelare</small></div>
            <span class="pill">🏆 ${nick(w.id)}</span></button>`;
        }).join("") : `<div class="card item"><small>Inga sparade rapporter än. De dyker upp här när du sparat en runda.</small></div>`}
      </div>`;
    document.getElementById("new").onclick = async () => {
      if (rep && !(await ask("Du har en påbörjad rapport. Vill du kasta den och börja om?", "Kasta och börja om", true))) return;
      viewSetup({ season: guessSeason(), round: guessRound(), course: "", date: today(), ids: store.get("hgm.lastIds", []) });
    };
    const r = document.getElementById("resume"); if (r) r.onclick = () => viewEntry();
    $view.querySelectorAll("[data-open]").forEach(b => b.onclick = () => viewReview(store.get(KEY_SAVED, [])[+b.dataset.open], true));
  }
  function guessSeason() {
    const ys = H.seasonYears();
    return ys.find(y => H.S(y).status !== "klar") || H.defaultSeason;
  }
  function guessRound() {
    const done = store.get(KEY_SAVED, []).map(r => r.round);
    return H.rounds.find(x => !done.includes(x)) || H.rounds[0];
  }

  /* =======================================================
     VY: Välj omgång, bana och spelare
     ======================================================= */
  function viewSetup(d) {
    header("Ny rapport", "Omgång & spelare", false);
    const ranked = H.ranked(d.season);
    $view.innerHTML = `
      <span class="label" style="margin-top:4px">Säsong</span>
      <div class="chips">${H.seasonYears().map(y => `<button class="chipb ${y === d.season ? "on" : ""}" data-season="${y}">${y}${H.S(y).status === "kommande" ? " (test)" : ""}</button>`).join("")}</div>

      <span class="label">Omgång</span>
      <div class="chips">${H.rounds.map(r => `<button class="chipb ${r === d.round ? "on" : ""}" data-round="${esc(r)}">${esc(r)}</button>`).join("")}</div>

      <span class="label">Bana</span>
      <div class="chips" style="margin-bottom:10px">${H.courses.map(c => `<button class="chipb ${c === d.course ? "on" : ""}" data-course="${esc(c)}">${esc(c)}</button>`).join("")}</div>
      <input class="field" id="course" placeholder="…eller skriv annan bana" value="${H.courses.includes(d.course) ? "" : esc(d.course)}" autocomplete="off">

      <span class="label">Datum</span>
      <input class="field" id="date" type="date" value="${d.date}">

      <span class="label">Spelare att rapportera för <span id="cnt" style="color:var(--ink)"></span></span>
      <div class="roster">${ranked.map(p => `
        <button class="pick" data-pid="${p.id}"><span class="n"></span><img src="${img(p.id)}" alt=""><b>${esc(p.nick)}</b></button>`).join("")}</div>
      <p style="color:var(--muted);font-size:.85rem;margin-top:10px">Välj bara dig själv, eller hela bollen om du för protokoll åt alla.</p>

      <div class="dock"><div class="dock-inner">
        <button class="btn btn-line sq" id="cancel" aria-label="Tillbaka">${ICON.left}</button>
        <button class="btn btn-dark" id="start">Fyll i resultat</button>
      </div></div>`;

    $view.querySelectorAll("[data-season]").forEach(b => b.onclick = () => {
      d.season = +b.dataset.season;
      const allowed = H.inSeason(d.season).map(p => p.id);
      d.ids = d.ids.filter(id => allowed.includes(id));
      d.course = (document.getElementById("course").value || d.course);
      viewSetup(d);
    });
    $view.querySelectorAll("[data-round]").forEach(b => b.onclick = () => {
      d.round = b.dataset.round; $view.querySelectorAll("[data-round]").forEach(x => x.classList.toggle("on", x === b));
    });
    const courseEl = document.getElementById("course");
    $view.querySelectorAll("[data-course]").forEach(b => b.onclick = () => {
      d.course = b.dataset.course; courseEl.value = "";
      $view.querySelectorAll("[data-course]").forEach(x => x.classList.toggle("on", x === b));
    });
    courseEl.oninput = () => {
      d.course = courseEl.value; $view.querySelectorAll("[data-course]").forEach(x => x.classList.remove("on"));
    };
    document.getElementById("date").onchange = e => d.date = e.target.value;
    const refresh = () => {
      $view.querySelectorAll("[data-pid]").forEach(b => {
        const i = d.ids.indexOf(b.dataset.pid);
        b.classList.toggle("on", i >= 0); b.querySelector(".n").textContent = i + 1;
      });
      document.getElementById("cnt").textContent = d.ids.length ? `· ${d.ids.length} valda` : "";
    };
    $view.querySelectorAll("[data-pid]").forEach(b => b.onclick = () => {
      const i = d.ids.indexOf(b.dataset.pid);
      i >= 0 ? d.ids.splice(i, 1) : d.ids.push(b.dataset.pid); vibrate(); refresh();
    });
    document.getElementById("cancel").onclick = viewHome;
    document.getElementById("start").onclick = () => {
      d.course = (d.course || "").trim();
      if (!d.course) { toast("Välj eller skriv in bana"); return; }
      if (!d.ids.length) { toast("Välj minst en spelare"); return; }
      store.set("hgm.lastIds", d.ids);
      rep = { id: Date.now().toString(36), season: d.season, round: d.round, course: d.course, date: d.date, cur: 0,
        entries: d.ids.map(id => ({ id, netto: null, lilla: null, putt: null, nh: 0, ld: 0 })) };
      save(); viewEntry();
    };
    refresh();
  }

  /* =======================================================
     VY: Fyll i totaler, en spelare i taget
     ======================================================= */
  function viewEntry() {
    const e = rep.entries[rep.cur], last = rep.cur === rep.entries.length - 1;
    const p = H.byId(e.id);
    header(`${rep.season || ""} ${rep.round} · ${rep.course}`, `${p.nick} · ${rep.cur + 1}/${rep.entries.length}`, true);
    $view.innerHTML = `
      ${rep.entries.length > 1 ? `<div class="ptabs">${rep.entries.map((x, i) => `
        <button class="ptab ${i === rep.cur ? "on" : ""}" data-go="${i}"><img src="${img(x.id)}" alt="">${esc(nick(x.id))}${complete(x) ? '<span class="ok">✓</span>' : ""}</button>`).join("")}</div>` : ""}
      <div class="card who-card"><img src="${img(e.id)}" alt="">
        <div><b>${esc(p.nick)}</b><small>${(() => { const y = rep.season || H.defaultSeason, t = H.teamOf(y, e.id); return t ? esc(H.S(y).teams[t].name) + " · " : ""; })()}${rep.season || ""} ${esc(rep.round)}</small></div></div>
      ${FIELDS.map(f => {
        const v = e[f.id], set = v != null && !(f.best === "sum" && v === 0);
        return `<div class="card stat">
          <div class="lbl"><b>${f.name}</b><small>${f.hint}</small></div>
          <div class="stepper">
            <button class="step" data-dec="${f.id}" aria-label="Minska ${f.name}">−</button>
            <button class="val ${v == null ? "empty" : set ? "set" : ""}" data-num="${f.id}">${v ?? "–"}</button>
            <button class="step" data-inc="${f.id}" aria-label="Öka ${f.name}">+</button>
          </div></div>`;
      }).join("")}
      <p style="text-align:center;color:var(--muted);font-size:.8rem;margin-top:14px">Tryck på siffran för att skriva in den direkt.</p>

      <div class="dock"><div class="dock-inner">
        <button class="btn btn-line sq" id="prev" aria-label="Tillbaka">${ICON.left}</button>
        <button class="btn btn-dark" id="next">${last ? "Granska & spara" : `Nästa: ${esc(nick(rep.entries[rep.cur + 1].id))} →`}</button>
      </div></div>`;

    const set = (fid, v) => { e[fid] = v; save(); vibrate(); viewEntry(); };
    const F = id => FIELDS.find(f => f.id === id);
    $view.querySelectorAll("[data-inc]").forEach(b => b.onclick = () => {
      const f = F(b.dataset.inc), v = e[f.id]; set(f.id, v == null ? f.start : Math.min(199, v + 1));
    });
    $view.querySelectorAll("[data-dec]").forEach(b => b.onclick = () => {
      const f = F(b.dataset.dec), v = e[f.id]; set(f.id, v == null ? Math.max(0, f.start - 1) : Math.max(0, v - 1));
    });
    $view.querySelectorAll("[data-num]").forEach(b => b.onclick = () => {
      const f = F(b.dataset.num);
      sheet(`<h3>${f.name} · ${esc(p.nick)}</h3>
        <input class="big" id="numin" type="number" inputmode="numeric" min="0" max="199" value="${e[f.id] ?? ""}" placeholder="${f.start}">
        <div class="dock-inner"><button class="btn btn-line" id="clr" style="flex:0 0 35%">Rensa</button><button class="btn btn-dark" id="ok">Klar</button></div>`, s => {
        const inp = s.querySelector("#numin"); setTimeout(() => inp.focus(), 50);
        const ok = () => { const n = parseInt(inp.value, 10); closeSheet(); set(f.id, isNaN(n) ? (f.best === "sum" ? 0 : null) : Math.max(0, Math.min(199, n))); };
        s.querySelector("#ok").onclick = ok;
        inp.onkeydown = ev => { if (ev.key === "Enter") ok(); };
        s.querySelector("#clr").onclick = () => { closeSheet(); set(f.id, f.best === "sum" ? 0 : null); };
      });
    });
    $view.querySelectorAll("[data-go]").forEach(b => b.onclick = () => { rep.cur = +b.dataset.go; save(); viewEntry(); });
    document.getElementById("prev").onclick = () => {
      if (rep.cur > 0) { rep.cur--; save(); viewEntry(); } else viewHome();
    };
    document.getElementById("next").onclick = () => {
      if (last) return viewReview(rep, false);
      rep.cur++; save(); viewEntry(); window.scrollTo(0, 0);
    };
  }

  $menu.onclick = () => {
    if (!rep) return;
    sheet(`<h3>Rapporten</h3><div class="list">
      <button class="card item" data-a="review"><div class="grow"><b>Granska & spara</b></div></button>
      <button class="card item" data-a="home"><div class="grow"><b>Till startsidan</b><small>Rapporten ligger kvar och kan fortsättas</small></div></button>
      <button class="card item" data-a="discard"><div class="grow"><b style="color:var(--double)">Kasta rapporten</b></div></button>
    </div>`, s => s.querySelectorAll("[data-a]").forEach(b => b.onclick = async () => {
      closeSheet();
      const a = b.dataset.a;
      if (a === "review") viewReview(rep, false);
      if (a === "home") viewHome();
      if (a === "discard" && await ask("Kasta rapporten? Inmatade resultat försvinner.", "Kasta", true)) { rep = null; store.del(KEY_ACTIVE); viewHome(); }
    }));
  };

  async function finish() {
    const missing = rep.entries.filter(e => !complete(e)).map(e => nick(e.id));
    if (missing.length && !(await ask(`Netto, Lilla Rundan eller puttar saknas för ${missing.join(", ")}. Spara ändå?`, "Spara ändå"))) return;
    const saved = store.get(KEY_SAVED, []);
    saved.push({ ...rep, saved: new Date().toISOString() });
    store.set(KEY_SAVED, saved);
    const done = rep; rep = null; store.del(KEY_ACTIVE);
    toast("Rapporten är sparad ✓");
    viewReview(done, true);
  }

  /* =======================================================
     VY: Granska
     ======================================================= */
  function viewReview(r, archived) {
    header(`${r.round} · ${r.date}`, archived ? r.course : "Granska", !archived);
    const w = winners(r);
    const winText = f => w[f.id] ? w[f.id].ids.map(nick).join(", ") : "–";
    const rows = byNetto(r);
    $view.innerHTML = `
      ${r.entries.length > 1 ? `<div class="winners">${FIELDS.slice(0, 3).map(f => `
        <div class="card win-card"><small>${f.name}</small><b>${esc(winText(f))}</b><span>${w[f.id] ? w[f.id].value + (f.id === "lilla" ? " p" : f.id === "putt" ? " puttar" : " slag") : ""}</span></div>`).join("")}
        <div class="card win-card"><small>NH / LD</small><b style="font-size:1rem">${esc(winText(FIELDS[3]))} / ${esc(winText(FIELDS[4]))}</b></div>
      </div>` : ""}
      <table class="res">
        <tr><th>Spelare</th>${FIELDS.map(f => `<th>${f.short}</th>`).join("")}</tr>
        ${rows.map(e => `<tr><td><b>${esc(nick(e.id))}</b></td>${FIELDS.map(f => {
          const win = r.entries.length > 1 && w[f.id] && f.best !== "sum" && w[f.id].ids.includes(e.id);
          return `<td class="${win ? "win" : ""}">${e[f.id] ?? "·"}</td>`;
        }).join("")}</tr>`).join("")}
      </table>
      <p style="color:var(--muted);font-size:.8rem;margin-top:8px">LR = Lilla Rundan · NH = närmast hål · LD = längsta drive. Sorterat på netto.</p>

      <div class="notice">ℹ️ <span>Rapporten sparas i den här telefonen. Inskickning till hemsidans ställning kopplas på när databasen är på plats – tills dess kan ni dela den i gruppchatten.</span></div>

      <div class="dock"><div class="dock-inner">
        <button class="btn btn-line sq" id="back" aria-label="Tillbaka">${ICON.left}</button>
        <button class="btn btn-line sq" id="share" aria-label="Dela">${ICON.share}</button>
        ${archived ? `<button class="btn btn-dark" id="home">Klar</button>` : `<button class="btn btn-accent" id="finish">Spara rapporten</button>`}
      </div></div>`;
    document.getElementById("back").onclick = () => archived ? viewHome() : viewEntry();
    document.getElementById("share").onclick = () => share(r);
    const f = document.getElementById("finish"); if (f) f.onclick = finish;
    const hm = document.getElementById("home"); if (hm) hm.onclick = viewHome;
  }

  async function share(r) {
    const w = winners(r);
    const line = e => `${nick(e.id)}: netto ${e.netto ?? "–"} · LR ${e.lilla ?? "–"} · puttar ${e.putt ?? "–"}${e.nh ? ` · NH ${e.nh}` : ""}${e.ld ? ` · LD ${e.ld}` : ""}`;
    const text = [`⛳ HGM Touren ${r.season || ""} – ${r.round}`, `${r.course}, ${r.date}`, "",
      ...byNetto(r).map(line),
      ...(r.entries.length > 1 ? ["", `🏆 Netto: ${w.netto ? w.netto.ids.map(nick).join(", ") : "–"}`,
        `🎯 Puttar: ${w.putt ? w.putt.ids.map(nick).join(", ") : "–"}`,
        `⛳ Lilla Rundan: ${w.lilla ? w.lilla.ids.map(nick).join(", ") : "–"}`] : []),
      "", "hgmtouren.se"].join("\n");
    try {
      if (navigator.share) { await navigator.share({ text }); return; }
      await navigator.clipboard.writeText(text); toast("Kopierat – klistra in i chatten");
    } catch (e) {
      if (e && e.name === "AbortError") return;
      sheet(`<h3>Kopiera och klistra in i chatten</h3><textarea class="field" id="share-txt" rows="10" readonly style="font-size:.9rem">${esc(text)}</textarea>`,
        s => { const t = s.querySelector("#share-txt"); t.focus(); t.select(); });
    }
  }

  /* Start */
  rep ? viewEntry() : viewHome();

  /* Offline-stöd */
  if ("serviceWorker" in navigator && location.protocol === "https:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
