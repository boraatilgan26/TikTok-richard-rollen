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
- Seit 23.11.2026 nur noch EIN Video pro Tag (Wunsch des Nutzers): Start 16:35 → Video bis 17 Uhr (deutsche Zeit).
  Die 13-Uhr-Aufgabe ist deaktiviert. Jede Folge = die zuletzt angekündigte Rolle.

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
