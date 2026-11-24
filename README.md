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
- Välj bana, spelform och spelare, knappa in slag hål för hål. Netto, poängbogey och ledartavla räknas ut automatiskt.
- Fungerar offline på banan. Banans par/index sparas och återanvänds nästa gång.
- Resultat sparas i telefonen och kan delas till gruppchatten.

### Nästa steg
Koppla en databas (t.ex. Supabase) med inloggning för spelarna, så att inskickade rundor
uppdaterar ställningen på hemsidan automatiskt.
