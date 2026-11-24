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
    ["hem", "Hem", ""],
    ["stallning", "Ställning", "stallning/"],
    ["spelarna", "Spelarna", "spelarna/"],
    ["mastare", "Mästare", "mastare/"]
  ];

  /* ── Nav ── */
  const nav = $("#site-nav");
  if (nav) {
    nav.className = "nav";
    nav.innerHTML = `
      <div class="wrap">
        <a class="brand" href="${ROOT}"><span class="brand-mark">HGM</span>HGM Touren</a>
        <ul class="nav-links">
          ${LINKS.map(([id, label, href]) => `<li><a href="${ROOT}${href}" class="${id === PAGE ? "active" : ""}">${label}</a></li>`).join("")}
          <li class="only-mobile"><a href="${ROOT}app/">Rapportera resultat →</a></li>
        </ul>
        <a class="nav-cta" href="${ROOT}app/">Rapportera resultat</a>
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
        <a class="brand" href="${ROOT}" style="color:#fff"><span class="brand-mark">HGM</span>HGM Touren</a>
        <nav>${LINKS.map(([, l, h]) => `<a href="${ROOT}${h}">${l}</a>`).join("")}<a href="${ROOT}app/">Resultatappen</a></nav>
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
      return `<div class="${cls}">
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
      return `<article class="pcard" data-team="${p.team}">
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
      <div class="p"><img src="${img(p)}" alt="" loading="lazy"><div><b>${esc(p.nick)}</b><br><small style="color:var(--muted)">${esc(p.name)}</small></div></div></div>`;
  }).join(""));

  fill("[data-timeline]", [...H.history].reverse().map(h => `
    <div class="card tl reveal"><span class="yr">${h.year}</span>
      <div><h4>${esc(h.title)}</h4><p>${esc(h.text)}</p></div></div>`).join(""));

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
