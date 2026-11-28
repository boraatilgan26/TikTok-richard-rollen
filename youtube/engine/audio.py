"""Mischt Stimme + ruhige generierte Musik (Langformat) + SFX.  Nutzung: python3 youtube/engine/audio.py youtube/ep01"""
import sys, json, numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 48000
ep = sys.argv[1]
rng = np.random.default_rng(3)
sr, voice = wavfile.read(f'{ep}/audio/voice.wav')
voice = voice.astype(np.float32) / 32768.0
if voice.ndim > 1: voice = voice.mean(axis=1)
N = len(voice) + SR; dur = N / SR
chapters = json.load(open(f'{ep}/chapters.json'))

def lp(x, f): return sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)
def hp(x, f): return sosfilt(butter(2, f, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), x)
def note(m): return 440 * 2 ** ((m - 69) / 12)

# ---------- Musik: warmes Pad + weicher Bass, Puls nur leicht; je Kapitel andere Akkordfolge ----------
bpm = 92; beat = 60 / bpm; bar = beat * 4
progs = [[[57, 60, 64], [53, 57, 60], [48, 55, 60], [55, 59, 62]],   # Am F C G
         [[50, 53, 57], [46, 50, 53], [53, 57, 60], [52, 55, 59]],   # Dm Bb F Em
         [[57, 60, 64], [52, 55, 59], [53, 57, 60], [55, 59, 62]]]   # Am Em F G
music = np.zeros(N)
def chap_at(t):
    ci = 0
    for i, c in enumerate(chapters):
        if t >= c['card']: ci = i
    return ci
nb = int(dur / bar) + 1
for b in range(nb):
    t0 = b * bar; s0 = int(t0 * SR); n = min(int(bar * SR), N - s0)
    if n <= 0: break
    ci = chap_at(t0); ch = progs[ci % 3][b % 4]; tt = np.arange(n) / SR
    pad = np.zeros(n)
    for m in ch:
        f = note(m - 12)
        for k, a in [(1, 1), (2, 0.3), (3, 0.1)]: pad += a * np.sin(2 * np.pi * f * k * tt + rng.random() * 6) * (1 + 0.15 * np.sin(2 * np.pi * 0.3 * tt))
    e = np.minimum(1, tt / 0.8) * np.minimum(1, (bar - tt) / 0.6)
    music[s0:s0 + n] += pad * e * 0.045
    for bt in (0, 2):
        bs = s0 + int(bt * beat * SR); bn = min(int(beat * 1.8 * SR), N - bs)
        if bn <= 0: continue
        b_ = np.arange(bn) / SR
        music[bs:bs + bn] += np.sin(2 * np.pi * note(ch[0] - 24) * b_) * np.exp(-b_ / 0.6) * 0.16
    # Arpeggio-Glitzer (leise)
    for i in range(8):
        a0 = s0 + int(i * beat / 2 * SR); an = min(int(0.4 * SR), N - a0)
        if an <= 0: continue
        a_ = np.arange(an) / SR
        music[a0:a0 + an] += np.sin(2 * np.pi * note(ch[i % 3] + 12) * a_) * np.exp(-a_ / 0.18) * 0.02
music = lp(music, 2200)
for i in range(int(dur / beat)):  # weicher Kick
    s0 = int(i * beat * SR); n = min(int(0.22 * SR), N - s0)
    if n <= 0: break
    tt = np.arange(n) / SR; f = 50 + 50 * np.exp(-tt / 0.03)
    music[s0:s0 + n] += np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.1) * 0.12
# Kapitelkarten: Musik kurz hoch
lift = np.ones(N)
for c in chapters[1:]:
    a, b = int(c['card'] * SR), int((c['start'] + 0.6) * SR)
    lift[a:b] = 1.8
lift = lp(lift, 3)
music *= 0.5 * lift

