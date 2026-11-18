# Richard-Rollen (TikTok, deutsch)

Täglich ein 9:16-Video (~60 s) im Flat-Chibi-Stil: „Heute ist Richard [Rolle].“ Format, Hook, Szenenaufbau und Lore stehen in
`STYLE_GUIDE.md` – vor jeder Folge lesen. Richard ist derselbe Milliardär wie im Haupt-Account (Repo `tiktok-videos`).

## Feste Regeln
- ElevenLabs: immer nur EINEN Take (`generations_count: 1`). Stimme Rob `5euSC8RarC3AHrZ242sr`, `eleven_v4`.
- Die am Ende angekündigte Rolle ist die nächste Folge.
- Fakten im Oma-Videocall müssen stimmen (vorher recherchieren).

## Zeitplan
- Zwei geplante Aufgaben pro Tag (deutsche Zeit): Start 12:35 → Video bis 13 Uhr, Start 16:35 → Video bis 17 Uhr.
  Jede Folge = die zuletzt angekündigte Rolle; beide Folgen eines Tages sind also verschiedene Rollen.

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
- `engine/bg.js`: Hintergründe (villa, sunset, park, station, soupKitchen, streetDay+screen, night, room) + Requisiten.
- `engine/timeline.js`: Wörter → Untertitel-Chunks (Satzweise), Szenen, SFX. `engine/audio.py`: Musik + SFX-Mix.

## Folgen
- r01 – obdachlos → nächste: Psychopath
- r02 – Psychopath: VORBEREITET (videos/r02/script.txt + video.js fertig, Wortanker per Text). Nur noch: 1 Take aus script.txt,
  Transkription, prep_audio, Stills, make.sh. ElevenLabs-Flow `nNWPEysXljbrhg5tH8p7` (leer; vorher prüfen). Danach → nächste: Veganer
