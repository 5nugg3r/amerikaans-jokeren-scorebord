# Amerikaans Jokeren - Scorebord

Een webapp om de score bij te houden tijdens een potje Amerikaans Jokeren. Werkt op smartphone, tablet en laptop.

## Kenmerken

- **Nieuw spel starten** met een unieke URL (GUID), zodat elk spel zijn eigen link heeft
- **QR-code** om het scorebord te delen met medespeelers
- **Spelers beheren** — toevoegen, verwijderen en volgorde aanpassen voordat het spel begint
- **Deler aanwijzen** — handmatig of willekeurig, roteert automatisch per ronde
- **Score invoer** per ronde met validatie (precies één winnaar, veelvouden van 5)
- **Correcties** — klik op een ingevulde ronde om scores aan te passen
- **Cumulatief scorebord** met automatische winnaar na ronde 7

## De 7 rondes

1. Drie opvolgende kaarten
2. Drie gelijke kaarten
3. Vier opvolgende kaarten
4. Vier gelijke kaarten
5. Vijf opvolgende kaarten
6. Zes opvolgende kaarten
7. Alles in één keer

## Puntentelling

| Kaart | Punten |
|-------|--------|
| Joker | 20 |
| Plaatje (B/V/H) | 10 |
| Overige kaarten | 5 |

> Een joker telt als 10 punten als je niet hebt kunnen uitleggen.

## Technologie

- Vanilla HTML, CSS en JavaScript — geen frameworks, geen build-stap
- Data opgeslagen in localStorage (geen server nodig)
- QR-code via [qrcode-generator](https://github.com/nicolestandifer3/qrcode-generator-master) (CDN met SRI)

## Gebruik

Open `index.html` in een browser, of bezoek de gehoste versie op GitHub Pages.

## Licentie

Dit project is gelicenseerd onder de [MIT-licentie](LICENSE).
