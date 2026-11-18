#!/usr/bin/env bash
# Komplettes Video bauen: ./make.sh videos/v01 Video01_Titel
# Vorher: videos/vXX/audio/voice_raw.mp3 + words_raw.json (ElevenLabs) und videos/vXX/video.js
set -euo pipefail
V=$1; NAME=${2:-final}
cd "$(dirname "$0")"
[ -d node_modules ] || npm install
python3 -c "import numpy, scipy" 2>/dev/null || pip install -q numpy scipy
[ -f "$V/audio/voice.wav" ] || python3 engine/prep_audio.py "$V"
node engine/render.mjs "$V"
python3 engine/audio.py "$V"
ffmpeg -v error -y -i "$V/video_noaudio.mp4" -i "$V/audio/mix.wav" -map 0:v -map 1:a -c:v copy \
  -af "loudnorm=I=-14:TP=-1.0:LRA=11" -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart "$V/$NAME.mp4"
echo "Fertig: $V/$NAME.mp4"
