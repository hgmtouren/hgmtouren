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
  /* Lagtävlingen (matchspel G mot H) i slutspelet */
  teamFinal: { G: "176,65", H: "143,65", text: "Lag G vann alla tre finalerna i Araslöv." },
  courses: ["Forsgårdens GK", "Vinbergs GK", "Araslöv"],

  /* points = ackumulerade poäng säsongen 2026 */
  players: [
    { id: "lufsen",      nick: "Lufsen",      name: "Niclas Magnusson", team: "G", img: "Lufsen",      points: 1180 },
    { id: "frallan",     nick: "Frallan",     name: "Pelle Frank",      team: "G", img: "Frallan",     points: 1065 },
    { id: "ossa",        nick: "Ossa",        name: "Peter Olsson",     team: "G", img: "Ossa",        points: 955 },
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
      awards: [["Bästa puttaren", "spikrak"], ["Lilla Rundan", "frallan"]] },
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
    { year: 2026, title: "Översten triumferar i Araslöv", text: "Mikael ”Översten” Ehrenborg vinner finalen med 221 slag netto. Lag G vinner alla tre lagfinalerna (176,65–143,65), Spikrak koras till bästa puttaren och Frallan vinner Lilla Rundan." }
  ],

  /* Tävlingsformerna */
  formats: [
    { id: "poang",  name: "Individuell poängställning", desc: "Placeringspoäng varje omgång – 250 poäng till 1:an och nedåt. Delade placeringar delar poängen." },
    { id: "match",  name: "Matchspel Lag G mot Lag H", desc: "Lagen möts i matchspel. Resultat som ”1 UP” eller ”AS” (delad)." },
    { id: "netto",  name: "Lägsta nettoscore",  desc: "Lägst nettoscore vinner." },
    { id: "putt",   name: "Bästa puttaren",     desc: "Lägst antal puttar vinner." },
    { id: "lilla",  name: "Lilla Rundan",       desc: "De sista 6 hålen – högst poäng vinner." },
    { id: "extra",  name: "Närmast hål & längsta drive", desc: "Antal vinster summeras över alla omgångar." }
  ],

  /* Regler för grundspel och slutspel */
  rules: [
    "8 omgångar i grundspelet – de 2 sämsta stryks, bästa 6 av 8 räknas (netto, Lilla Rundan och puttar).",
    "Längsta drive och närmast hål summeras över alla omgångar.",
    "Slutspel för topp 10: 3 finalrundor på Araslöv, lägst nettoscore vinner. Ledaren startar på −1."
  ],

  /* Omgångar som går att rapportera i appen */
  rounds: ["Grundspel 1", "Grundspel 2", "Grundspel 3", "Grundspel 4", "Grundspel 5", "Grundspel 6", "Grundspel 7", "Grundspel 8", "Final 1", "Final 2", "Final 3"]
};

/* Små hjälpfunktioner */
HGM.byId = id => HGM.players.find(p => p.id === id);
HGM.ranked = () => [...HGM.players].sort((a, b) => b.points - a.points);
HGM.teamTotal = t => HGM.players.filter(p => p.team === t).reduce((s, p) => s + p.points, 0);
HGM.titles = id => HGM.champions.filter(c => c.player === id).map(c => c.year);
