# Matte-Portalen

Matteövningar och spel för åk 1–3, byggda av en lärare för sin egen klass (och andra klasser).
Publiceras med GitHub Pages på **matteportalen.github.io**. Allt språk på sajten är **svenska**.

## Teknik i korthet

- Ren HTML, CSS och JavaScript. **Inga ramverk, inget byggsteg.** Varje övning är en enda `index.html` i en egen mapp, med CSS och JS i samma fil. Bilder som hämtats utifrån eller ritats av läraren får ligga i en undermapp `bilder/` i övningens mapp (sajten används alltid via webbläsaren). Ange källa och licens i tabellen nedan.
- All data sparas i **localStorage** i elevens webbläsare. Ingen server, inga konton på nätet.
- Typsnitt: **Baloo 2** från Google Fonts (vikt 500/700/800), med `"Trebuchet MS", system-ui, sans-serif` som reserv.
- Delat ljud: `ljud.js` i roten. Alla sidor laddar den med `<script src="../ljud.js">` (startsidan med `ljud.js`).
- Delat djur: `djur.js` i roten (`WARD`, `NATUR`, `itemOf`, `owlSVG`, `PETNAME`, `lasDjur()`). Laddas av startsidan, Spelhörnan, Geometri och Bråk. **Inga kopior** av djurmallen i sidorna, ändra bara i `djur.js`.
- Externa skript laddas bara när de behövs: `qrcodejs 1.0.0` från cdnjs (QR-koder) och `jsqr 1.4.0` från jsdelivr (läsa QR med kameran, om webbläsaren saknar `BarcodeDetector`).

## Mappar och lagring

| Mapp | Innehåll | localStorage-nyckel |
| --- | --- | --- |
| `/` (`index.html`) | Startsidan: alla kort, stjärnor, dagar i rad, garderob, klistermärken, profiler, ljudknapp | `matteportalen-uggla`, `matteportalen-klister`, `matteportalen-dagar`, `matteportalen-ljud`, `mp-profiles`, `mp-owner`, `mp-bundle-<id>` (+ `sessionStorage` `mp-active`) |
| `lillaplus/` | Lilla plus & minus (0–10): Öva, Racet, Blixtrunda, Mina svåra | `mattespel-lillaplus-v1` |
| `tiotal/` | Tiotalsövergång, upp till 20 eller 100, med genomgången "Så här räknar du" | `mattespel-tiotal-v1` |
| `hundraruta/` | Hela hundrarutan (verktyg), Tio hopp, Trasig hundraruta (med hjälpruta som kan visas/döljas) | `mattespel-hundraruta-v1` |
| `uppstallning/` | Uppställning: addition och subtraktion med växling, upp till 100 eller 1000, Steg för steg och Själv, genomgång med blyertsringar | `mattespel-uppstallning-v1` |
| `multiplikation/` | Tabellerna 1–10, medaljer, Mästartavlan | `mattespel-multiplikation-v1` |
| `division/` | Utan och med rest, bråkstreck | `mattespel-division-v1` |
| `klockan/` | Åtta nivåer, analog och digital tid, mäta tid | `mattespel-klockan-v1` |
| `geometri/` | Elevens djur är med i alla områden (vid frågan eller i bilden), hoppar vid rätt och lutar huvudet vid fel. **Former:** Formjakt i ett hus byggt av former + namnge formen. **Kroppar:** ritade kroppar och riktiga saker som emojis, åt båda hållen. **Hörn och sidor:** skyltpromenad med sex svenska vägskyltar i `geometri/bilder/` (public domain, Wikimedia Commons) och djurets egna träskyltar med porträtt. **Punkt, linje, sträcka, stråle** + rita sträckan (oförändrad). **Mönster:** pärlhalsband till djurets kalas, djuret får bära halsbandet. **Symmetri:** måla fjärilens andra vinge, "Är fjärilen/nyckelpigan symmetrisk?" (fjärilssiluett: "Butterfly Pinhead icon", CC0, Wikimedia Commons, inlagd direkt i koden). **Omkrets och area:** staket runt djurets hage (meter) och odlingens area med grönsaksemojis. | `mattespel-geometri-v1` (läser även `matteportalen-uggla`) |
| `brak/` | Bråk med mat ritad i kod: **pizza**, **chokladkaka** och **rulltårta**. Elevens djur vid frågan. Halva/tredjedel (en bit dras ut till djuret), Lika stora delar ("rättvist?" + **skär själv**: pizzan med raka snitt genom mitten, närmaste 15°, och rulltårtan där man trycker. Rulltårtans felmarginal: varje bit högst 15 % för lång eller kort, men aldrig snävare än 3,5 % av hela tårtan (ett halvt finger på mobil). Efter Klar visas bitarna isär. En egenritad **pizzaskärare** och en streckad linje visar snittet innan man skär: med mus när man pekar, med finger medan fingret är nere, och snittet görs när man lyfter), Ät rätt del (området hette Färglägg, id `farg`), Hur stor del är kvar, Del av antal (tallrikar; eleven kan dra eller trycka ut sakerna på tallrikarna för att prova, svaret skrivs ändå med sifferknapparna), Jämför (pizzor i hjälpen), Tallinjen (rulltårtan lika lång som 0–1). | `mattespel-brak-v1` (läser även `matteportalen-uggla`) |
| `taluppfattning/` | Bedömningsstöd i taluppfattning åk 1 och 2, diagnos | `mattespel-taluppfattning-v1` |
| `np3/` | Nationella prov åk 3 (äldre sida, patchad) | `np3-resultat` |
| `spel/` | Spelhörnan: Ugglans flygtur, Memory, Racerbanan, Asteroidjakten, Grodhoppet, Tornbygget, Skattkartan, Kiosken | `mattespel-spel-v1` |
| `tiobas/` | Tiobasmaterial. **Byggs om** (prototyp i `tiobas/ny.html`, den gamla `index.html` ligger kvar tills läraren godkänt). Rör inte utan att fråga. Se "Tiobas: beslut" nedan. | – |

