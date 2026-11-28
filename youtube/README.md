# Richard 2.0 – YouTube-Langvideos (16:9, 10–15 min)

Neon-Welt aus dem Richard-Finance-Account (`tiktok-videos`), aber Richard mit Gesicht, Gesten und Lippensync.
Canvas 2D (kein WebGL) → ca. 0,1 s/Frame, ein 11-Minuten-Video rendert in 4 Teilen parallel in ~12 min.

## Engine (`engine/`)
- `core.js` – Canvas 1920×1080, Kamera (Zoom/Schwenk pro Szene), UI-Bausteine (text, pill, stamp, panel, bar, arrow, coinFlow, check/cross),
  Untertitel (Satzstücke, aktives Wort gold, „26 Komma 4“ → „26,4“), Timeline, `wi()`-Wortsuche.
- `characters.js` – `actor(kind, {x, s, talk, keys, enter, exit, prop})`. Figuren: richard, finanzamt, nurse, son, daughter, wife, banker, judge, normal.
  Posen: idle, point, pointUp, pointDown, up, hip, hold, shrug, chin, wave, present, count, fist, phone, cross, give.
  Ausdrücke: neutral, smug, happy, laugh, shock, angry, worried, sad, thinking, serious, wink.
  Weiche Übergänge (0,3 s) zwischen Keyframes, Blinzeln automatisch, Mund aus `mouth.json` (nur `talk: true`).
- `sets.js` – Kulissen `SETS.office|finanzamt|villa|bank|court|hospital|living|stage` + Requisiten (building, house, yacht, doc, chartLine,
  gift, hourglass, factory, calendar, scales, etfJar, moneyStack, palm).
- `prep.py` – Kapitel-MP3s + Transkripte → `voice.wav` (Tempo 1,1, Pause 1,8 s vor jedem Kapitel), `words.json`, `chapters.json`, `mouth.json`.
- `audio.py` – ruhige Musik (Akkorde wechseln pro Kapitel), SFX, Ducking → `audio/mix.wav`.
- `render.mjs` – Playwright → ffmpeg. `--stills 1,5,…`, `--from/--to/--out` für Teile, `--sfx-only`.

## Ablauf neue Folge (`epXX/`)
1. `script.json` (Kapitel, Zahlen ausgeschrieben, Richard spricht in Ich-Form), ~1.700 Wörter ≈ 11 min.
2. ElevenLabs: je Kapitel EIN Take (Rob `5euSC8RarC3AHrZ242sr`, `eleven_v4`) → `audio/cN_raw.mp3`; Transkript → `audio/cN_words.json`.
3. `cd youtube && npm install && python3 engine/prep.py epXX 1.1 1.8`
4. `epXX/video.js` (Vorlage `ep01/video.js`): Szenen in Skript-Reihenfolge, Anker mit `w('Wort')` (Cursor läuft mit).
5. Stills: `node engine/render.mjs epXX --stills …`
6. Render: 4 Teile parallel (`--from/--to/--out epXX/parts/pN.mp4`), dann `./make_yt.sh epXX Titel`.
7. Zu JEDER Folge `epXX/beschreibung.txt`: klickstarker Titel (≤ 60 Zeichen, ergänzt das Thumbnail statt es zu wiederholen, ehrlich – kein falsches Versprechen) + 2 Alternativen, 2–3 Sätze Teaser, Kapitelmarken, Quellen; darunter der feste Block aus `beschreibung_vorlage.txt`. Beides dem Nutzer im Chat mitgeben.
8. Thumbnail: `epXX_thumb/video.js`, `node engine/render.mjs epXX_thumb --stills 0.5`.

## Folgen
- ep01 (28.11.2026) – Warum zahlen Millionäre weniger Steuern als du? (Holding, Lombardkredit, Schenkung alle 10 J., Verschonung Betriebsvermögen + BVerfG 13.10.2026) → nächste: Wirecard

## Zeitplan
- Geplante Aufgabe täglich 13:17 (Berlin): prüft das Datum der letzten Folge oben; erst wenn ≥ 4 Tage vergangen sind, entsteht die nächste Folge (fertig bis 16 Uhr). Sonst sofort beenden.
- Nach jeder Folge hier unter „Folgen“ mit Datum eintragen (das Datum steuert den 4-Tage-Rhythmus) und „nächste:“ festlegen.
