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
    { id: "eb",          nick: "EB",          name: "Anders Engelbrektsson", team: "G", img: "EB",          points: 945 },
    { id: "oversten",    nick: "Översten",    name: "Mikael Ehrenborg", team: "H", img: "Oversten",    points: 798 },
    { id: "lillegubben", nick: "Lillegubben", name: "Lars Ambratt",     team: "H", img: "Lillegubben", points: 725 },
    { id: "27an",        nick: "27an",        name: "Jesper Demén",     team: "H", img: "27an",        points: 630 },
    { id: "spikrak",     nick: "Spikrak",     name: "Hasse Wahlberg",   team: "H", img: "Spikrak",     points: 628 },
    { id: "kaka",        nick: "Kaka",        name: "Staffan Fritiofsson", team: "G", img: "Kaka",        points: 605 },
    { id: "mike",        nick: "Mike",        name: "Mike Strömbäck",   team: "H", img: "Mike",        points: 600 },
    { id: "tamo",        nick: "Tämo",        name: "Fabian Dahl",      team: "G", img: "Tamo",        points: 503 },
    { id: "sillen",      nick: "Sillen",      name: "Robert Sidlo",     team: "G", img: "Sillen",      points: 335 },
    { id: "svagern",     nick: "Svågern",     name: "Jonas Ahlberg",    team: "H", img: "Svagern",     points: 305 },
    { id: "elof",        nick: "Elof",        name: "Andreas Elofsson", team: "H", img: "Elof",        points: 195 },
    /* Med de första fem åren, inte aktiv 2026 – finns kvar i historisk statistik */
    { id: "idioten",     nick: "Idioten",     name: "Mats Söderström",  team: null, img: "Idioten",   points: 0, inactive: true }
  ],

  champions: [
    { year: 2026, player: "oversten", venue: "Araslövs GK", note: "221 slag netto i finalen",
      awards: [["Bästa puttaren", "spikrak"], ["Lilla Rundan", "frallan"]] },
    { year: 2025, player: "oversten", venue: "Landskrona GK", note: "ett slag före Frallan" },
    { year: 2024, player: "spikrak", venue: "Landskrona GK" },
    { year: 2023, player: "oversten", venue: "Spanien", note: "ett slag före Spikrak" },
    { year: 2022, player: "kaka", venue: "Torrevieja", note: "avgjort på sista hålet" },
    { year: 2021, player: "lillegubben", venue: "Skogaby" }
  ],

  /* Vinnare av grundomgångarna (poängställningen) */
  grundWinners: { 2021: "oversten", 2022: "oversten", 2023: "oversten", 2024: "spikrak", 2025: "oversten", 2026: "lufsen" },

  history: [
    { year: 2021, title: "HGM Touren grundas", text: "Touren startar med eget poängsystem, lag och slutspel. Lillegubben vinner den allra första mästartiteln." },
    { year: 2022, title: "Kaka mästare", text: "Andra säsongen. Staffan ”Kaka” Tumbygg vinner slutspelet." },
    { year: 2023, title: "Översten tar sin första titel", text: "Mikael ”Översten” Ehrenborg vinner slutspelet för första gången." },
    { year: 2024, title: "Spikrak mästare", text: "Hasse ”Spikrak” Wahlberg vinner slutspelet." },
    { year: 2025, title: "Översten igen", text: "Översten vinner sin andra mästartitel." },
    { year: 2026, title: "Tredje titeln för Översten", text: "Översten vinner finalen på Araslöv med 221 slag netto och blir först med tre titlar. Lufsen vinner grundspelet, Lag G vinner lagfinalerna (176,65–143,65), Spikrak blir bästa puttare och Frallan vinner Lilla Rundan." }
  ],

  /* Tävlingsformerna */
  formats: [
    { id: "poang",  name: "Individuell poängställning", desc: "Placeringspoäng varje omgång: 250, 200, 160, 130, 110, 100 … ner till 20 p för 14:e plats. Delad placering delar poängen. Bästa 6 av 8 räknas." },
    { id: "match",  name: "Matchspel Lag G mot Lag H", desc: "Lagtävlingen: matchspel G mot H ger 10 p för vinst och 5 p för delat. Därtill tippning och sidospel som EB bestämmer per omgång." },
    { id: "netto",  name: "Lägsta nettoscore",  desc: "Lägst nettoscore vinner." },
    { id: "putt",   name: "Bästa puttaren",     desc: "Lägst antal puttar vinner." },
    { id: "lilla",  name: "Lilla Rundan",       desc: "De sista 6 hålen – högst poäng vinner." },
    { id: "extra",  name: "Närmast hål & längsta drive", desc: "Två hål per runda. Antal vinster summeras över alla 8 omgångar." }
  ],

  /* Regler för grundspel och slutspel */
  rules: [
    "8 omgångar i grundspelet – de 2 sämsta stryks, bästa 6 av 8 räknas (netto, Lilla Rundan och puttar).",
    "Längsta drive och närmast hål summeras över alla omgångar.",
    "Slutspel för topp 10: 3 finalrundor på Araslöv, lägst nettoscore vinner. Ledaren startar på −1."
  ],

  /* Placeringspoäng per plats 1–14 */
  pointScale: [250, 200, 160, 130, 110, 100, 90, 80, 70, 60, 50, 40, 30, 20],

  /* Grundomgångarna 2026 per spelare: [netto, poäng, lilla rundan, puttar, placering], null = ej spelat */
  rounds2026: {
    lufsen:      [[77,70,9,37,9],[72,225,13,32,1],[67,250,13,27,1],[69,250,14,33,1],[77,160,12,32,3],[83,70,7,35,9],[83,70,9,36,9],[72,225,13,32,1]],
    frallan:     [[65,250,13,31,1],[72,225,15,31,1],[76,80,10,33,8],[81,45,12,32,11],[75,250,9,29,1],[79,100,13,30,5],[75,160,8,34,3],[83,65,8,35,9]],
    ossa:        [[75,90,14,34,7],[75,145,14,32,3],[79,60,7,33,9],[76,95,10,32,6],[82,95,11,33,5],[77,145,10,29,3],[67,250,10,29,1],[72,225,12,30,1]],
    eb:          [[69,200,15,30,2],[76,105,14,34,5],[71,180,12,29,2],[78,75,8,35,8],[81,130,9,32,4],[88,50,6,29,11],[72,200,12,33,2],[76,130,12,32,4]],
    oversten:    [[76,80,14,33,8],[80,70,12,34,9],[72,113,11,27,4],[73,175,10,31,3],[87,70,7,34,9],[71,250,12,25,1],[77,110,12,31,5],[83,65,8,32,9]],
    lillegubben: [[74,105,10,31,5],[78,85,15,30,7],[71,180,12,31,2],[76,95,10,29,6],[88,60,9,27,10],[79,100,11,30,5],[80,85,9,37,7],[74,160,12,30,3]],
    "27an":      [null,null,[79,60,12,36,9],[74,110,8,34,5],[82,95,9,25,5],[77,145,9,31,3],[76,130,11,31,4],[80,90,10,32,6]],
    spikrak:     [[73,145,13,32,3],[78,85,12,31,7],[72,113,13,27,4],[81,45,7,31,11],[82,95,8,32,5],null,[78,100,9,34,6],[80,90,7,35,6]],
    kaka:        [[86,40,7,36,12],[75,145,10,32,3],[74,90,14,31,7],[78,75,9,32,8],null,[79,100,9,29,5],[80,85,5,31,7],[77,110,13,30,5]],
    mike:        [null,null,null,[72,200,10,27,2],[76,200,10,33,2],[72,200,12,25,2],null,null],
    tamo:        [[82,50,15,35,11],[76,105,14,26,5],[72,113,13,31,4],[73,175,12,31,3],null,[85,60,6,30,10],null,null],
    sillen:      [[73,145,11,31,3],[87,50,5,34,10],null,null,null,[81,80,6,32,8],[97,60,7,35,10],null],
    svagern:     [[80,60,10,42,10],null,null,[80,60,10,39,10],[82,95,10,34,5],null,null,[80,90,15,46,6]],
    elof:        [[74,105,10,32,5],null,[79,60,12,33,9],[97,30,5,46,13],null,null,null,null]
  },
  /* Totaler grundspelet 2026 (bästa 6) och antal närmast hål / längsta drive */
  season2026: {
    lilla:  { lufsen: 74, eb: 74, frallan: 72, ossa: 71, oversten: 71, lillegubben: 70, spikrak: 62, kaka: 62, tamo: 62, "27an": 59, svagern: 48, mike: 38, sillen: 33, elof: 32 },
    putt:   { lillegubben: 178, oversten: 181, frallan: 186, spikrak: 187, eb: 187, ossa: 189, kaka: 191, tamo: 192, lufsen: 195, "27an": 196, mike: 207, sillen: 212, elof: 225, svagern: 235 },
    nh:     { spikrak: 6, lufsen: 4, oversten: 4, "27an": 3, ossa: 3, kaka: 3, eb: 2, lillegubben: 2, frallan: 2, tamo: 1 },
    ld:     { "27an": 6, lufsen: 4, spikrak: 2, kaka: 1, ossa: 1, mike: 1, tamo: 1 },
    team:   { G: 431, H: 354 }
  },
  /* Slutspelet 2026: netto final 1–3, puttar och Lilla Rundan totalt */
  final2026: {
    oversten: { netto: [73,71,77], putt: 91, lilla: 34 }, eb: { netto: [75,78,73], putt: 88, lilla: 32 },
    frallan: { netto: [74,78,75], putt: 92, lilla: 36 }, lufsen: { netto: [78,77,74], putt: 100, lilla: 30, start: -1 },
    ossa: { netto: [81,75,73], putt: 90, lilla: 31 }, lillegubben: { netto: [77,78,74], putt: 89, lilla: 33 },
    spikrak: { netto: [77,74,82], putt: 87, lilla: 33 }, mike: { netto: [74,81,78], putt: 96, lilla: 29 },
    tamo: { netto: [77,76,80], putt: 97, lilla: 27 }, kaka: { netto: [74,80,80], putt: 97, lilla: 31 }
  },

  /* Topplistor genom tiderna (från gamla hgmtouren.se, 2021–2025 + 2026 för delsegrar) */
  allTime: {
    wins: { oversten: 8, idioten: 7, lufsen: 6, "27an": 5, kaka: 5, spikrak: 5, ossa: 5, frallan: 4, eb: 3, mike: 3, svagern: 3, lillegubben: 2, elof: 2, tamo: 2, sillen: 1 },
    putt: { "27an": 30.488, idioten: 30.761, spikrak: 30.810, mike: 31.210, tamo: 31.417, oversten: 31.475, lillegubben: 31.500, eb: 31.575, ossa: 31.642, sillen: 32.550, kaka: 32.852, lufsen: 32.921, frallan: 33.940, elof: 34.400, svagern: 38.029 },
    lilla: { lufsen: 11.668, idioten: 11.533, lillegubben: 11.432, kaka: 11.218, mike: 11.167, "27an": 11.102, oversten: 11.100, eb: 11.075, frallan: 10.838, spikrak: 10.733, ossa: 10.679, svagern: 10.483, elof: 10.117, tamo: 9.861, sillen: 9.517 },
    loyal: { oversten: 100, eb: 93, kaka: 93, idioten: 90, ossa: 90, lufsen: 88, spikrak: 85, mike: 84, lillegubben: 83, elof: 80, "27an": 73, frallan: 68, svagern: 61, tamo: 60, sillen: 54 }
  },
  records: [
    { label: "Lägsta nettoscore", value: "64 slag", player: "tamo", note: "2025" },
    { label: "Lägsta bruttoscore", value: "68 slag", player: "spikrak", note: "2021, Forsgårdens GK" },
    { label: "Flest delsegrar", value: "8 st", player: "oversten", note: "2021–2026" },
    { label: "Mest trogna spelaren", value: "100 %", player: "oversten", note: "alla rundor 2021–2025" },
    { label: "Lägst placeringssumma", value: "27", player: "oversten", note: "säsongen 2022" }
  ],
  /* Delsegrar per omgång 2026 */
  roundWinners2026: [["frallan"], ["frallan", "lufsen"], ["lufsen"], ["lufsen"], ["frallan"], ["oversten"], ["ossa"], ["lufsen", "ossa"]],

  /* Omgångar som går att rapportera i appen */
  rounds: ["Grundspel 1", "Grundspel 2", "Grundspel 3", "Grundspel 4", "Grundspel 5", "Grundspel 6", "Grundspel 7", "Grundspel 8", "Final 1", "Final 2", "Final 3"]
};

/* Små hjälpfunktioner */
HGM.byId = id => HGM.players.find(p => p.id === id);
HGM.active = () => HGM.players.filter(p => !p.inactive);
HGM.ranked = () => HGM.active().sort((a, b) => b.points - a.points);
HGM.teamTotal = t => HGM.players.filter(p => p.team === t).reduce((s, p) => s + p.points, 0);
HGM.titles = id => HGM.champions.filter(c => c.player === id).map(c => c.year);
