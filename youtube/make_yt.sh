#!/usr/bin/env bash
# Teile zusammenfügen + Ton: ./make_yt.sh ep01 Folge01_Titel   (vorher: epXX/parts/p0..pN.mp4 gerendert)
set -euo pipefail
cd "$(dirname "$0")"
E=$1; NAME=${2:-final}
python3 -c "import numpy, scipy" 2>/dev/null || pip install -q numpy scipy
node engine/render.mjs "$E" --sfx-only
python3 engine/audio.py "$E"
ls "$E"/parts/p*.mp4 | sort -V | sed "s|^$E/parts/|file '|; s|$|'|" > "$E/parts/list.txt"
ffmpeg -v error -y -f concat -safe 0 -i "$E/parts/list.txt" -c copy "$E/video_noaudio.mp4"
ffmpeg -v error -y -i "$E/video_noaudio.mp4" -i "$E/audio/mix.wav" -map 0:v -map 1:a -c:v copy \
  -af "loudnorm=I=-14:TP=-1.0:LRA=11" -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart "$E/$NAME.mp4"
echo "Fertig: $E/$NAME.mp4"
