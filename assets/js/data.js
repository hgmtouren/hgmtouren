/* =========================================================
   HGM Touren – all data på ett ställe.
   Uppdatera här så ändras hela sajten.
   ========================================================= */
window.HGM = {
  season: 2026,
  founded: 2021,
  tagline: "Sveriges hetaste privata golftour",
  contact: "info@hgmtouren.se",

  teams: {
    G: { id: "G", name: "Lag G", nick: "GAY",   captain: "lufsen",   color: "var(--team-g)" },
    H: { id: "H", name: "Lag H", nick: "HETRO", captain: "oversten", color: "var(--team-h)" }
  },
  teamWinner: "G",

  /* points = ackumulerade poäng säsongen 2026 */
  players: [
    { id: "lufsen",      nick: "Lufsen",      name: "Niclas Magnusson", team: "G", img: "Lufsen",      points: 1180 },
    { id: "frallan",     nick: "Frallan",     name: "Pelle Frank",      team: "G", img: "Frallan",     points: 1065 },
    { id: "ossa",        nick: "Ossa",        name: "Oscar",            team: "G", img: "Ossa",        points: 955 },
    { id: "eb",          nick: "EB",          name: "Anders Tumbygg",   team: "G", img: "EB",          points: 945 },
    { id: "oversten",    nick: "Översten",    name: "Mikael Ehrenborg", team: "H", img: "Oversten",    points: 798 },
    { id: "lillegubben", nick: "Lillegubben", name: "Lars Ambratt",     team: "H", img: "Lillegubben", points: 725 },
    { id: "27an",        nick: "27an",        name: "Jesper Demén",     team: "H", img: "27an",        points: 630 },
    { id: "spikrak",     nick: "Spikrak",     name: "Hasse Wahlberg",   team: "H", img: "Spikrak",     points: 628 },
    { id: "kaka",        nick: "Kaka",        name: "Staffan Tumbygg",  team: "G", img: "Kaka",        points: 605 },
    { id: "mike",        nick: "Mike",        name: "Mike",             team: "H", img: "Mike",        points: 600 },
    { id: "tamo",        nick: "Tämo",        name: "Fabian Dahl",      team: "G", img: "Tamo",        points: 503 },
    { id: "sillen",      nick: "Sillen",      name: "Robert Sidlo",     team: "G", img: "Sillen",      points: 335 },
    { id: "svagern",     nick: "Svågern",     name: "Jonas Ahlberg",    team: "H", img: "Svagern",     points: 305 },
    { id: "elof",        nick: "Elof",        name: "Andreas Elofsson", team: "H", img: "Elof",        points: 195 }
  ],

  champions: [
    { year: 2026, player: "oversten", venue: "Araslöv", note: "221 slag netto i finalen",
      awards: [["Bästa puttaren", "spikrak"], ["Lilla rundan", "frallan"]] },
    { year: 2025, player: "lufsen" },
    { year: 2024, player: "frallan" },
    { year: 2023, player: "spikrak" },
    { year: 2022, player: "lufsen" },
    { year: 2021, player: "lufsen" }
  ],

  history: [
    { year: 2021, title: "HGM Touren grundas", text: "En skara dedikerade golfare skapar sin egen privata tour – med eget poängsystem, lag och slutspel. Lufsen tar den allra första mästartiteln." },
    { year: 2022, title: "Lufsen försvarar titeln", text: "Traditionen cementeras. Touren växer med fler omgångar och ökad rivalitet mellan Lag G och Lag H." },
    { year: 2023, title: "Spikrak bryter dominansen", text: "Hasse Wahlberg går hela vägen och tar sin första mästartitel. Lag H börjar göra sig gällande på allvar." },
    { year: 2024, title: "Frallan tar guldet", text: "Pelle Frank spelar säsongen i toppform och krönar sig till mästare. En av de jämnaste säsongerna hittills." },
    { year: 2025, title: "Lufsen återtar tronen", text: "Niclas Magnusson visar klassen och vinner sin tredje mästartitel. Lag G dominerar poängtabellen." },
    { year: 2026, title: "Översten triumferar i Araslöv", text: "Mikael ”Översten” Ehrenborg vinner finalen med 221 slag netto. Lag G tar lagpokalen, Spikrak koras till bästa puttaren och Frallan vinner Lilla rundan." }
  ],

  /* Spelformer som går att välja i resultatappen.
     OBS: justera texterna så de stämmer med era regler. */
  formats: [
    { id: "netto",      name: "Slagspel netto", desc: "Lägst antal slag efter handicap vinner omgången." },
    { id: "stableford", name: "Poängbogey",     desc: "Poäng per hål efter handicap (Stableford)." },
    { id: "final",      name: "Final",          desc: "Slutspelet – lägst sammanlagt netto blir HGM-mästare." },
    { id: "lilla",      name: "Lilla rundan",   desc: "Sidotävlingen vid slutspelet." }
  ]
};

/* Små hjälpfunktioner */
HGM.byId = id => HGM.players.find(p => p.id === id);
HGM.ranked = () => [...HGM.players].sort((a, b) => b.points - a.points);
HGM.teamTotal = t => HGM.players.filter(p => p.team === t).reduce((s, p) => s + p.points, 0);
HGM.titles = id => HGM.champions.filter(c => c.player === id).map(c => c.year);
