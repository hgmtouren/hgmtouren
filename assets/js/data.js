/* =========================================================
   HGM Touren – all data på ett ställe.
   Uppdatera här så ändras hela sajten.
   ========================================================= */
window.HGM = {
  founded: 2021,
  tagline: "Sveriges hetaste privata golftour",
  contact: "info@hgmtouren.se",

  courses: ["Forsgårdens GK", "Vinbergs GK", "Araslöv"],

  /* Alla som spelat i touren. Lag och poäng ligger per säsong nedan. */
  players: [
    { id: "lufsen",      nick: "Lufsen",      name: "Niclas Magnusson",      img: "Lufsen" },
    { id: "frallan",     nick: "Frallan",     name: "Pelle Frank",           img: "Frallan" },
    { id: "ossa",        nick: "Ossa",        name: "Peter Olsson",          img: "Ossa" },
    { id: "eb",          nick: "EB",          name: "Anders Engelbrektsson", img: "EB" },
    { id: "oversten",    nick: "Översten",    name: "Mikael Ehrenborg",      img: "Oversten" },
    { id: "lillegubben", nick: "Lillegubben", name: "Lars Ambratt",          img: "Lillegubben" },
    { id: "27an",        nick: "27an",        name: "Jesper Demén",          img: "27an" },
    { id: "spikrak",     nick: "Spikrak",     name: "Hasse Wahlberg",        img: "Spikrak" },
    { id: "kaka",        nick: "Kaka",        name: "Staffan Fritiofsson",   img: "Kaka" },
    { id: "mike",        nick: "Mike",        name: "Mike Strömbäck",        img: "Mike" },
    { id: "tamo",        nick: "Tämo",        name: "Fabian Dahl",           img: "Tamo" },
    { id: "sillen",      nick: "Sillen",      name: "Robert Sidlo",          img: "Sillen" },
    { id: "svagern",     nick: "Svågern",     name: "Jonas Ahlberg",         img: "Svagern" },
    { id: "elof",        nick: "Elof",        name: "Andreas Elofsson",      img: "Elof" },
    { id: "idioten",     nick: "Idioten",     name: "Mats Söderström",       img: "Idioten" }
  ],

  /* =======================================================
     SÄSONGER
     status: "klar" | "pågår" | "kommande"
     teams: lag-id → { name, nick, color (g|h|b), captain, members }
     points: grundspelets poäng (bästa 6 av 8)
     rounds: per spelare [netto, poäng, lilla rundan, puttar, placering], null = ej spelat
     ======================================================= */
  defaultSeason: 2026,
  seasons: {
    2027: {
      status: "kommande",
      note: "Kaptener: Frallan och Översten. Övriga spelare är ett förslag, beräknat för att lagen ska bli så jämna som möjligt utifrån poäng 2025–2026, snittnetto 2026 och handicap.",
      teams: {
        G: { name: "Lag G", nick: "GAY",   color: "g", captain: "frallan",  members: ["frallan", "ossa", "mike", "lillegubben", "kaka", "tamo", "elof"] },
        H: { name: "Lag H", nick: "HETRO", color: "h", captain: "oversten", members: ["oversten", "lufsen", "eb", "27an", "spikrak", "sillen", "svagern"] }
      },
      points: {}, rounds: {}, roundWinners: [], side: { lilla: {}, putt: {}, nh: {}, ld: {} }
    },
    2026: {
      status: "klar",
      grundWinner: "lufsen",
      teams: {
        G: { name: "Lag G", nick: "GAY",   color: "g", captain: "lufsen",   members: ["lufsen", "frallan", "ossa", "eb", "kaka", "tamo", "sillen"] },
        H: { name: "Lag H", nick: "HETRO", color: "h", captain: "oversten", members: ["oversten", "lillegubben", "27an", "spikrak", "mike", "svagern", "elof"] }
      },
      teamResult: { grund: { G: 431, H: 354 }, final: { G: 176.65, H: 143.65 }, winner: "G",
        text: "Lag G vann grundspelet 431–354 och alla tre finalerna i Araslöv." },
      points: {"lufsen": 1180, "frallan": 1065, "ossa": 955, "eb": 945, "oversten": 798, "lillegubben": 725, "27an": 630, "spikrak": 628, "kaka": 605, "mike": 600, "tamo": 503, "sillen": 335, "svagern": 305, "elof": 195},
      rounds: {
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
      side: {
    lilla:  { lufsen: 74, eb: 74, frallan: 72, ossa: 71, oversten: 71, lillegubben: 70, spikrak: 62, kaka: 62, tamo: 62, "27an": 59, svagern: 48, mike: 38, sillen: 33, elof: 32 },
    putt:   { lillegubben: 178, oversten: 181, frallan: 186, spikrak: 187, eb: 187, ossa: 189, kaka: 191, tamo: 192, lufsen: 195, "27an": 196, mike: 207, sillen: 212, elof: 225, svagern: 235 },
    nh:     { spikrak: 6, lufsen: 4, oversten: 4, "27an": 3, ossa: 3, kaka: 3, eb: 2, lillegubben: 2, frallan: 2, tamo: 1 },
    ld:     { "27an": 6, lufsen: 4, spikrak: 2, kaka: 1, ossa: 1, mike: 1, tamo: 1 }
  },
      /* Bana och datum per omgång */
      roundInfo: [
        { course: "Forsgårdens GK, Slottsbanan", date: "3 maj" },
        { course: "Forsgårdens GK, Slottsbanan", date: "16 maj", note: "Blandad tee" },
        { course: "Forsgårdens GK, Slottsbanan", date: "31 maj" },
        { course: "Gräppås GK", date: "28 juni" },
        { course: "Forsgårdens GK, Slottsbanan", date: "2 juli", note: "3 klubbor & putter" },
        { course: "Vinbergs GK", date: "9 augusti" },
        { course: "Göteborgs Golfklubb", date: "15 augusti" },
        { course: "Forsgårdens GK, Slottsbanan", date: "30 augusti", note: "Röd tee" }
      ],
      roundWinners: [["frallan"], ["frallan", "lufsen"], ["lufsen"], ["lufsen"], ["frallan"], ["oversten"], ["ossa"], ["lufsen", "ossa"]],
      /* Slutspelet: netto per finalrunda, brutto per finalrunda, puttar och Lilla Rundan totalt.
         start = startslag (vinnaren av grundspelet startar på −1) */
      final: {
        oversten:    { netto: [73,71,77], brutto: [83,81,87], putt: 91,  lilla: 34, nh: 1 },
        eb:          { netto: [75,78,73], brutto: [83,85,81], putt: 88,  lilla: 32, nh: 3 },
        frallan:     { netto: [74,78,75], brutto: [85,89,86], putt: 92,  lilla: 36 },
        lufsen:      { netto: [78,77,74], brutto: [84,83,80], putt: 100, lilla: 30, start: -1, nh: 1, ld: 1 },
        ossa:        { netto: [81,75,73], brutto: [83,77,75], putt: 90,  lilla: 31, nh: 2, ld: 2 },
        lillegubben: { netto: [77,78,74], brutto: [86,87,83], putt: 89,  lilla: 33 },
        spikrak:     { netto: [77,74,82], brutto: [82,79,87], putt: 87,  lilla: 33, nh: 1 },
        mike:        { netto: [74,81,78], brutto: [82,89,86], putt: 96,  lilla: 29, nh: 1 },
        tamo:        { netto: [77,76,80], brutto: [85,84,88], putt: 97,  lilla: 27, nh: 1 },
        kaka:        { netto: [74,80,80], brutto: [83,88,89], putt: 97,  lilla: 31, nh: 1, ld: 1 }
      },
      /* Lika slag i finalen delas inte – lägst HCP avgör. Ordning enligt resultatlistan. */
      finalOrder: ["oversten", "eb", "frallan", "lufsen", "ossa", "lillegubben", "spikrak", "mike", "tamo", "kaka"],
      finalInfo: {
        venue: "Araslövs GK", dates: "11–13 september 2026", holes: 54,
        teamPoints: { G: [64.33, 57.66, 54.66], H: [43.33, 48.66, 51.66] },
        /* Lagmatcher per final: [Lag H, Lag G, vinnare G|H|D (delad)] */
        matches: [
          [["spikrak", "frallan", "G"], ["oversten", "kaka", "D"], ["mike", "tamo", "D"], ["lillegubben", "ossa", "G"]],
          [["spikrak", "eb", "H"], ["oversten", "ossa", "D"], ["lillegubben", "tamo", "G"], ["mike", "lufsen", "G"]],
          [["oversten", "frallan", "H"], ["spikrak", "eb", "G"], ["mike", "ossa", "G"], ["lillegubben", "tamo", "H"]]
        ]
      }
    },
    2025: {
      status: "klar",
      grundWinner: "oversten",
      teams: {
        MONGO: { name: "MONGO", nick: "MONGO", color: "b", members: ["frallan", "kaka", "idioten", "oversten", "svagern"] },
        HETRO: { name: "HETRO", nick: "HETRO", color: "h", members: ["spikrak", "sillen", "ossa", "eb", "lufsen"] },
        GAY:   { name: "GAY",   nick: "GAY",   color: "g", members: ["mike", "tamo", "lillegubben", "27an", "elof"] }
      },
      teamResult: { grund: { MONGO: 1046.4, HETRO: 1045.0, GAY: 987.1 }, winner: "MONGO",
        text: "Tre lag 2025. MONGO vann lagtävlingen i grundspelet." },
      points: {"spikrak": 593, "sillen": 533, "ossa": 1028, "eb": 540, "lufsen": 643, "mike": 748, "tamo": 560, "lillegubben": 525, "27an": 713, "elof": 230, "frallan": 390, "kaka": 618, "idioten": 623, "oversten": 1213, "svagern": 200},
      rounds: {
      "spikrak": [[71,113,11,27,4],[81,75,9,30,8],[70,160,11,29,3],[75,145,11,30,3],[78,100,10,32,6],null,null,[77,60,11,30,10]],
      "sillen": [[70,203,12,32,1],[80,95,9,34,6],null,null,[86,40,7,40,12],[79,75,8,35,8],[68,120,13,35,4],null],
      "ossa": [[71,113,12,31,4],[76,130,11,30,4],[69,200,10,28,2],[70,250,16,31,1],[79,85,11,40,7],[71,130,13,30,4],[68,120,12,29,4],[74,105,11,31,5]],
      "eb": [[73,70,11,34,9],[82,60,9,31,10],[81,70,9,35,9],[79,95,12,30,6],[75,120,11,36,4],[85,50,9,31,11],[73,75,13,37,8],[67,250,13,28,1]],
      "lufsen": [[71,113,13,33,4],null,[83,60,10,35,10],[75,145,14,32,3],[74,160,12,34,3],[76,90,12,32,7],[73,75,11,29,8],[75,90,10,30,7]],
      "mike": [[77,40,13,31,11],[74,203,12,30,1],null,null,[71,225,12,35,1],[73,100,13,32,6],[67,180,15,32,2],[71,180,10,30,2]],
      "tamo": [[77,40,10,32,11],null,[75,100,11,30,6],[82,80,11,33,8],null,[64,250,16,31,1],[71,90,10,33,7],[73,130,12,36,4]],
      "lillegubben": [[77,40,11,24,11],null,[79,80,9,36,8],[77,110,12,31,5],[79,85,11,32,7],[68,160,14,30,3],[76,50,10,33,11],[76,75,12,31,8]],
      "27an": [[70,203,11,31,1],[83,50,9,36,11],[76,90,12,34,7],null,[75,120,9,34,4],null,[65,250,12,25,1],[79,50,8,25,11]],
      "elof": [[72,85,13,29,7],[81,75,6,34,8],null,null,[81,70,9,36,9],null,null,null],
      "frallan": [null,[78,110,10,32,5],[72,110,11,32,5],null,null,[72,110,11,33,5],[74,60,11,28,10],[71,180,16,33,2]],
      "kaka": [[72,85,12,31,7],[74,203,14,30,1],null,[79,95,11,33,6],[82,60,9,34,10],[79,75,13,35,8],[70,100,11,33,6],[74,105,11,32,5]],
      "idioten": [[74,60,12,32,10],[74,203,13,32,1],[71,130,11,32,4],null,[85,50,8,33,11],null,[67,180,14,33,2],[76,75,12,30,8]],
      "oversten": [[70,203,9,29,1],[80,95,12,33,6],[68,250,14,31,1],[74,200,12,27,2],[71,225,10,33,1],[67,200,13,30,2],[79,40,8,33,12],[81,40,11,32,12]],
      "svagern": [[85,20,11,41,14],null,[84,50,9,45,11],[91,70,8,39,9],null,[82,60,10,39,10],null,null]
    },
      side: {"lilla": {"spikrak": 69, "sillen": 59, "ossa": 96, "eb": 87, "lufsen": 83, "mike": 82, "tamo": 73, "lillegubben": 80, "27an": 67, "elof": 44, "frallan": 68, "kaka": 85, "idioten": 76, "oversten": 89, "svagern": 47}, "putt": {"spikrak": 262, "sillen": 310, "ossa": 250, "eb": 262, "lufsen": 266, "mike": 283, "tamo": 281, "lillegubben": 258, "27an": 273, "elof": 317, "frallan": 293, "kaka": 277, "idioten": 280, "oversten": 248, "svagern": 331}, "nh": {"spikrak": 3, "ossa": 8, "eb": 1, "lufsen": 1, "mike": 1, "tamo": 2, "lillegubben": 1, "27an": 5, "elof": 2, "kaka": 1, "idioten": 3, "oversten": 3}, "ld": {"spikrak": 4, "ossa": 5, "eb": 1, "lufsen": 1, "mike": 1, "tamo": 2, "27an": 1, "kaka": 1}},
      placSum: {"spikrak": 66, "sillen": 79, "ossa": 31, "eb": 58, "lufsen": 58, "mike": 55, "tamo": 69, "lillegubben": 69, "27an": 67, "elof": 104, "frallan": 75, "kaka": 59, "idioten": 68, "oversten": 37, "svagern": 108},
      roundWinners: [["sillen", "27an", "oversten"], ["mike", "kaka", "idioten"], ["oversten"], ["ossa"], ["mike", "oversten"], ["tamo"], ["27an"], ["eb"]]
    }
  },

  champions: [
    { year: 2026, photo: "mastare/2026.jpg", player: "oversten", venue: "Araslövs GK", note: "221 slag netto i finalen",
      awards: [["Bästa puttaren", "spikrak"], ["Lilla Rundan", "frallan"]] },
    { year: 2025, photo: "mastare/2025.jpg", player: "oversten", venue: "Landskrona GK", note: "ett slag före Frallan" },
    { year: 2024, photo: "mastare/2024.jpg", player: "spikrak", venue: "Landskrona GK" },
    { year: 2023, photo: "mastare/2023.jpg", player: "oversten", venue: "Torrevieja", note: "ett slag före Spikrak" },
    { year: 2022, photo: "mastare/2022.jpg", player: "kaka", venue: "Torrevieja", note: "avgjort på sista hålet" },
    { year: 2021, photo: "mastare/2021.jpg", player: "lillegubben", venue: "Skogaby" }
  ],

  /* Vinnare av grundomgångarna (poängställningen) */
  /* Vinnare av grundomgångarna. 2021–2024: lägst placeringssumma vann. 2025–: flest poäng (250-skalan). */
  grundWinners: {
    2021: { p: "oversten", value: "29", unit: "i placeringssumma" },
    2022: { p: "oversten", value: "27", unit: "i placeringssumma", note: "rekord" , img: "vinnare/2022.jpg" },
    2023: { p: "oversten", value: "24", unit: "i placeringssumma", note: "bästa 7 av 9" , img: "vinnare/2023.jpg" },
    2024: { p: "spikrak",  value: "35", unit: "i placeringssumma" , img: "vinnare/2024.jpg" },
    2025: { p: "oversten", value: "1 213", unit: "poäng" , img: "vinnare/2025.jpg" },
    2026: { p: "lufsen",   value: "1 180", unit: "poäng" }
  },

  /* Vår historia – texterna bygger på historiksidan på gamla hgmtouren.se */
  history: [
    { year: 2021, title: "Premiären", img: "galleri/tidigare-14.jpg", final: "Skogaby", champion: "lillegubben", grund: "oversten",
      text: "HGM Tourens grundare Anders Engelbrektsson, EB, bröt sig ur den tidigare KIF Touren och startade HGM. Tävlingen spelades både som singelspel och som lagtävling, precis som i dag. Finalrundan spelades på klassiska Skogaby i tuffa förhållanden, och segrare i första upplagan blev Lars Ambratt, även kallad Lillegubben. Alla minns att 27:an vann ett par strumpor. Översten vann grundomgången. Skogaby bjöd varken på bra väder eller en bra anläggning, så det bestämdes snabbt att touren behövde ett nytt finalställe." },
    { year: 2022, title: "Till solen i Torrevieja", img: "galleri/tidigare-15.jpg", final: "Torrevieja", champion: "kaka", grund: "oversten",
      text: "Efter ett regnigt finalspel året innan suktade grabbarna efter värme och sol. Andra upplagan avslutades därför i värmen i Torrevieja, som blev tourens favoritställe. Finalen blev en jämn fight mellan EB och Kaka, och många minns Kakas omöjliga slag på 17:e hålet som troligen var avgörande. Till slut stod Kaka som vinnare efter att ha avgjort på sista hålet. Översten vann grundspelet." },
    { year: 2023, title: "Översten tar sin första titel", img: "galleri/tidigare-16.jpg", final: "Torrevieja", champion: "oversten", grund: "oversten",
      text: "Efter en övertygande seger i grundspelet kom Översten tillbaka till Torrevieja och den spanska solkusten med riktigt gott självförtroende. Efter en tight finalrunda tog han sin första HGM-seger, ett slag före Hasse Spikrak. Ännu ett slutspel som avgjordes på sista hålet." },
    { year: 2024, title: "Spikrak segrar i Landskrona", img: "galleri/tidigare-17.jpg", final: "Landskrona GK", champion: "spikrak", grund: "spikrak",
      text: "Efter två år av finalspel i Spanien testade touren Landskrona Golfklubb, en mycket utmanande bana med tuffa greener och svårbemästrad vind. Efter andraplatsen 2023 och seger i grundspelet kom Hasse Spikrak till Landskrona med gott självförtroende. En stabil start gav stor ledning inför sista rundan, som nästan blåste bort, men Spikrak säkrade sin första HGM-seger. Han blev därmed bara den fjärde vinnaren av HGM Touren." },
    { year: 2025, title: "Översten blir tourens gigant", img: "galleri/tidigare-18.jpg", final: "Landskrona GK", champion: "oversten", grund: "oversten",
      text: "Många tyckte att Landskrona var tufft 2024 och ville ha revansch, så tävlingsledaren EB förlade finalspelet där igen. Översten vann grundspelet för fjärde gången och tog med sig ett slags fördel in i finalen. Det visade sig vara helt avgörande: efter sista putten på det 54:e hålet vann han ett slag före Frallan. Därmed hade Översten vunnit fyra av fem grundomgångar och två mästartitlar, och han var den alla ville slå när 2026 drog igång." },
    { year: 2026, title: "Duellen och tredje titeln", img: "galleri/2026-01.jpg", final: "Araslövs GK", champion: "oversten", grund: "lufsen",
      text: "Fjorton spelare, två lag och åtta grundomgångar som blev en duell mellan Lufsen och Frallan. Lufsen tog fyra delsegrar och vann grundspelet med 1 180 poäng, Frallan tog tre och slutade på 1 065. Översten tog sin åttonde delseger genom tiderna på Vinbergs GK, med ett birdieslag från 171 meter på hål 16, och blev ensam rekordinnehavare. Lag G vann lagtävlingen i grundspelet med 431 mot 354. I slutspelet på Araslöv 11–13 september vann Översten på 221 slag netto före EB och Frallan och blev först med tre mästartitlar. Spikrak blev bästa puttare, Frallan vann Lilla Rundan och Lag G vann alla tre lagfinalerna." }
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

  /* Topplistor genom tiderna (från gamla hgmtouren.se, 2021–2025 + 2026 för delsegrar) */
  allTime: {
    wins: { oversten: 8, idioten: 7, lufsen: 6, "27an": 5, kaka: 5, spikrak: 5, ossa: 5, frallan: 4, eb: 3, mike: 3, svagern: 3, lillegubben: 2, elof: 2, tamo: 2, sillen: 1 },
    /* Snitt puttar per runda 2021–2026 (6 bästa per säsong, varje säsong väger lika) */
    putt: { "idioten": 30.761, "27an": 30.851, "spikrak": 30.869, "lillegubben": 31.194, "oversten": 31.257, "eb": 31.507, "tamo": 31.563, "ossa": 31.618, "mike": 32.032, "kaka": 32.682, "lufsen": 32.851, "sillen": 33.014, "frallan": 33.450, "elof": 34.917, "svagern": 38.219 },
    /* Lilla Rundan: snittpoäng per runda 2021–2026 (6 bästa per säsong) */
    lilla: { "lufsen": 11.779, "idioten": 11.533, "lillegubben": 11.471, "eb": 11.285, "oversten": 11.222, "kaka": 11.071, "frallan": 11.032, "27an": 10.891, "ossa": 10.871, "spikrak": 10.666, "svagern": 10.069, "tamo": 9.979, "mike": 9.959, "elof": 9.320, "sillen": 8.848 },
    /* Andel spelade grundomgångar 2021–2026 i procent (Idioten 2021–2025) */
    loyal: { "oversten": 100.0, "eb": 94.2, "kaka": 92.1, "ossa": 91.7, "idioten": 90.0, "lufsen": 90.0, "lillegubben": 85.8, "spikrak": 85.4, "27an": 73.3, "frallan": 73.3, "elof": 72.9, "mike": 72.4, "tamo": 60.6, "svagern": 59.2, "sillen": 53.3 }
  },
  records: [
    { label: "Lägsta nettoscore", value: "64 slag", player: "tamo", note: "2025" },
    { label: "Lägsta bruttoscore", value: "68 slag", player: "spikrak", note: "2021, Forsgårdens GK" },
    { label: "Flest delsegrar", value: "8 st", player: "oversten", note: "2021–2026" },
    { label: "Mest trogna spelaren", value: "100 %", player: "oversten", note: "alla grundomgångar 2021–2026" },
    { label: "Lägst placeringssumma", value: "27", player: "oversten", note: "säsongen 2022" }
  ],
  /* Bildgalleri: s = 2026 | tidigare | jubileum */
  gallerySections: [["2026", "Säsongen 2026"], ["tidigare", "Tidigare år"], ["jubileum", "5-årsjubileet"]],
  gallery: [{"f":"2026-01","s":"2026","w":640,"h":480},{"f":"2026-02","s":"2026","w":640,"h":480},{"f":"2026-03","s":"2026","w":640,"h":480},{"f":"2026-04","s":"2026","w":640,"h":480},{"f":"2026-08","s":"2026","w":480,"h":640},{"f":"2026-09","s":"2026","w":480,"h":640},{"f":"2026-10","s":"2026","w":640,"h":480},{"f":"2026-11","s":"2026","w":480,"h":640},{"f":"2026-12","s":"2026","w":480,"h":640},{"f":"2026-13","s":"2026","w":640,"h":480},{"f":"2026-19","s":"2026","w":640,"h":480},{"f":"2026-20","s":"2026","w":640,"h":480},{"f":"2026-21","s":"2026","w":640,"h":480},{"f":"2026-22","s":"2026","w":640,"h":480},{"f":"2026-23","s":"2026","w":640,"h":480},{"f":"2026-24","s":"2026","w":640,"h":480},{"f":"2026-25","s":"2026","w":640,"h":480},{"f":"2026-26","s":"2026","w":640,"h":480},{"f":"2026-27","s":"2026","w":640,"h":360},{"f":"2026-28","s":"2026","w":640,"h":480},{"f":"tidigare-07","s":"tidigare","w":640,"h":480},{"f":"tidigare-14","s":"tidigare","w":640,"h":467},{"f":"tidigare-15","s":"tidigare","w":366,"h":640},{"f":"tidigare-16","s":"tidigare","w":640,"h":342},{"f":"tidigare-17","s":"tidigare","w":640,"h":467},{"f":"tidigare-18","s":"tidigare","w":640,"h":480},{"f":"tidigare-34","s":"tidigare","w":480,"h":640},{"f":"tidigare-35","s":"tidigare","w":640,"h":480},{"f":"tidigare-37","s":"tidigare","w":480,"h":640},{"f":"jubileum-29","s":"jubileum","w":480,"h":640},{"f":"jubileum-30","s":"jubileum","w":467,"h":640},{"f":"jubileum-31","s":"jubileum","w":480,"h":640},{"f":"jubileum-32","s":"jubileum","w":480,"h":640},{"f":"jubileum-33","s":"jubileum","w":480,"h":640}],

  /* Omgångar som går att rapportera i appen */
  rounds: ["Grundspel 1", "Grundspel 2", "Grundspel 3", "Grundspel 4", "Grundspel 5", "Grundspel 6", "Grundspel 7", "Grundspel 8", "Final 1", "Final 2", "Final 3"]
};

/* Små hjälpfunktioner */
HGM.byId = id => HGM.players.find(p => p.id === id);
HGM.titles = id => HGM.champions.filter(c => c.player === id).map(c => c.year);
HGM.seasonYears = () => Object.keys(HGM.seasons).map(Number).sort((a, b) => b - a);
/* Vald säsong: #2025 i adressen, annars senast valda, annars standard */
HGM.pickSeason = () => {
  const h = parseInt((location.hash || "").replace("#", ""), 10);
  if (HGM.seasons[h]) return h;
  try { const v = parseInt(localStorage.getItem("hgm.season"), 10); if (HGM.seasons[v]) return v; } catch (e) {}
  return HGM.defaultSeason;
};
HGM.S = y => HGM.seasons[y];
HGM.teamOf = (y, id) => { const t = HGM.S(y).teams; return Object.keys(t).find(k => t[k].members.includes(id)) || null; };
HGM.inSeason = y => { const S = HGM.S(y); return [...new Set(Object.values(S.teams).flatMap(t => t.members))].map(HGM.byId); };
HGM.ranked = y => HGM.inSeason(y).map(p => ({ ...p, points: HGM.S(y).points[p.id] || 0, team: HGM.teamOf(y, p.id) }))
  .sort((a, b) => b.points - a.points || a.nick.localeCompare(b.nick, "sv"));
HGM.teamTotal = (y, t) => HGM.ranked(y).filter(p => p.team === t).reduce((s, p) => s + p.points, 0);
