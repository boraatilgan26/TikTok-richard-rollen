# Richard-Rollen (TikTok, deutsch)

Täglich ein 9:16-Video (~60 s) im Flat-Chibi-Stil: „Heute ist Richard [Rolle].“ Format, Hook, Szenenaufbau und Lore stehen in
`STYLE_GUIDE.md` – vor jeder Folge lesen. Richard ist derselbe Milliardär wie im Haupt-Account (Repo `tiktok-videos`).

## Feste Regeln
- ElevenLabs-Timeout ≠ nicht erzeugt: Aufrufe können verspätet doch durchlaufen. Nach einem Timeout NIE sofort wiederholen,
  sondern per `creative_get_flow` prüfen (auch Minuten später) und vorhandene Takes nutzen.
- ElevenLabs: immer nur EINEN Take (`generations_count: 1`). Stimme Rob `5euSC8RarC3AHrZ242sr`, `eleven_v4`.
- Die am Ende angekündigte Rolle ist die nächste Folge.
- Fakten im Oma-Videocall müssen stimmen (vorher recherchieren).

## Zeitplan
- PAUSIERT seit 25.11.2026 (Wunsch des Nutzers): beide geplanten Aufgaben (13 Uhr und 17 Uhr) sind deaktiviert.
  Zuletzt: 1 Video pro Tag um 17 Uhr (Start 16:35). Beim Fortsetzen: nächste Folge r13 = Rentner.

## Ablauf (videos/rXX)
1. Skript (~140–150 Wörter) nach STYLE_GUIDE; Zahlen ausgeschrieben.
2. `creative_create_flow` → `creative_generate_speech` (1 Take) → MP3 nach `videos/rXX/audio/voice_raw.mp3`.
3. `creative_transcribe_audio` (connect_from = TTS-Node) → words.json nach `videos/rXX/audio/words_raw.json`.
4. `python3 engine/prep_audio.py videos/rXX 1.2` → Wort-Indizes mit Zeiten.
5. `videos/rXX/video.js` (Vorlage `videos/r01/video.js`), Stills prüfen: `node engine/render.mjs videos/rXX --stills 1,5,...`
6. `./make.sh videos/rXX FolgeXX_Titel` (~10 min), MP4 + caption.txt schicken, Quellen committen.

## Engine
- `engine/chibi.js`: Figuren (`person`, Presets RICHARD, RICHARD_HOMELESS, BUTLER), UI (clockBadge, bubble, iconCard, stamp, pill,
  questionCard, commentSign, rouletteBar/roulettePos, ROLES), Untertitel.
- `engine/bg.js`: Hintergründe (villa, sunset, park, station, soupKitchen, streetDay+screen, night, room, diningRoom, boardroom,
  restaurant, livingRoom+sofa, garage+sportsCar/bambooBike, kitchenNight+fridge, monastery+candle/gong, spaceStation, space, classroom, bunker+cans) + Requisiten, Flaggen (finland, uk).
- Vorlage für neue Folgen: `videos/r04/video.js` (Wortanker per Text mit `wi()`). Achtung: `wi()` matcht Wortanfänge –
  bei Komposita (z. B. „Gratis-Tee“) den ersten Wortteil als Anker nehmen, sonst springen alle späteren Anker.
  `wi(word, after)` sucht AB Index `after` inklusive – bei gleichem Präfix (klopft/Klo) `after + 1` übergeben.
- `engine/timeline.js`: Wörter → Untertitel-Chunks (Satzweise), Szenen, SFX. `engine/audio.py`: Musik + SFX-Mix.

## Folgen
(Glücksrad-ROLES ab r12 erweitert: Rentner, Bodybuilder, Detektiv, Pirat, Koch, Bauer – noch ungenutzt außer angekündigten.)
- r01 – obdachlos → nächste: Psychopath
- r02 – Psychopath (Fakt: Kevin Dutton 2011, Platz 1 CEO) → nächste: Veganer
- r03 – Veganer (Fakt: Donald Watson 1944, VEG+AN) → nächste: Influencer
- r04 – Influencer (Fakt: „Me at the zoo“, Jawed Karim 2005, 19 s) → nächste: Mönch
- r05 – Mönch (Fakt: Kloster Weltenburg seit 1050, gilt als älteste Klosterbrauerei) → nächste: Gangster
- r06 – Gangster (Fakt: Al Capone 1931 wegen Steuerhinterziehung, 11 Jahre) → nächste: Hausmeister
- r07 – Hausmeister (Fakt: Hubert Booth 1901, Staubsauger von Pferden gezogen) → nächste: Astronaut
- r08 – Astronaut (Fakt: Juri Gagarin 1961, Flug 108 Minuten) → nächste: Lehrer
- r09 – Lehrer (Fakt: Schulpflicht Preußen 1717, Friedrich Wilhelm I.) → nächste: Prepper
- r10 – Prepper (Fakt: Regierungsbunker Ahrtal ab 1960, >17 km, 3.000 Menschen, heute Museum) → nächste: Kommunist
- r11 – Kommunist (Fakt: Das Kapital 1867, Marx von Fabrikantensohn Engels finanziert) → nächste: Minimalist
- r12 – Minimalist (Fakt: Diogenes im Fass, wirft der Legende nach seinen Becher weg) → nächste: Rentner

## YouTube (Langformat, `youtube/`)
- Stil „Richard 2.0“: Neon-Welt wie Haupt-Account, Richard mit Gesicht/Gesten/Lippensync, 16:9, 10–15 min. Details + Ablauf: `youtube/README.md`.
- Richard spricht in Ich-Form; je Kapitel EIN ElevenLabs-Take; Caption/Beschreibung immer mit „Keine Steuer-/Finanzberatung“.
- Zu JEDEM Video im Chat mitgeben: klickstarken Titel (+2 Alternativen) und Beschreibung (Teaser + Kapitel + fester Block aus `youtube/beschreibung_vorlage.txt`).
- ep01 (28.11.2026) – Warum zahlen Millionäre weniger Steuern als du? → nächste Folge: Wirecard (1,9 Mrd.).
- Rhythmus: alle 4 Tage ein Video um 16 Uhr (geplante Aufgabe täglich 13:17, überspringt, solange die letzte Folge < 4 Tage alt ist).
