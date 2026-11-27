/* =========================================================
   HGM Touren – gemensam rendering (nav, footer, sektioner)
   Varje sida sätter <body data-root="" eller "../" data-page="...">
   Säsongsberoende delar ritas om när man byter säsong.
   ========================================================= */
(function () {
  const ROOT = document.body.dataset.root || "";
  const PAGE = document.body.dataset.page || "hem";
  const H = window.HGM;
  const img = p => `${ROOT}assets/img/spelare/${p.img}.jpg`;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const $ = sel => document.querySelector(sel);
  const fill = (sel, html) => document.querySelectorAll(sel).forEach(el => el.innerHTML = html);
  const fmtNum = v => Number(v).toLocaleString("sv-SE", { maximumFractionDigits: 2 });
  let Y = H.pickSeason();

  const LINKS = [
    ["hem", "Hem", "index.html"],
    ["stallning", "Ställning", "stallning/index.html"],
    ["spelarna", "Spelarna", "spelarna/index.html"],
    ["statistik", "Statistik", "statistik/index.html"],
    ["mastare", "Mästare", "mastare/index.html"],
    ["galleri", "Galleri", "galleri/index.html"]
  ];

  /* ── Nav ── */
  const nav = $("#site-nav");
  if (nav) {
    nav.className = "nav";
    nav.innerHTML = `
      <div class="wrap">
        <a class="brand" href="${ROOT}index.html"><img class="brand-logo" src="${ROOT}assets/img/logo.jpg" alt="">HGM Touren</a>
        <ul class="nav-links">
          ${LINKS.map(([id, label, href]) => `<li><a href="${ROOT}${href}" class="${id === PAGE ? "active" : ""}">${label}</a></li>`).join("")}
          <li class="only-mobile"><a href="${ROOT}app/index.html">Rapportera resultat →</a></li>
        </ul>
        <a class="nav-cta" href="${ROOT}app/index.html">Rapportera resultat</a>
        <button class="nav-toggle" aria-label="Meny" aria-expanded="false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        </button>
      </div>`;
    const t = nav.querySelector(".nav-toggle");
    t.addEventListener("click", () => t.setAttribute("aria-expanded", nav.classList.toggle("open")));
    const style = document.createElement("style");
    style.textContent = "@media(min-width:861px){.only-mobile{display:none}}";
    document.head.appendChild(style);
  }

  /* ── Footer ── */
  const foot = $("#site-footer");
  if (foot) {
    foot.className = "footer";
    foot.innerHTML = `
      <div class="wrap">
        <a class="brand" href="${ROOT}index.html" style="color:#fff"><img class="brand-logo" src="${ROOT}assets/img/logo.jpg" alt="">HGM Touren</a>
        <nav>${LINKS.map(([, l, h]) => `<a href="${ROOT}${h}">${l}</a>`).join("")}<a href="${ROOT}app/index.html">Resultatappen</a></nav>
        <small>© HGM Touren · All Swingers · Est. ${H.founded} · <a href="mailto:${H.contact}">${H.contact}</a></small>
      </div>`;
  }

  /* ── Säsongsväljare ── */
  function switcher() {
    return `<div class="season-switch" role="tablist" aria-label="Välj säsong">${H.seasonYears().map(y => {
      const st = H.S(y).status;
      return `<button role="tab" aria-selected="${y === Y}" class="${y === Y ? "on" : ""}" data-year="${y}">${y}${st === "kommande" ? ' <em>test</em>' : st === "pågår" ? ' <em>pågår</em>' : ""}</button>`;
    }).join("")}</div>`;
  }
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-year]");
    if (!b) return;
    setSeason(+b.dataset.year);
  });

  /* ── Hjälp för lag ── */
  const team = (id) => H.S(Y).teams[id];
  const teamColor = id => (team(id) || {}).color || "x";

  function standingsRows(list, ranked) {
    const vals = ranked.map(p => p.points).filter(Boolean), plac = H.isPlac(Y);
    const max = Math.max(1, ...vals), min = Math.min(...vals);
    return list.map(p => {
      const pos = H.rank(Y, p.id) || ranked.indexOf(p) + 1, t = team(p.team);
      const started = ranked.some(x => x.points);
      const cls = !started ? "row" : pos === 1 ? "row top first" : pos <= 3 ? "row top" : "row";
      return `<div class="${cls}" data-profile="${p.id}" tabindex="0" role="button" style="cursor:pointer">
        <div class="pos">${started ? pos : "–"}</div>
        <img class="avatar" src="${img(p)}" alt="" loading="lazy">
        <div class="who"><b>${esc(p.nick)}</b><small><span class="dot ${teamColor(p.team)}"></span>${t ? esc(t.name) : ""}${t && t.captain === p.id ? " · Kapten" : ""}</small></div>
        <div class="pts"><b>${p.points.toLocaleString("sv-SE")}</b><div class="bar"><i style="width:${(plac ? (p.points ? min / p.points * 100 : 0) : p.points / max * 100).toFixed(1)}%"></i></div></div>
      </div>`;
    }).join("");
  }

  function teamResultCard() {
    const S = H.S(Y), R = S.teamResult, ids = Object.keys(S.teams);
    if (!R) return `<div class="card duel"><h3>Lagtävlingen ${Y}</h3>
      <p style="color:var(--ink-2)">Lagtävlingen har inte startat än.</p>
      <div style="display:grid;gap:6px;font-size:.9rem;color:var(--ink-2)">${ids.map(id => `<div><span class="dot ${S.teams[id].color}"></span> <b>${esc(S.teams[id].name)}</b>${S.teams[id].captain ? ` · Kapten ${esc(H.byId(S.teams[id].captain).nick)}` : ""}</div>`).join("")}</div></div>`;
    const block = (label, scores) => {
      const total = ids.reduce((s, id) => s + (scores[id] || 0), 0) || 1;
      const order = [...ids].sort((a, b) => scores[b] - scores[a]);
      return `<div class="duel-block"><small class="duel-label">${label}</small>
        <div class="duel-scores">${order.map(id => `<div><b class="c-${S.teams[id].color}">${fmtNum(scores[id])}</b><span>${esc(S.teams[id].name)}</span></div>`).join("")}</div>
        <div class="duel-bar">${order.map(id => `<i class="bg-${S.teams[id].color}" style="width:${(scores[id] / total * 100).toFixed(1)}%"></i>`).join("")}</div></div>`;
    };
    return `<div class="card duel">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
        <h3>Lagtävlingen ${Y}</h3><span class="badge gold">🏆 ${esc(S.teams[R.winner].name)} vann</span></div>
      ${R.grund ? block("Grundspelet", R.grund) : ""}
      ${R.final ? block("Slutspelet", R.final) : ""}
      <p style="font-size:.9rem;color:var(--ink-2)">${esc(R.text || "")}</p>
    </div>`;
  }

  function champFeature() {
    const c = H.champions[0], p = H.byId(c.player);
    return `<div class="champ-feature">
      <img src="${c.photo ? ROOT + "assets/img/" + c.photo : img(p)}" alt="${esc(p.nick)}" style="object-position:center 30%">
      <div class="body">
        <span class="eyebrow">Mästare ${c.year}${c.venue ? " · " + esc(c.venue) : ""}</span>
        <h3>${esc(p.nick)}</h3>
        <p>${esc(p.name)}${c.note ? " – " + esc(c.note) : ""}.</p>
        <div class="badges">
          <span class="badge">🏆 ${H.titles(p.id).length}× mästare</span>
          ${(c.awards || []).map(([a, id]) => `<span class="badge">${esc(a)}: ${esc(H.byId(id).nick)}</span>`).join("")}
        </div>
      </div>
    </div>`;
  }

  function playerCards(ranked) {
    const started = ranked.some(x => x.points);
    return ranked.map((p, i) => {
      const t = team(p.team), titles = H.titles(p.id);
      return `<article class="pcard" data-team="${p.team}" data-profile="${p.id}" tabindex="0" role="button" aria-label="Visa profil för ${esc(p.nick)}">
        <img src="${img(p)}" alt="${esc(p.nick)}" loading="lazy">
        <span class="tag ${teamColor(p.team)}">${t ? esc(t.name) : ""}${t && t.captain === p.id ? " · C" : ""}</span>
        ${started ? `<span class="rank">#${H.rank(Y, p.id) || i + 1}</span>` : ""}
        <div class="info">
          <b>${esc(p.nick)}</b><small>${esc(p.name)}</small>
          <div class="meta"><span><b>${p.points}</b> ${H.unit(Y).short}</span>${titles.length ? `<span>🏆 ${titles.join(", ")}</span>` : ""}</div>
        </div>
      </article>`;
    }).join("");
  }

  function teamCards(ranked) {
    const S = H.S(Y);
    return Object.entries(S.teams).map(([id, t]) => {
      const list = ranked.filter(p => p.team === id);
      const score = S.teamResult && S.teamResult.grund ? S.teamResult.grund[id] : null;
      return `<div class="card team c-border-${t.color}">
        <div class="team-head">
          <div><h3>${esc(t.name)}</h3><small>${t.nick && t.nick !== t.name ? esc(t.nick) + " · " : ""}${t.captain ? "Kapten " + esc(H.byId(t.captain).nick) : `${list.length} spelare`}</small></div>
          ${score != null ? `<div class="team-total"><b>${fmtNum(score)}</b><small>lagpoäng grundspel</small></div>` : ""}
        </div>
        ${standingsRows(list, ranked)}
      </div>`;
    }).join("");
  }

  /* ── Topplistor ── */
  function toplist(title, sub, obj, fmt, asc, limit = 8) {
    const rows = Object.entries(obj || {}).filter(([id]) => H.byId(id)).sort((a, b) => asc ? a[1] - b[1] : b[1] - a[1]);
    if (!rows.length) return `<div class="card toplist"><h3>${title}</h3><small>${sub}</small><p class="empty">Inga resultat än.</p></div>`;
    let n = 0, prev = null;
    const html = rows.map(([id, v], i) => {
      if (v !== prev) n = i + 1; prev = v;
      const p = H.byId(id);
      return `<div class="tl-row" ${i >= limit ? "hidden" : ""}><span class="n">${n}</span><img src="${img(p)}" alt="" loading="lazy"><b>${esc(p.nick)}</b><span class="v">${fmt(v)}</span></div>`;
    }).join("");
    return `<div class="card toplist"><h3>${title}</h3><small>${sub}</small>${html}
      ${rows.length > limit ? `<button class="tl-more" data-more>Visa alla ${rows.length}</button>` : ""}</div>`;
  }
  const dec = v => v.toFixed(2).replace(".", ",");
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-more]");
    if (b) { b.parentElement.querySelectorAll(".tl-row[hidden]").forEach(r => r.hidden = false); b.remove(); }
  });

  /* ── Slutspelet ── */
  function finalSection() {
    const S = H.S(Y), F = S.final, I = S.finalInfo || {}, champ = H.champions.find(c => c.year === Y);
    if (!F) {
      if (champ) { const p = H.byId(champ.player);
        return `<div class="card final-empty"><b>🏆 ${esc(p.nick)} vann slutspelet ${Y}${champ.venue ? " på " + esc(champ.venue) : ""}${champ.note ? ", " + esc(champ.note) : ""}.</b>
          <span>Detaljerade finalresultat för ${Y} finns inte inlagda än.</span></div>`; }
      return `<div class="card final-empty"><b>Slutspelet ${Y} har inte spelats.</b><span>Topp 10 i grundspelet går till slutspelet. Vinnaren av grundspelet startar på −1.</span></div>`;
    }
    const order = S.finalOrder || Object.keys(F);
    const sum = a => a.reduce((x, y) => x + y, 0);
    const tot = id => sum(F[id].netto) + (F[id].start || 0);
    const best = (fn, low) => { const v = order.map(fn); const b = low ? Math.min(...v) : Math.max(...v); return { v: b, ids: order.filter(id => fn(id) === b) }; };
    const bPutt = best(id => F[id].putt, true), bLilla = best(id => F[id].lilla), bBrutto = best(id => sum(F[id].brutto), true);
    const names = ids => ids.map(id => esc(H.byId(id).nick)).join(" & ");
    const award = (label, ids, val) => `<div class="card rec"><small>${label}</small><b>${val}</b>
      <div class="who">${ids.map(id => `<img src="${img(H.byId(id))}" alt="">`).join("")}${names(ids)}</div></div>`;
    const rows = order.map((id, i) => { const f = F[id], p = H.byId(id);
      const hl = (cond) => cond ? ' class="best"' : "";
      return `<tr data-profile="${id}" tabindex="0" role="button" style="cursor:pointer"><td class="fpos">${i + 1}</td>
        <td class="fname"><img src="${img(p)}" alt="">${esc(p.nick)}</td>
        ${f.netto.map(n => `<td>${n}</td>`).join("")}<td>${f.start ? "−1" : ""}</td>
        <td class="ftot${i === 0 ? " best" : ""}">${tot(id)}</td>
        <td${hl(bBrutto.ids.includes(id))}>${sum(f.brutto)}</td><td${hl(bPutt.ids.includes(id))}>${f.putt}</td><td${hl(bLilla.ids.includes(id))}>${f.lilla}</td></tr>`; }).join("");
    const T = S.teams, tp = I.teamPoints;
    const matches = (I.matches || []).map((ms, k) => `<div class="card fmatch"><div class="fm-head"><b>Final ${k + 1}</b>
        ${tp ? `<span><span class="c-${T.G.color}">${fmtNum(tp.G[k])}</span> – <span class="c-${T.H.color}">${fmtNum(tp.H[k])}</span></span>` : ""}</div>
        ${ms.map(([h, g, w]) => `<div class="fm-row"><span class="${w === "H" ? "win" : ""}"><i class="dot ${T.H.color}"></i>${esc(H.byId(h).nick)}</span>
          <em>${w === "D" ? "Delad" : "vs"}</em><span class="r ${w === "G" ? "win" : ""}">${esc(H.byId(g).nick)}<i class="dot ${T.G.color}"></i></span></div>`).join("")}</div>`).join("");
    return `
      <p class="final-meta">${esc(I.venue || "")}${I.dates ? " · " + esc(I.dates) : ""}${I.holes ? ` · ${I.holes} hål` : ""}</p>
      <div class="records">
        ${award("Mästare", [order[0]], tot(order[0]) + " slag netto")}
        ${award("Bästa puttaren", bPutt.ids, bPutt.v + " puttar")}
        ${award("Lilla Rundan", bLilla.ids, bLilla.v + " p")}
        ${award("Lägsta brutto", bBrutto.ids, bBrutto.v + " slag")}
      </div>
      <h3 class="sub-h">Resultatlista</h3>
      <div class="p-table-wrap"><table class="p-table final-table">
        <tr><th></th><th>Spelare</th><th>F1</th><th>F2</th><th>F3</th><th>Start</th><th>Netto</th><th>Brutto</th><th>Puttar</th><th>Lilla R.</th></tr>${rows}</table></div>
      <p class="final-foot">Netto per finalrunda. Lika slag i finalen delas inte, där avgör lägst handicap. Tryck på en spelare för profilen.</p>
      ${matches ? `<h3 class="sub-h">Lagtävlingen i finalen</h3><div class="fmatches">${matches}</div>` : ""}`;
  }

  /* =======================================================
     Ritar allt som beror på vald säsong
     ======================================================= */
  function render() {
    const S = H.S(Y), ranked = H.ranked(Y), started = ranked.some(p => p.points);
    document.querySelectorAll("[data-season]").forEach(el => el.textContent = Y);
    fill("[data-season-switch]", switcher());
    fill("[data-season-note]", S.status === "kommande"
      ? `<div class="season-note">🧪 <b>${Y} är en testsäsong.</b> ${esc(S.note || "")}</div>` : "");

    fill("[data-kpis]", `
      <div class="kpi"><b>${ranked.length}</b><span>Spelare ${Y}</span></div>
      <div class="kpi"><b>${Object.keys(S.teams).length}</b><span>Lag</span></div>
      <div class="kpi"><b>${S.grundWinner ? esc(H.byId(S.grundWinner).nick) : "–"}</b><span>Vann grundspelet</span></div>
      <div class="kpi"><b>${esc(H.byId(H.champions[0].player).nick)}</b><span>Regerande mästare</span></div>`);

    const emptyStand = `<div class="empty-state"><b>Säsongen ${Y} har inte startat.</b><span>Ställningen fylls på när de första resultaten rapporteras.</span></div>`;
    fill("[data-standings-top]", (started ? "" : emptyStand) + standingsRows(ranked.slice(0, 8), ranked));
    fill("[data-standings-all]", (started ? "" : emptyStand) + standingsRows(ranked, ranked));
    fill("[data-duel]", teamResultCard());
    fill("[data-teams]", teamCards(ranked));
    fill("[data-players]", playerCards(ranked));
    fill("[data-filters]", `<button class="chip active" data-filter="all">Alla</button>` +
      Object.entries(S.teams).map(([id, t]) => `<button class="chip" data-filter="${id}">${esc(t.name)}</button>`).join(""));

    fill("[data-final]", finalSection());
    const side = S.side || {};
    const si = S.sideInfo || {}, nhT = Array.isArray(si.nh) ? si.nh : ["Närmast hål", si.nh || "Antal vinster, alla 8 omgångar"];
    fill("[data-season-lists]",
      toplist("Lilla Rundan", si.lilla || "Poäng, bästa 6 av 8", side.lilla, v => v + " p") +
      toplist("Bästa puttaren", si.putt || "Puttar, bästa 6 av 8 · lägst vinner", side.putt, v => v, true) +
      toplist(nhT[0], nhT[1], side.nh, v => v + " st") +
      toplist("Längsta drive", si.ld || "Antal vinster, alla 8 omgångar", side.ld, v => v + " st"));
    fill("[data-scoring-note]", esc(H.unit(Y).note) + (H.isPlac(Y) ? ". Varje omgångs placering räknas ihop." : ". Placeringspoäng varje omgång, 250 till 1:an."));
    fill("[data-round-winners]", Array.from({ length: 8 }, (_, i) => {
      const w = (S.roundWinners || [])[i];
      const info = (S.roundInfo || [])[i];
      const has = w && w.length;
      return `<${has ? `button data-round-detail="${i}"` : "div"} class="card rw${has ? " rw-btn" : ""}"><small>Omgång ${i + 1}${info ? " · " + esc(info.date) : ""}</small>
        <b>${has ? "🏆 " + w.map(id => esc(H.byId(id).nick)).join(" & ") : "<span style='color:var(--muted)'>Ej spelad</span>"}</b>
        ${info ? `<span class="rw-course">${esc(info.course.split(",")[0])}</span>` : ""}${has ? `<span class="rw-more">Alla resultat →</span>` : ""}</${has ? "button" : "div"}>`;
    }).join(""));
    fill("[data-season-summary]", S.grundWinner
      ? `${esc(H.byId(S.grundWinner).nick)} vann grundspelet med ${fmtNum(S.points[S.grundWinner])} ${H.unit(Y).long}.${S.teamResult ? " " + esc(S.teams[S.teamResult.winner].name) + " vann lagtävlingen." : ""}`
      : `Säsongen ${Y} har inte startat.`);
  }

  /* ── Sidor som inte beror på säsong ── */
  fill("[data-champ-feature]", champFeature());
  fill("[data-formats]", H.formats.map(f => `<div class="card fmt reveal"><h3>${esc(f.name)}</h3><p>${esc(f.desc)}</p></div>`).join(""));
  fill("[data-rules]", H.rules.map(r => `<li>${esc(r)}</li>`).join(""));
  const ordinal = n => n + (n === 1 || n === 2 ? ":a" : ":e");
  fill("[data-champ-list]", H.champions.map((c, i) => {
    const p = H.byId(c.player);
    const nth = H.champions.filter(x => x.player === c.player && x.year <= c.year).length;
    return `<article class="hof ${i === 0 ? "hof-current" : ""}" data-profile="${p.id}" tabindex="0" role="button" aria-label="${esc(p.nick)}, mästare ${c.year}">
      <div class="hof-img"><img src="${ROOT}assets/img/${c.photo || ""}" alt="Prisutdelning ${c.year}" loading="lazy" onerror="this.src='${img(p)}'"></div>
      ${i === 0 ? `<span class="hof-pill">👑 Regerande mästare</span>` : ""}
      <div class="hof-body">
        ${c.photoBadge ? "" : `<span class="hof-year">${c.year}</span>`}
        <h3>${esc(p.nick)}</h3>
        <small>${esc(p.name)}</small>
        <div class="hof-meta">
          ${c.venue ? `<span>⛳ ${esc(c.venue)}</span>` : ""}
          <span>🏆 ${ordinal(nth)} titeln</span>
        </div>
        ${c.note ? `<p>${esc(c.note.charAt(0).toUpperCase() + c.note.slice(1))}.</p>` : ""}
      </div>
    </article>`;
  }).join(""));
  const titleCount = {}; H.champions.forEach(c => titleCount[c.player] = (titleCount[c.player] || 0) + 1);
  fill("[data-title-count]", Object.entries(titleCount).sort((a, b) => b[1] - a[1]).map(([id, n]) => { const p = H.byId(id);
    return `<span class="tc"><img src="${img(p)}" alt="">${esc(p.nick)} <b>${n}</b></span>`; }).join(""));
  fill("[data-timeline]", [...H.history].reverse().map(h => {
    const facts = [["Final", h.final ? esc(h.final) : null], ["Mästare", h.champion ? esc(H.byId(h.champion).nick) : null], ["Grundspelet", h.grund ? esc(H.byId(h.grund).nick) : null]].filter(f => f[1]);
    return `<article class="card tl tl-rich">
      ${h.img ? `<div class="tl-media"><img src="${ROOT}assets/img/${h.img}" alt="" loading="lazy"></div>` : ""}
      <div class="tl-body"><span class="yr">${h.year}</span><span class="tl-season">Säsong ${h.year - H.founded + 1}</span>
        <h4>${esc(h.title)}</h4><p>${esc(h.text)}</p>
        <div class="tl-facts">${facts.map(([k, v]) => `<span><small>${k}</small>${v}</span>`).join("")}</div></div>
    </article>`; }).join(""));
  fill("[data-alltime-lists]",
    toplist("Mest delsegrar", "Omgångsvinster 2021–2026, delade räknas", H.allTime.wins, v => v + " st") +
    toplist("Bästa puttaren", "Snitt puttar per runda 2021–2026 · lägst vinner", H.allTime.putt, dec, true) +
    toplist("Lilla Rundan", "Snittpoäng per runda 2021–2026", H.allTime.lilla, dec) +
    toplist("Mest trogna spelaren", "Andel spelade grundomgångar 2021–2026", H.allTime.loyal, v => fmtNum(v) + " %"));
  fill("[data-records]", H.records.map(r => { const p = H.byId(r.player);
    return `<div class="card rec"><small>${esc(r.label)}</small><b>${esc(r.value)}</b>
      <div class="who"><img src="${img(p)}" alt="">${esc(p.nick)} <span>${esc(r.note)}</span></div></div>`; }).join(""));
  fill("[data-grund-winners]", Object.entries(H.grundWinners).reverse().map(([y, w]) => { const p = H.byId(w.p);
    return `<button class="card gw" data-profile="${p.id}"><img src="${w.img ? ROOT + "assets/img/" + w.img : img(p)}" alt="" loading="lazy">
      <div><small>Grundspelet ${y}</small><b>${esc(p.nick)}</b>
      <span class="gw-res"><strong>${esc(w.value)}</strong> ${esc(w.unit)}${w.note ? ` · ${esc(w.note)}` : ""}</span></div></button>`; }).join(""));

  /* ── Resultat för en omgång ── */
  function openRound(i) {
    const S = H.S(Y), info = (S.roundInfo || [])[i] || null, R = S.rounds || {};
    const played = Object.entries(R).filter(([, r]) => r[i]).map(([id, r]) => ({ id, r: r[i] })).sort((a, b) => a.r[4] - b.r[4] || a.r[0] - b.r[0]);
    const dns = Object.keys(R).filter(id => !R[id][i]).map(id => H.byId(id).nick).sort((a, b) => a.localeCompare(b, "sv"));
    const bestPutt = Math.min(...played.map(x => x.r[3])), bestLilla = Math.max(...played.map(x => x.r[2]));
    const total = (S.roundWinners || []).filter(w => w && w.length).length;
    const rows = played.map(({ id, r }) => { const p = H.byId(id), t = H.teamOf(Y, id);
      return `<tr class="${r[4] === 1 ? "win" : ""}"><td class="fpos">${r[4]}</td>
        <td class="fname"><img src="${img(p)}" alt="">${esc(p.nick)}${t ? `<i class="dot ${teamColor(t)}"></i>` : ""}</td>
        <td><b>${r[0]}</b></td><td>${r[1]}</td><td${r[2] === bestLilla ? ' class="best"' : ""}>${r[2]}</td><td${r[3] === bestPutt ? ' class="best"' : ""}>${r[3]}</td></tr>`; }).join("");
    const wrap = document.createElement("div");
    wrap.className = "profile-bg";
    wrap.innerHTML = `<div class="profile" role="dialog" aria-modal="true" aria-label="Omgång ${i + 1}">
      <div class="profile-head round-head"><div>
        <small>Säsong ${Y} · Omgång ${i + 1} av 8</small>
        <h3>${info ? esc(info.course) : "Omgång " + (i + 1)}</h3>
        <small>${info ? esc(info.date + " " + Y) + (info.note ? " · " + esc(info.note) : "") : "Bana och datum är inte registrerade för den här säsongen."}</small></div>
        <button class="profile-close" aria-label="Stäng">✕</button></div>
      <div class="profile-body">
        <div class="p-table-wrap"><table class="p-table final-table">
          <tr><th>Plac</th><th>Spelare</th><th>Netto</th><th>${H.isPlac(Y) ? "Poängb." : "Poäng"}</th><th>Lilla</th><th>Putt</th></tr>${rows}</table></div>
        ${dns.length ? `<p class="final-foot">Spelade inte: ${dns.map(esc).join(", ")}.</p>` : ""}
        ${(() => { const x = (S.roundSide || [])[i];
          const list = arr => arr.map(([pid, hole]) => `<span class="rs-chip"><img src="${img(H.byId(pid))}" alt="">${esc(H.byId(pid).nick)}${hole ? ` <em>hål ${hole}</em>` : ""}</span>`).join("");
          if (!x) return `<div class="round-side"><p class="final-foot">Vem som vann närmast hål och längsta drive är inte registrerat per omgång för ${Y}.${S.side && (S.side.nh || S.side.ld) ? " Totalerna för säsongen finns under Sidotävlingarna." : ""}</p></div>`;
          return `<div class="round-side">
            <div><h4>🎯 Närmast hål</h4><div class="rs-list">${list(x.nh)}${(x.nhNone || []).map(h => `<span class="rs-chip rs-none">Ingen på hål ${h}</span>`).join("")}</div></div>
            <div><h4>🏌️ Längsta drive</h4><div class="rs-list">${list(x.ld)}</div></div>
            ${x.note ? `<p class="final-foot">${esc(x.note)}</p>` : ""}</div>`; })()}
        <div class="round-nav">
          <button class="btn btn-line" data-step="-1" ${i === 0 ? "disabled" : ""}>← Omgång ${i}</button>
          <button class="btn btn-line" data-step="1" ${i + 1 >= total ? "disabled" : ""}>Omgång ${i + 2} →</button>
        </div>
      </div></div>`;
    const close = () => { wrap.remove(); document.removeEventListener("keydown", onKey); };
    const onKey = e => { if (e.key === "Escape") close(); if (e.key === "ArrowRight" && i + 1 < total) { close(); openRound(i + 1); } if (e.key === "ArrowLeft" && i > 0) { close(); openRound(i - 1); } };
    wrap.addEventListener("click", e => {
      if (e.target === wrap) return close();
      const st = e.target.closest("[data-step]");
      if (st && !st.disabled) { close(); openRound(i + +st.dataset.step); }
    });
    wrap.querySelector(".profile-close").addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    document.body.appendChild(wrap);
    wrap.querySelector(".profile-close").focus();
  }
  document.addEventListener("click", e => { const b = e.target.closest("[data-round-detail]"); if (b) openRound(+b.dataset.roundDetail); });

  /* ── Spelarprofil (vald säsong + översikt alla säsonger) ── */
  function finalPlace(y, id) {
    const S = H.S(y);
    if (S.final && S.final[id]) {
      const order = S.finalOrder || Object.keys(S.final), f = S.final[id];
      return { pos: order.indexOf(id) + 1, text: `${f.netto.reduce((a, b) => a + b, 0) + (f.start || 0)} netto` };
    }
    const c = H.champions.find(x => x.year === y);
    return c && c.player === id ? { pos: 1, text: "mästare" } : null;
  }
  function profileHTML(id) {
    const p = H.byId(id), S = H.S(Y), tid = H.teamOf(Y, id), t = tid ? S.teams[tid] : null;
    const ranked = H.ranked(Y), me = ranked.find(x => x.id === id);
    const pos = H.rank(Y, id);
    const R = (S.rounds || {})[id] || [], F = (S.final || {})[id];
    const played = R.filter(Boolean);
    const best = played.length ? Math.min(...played.map(r => r[0])) : "–";
    const wins = played.filter(r => r[4] === 1).length;
    const titles = H.titles(id), grund = Object.entries(H.grundWinners).filter(([, w]) => w.p === id).map(([y]) => y);
    const at = H.allTime, recs = H.records.filter(r => r.player === id);
    const badges = [
      ...titles.map(y => `🏆 Mästare ${y}`), ...grund.map(y => `🥇 Grundspelet ${y}`),
      ...recs.map(r => `⭐ ${r.label}: ${r.value}`),
      at.wins[id] ? `${at.wins[id]} delsegrar totalt` : "", at.loyal[id] ? `${fmtNum(at.loyal[id])} % spelade omgångar 2021–26` : ""
    ].filter(Boolean);
    const rows = R.map((r, i) => r
      ? `<tr class="${r[4] === 1 ? "win" : ""}"><td>Omgång ${i + 1}</td><td>${r[0]}</td><td>${r[4]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`
      : `<tr class="dns"><td>Omgång ${i + 1}</td><td colspan="5">Ej spelat</td></tr>`).join("");
    const frows = F ? F.netto.map((n, i) => `<tr class="final"><td>Final ${i + 1}</td><td>${n}</td><td colspan="4"></td></tr>`).join("") +
      `<tr class="final"><td>Finalen totalt</td><td>${F.netto.reduce((a, b) => a + b, 0) + (F.start || 0)}</td><td colspan="2"></td><td>${F.lilla}</td><td>${F.putt}</td></tr>` : "";
    const years = H.seasonYears();
    const grundChips = years.filter(y => H.S(y).points[id]).map(y => {
      const rk = H.ranked(y), m = rk.find(x => x.id === id);
      return `<button class="hist-chip ${y === Y ? "on" : ""}" data-pyear="${y}" aria-pressed="${y === Y}">${y}<b>${H.rank(y, id)}:a</b><span>${fmtNum(m.points)} ${H.unit(y).short}</span></button>`;
    }).join("");
    const finalChips = years.map(y => [y, finalPlace(y, id)]).filter(([, f]) => f).map(([y, f]) =>
      `<button class="hist-chip final-chip ${y === Y ? "on" : ""}" data-pyear="${y}" aria-pressed="${y === Y}">${y}<b>${f.pos === 1 ? "🏆 1:a" : f.pos + ":a"}</b><span>${esc(f.text)}</span></button>`).join("");
    const fp = finalPlace(Y, id);
    return `
      <div class="profile-head"><img src="${img(p)}" alt="">
        <div><h3>${esc(p.nick)}</h3><small>${esc(p.name)}${t ? ` · ${esc(t.name)} ${Y}${t.captain === id ? " · Kapten" : ""}` : ""}</small></div>
        <button class="profile-close" aria-label="Stäng">✕</button></div>
      <div class="profile-body">
        ${grundChips ? `<div class="p-section"><h4>Grundspelet per säsong</h4><p class="p-hint">Placering och resultat i grundomgångarna (poäng, eller placeringssumma t.o.m. 2024). Tryck på ett år för att visa den säsongen nedan.</p><div class="hist">${grundChips}</div></div>` : ""}
        ${finalChips ? `<div class="p-section"><h4>Slutspelet per säsong</h4><div class="hist">${finalChips}</div></div>` : ""}
        <div class="p-season-label" id="p-season">Visar säsong ${Y}</div>
        <div class="p-kpis">
          <div class="p-kpi"><b>${me && me.points ? fmtNum(me.points) : "–"}</b><span>${H.unit(Y).label} grundspelet ${Y}${pos ? ` · plats ${pos}` : ""}</span></div>
          <div class="p-kpi"><b>${fp ? fp.pos + ":a" : "–"}</b><span>Slutspelet ${Y}${fp ? " · " + esc(fp.text) : ""}</span></div>
          <div class="p-kpi"><b>${best}</b><span>Bästa netto grundspelet ${Y}</span></div>
          <div class="p-kpi"><b>${wins} · ${played.length}/8</b><span>Delsegrar · spelade omgångar ${Y}</span></div>
        </div>
        ${badges.length ? `<div class="p-badges">${badges.map(b => `<span class="badge">${esc(b)}</span>`).join("")}</div>` : ""}
        ${R.length ? `<div class="p-section"><h4>Säsongen ${Y} runda för runda</h4><div class="p-table-wrap"><table class="p-table">
          <tr><th>Omgång</th><th>Netto</th><th>Plac</th><th>${H.isPlac(Y) ? "Poängb." : "Poäng"}</th><th>Lilla R.</th><th>Puttar</th></tr>${rows}${frows}</table></div></div>`
          : `<p class="empty">Inga rundor inlagda för ${Y}.</p>`}
      </div>`;
  }
  /* Byt säsong för hela sidan (används av väljaren och profilen) */
  function setSeason(y) {
    Y = y;
    try { localStorage.setItem("hgm.season", y); } catch (err) {}
    try { history.replaceState(null, "", "#" + y); } catch (err) {}
    render();
  }
  function openProfile(id) {
    const wrap = document.createElement("div");
    wrap.className = "profile-bg";
    const box = document.createElement("div");
    box.className = "profile"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", H.byId(id).nick);
    box.innerHTML = profileHTML(id);
    wrap.appendChild(box);
    const close = () => { wrap.remove(); document.removeEventListener("keydown", onKey); last && last.focus && last.focus(); };
    const onKey = e => { if (e.key === "Escape") close(); };
    const last = document.activeElement;
    wrap.addEventListener("click", e => {
      if (e.target === wrap || e.target.closest(".profile-close")) return close();
      const c = e.target.closest("[data-pyear]");
      if (c) {
        setSeason(+c.dataset.pyear);
        box.innerHTML = profileHTML(id);
        const label = box.querySelector("#p-season");
        if (label) { box.scrollTo({ top: label.offsetTop - 12, behavior: "smooth" }); label.classList.remove("flash"); void label.offsetWidth; label.classList.add("flash"); }
      }
    });
    document.addEventListener("keydown", onKey);
    document.body.appendChild(wrap);
    box.querySelector(".profile-close").focus();
  }
  document.addEventListener("click", e => {
    if (e.target.closest(".profile")) return;
    const c = e.target.closest("[data-profile]"); if (c) openProfile(c.dataset.profile);
  });
  document.addEventListener("keydown", e => { const c = e.target.closest && e.target.closest("[data-profile]"); if (c && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openProfile(c.dataset.profile); } });

  /* ── Galleri ── */
  const G = H.gallery || [];
  fill("[data-gallery]", (H.gallerySections || []).map(([id, label]) => {
    const items = G.filter(x => x.s === id);
    if (!items.length) return "";
    return `<div class="gal-sec"><h2 class="gal-h">${esc(label)} <span>${items.length} bilder</span></h2><div class="gal-grid">${items.map(x =>
      `<button class="gal-item" data-gal="${G.indexOf(x)}" aria-label="Visa bild"><img src="${ROOT}assets/img/galleri/${x.f}-t.jpg" alt="" loading="lazy" width="${x.w}" height="${x.h}"></button>`).join("")}</div></div>`;
  }).join(""));
  function openGal(i) {
    const box = document.createElement("div");
    box.className = "lightbox";
    const show = () => { box.querySelector("img").src = `${ROOT}assets/img/galleri/${G[i].f}.jpg`; box.querySelector(".lb-count").textContent = `${i + 1} / ${G.length}`; };
    box.innerHTML = `<img alt=""><button class="lb-btn lb-prev" aria-label="Föregående">‹</button><button class="lb-btn lb-next" aria-label="Nästa">›</button><button class="lb-btn lb-close" aria-label="Stäng">✕</button><span class="lb-count"></span>`;
    const step = d => { i = (i + d + G.length) % G.length; show(); };
    const close = () => { box.remove(); document.removeEventListener("keydown", key); };
    const key = e => { if (e.key === "Escape") close(); if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); };
    box.querySelector(".lb-prev").onclick = e => { e.stopPropagation(); step(-1); };
    box.querySelector(".lb-next").onclick = e => { e.stopPropagation(); step(1); };
    box.querySelector(".lb-close").onclick = close;
    box.addEventListener("click", e => { if (e.target === box) close(); });
    let x0 = null;
    box.addEventListener("touchstart", e => x0 = e.touches[0].clientX, { passive: true });
    box.addEventListener("touchend", e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1); x0 = null; });
    document.addEventListener("keydown", key);
    document.body.appendChild(box); show(); box.querySelector(".lb-close").focus();
  }
  document.addEventListener("click", e => { const g = e.target.closest("[data-gal]"); if (g) openGal(+g.dataset.gal); });

  /* ── Lagfilter på spelarsidan ── */
  document.addEventListener("click", e => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;
    document.querySelectorAll("[data-filter]").forEach(b => b.classList.toggle("active", b === btn));
    const f = btn.dataset.filter;
    document.querySelectorAll(".pcard").forEach(c => { c.style.display = f === "all" || c.dataset.team === f ? "" : "none"; });
  });

  render();
  /* Byt säsong när adressen ändras (t.ex. bakåtknappen) */
  window.addEventListener("hashchange", () => {
    const y = parseInt(location.hash.replace("#", ""), 10);
    if (H.seasons[y] && y !== Y) { Y = y; document.querySelectorAll(".profile-bg").forEach(el => el.remove()); render(); }
  });

  /* Mjuk in-animation */
  const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: .08 }) : null;
  document.querySelectorAll(".reveal").forEach(el => io ? io.observe(el) : el.classList.add("in"));
})();
