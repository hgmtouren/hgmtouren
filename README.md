# HGM Touren – hemsida & resultatapp

Statisk sajt (HTML/CSS/JS, inget byggsteg) som publiceras via GitHub Pages på hgmtouren.se.

| Sida | Fil |
|---|---|
| Hem | `index.html` |
| Ställning & lag | `stallning/index.html` |
| Spelarna | `spelarna/index.html` |
| Mästare & historik | `mastare/index.html` |
| Resultatappen (mobil) | `app/index.html` |

## Uppdatera innehåll
All data (spelare, poäng, lag, mästare, historik, spelformer) ligger i **`assets/js/data.js`**.
Ändra där så uppdateras alla sidor.

## Resultatappen
- Öppna `hgmtouren.se/app/` i mobilen → "Lägg till på hemskärmen" så beter den sig som en app.
- Välj omgång (Grundspel 1–8, Final 1–3), bana och spelare – dig själv eller hela bollen.
- Fyll i rundans totaler: nettoscore, Lilla Rundan, puttar, närmast hål och längsta drive.
- Granskningsvyn visar dagens vinnare per kategori. Rapporten kan delas i gruppchatten.
- Fungerar offline. Rapporter sparas i telefonen tills databasen är kopplad.

### Nästa steg
Koppla en databas (t.ex. Supabase) med inloggning för spelarna, så att inskickade rundor
uppdaterar ställningen på hemsidan automatiskt.