# ---------- SFX ----------
def sfx(kind):
    if kind == 'whoosh':
        n = int(0.45 * SR); x = rng.standard_normal(n); tt = np.arange(n) / SR; out = np.zeros(n)
        for i in range(0, n, 512):
            fc = 300 + 3500 * np.sin(np.pi * i / n) ** 2; seg = x[i:i + 512]; out[i:i + 512] = bp(seg, fc * 0.6, fc * 1.4)[:len(seg)]
        return out * np.sin(np.pi * tt / tt[-1]) ** 2 * 0.32
    if kind == 'swipe':
        n = int(0.25 * SR); tt = np.arange(n) / SR
        return hp(rng.standard_normal(n), 2500) * np.sin(np.pi * tt / tt[-1]) ** 2 * 0.18
    if kind == 'pop':
        n = int(0.09 * SR); tt = np.arange(n) / SR; f = 1100 - 500 * tt / tt[-1]
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.03) * 0.25
    if kind == 'ding':
        n = int(0.9 * SR); tt = np.arange(n) / SR
        return (np.sin(2 * np.pi * 1318 * tt) + 0.4 * np.sin(2 * np.pi * 2637 * tt) + 0.2 * np.sin(2 * np.pi * 1976 * tt)) * np.exp(-tt / 0.25) * 0.16
    if kind == 'coins':
        n = int(0.8 * SR); out = np.zeros(n)
        for k in range(9):
            s = int(rng.random() * 0.55 * SR); m = int(0.18 * SR); tt = np.arange(m) / SR; f = 3000 + rng.random() * 2500
            seg = (np.sin(2 * np.pi * f * tt) + 0.5 * np.sin(2 * np.pi * f * 1.51 * tt)) * np.exp(-tt / 0.04); out[s:s + m] += seg[:n - s] * 0.07
        return out
    if kind == 'hit':
        n = int(0.7 * SR); tt = np.arange(n) / SR; f = 45 + 90 * np.exp(-tt / 0.04)
        return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.25) * 0.5 + lp(rng.standard_normal(n), 3000) * np.exp(-tt / 0.03) * 0.25)
    if kind == 'bass':
        n = int(1.4 * SR); tt = np.arange(n) / SR; f = 38 + 60 * np.exp(-tt / 0.08)
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.6) * 0.6
    if kind == 'knock':
        out = np.zeros(int(0.45 * SR))
        for s in (0, 0.18):
            m = int(0.12 * SR); tt = np.arange(m) / SR
            seg = bp(rng.standard_normal(m), 120, 900) * np.exp(-tt / 0.025) * 1.2 + np.sin(2 * np.pi * 110 * tt) * np.exp(-tt / 0.04) * 0.5
            out[int(s * SR):int(s * SR) + m] += seg
        return out * 0.5
    if kind == 'rise':
        n = int(0.7 * SR); tt = np.arange(n) / SR; x = rng.standard_normal(n); out = np.zeros(n)
        for i in range(0, n, 512):
            fc = 400 + 5000 * (i / n) ** 2; seg = x[i:i + 512]; out[i:i + 512] = bp(seg, fc * 0.7, fc * 1.3)[:len(seg)]
        return out * (tt / tt[-1]) ** 2 * 0.28
    if kind == 'magic':
        n = int(1.2 * SR); out = np.zeros(n)
        for k, m in enumerate([81, 84, 88, 93, 96]):
            s = int(k * 0.07 * SR); tt = np.arange(n - s) / SR; out[s:] += np.sin(2 * np.pi * note(m) * tt) * np.exp(-tt / 0.35) * 0.06
        return out
    return np.zeros(1)

fx = np.zeros(N)
for e in json.load(open(f'{ep}/sfx.json')):
    x = sfx(e['type']); s = int(e['t'] * SR)
    if s >= N or s < 0: continue
    x = x[:N - s]; fx[s:s + len(x)] += x

v = np.zeros(N); v[:len(voice)] = voice
envv = lp(np.abs(v), 5)
duck = 1 - 0.55 * np.clip(envv / (envv.max() * 0.2), 0, 1)
mix = v + music * duck + fx * 0.8
mix = mix / max(1e-6, np.abs(mix).max()) * 0.95
wavfile.write(f'{ep}/audio/mix.wav', SR, (mix * 32767).astype(np.int16))
print('mix ok', round(dur, 2), 's')
