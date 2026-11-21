# Richard-Rollen – Style Guide (aus 4 Referenzvideos abgeleitet)

Format: 9:16, ca. 60 s, 30 fps. Flat-Vector-Chibi-Look (große Köpfe, dicke dunkle Outlines,
Pastell-Hintergründe, keine Schatten außer Bodenschatten). Ein ruhiger, trockener männlicher
Erzähler (Referenz ≈ 126 Hz, deadpan), kurze Sätze, Präsens.

## Hook (0–2 s) – das Wichtigste
- Textzeile oben: klein „Heute ist Richard ein“ / groß **„[ROLLE].“**
- Darunter eine **Roulette-Leiste** mit runden Icons (jede Rolle ein Icon), die durchrattert;
  bei jedem Tick wechselt Richards Outfit + Hintergrundfarbe (lila, blau, petrol, dunkelrot …).
- Sie bleibt auf der Ziel-Rolle stehen (goldener Ring um das Icon).
- Hintergrund-Bühne: wiedererkennbares Wahrzeichen (Referenz: Capitol). Für uns: Richards Villa
  bzw. Reichstag/Brandenburger Tor – Wiedererkennung über alle Folgen.
- Gesprochen: „Heute ist Richard [Rolle].“ – sofort, kein Intro.

## „Bedeutet:“-Block (2–6 s)
- Roter Sonnenuntergang, Lichtkegel, Richard in der Mitte im Rollen-Outfit.
- 2–3 runde Icon-Karten poppen nacheinander auf, je mit Mini-Label (z. B. „kein Staat“, „keine Chefs“).
- Erzähler: „Bedeutet: …“ + 2–3 Mini-Sätze.

## Tagesablauf mit Uhr-Badge (6–46 s)
Oben mittig immer ein Uhr-Badge (07:00 → 08:15/10:30 → 12:00 → 16:00/18:00 → 21:00).
Jede Szene = ein Ort, ein Gag, Muster **Setup → Reaktion der Familie → Richards Punchline**:
1. **07:00 Zuhause** (Küche/Bad): Familie (Papa, Mama) reagiert. „Papa sagt: …“ „Richard sagt: …“
   Sprechblasen zeigen den Satz als Text.
2. **08:15 / 10:30 Schule/Arbeit**: Rolle kollidiert mit Alltag (Tafel-Popups, Stempel wie „FEUERALARM“).
3. **12:00 Mittag/Öffentlichkeit**: Gag mit Zähler-Overlay (z. B. „Selfie 40/40“, „Trinkgeld 2 €“).
4. **16:00/18:00 Oma-Videocall = FAKTEN-TWIST**: „Oma ruft an. Sie sagt:“ → Bildschirm zeigt
   echten historischen Fakt: Land/Flagge + **Jahr groß in Gold** + Person mit Namensschild +
   Zahl/Liste. Das ist der Save-/Share-Moment („wusste ich nicht“). Fakten müssen stimmen!
5. **21:00 Nacht** (dunkellila, Mond): Callback auf den Morgen-Gag, finale Pointe.

## Ende (54–60 s)
- Weißes Kärtchen oben: Frage „Würdest du …?“ → Erzähler: „Schreib’s mir in die Kommentare.“
  + kleines Schild „Sag’s mir unten“ mit rotem Pfeil nach unten.
- Roulette-Leiste dreht erneut: **„Nächstes Mal ist Richard [NÄCHSTE ROLLE].“** → Serien-Cliffhanger,
  treibt Follows. Die angekündigte Rolle MUSS die nächste Folge sein.

## Schnitt & Text
- Neuer Bildwechsel/Pop-up ca. alle 1–2 s, nie ein statisches Bild > 2 s.
- Untertitel: weiß, fett, schwarze Kontur, unteres Drittel, 1 kurzer Satz pro Einblendung.
- Sätze 1–6 Wörter. „Halb acht.“ „Papa erschrickt.“ „Richard sagt:“
- Figuren hüpfen leicht (squash & stretch) beim Sprechen; Pop-ups mit Scale-Bounce.

## Voice (ElevenLabs)
- Stimme: **Rob – Warm Bass German Narrator** (`5euSC8RarC3AHrZ242sr`), Modell `eleven_v4` – dieselbe Stimme wie
  auf dem Haupt-Account (Wiedererkennung). Tempo 1.2 via `engine/prep_audio.py`.
- **Credits sparen:** immer nur EIN Take (`generations_count: 1`), komplettes Skript in einem Call.
- Zahlen im Skript ausschreiben, in Untertiteln per `capMap` als Ziffern.

## Richard-Lore (Serien-Bindung zum Haupt-Account „Tricks der Reichen“)
- Richard ist **Milliardär**, Markenzeichen **goldene Krawatte** (trägt er in JEDER Rolle, auch obdachlos).
  Im Hook steht „VERMÖGEN 47.683.594 €“ (Zahl aus dem Haupt-Account) und stürzt je nach Rolle ab.
- Chibi-Look: Seitenscheitel braun, weißes Hemd, dunkle Hose, goldene Krawatte. Rollen ändern Outfit + Shirt-Icon.
- Nebenfiguren: **Johann** (Butler, grauer Schnurrbart, schwarzer Anzug), **Oma** (Videocall = Fakten),
  später Mama/Papa möglich.
- Ende jeder Folge: „Nächstes Mal ist Richard …“ → diese Rolle ist die nächste Folge.

## Episoden
- r01 – obdachlos (Pfand-Rechnung, Suppenküche, Fakt: Finnland Housing First 2008, −70 % Langzeit-Obdachlose bis 2024) → nächste: Psychopath
- r02 – Psychopath (Frühstück: Johann gefeuert, Aktie −20 % + Apfel, Kellner weint, Fakt: Dutton 2011 Platz 1 CEO, Horrorfilm) → nächste: Veganer
- r03 – Veganer (Speck-Frühstück, Ferrari mit Ledersitzen → Bambus-Fahrrad, Steakhaus-Salat, Fakt: Donald Watson 1944 VEG+AN, Kühlschrank-Gurke) → nächste: Influencer
- r04 – Influencer (47 Versuche Frühstück, Privatjet-Unboxing 12 Likes, Gratis-Tee, Fakt: „Me at the zoo“ 2005, Johanns Rührei 2 Mio.) → nächste: Mönch
- r05 – Mönch (Gong um 5 Uhr, Schweige-Nicken = Kaufen +30 %, Kaviar per Zeichensprache, Fakt: Weltenburg 1050 Klosterbier, Meditation vs. Johanns Handy) → nächste: Gangster
- r06 – Gangster (Sonnenbrille im Dunkeln, Bäckerei für 2 Mio. gekauft, Golfwagen 12 km/h, Fakt: Capone 1931 Steuerhinterziehung, Starrduell mit Johann) → nächste: Hausmeister