### När en ny övning läggs till

Startsidan måste uppdateras på **fyra** ställen, annars följer framstegen inte med:
1. Ett kort i `<nav class="cards">` med ett `badge`-element.
2. Stjärnorna räknas in i `S.stars` (läs nyckeln, summera `stars`).
3. Nyckeln läggs i listan `snap` (dagar i rad) och i **`PKEYS`** i profilskriptet (profiler, flyttkod och inloggningskort).
4. Gärna ett eller två klistermärken i `STICKERS`.

### Tiobas: beslut

- Ett **verktyg** som ersätter fysiskt material (hemma eller när skolans material är upptaget), inte ett spel.
- **Träklossar med spår** som skolans: tiostaven har 9 spår, hundraplattan ett rutnät av spår, tusenkuben spår på alla sidor.
- **Lådan har 10 av varje sort.** När 10 ligger på bordet är lådan tom och eleven måste växla; vid växling uppåt går klossarna tillbaka till lådan. **Växla ner** går alltid ("banken"), annars fungerar inte subtraktion.
- Eleven växlar alltid själv, sidan växlar aldrig automatiskt.
- Upp till **9 999**. Tusentalskolumnen visas först när den behövs.
- Ordning som i klassrummet: tusental, hundratal, tiotal, ental (entalen till höger).
- **Addition:** bygg första talet, lägg sedan till det andra kloss för kloss, växla när det behövs. **Subtraktion:** bygg första talet, ta bort det andra, växla ner när det behövs.
- **Liggande läge först** på mobil. Stående: vänlig ruta "Vrid mobilen" som går att stänga. Fullskärm + låst liggande läge bara där det fungerar (inte iPhone).

## Gemensam design

- Färger: `--bg #EAF3FF`, `--ink #1D2B53`, `--muted #56668F`, `--card #FFFFFF`, `--line #C6D6F2`, `--good #1E9E5E`, `--good-dark #157548`, `--bad #E5484D`, `--accent #3D5AFE`, `--gold #F2B707`.
- Vita kort med hård skugga rakt nedåt (`box-shadow:0 4px 0 var(--line)`) som trycks ner 3 px vid tryck.
- Stora tryckytor (minst 48 px), sifferknappsats för inmatning, 🔊-uppläsning med svensk röst där det finns.
- Konfetti vid alla rätt eller nytt rekord. Respektera `prefers-reduced-motion`.
- Rätt svar: grönt och pling. Fel svar: mjukt rosa, en förklaring och uppgiften kommer tillbaka senare i rundan. Aldrig bara ordet "Fel".
- **Emojis används som ikoner.** Ett försök med egenritade SVG-ikoner och en stilguide gjordes men **valdes bort**: läraren tyckte emojiversionen var snyggare. Rita inte nya figurer i SVG utan att fråga.
- Maskoten är en **uggla**. Eleven kan välja bland nio djur i Garderoben (uggla, katt, kanin, räv, panda, pingvin, robot, drake, enhörning). Alla ritas med samma mall i funktionen `owlSVG` så att kläderna passar alla. Mallen finns bara i `djur.js`. Ugglans flygtur visar alltid ugglan, Grodhoppet alltid grodan.

