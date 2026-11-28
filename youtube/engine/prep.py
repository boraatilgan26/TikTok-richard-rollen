"""Kapitel-Stimmen zusammenfügen: audio/cN_raw.mp3 + audio/cN_words.json -> voice.wav, words.json, chapters.json, mouth.json
Nutzung: python3 youtube/engine/prep.py youtube/ep01 [tempo=1.1] [gap=1.8]"""
import sys, json, subprocess, os, numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

ep = sys.argv[1]; tempo = float(sys.argv[2]) if len(sys.argv) > 2 else 1.1; gap = float(sys.argv[3]) if len(sys.argv) > 3 else 1.8
SR, FPS, LEAD = 48000, 30, 0.4
script = json.load(open(f'{ep}/script.json'))
parts, words, chapters, t = [np.zeros(int(LEAD * SR), np.float32)], [], [], LEAD
for ci, ch in enumerate(script['chapters']):
    cid = ch['id']
    if ci > 0:
        parts.append(np.zeros(int(gap * SR), np.float32)); card = t; t += gap
    else:
        card = 0.0
    tmp = f'{ep}/audio/{cid}_tmp.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{ep}/audio/{cid}_raw.mp3', '-af', f'atempo={tempo}', '-ac', '1', '-ar', str(SR), tmp], check=True)
    _, a = wavfile.read(tmp); os.remove(tmp)
    a = a.astype(np.float32) / 32768.0
    d = json.load(open(f'{ep}/audio/{cid}_words.json'))
    for w in d['words']:
        if w.get('type', 'word') != 'word' or w['text'].strip()[:1] in '([': continue
        words.append({'w': w['text'], 's': round(t + w['start'] / tempo, 3), 'e': round(t + w['end'] / tempo, 3), 'c': ci})
    chapters.append({'id': cid, 'name': ch['name'], 'card': round(card, 3), 'start': round(t, 3), 'end': round(t + len(a) / SR, 3)})
    parts.append(a); t += len(a) / SR
parts.append(np.zeros(int(1.5 * SR), np.float32))
voice = np.concatenate(parts)
# Mund-Hüllkurve pro Frame (Sprachband, geglättet, normiert)
sos = butter(2, [250, 3500], 'band', fs=SR, output='sos')
v = np.abs(sosfilt(sos, voice))
hop = SR // FPS; n = len(v) // hop
env = np.array([v[i * hop:(i + 1) * hop].mean() for i in range(n)])
env = np.convolve(env, [0.25, 0.5, 0.25], 'same')
ref = np.percentile(env[env > env.max() * 0.05], 90)
mouth = np.clip((env / ref - 0.12) / 0.88, 0, 1) ** 0.8
wavfile.write(f'{ep}/audio/voice_pre.wav', SR, (voice * 32767).astype(np.int16))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{ep}/audio/voice_pre.wav', '-af', 'loudnorm=I=-15:TP=-1.5:LRA=11', '-ar', str(SR), f'{ep}/audio/voice.wav'], check=True)
os.remove(f'{ep}/audio/voice_pre.wav')
json.dump(words, open(f'{ep}/words.json', 'w'), ensure_ascii=False)
json.dump(chapters, open(f'{ep}/chapters.json', 'w'), ensure_ascii=False, indent=1)
json.dump([round(float(m), 3) for m in mouth], open(f'{ep}/mouth.json', 'w'))
print('Dauer', round(len(voice) / SR, 2), 's |', len(words), 'Wörter')
for c in chapters: print(c)
