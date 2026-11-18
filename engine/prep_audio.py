"""Stimme vorbereiten: voice_raw.mp3 -> voice.wav (Tempo 1.2, -14 LUFS) und words_raw.json -> words.json
Nutzung: python3 engine/prep_audio.py videos/v02 [tempo]"""
import sys, json, subprocess
vdir = sys.argv[1]; tempo = float(sys.argv[2]) if len(sys.argv) > 2 else 1.2
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{vdir}/audio/voice_raw.mp3', '-af', f'atempo={tempo},loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '48000', f'{vdir}/audio/voice.wav'], check=True)
d = json.load(open(f'{vdir}/audio/words_raw.json'))
ws = d['words'] if isinstance(d, dict) and 'words' in d else d
out = [{'w': w['text'], 's': round(w['start'] / tempo, 3), 'e': round(w['end'] / tempo, 3)} for w in ws if w.get('type', 'word') == 'word']
json.dump(out, open(f'{vdir}/words.json', 'w'), ensure_ascii=False)
for i, w in enumerate(out): print(i, w['w'], w['s'], end=' | ')
print()
