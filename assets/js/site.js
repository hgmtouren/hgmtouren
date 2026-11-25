/* =========================================================
   HGM Touren – gemensam rendering (nav, footer, sektioner)
   Varje sida sätter <body data-root="" eller "../" data-page="...">
   ========================================================= */
(function () {
  const ROOT = document.body.dataset.root || "";
  const PAGE = document.body.dataset.page || "hem";
  const H = window.HGM;
  const img = p => `${ROOT}assets/img/spelare/${p.img}.jpg`;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const $ = (sel) => document.querySelector(sel);

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
    t.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      t.setAttribute("aria-expanded", open);
    });
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
        <small>© ${H.season} HGM Touren · All Swingers · Est. ${H.founded} · <a href="mailto:${H.contact}">${H.contact}</a></small>
      </div>`;
  }

  /* ── Komponenter ── */
  const ranked = H.ranked();
  const max = ranked[0].points;

  function standingsRows(list) {
    return list.map(p => {
      const pos = ranked.indexOf(p) + 1;
      const cls = pos === 1 ? "row top first" : pos <= 3 ? "row top" : "row";
      const t = H.teams[p.team];
      const cap = t.captain === p.id ? " · Kapten" : "";
      return `<div class="${cls}" data-profile="${p.id}" tabindex="0" role="button" style="cursor:pointer">
        <div class="pos">${pos}</div>
        <img class="avatar" src="${img(p)}" alt="" loading="lazy">
        <div class="who"><b>${esc(p.nick)}</b><small><span class="dot ${p.team}"></span>${t.name}${cap}</small></div>
        <div class="pts"><b>${p.points.toLocaleString("sv-SE")}</b><div class="bar"><i style="width:${(p.points / max * 100).toFixed(1)}%"></i></div></div>
      </div>`;
    }).join("");
  }

  function duelCard() {
    const f = H.teamFinal, num = v => parseFloat(String(v).replace(",", "."));
    const gp = (num(f.G) / (num(f.G) + num(f.H)) * 100).toFixed(1);
    return `<div class="card duel">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
        <h3>Lagtävlingen ${H.season}</h3>
        <span class="badge gold">🏆 ${H.teams[H.teamWinner].name} vann</span>
      </div>
      <div class="duel-score">
        <div><b style="color:var(--team-g)">${f.G}</b><span>Lag G · ${H.teams.G.nick}</span></div>
        <div style="text-align:right"><b style="color:var(--team-h)">${f.H}</b><span>Lag H · ${H.teams.H.nick}</span></div>
      </div>
      <div class="duel-bar"><i style="width:${gp}%"></i><i style="flex:1"></i></div>
      <p style="font-size:.9rem;color:var(--ink-2)">Matchspel Lag G mot Lag H. ${esc(f.text)}</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:.9rem;color:var(--ink-2)">
        <div>Kapten <b>${H.byId(H.teams.G.captain).nick}</b></div>
        <div style="text-align:right">Kapten <b>${H.byId(H.teams.H.captain).nick}</b></div>
      </div>
    </div>`;
  }

  function champFeature() {
    const c = H.champions[0], p = H.byId(c.player);
    const titles = H.titles(p.id).length;
    return `<div class="champ-feature">
      <img src="${img(p)}" alt="${esc(p.nick)}">
      <div class="body">
        <span class="eyebrow">Mästare ${c.year}${c.venue ? " · " + esc(c.venue) : ""}</span>
        <h3>${esc(p.nick)}</h3>
        <p>${esc(p.name)}${c.note ? " – " + esc(c.note) : ""}.</p>
        <div class="badges">
          <span class="badge">🏆 ${titles}× mästare</span>
          ${(c.awards || []).map(([a, id]) => `<span class="badge">${esc(a)}: ${esc(H.byId(id).nick)}</span>`).join("")}
        </div>
      </div>
    </div>`;
  }

  function playerCards(list) {
    return list.map(p => {
      const pos = ranked.indexOf(p) + 1;
      const titles = H.titles(p.id);
      const cap = H.teams[p.team].captain === p.id;
      return `<article class="pcard" data-team="${p.team}" data-profile="${p.id}" tabindex="0" role="button" aria-label="Visa profil för ${esc(p.nick)}">
        <img src="${img(p)}" alt="${esc(p.nick)}" loading="lazy">
        <span class="tag ${p.team}">${H.teams[p.team].name}${cap ? " · C" : ""}</span>
        <span class="rank">#${pos}</span>
        <div class="info">
          <b>${esc(p.nick)}</b><small>${esc(p.name)}</small>
          <div class="meta"><span><b>${p.points}</b> p</span>${titles.length ? `<span>🏆 ${titles.join(", ")}</span>` : ""}</div>
        </div>
      </article>`;
    }).join("");
  }

  function teamCard(t) {
    const team = H.teams[t];
    const list = ranked.filter(p => p.team === t);
    return `<div class="card team ${t}">
      <div class="team-head">
        <div><h3>${team.name}</h3><small>${team.nick} · Kapten ${H.byId(team.captain).nick}</small></div>
        <div class="team-total"><b>${H.teamTotal(t).toLocaleString("sv-SE")}</b><small>indiv. poäng</small></div>
      </div>
      ${standingsRows(list)}
    </div>`;
  }

  /* ── Fyll i element som finns på sidan ── */
  const fill = (sel, html) => { const el = $(sel); if (el) el.innerHTML = html; };

  fill("[data-kpis]", `
    <div class="kpi"><b>${H.players.length}</b><span>Spelare</span></div>
    <div class="kpi"><b>${H.season - H.founded + 1}</b><span>Säsonger</span></div>
    <div class="kpi"><b>2</b><span>Lag</span></div>
    <div class="kpi"><b>${H.byId(H.champions[0].player).nick}</b><span>Regerande mästare</span></div>`);

  fill("[data-standings-top]", standingsRows(ranked.slice(0, 8)));
  fill("[data-standings-all]", standingsRows(ranked));
  fill("[data-duel]", duelCard());
  fill("[data-champ-feature]", champFeature());
  fill("[data-teams]", teamCard("G") + teamCard("H"));
  fill("[data-formats]", H.formats.map(f => `<div class="card fmt reveal"><h3>${esc(f.name)}</h3><p>${esc(f.desc)}</p></div>`).join(""));
  fill("[data-rules]", H.rules.map(r => `<li>${esc(r)}</li>`).join(""));
  fill("[data-players]", playerCards(ranked));
  document.querySelectorAll("[data-season]").forEach(el => el.textContent = H.season);

  fill("[data-champ-list]", H.champions.map(c => {
    const p = H.byId(c.player);
    return `<div class="card champ"><span class="yr">${c.year}</span>
      <div class="p"><img src="${img(p)}" alt="" loading="lazy"><div><b>${esc(p.nick)}</b><br><small style="color:var(--muted)">${esc(p.name)}</small></div></div>${c.venue ? `<small style="color:var(--muted)">Final: ${esc(c.venue)}</small>` : ""}</div>`;
  }).join(""));

  fill("[data-timeline]", [...H.history].reverse().map(h => `
    <div class="card tl reveal"><span class="yr">${h.year}</span>
      <div><h4>${esc(h.title)}</h4><p>${esc(h.text)}</p></div></div>`).join(""));

  /* ── Statistik: topplistor ── */
  function toplist(title, sub, obj, fmt, asc, limit = 8) {
    const rows = Object.entries(obj).filter(([id]) => H.byId(id)).sort((a, b) => asc ? a[1] - b[1] : b[1] - a[1]);
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
  const S = H.season2026;
  fill("[data-season-lists]",
    toplist("Lilla Rundan", "Poäng, bästa 6 av 8", S.lilla, v => v + " p") +
    toplist("Bästa puttaren", "Puttar, bästa 6 av 8 · lägst vinner", S.putt, v => v, true) +
    toplist("Närmast hål", "Antal vinster, alla 8 omgångar", S.nh, v => v + " st") +
    toplist("Längsta drive", "Antal vinster, alla 8 omgångar", S.ld, v => v + " st"));
  fill("[data-alltime-lists]",
    toplist("Mest delsegrar", "Omgångsvinster 2021–2026, delade räknas", H.allTime.wins, v => v + " st") +
    toplist("Bästa puttaren", "Snitt puttar per runda 2021–2025 · lägst vinner", H.allTime.putt, dec, true) +
    toplist("Lilla Rundan", "Snittpoäng per runda 2021–2025", H.allTime.lilla, dec) +
    toplist("Mest trogna spelaren", "Andel spelade rundor 2021–2025", H.allTime.loyal, v => v + " %"));
  fill("[data-records]", H.records.map(r => { const p = H.byId(r.player);
    return `<div class="card rec"><small>${esc(r.label)}</small><b>${esc(r.value)}</b>
      <div class="who"><img src="${img(p)}" alt="">${esc(p.nick)} <span>${esc(r.note)}</span></div></div>`; }).join(""));
  fill("[data-round-winners]", H.roundWinners2026.map((w, i) =>
    `<div class="card rw"><small>Omgång ${i + 1}</small><b>🏆 ${w.map(id => esc(H.byId(id).nick)).join(" & ")}</b></div>`).join(""));
  fill("[data-grund-winners]", Object.entries(H.grundWinners).reverse().map(([y, id]) =>
    `<div class="card rw"><small>Grundspelet ${y}</small><b>${esc(H.byId(id).nick)}</b></div>`).join(""));
  document.querySelectorAll("[data-more]").forEach(b => b.addEventListener("click", () => {
    b.parentElement.querySelectorAll(".tl-row[hidden]").forEach(r => r.hidden = false); b.remove();
  }));

  /* ── Spelarprofil ── */
  function openProfile(id) {
    const p = H.byId(id), t = H.teams[p.team], R = (H.rounds2026 || {})[id] || [], F = (H.final2026 || {})[id];
    const played = R.filter(Boolean), pos = ranked.indexOf(p) + 1;
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
    const wrap = document.createElement("div");
    wrap.className = "profile-bg";
    wrap.innerHTML = `<div class="profile" role="dialog" aria-modal="true" aria-label="${esc(p.nick)}">
      <div class="profile-head"><img src="${img(p)}" alt="">
        <div><h3>${esc(p.nick)}</h3><small>${esc(p.name)}${t ? ` · ${t.name}${t.captain === id ? " · Kapten" : ""}` : ""}</small></div>
        <button class="profile-close" aria-label="Stäng">✕</button></div>
      <div class="profile-body">
        <div class="p-kpis">
          <div class="p-kpi"><b>${p.points ? p.points.toLocaleString("sv-SE") : "–"}</b><span>Poäng 2026${pos ? ` · plats ${pos}` : ""}</span></div>
          <div class="p-kpi"><b>${best}</b><span>Bästa netto 2026</span></div>
          <div class="p-kpi"><b>${wins}</b><span>Delsegrar 2026</span></div>
          <div class="p-kpi"><b>${played.length}/8</b><span>Spelade omgångar</span></div>
        </div>
        ${badges.length ? `<div class="p-badges">${badges.map(b => `<span class="badge">${esc(b)}</span>`).join("")}</div>` : ""}
        ${R.length ? `<div class="p-section"><h4>Säsongen 2026 runda för runda</h4><div class="p-table-wrap"><table class="p-table">
          <tr><th>Omgång</th><th>Netto</th><th>Plac</th><th>Poäng</th><th>Lilla R.</th><th>Puttar</th></tr>${rows}${frows}</table></div></div>` : ""}
      </div></div>`;
    const close = () => { wrap.remove(); document.removeEventListener("keydown", onKey); last && last.focus(); };
    const onKey = e => { if (e.key === "Escape") close(); };
    const last = document.activeElement;
    wrap.addEventListener("click", e => { if (e.target === wrap) close(); });
    wrap.querySelector(".profile-close").addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    document.body.appendChild(wrap);
    wrap.querySelector(".profile-close").focus();
  }
  document.addEventListener("click", e => { const c = e.target.closest("[data-profile]"); if (c) openProfile(c.dataset.profile); });
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

  /* Filter på spelarsidan */
  document.querySelectorAll("[data-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-filter]").forEach(b => b.classList.toggle("active", b === btn));
      const f = btn.dataset.filter;
      document.querySelectorAll(".pcard").forEach(c => { c.style.display = f === "all" || c.dataset.team === f ? "" : "none"; });
    });
  });

  /* Mjuk in-animation */
  const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: .08 }) : null;
  document.querySelectorAll(".reveal").forEach(el => io ? io.observe(el) : el.classList.add("in"));
})();
