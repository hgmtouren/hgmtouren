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
    Y = +b.dataset.year;
    try { localStorage.setItem("hgm.season", Y); } catch (err) {}
    try { history.replaceState(null, "", "#" + Y); } catch (err) { location.hash = Y; }
    render();
  });

  /* ── Hjälp för lag ── */
  const team = (id) => H.S(Y).teams[id];
  const teamColor = id => (team(id) || {}).color || "x";

  function standingsRows(list, ranked) {
    const max = Math.max(1, ...ranked.map(p => p.points));
    return list.map(p => {
      const pos = ranked.indexOf(p) + 1, t = team(p.team);
      const started = ranked.some(x => x.points);
      const cls = !started ? "row" : pos === 1 ? "row top first" : pos <= 3 ? "row top" : "row";
      return `<div class="${cls}" data-profile="${p.id}" tabindex="0" role="button" style="cursor:pointer">
        <div class="pos">${started ? pos : "–"}</div>
        <img class="avatar" src="${img(p)}" alt="" loading="lazy">
        <div class="who"><b>${esc(p.nick)}</b><small><span class="dot ${teamColor(p.team)}"></span>${t ? esc(t.name) : ""}${t && t.captain === p.id ? " · Kapten" : ""}</small></div>
        <div class="pts"><b>${p.points.toLocaleString("sv-SE")}</b><div class="bar"><i style="width:${(p.points / max * 100).toFixed(1)}%"></i></div></div>
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
      <img src="${img(p)}" alt="${esc(p.nick)}">
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
        ${started ? `<span class="rank">#${i + 1}</span>` : ""}
        <div class="info">
          <b>${esc(p.nick)}</b><small>${esc(p.name)}</small>
          <div class="meta"><span><b>${p.points}</b> p</span>${titles.length ? `<span>🏆 ${titles.join(", ")}</span>` : ""}</div>
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

    const side = S.side || {};
    fill("[data-season-lists]",
      toplist("Lilla Rundan", "Poäng, bästa 6 av 8", side.lilla, v => v + " p") +
      toplist("Bästa puttaren", "Puttar, bästa 6 av 8 · lägst vinner", side.putt, v => v, true) +
      toplist("Närmast hål", "Antal vinster, alla 8 omgångar", side.nh, v => v + " st") +
      toplist("Längsta drive", "Antal vinster, alla 8 omgångar", side.ld, v => v + " st"));
    fill("[data-round-winners]", Array.from({ length: 8 }, (_, i) => {
      const w = (S.roundWinners || [])[i];
      return `<div class="card rw"><small>Omgång ${i + 1}</small><b>${w && w.length ? "🏆 " + w.map(id => esc(H.byId(id).nick)).join(" & ") : "<span style='color:var(--muted)'>Ej spelad</span>"}</b></div>`;
    }).join(""));
    fill("[data-season-summary]", S.grundWinner
      ? `${esc(H.byId(S.grundWinner).nick)} vann grundspelet med ${fmtNum(S.points[S.grundWinner])} poäng.${S.teamResult ? " " + esc(S.teams[S.teamResult.winner].name) + " vann lagtävlingen." : ""}`
      : `Säsongen ${Y} har inte startat.`);
  }

  /* ── Sidor som inte beror på säsong ── */
  fill("[data-champ-feature]", champFeature());
  fill("[data-formats]", H.formats.map(f => `<div class="card fmt reveal"><h3>${esc(f.name)}</h3><p>${esc(f.desc)}</p></div>`).join(""));
  fill("[data-rules]", H.rules.map(r => `<li>${esc(r)}</li>`).join(""));
  fill("[data-champ-list]", H.champions.map(c => {
    const p = H.byId(c.player);
    return `<div class="card champ"><span class="yr">${c.year}</span>
      <div class="p"><img src="${img(p)}" alt="" loading="lazy"><div><b>${esc(p.nick)}</b><br><small style="color:var(--muted)">${esc(p.name)}</small></div></div>${c.venue ? `<small style="color:var(--muted)">Final: ${esc(c.venue)}</small>` : ""}</div>`;
  }).join(""));
  fill("[data-timeline]", [...H.history].reverse().map(h => `
    <div class="card tl reveal"><span class="yr">${h.year}</span>
      <div><h4>${esc(h.title)}</h4><p>${esc(h.text)}</p></div></div>`).join(""));
  fill("[data-alltime-lists]",
    toplist("Mest delsegrar", "Omgångsvinster 2021–2026, delade räknas", H.allTime.wins, v => v + " st") +
    toplist("Bästa puttaren", "Snitt puttar per runda 2021–2025 · lägst vinner", H.allTime.putt, dec, true) +
    toplist("Lilla Rundan", "Snittpoäng per runda 2021–2025", H.allTime.lilla, dec) +
    toplist("Mest trogna spelaren", "Andel spelade rundor 2021–2025", H.allTime.loyal, v => v + " %"));
  fill("[data-records]", H.records.map(r => { const p = H.byId(r.player);
    return `<div class="card rec"><small>${esc(r.label)}</small><b>${esc(r.value)}</b>
      <div class="who"><img src="${img(p)}" alt="">${esc(p.nick)} <span>${esc(r.note)}</span></div></div>`; }).join(""));
  fill("[data-grund-winners]", Object.entries(H.grundWinners).reverse().map(([y, id]) =>
    `<div class="card rw"><small>Grundspelet ${y}</small><b>${esc(H.byId(id).nick)}</b></div>`).join(""));

  /* ── Spelarprofil (vald säsong + översikt alla säsonger) ── */
  function openProfile(id) {
    const p = H.byId(id), S = H.S(Y), tid = H.teamOf(Y, id), t = tid ? S.teams[tid] : null;
    const ranked = H.ranked(Y), me = ranked.find(x => x.id === id);
    const pos = me && me.points ? ranked.indexOf(me) + 1 : null;
    const R = (S.rounds || {})[id] || [], F = (S.final || {})[id];
    const played = R.filter(Boolean);
    const best = played.length ? Math.min(...played.map(r => r[0])) : "–";
    const wins = played.filter(r => r[4] === 1).length;
    const titles = H.titles(id), grund = Object.entries(H.grundWinners).filter(([, w]) => w === id).map(([y]) => y);
    const at = H.allTime, recs = H.records.filter(r => r.player === id);
    const badges = [
      ...titles.map(y => `🏆 Mästare ${y}`), ...grund.map(y => `🥇 Grundspelet ${y}`),
      ...recs.map(r => `⭐ ${r.label}: ${r.value}`),
      at.wins[id] ? `${at.wins[id]} delsegrar totalt` : "", at.loyal[id] ? `${at.loyal[id]} % spelade rundor 2021–25` : ""
    ].filter(Boolean);
    const rows = R.map((r, i) => r
      ? `<tr class="${r[4] === 1 ? "win" : ""}"><td>Omgång ${i + 1}</td><td>${r[0]}</td><td>${r[4]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`
      : `<tr class="dns"><td>Omgång ${i + 1}</td><td colspan="5">Ej spelat</td></tr>`).join("");
    const frows = F ? F.netto.map((n, i) => `<tr class="final"><td>Final ${i + 1}</td><td>${n}</td><td colspan="4"></td></tr>`).join("") +
      `<tr class="final"><td>Finalen totalt</td><td>${F.netto.reduce((a, b) => a + b, 0) + (F.start || 0)}</td><td colspan="2"></td><td>${F.lilla}</td><td>${F.putt}</td></tr>` : "";
    const history = H.seasonYears().filter(y => H.S(y).points[id]).map(y => {
      const rk = H.ranked(y), m = rk.find(x => x.id === id);
      return `<button class="hist-chip ${y === Y ? "on" : ""}" data-year="${y}" data-reopen="${id}">${y}<b>${rk.indexOf(m) + 1}:a</b><span>${fmtNum(m.points)} p</span></button>`;
    }).join("");
    const wrap = document.createElement("div");
    wrap.className = "profile-bg";
    wrap.innerHTML = `<div class="profile" role="dialog" aria-modal="true" aria-label="${esc(p.nick)}">
      <div class="profile-head"><img src="${img(p)}" alt="">
        <div><h3>${esc(p.nick)}</h3><small>${esc(p.name)}${t ? ` · ${esc(t.name)} ${Y}${t.captain === id ? " · Kapten" : ""}` : ""}</small></div>
        <button class="profile-close" aria-label="Stäng">✕</button></div>
      <div class="profile-body">
        ${history ? `<div class="p-section"><h4>Säsonger</h4><div class="hist">${history}</div></div>` : ""}
        <div class="p-kpis">
          <div class="p-kpi"><b>${me && me.points ? fmtNum(me.points) : "–"}</b><span>Poäng ${Y}${pos ? ` · plats ${pos}` : ""}</span></div>
          <div class="p-kpi"><b>${best}</b><span>Bästa netto ${Y}</span></div>
          <div class="p-kpi"><b>${wins}</b><span>Delsegrar ${Y}</span></div>
          <div class="p-kpi"><b>${played.length}/8</b><span>Spelade omgångar</span></div>
        </div>
        ${badges.length ? `<div class="p-badges">${badges.map(b => `<span class="badge">${esc(b)}</span>`).join("")}</div>` : ""}
        ${R.length ? `<div class="p-section"><h4>Säsongen ${Y} runda för runda</h4><div class="p-table-wrap"><table class="p-table">
          <tr><th>Omgång</th><th>Netto</th><th>Plac</th><th>Poäng</th><th>Lilla R.</th><th>Puttar</th></tr>${rows}${frows}</table></div></div>`
          : `<p class="empty">Inga rundor rapporterade ${Y}.</p>`}
      </div></div>`;
    const close = () => { wrap.remove(); document.removeEventListener("keydown", onKey); last && last.focus && last.focus(); };
    const onKey = e => { if (e.key === "Escape") close(); };
    const last = document.activeElement;
    wrap.addEventListener("click", e => {
      if (e.target === wrap) return close();
      const r = e.target.closest("[data-reopen]");
      if (r) { close(); setTimeout(() => openProfile(r.dataset.reopen), 0); }
    });
    wrap.querySelector(".profile-close").addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    document.body.appendChild(wrap);
    wrap.querySelector(".profile-close").focus();
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

  /* Mjuk in-animation */
  const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: .08 }) : null;
  document.querySelectorAll(".reveal").forEach(el => io ? io.observe(el) : el.classList.add("in"));
})();