## Pedagogiska beslut (viktiga, följ dem)

- **Addition och subtraktion**, inte "plus" och "minus", i Tiotalsövergång. Strategin heter **"Tänk addition"**, inte "tänk plus".
- **Tiokompisar**, inte "tiokamrater".
- Tiotalsövergång följer boken: *"Addera först tiokompisen. Addera sedan resten."* och *"Subtrahera först ner till tio. Subtrahera sedan resten."* Korta instruktioner, siffrorna visas i bilden.
- Klockan: **:20 = "tjugo över"**, **:40 = "tjugo i"**, :25 = "fem i halv", :35 = "fem över halv".
- Multiplikation skrivs med **·**, division med **bråkstreck**.
- **Uppställning, subtraktion med växling (svenskt sätt):** siffran man växlar från **stryks bara över**. Man skriver **inget** nytt tal ovanför den, det hålls i minnet. Ovanför kolumnen som får skrivs en liten **10**. Eleven räknar själv *10 + 2 − 7*. Vid växling över noll (402 − 157) skrivs 10 ovanför nollan, och den tian stryks sedan över när man växlar vidare.
- **Uppställning, addition:** eleven skriver **alltid själv minnessiffran**. Rutorna för minnessiffror och växling finns ovanför alla kolumner i alla uppgifter, så att det inte avslöjas när växling behövs.
- **Själv-läget i Uppställning ger inga tips alls** under räknandet. Tips finns bara i Steg för steg.
- Borttaget med flit: **Känguruhoppet** (höll inte kvaliteten), **Grannar** i Hundrarutan (kändes billig), **Lägesord** i Geometri (förskoleklassnivå), pilar i Trasig hundraruta.

## Profiler, flyttkod och inloggningskort

- Profiler finns **bara på enheten**. Vid byte sparas alla `PKEYS` för den gamla profilen i `mp-bundle-<id>` och den nya profilens data läses in. Övningssidorna märker ingenting.
- Fyrsiffrig kod (FNV-hash med salt, inget riktigt säkerhetsskydd och det behövs inte). "Glömt koden?": en vuxen svarar på en multiplikation.
- **Flyttkod:** hela profilen komprimerad (`CompressionStream deflate-raw`, base64url) i en länk `#flytta=…`, som QR-kod, text eller fil.
- **Inloggningskort ("Ta med min profil"):** QR-kod med **användarnamnet under**. Innehåller en **kompakt** version (`cardData()`: stjärnor, medaljer, rekord, klistermärken, djur och dagar, ingen detaljhistorik) så att koden går att skanna även med enkla webbkameror. Utskrift: en A4-sida, QR ca 10 cm. Skanning loggar in **utan kod**. Vid inloggning slås data ihop och **den version som kommit längst behålls per övning** (`mergeBundles`), så ett gammalt kort tar aldrig bort framsteg.
- Knappen uppe till höger öppnar alltid "Vem tränar idag?" (Ny profil, Logga in med QR-kod, Fortsätt som gäst). Utan profiler får "Fortsätt som gäst" bara stänga rutan, så att gästens framsteg inte försvinner.

## Så vill läraren jobba

- **Säger läraren "börja inte" eller "bolla idéer", bygg ingenting.** Föreslå, förklara och fråga, och vänta på "kör". Ibland vill läraren att du först förklarar vad du har förstått.
- Hög kvalitetsribba. Hellre ta bort något än behålla något som känns billigt. Var ärlig när något inte håller måttet.
- Korta, tydliga svar på svenska. Säg alltid **vilka filer som ändrats och var de ska ligga**.
- Testa alltid ordentligt innan leverans: kör `node --check` på skripten och spela igenom övningar och spel i en headless webbläsare (Playwright) i både mobilstorlek (390 × 844) och datorstorlek.
- Tänk på delade skol-iPads och Chromebooks, och på yngre barn som inte läser säkert.

## Idéer som väntar

- **Hitta felet** i Uppställning: färdiga uppställningar med typiska misstag.
- **Tiobasmaterialet** ska byggas om.
- **Små tryckytor i Formjakten** (Geometri): flaggan och trädstammen är små i mobilstorlek. Åtgärdas bara om det visar sig vara ett problem för eleverna.
- Kort kod utan server (sammanfattning i 8–30 tecken) diskuterades men byggdes inte.
- På sikt: riktiga konton för **privat bruk** (kräver server), och senare en skolversion med lärarvy. Elevdata på en server behöver stämmas av med dataskyddsombudet (GDPR), och slumpade användarnamn räcker inte för att undgå GDPR helt.
