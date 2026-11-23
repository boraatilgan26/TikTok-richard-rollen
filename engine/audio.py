"""Mischt Stimme + generierte Musik + SFX.  Nutzung: python3 engine/audio.py v01"""
import sys, json, numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 48000
vdir = sys.argv[1]
rng = np.random.default_rng(3)

sr, voice = wavfile.read(f'{vdir}/audio/voice.wav')
voice = voice.astype(np.float32) / 32768.0
if voice.ndim > 1: voice = voice.mean(axis=1)
dur = max(len(voice) / SR, json.load(open(f'{vdir}/meta.json'))['duration'] if False else len(voice) / SR) + 1.0
N = int(dur * SR)
t = np.arange(N) / SR

def lp(x, f): return sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)
def hp(x, f): return sosfilt(butter(2, f, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), x)
def env(n, a, d): e = np.ones(n); na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na); e *= np.exp(-np.arange(n) / SR / d) if d else 1; return e
def note(f): return 440 * 2 ** ((f - 69) / 12)

# ---------- Musik: leichter, freundlicher Bed (C - G - Am - F) ----------
bpm = 108; beat = 60 / bpm; bar = beat * 4
chords = [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]]  # C-G-Am-F, freundlich
music = np.zeros(N)
nb = int(dur / bar) + 1
for b in range(nb):
    ch = chords[b % 4]; s0 = int(b * bar * SR); n = int(bar * SR)
    if s0 >= N: break
    n = min(n, N - s0); tt = np.arange(n) / SR
    pad = np.zeros(n)
    for m in ch:
        f = note(m - 12)
        for k, a in [(1, 1), (2, 0.35), (3, 0.15)]: pad += a * np.sin(2 * np.pi * f * k * tt + rng.random() * 6)
    e = np.minimum(1, tt / 0.6) * np.minimum(1, (bar - tt) / 0.4)
    music[s0:s0 + n] += pad * e * 0.05
    # Bass auf 1 und 3
    for bt in (0, 2):
        bs = s0 + int(bt * beat * SR); bn = min(int(beat * 1.6 * SR), N - bs)
        if bn <= 0: continue
        bt_ = np.arange(bn) / SR
        music[bs:bs + bn] += np.sin(2 * np.pi * note(ch[0] - 24) * bt_) * np.exp(-bt_ / 0.5) * 0.22
music = lp(music, 2600)
# Kick + Hi-Hats
for i in range(int(dur / beat)):
    s0 = int(i * beat * SR); n = min(int(0.25 * SR), N - s0)
    if n <= 0: break
    tt = np.arange(n) / SR
    f = 50 + 70 * np.exp(-tt / 0.03)
    music[s0:s0 + n] += np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.12) * 0.35
    for off in (0.5,):
        hs = s0 + int(off * beat * SR); hn = min(int(0.05 * SR), N - hs)
        if hn > 0: music[hs:hs + hn] += hp(rng.standard_normal(hn), 7000) * np.exp(-np.arange(hn) / SR / 0.015) * 0.06
music *= 0.55

# ---------- SFX ----------
def sfx(kind):
    if kind == 'whoosh':
        n = int(0.45 * SR); x = rng.standard_normal(n); tt = np.arange(n) / SR
        out = np.zeros(n)
        for i in range(0, n, 512):
            fc = 300 + 3500 * np.sin(np.pi * i / n) ** 2
            seg = x[i:i + 512]; out[i:i + 512] = bp(seg, fc * 0.6, fc * 1.4)[:len(seg)]
        return out * np.sin(np.pi * tt / tt[-1]) ** 2 * 0.5
    if kind == 'swipe':
        n = int(0.25 * SR); tt = np.arange(n) / SR
        return hp(rng.standard_normal(n), 2500) * np.sin(np.pi * tt / tt[-1]) ** 2 * 0.25
    if kind == 'pop':
        n = int(0.09 * SR); tt = np.arange(n) / SR; f = 1100 - 500 * tt / tt[-1]
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.03) * 0.35
    if kind == 'ding':
        n = int(0.9 * SR); tt = np.arange(n) / SR
        return (np.sin(2 * np.pi * 1318 * tt) + 0.4 * np.sin(2 * np.pi * 2637 * tt) + 0.2 * np.sin(2 * np.pi * 1976 * tt)) * np.exp(-tt / 0.25) * 0.22
    if kind == 'coins':
        n = int(0.8 * SR); out = np.zeros(n)
        for k in range(9):
            s = int(rng.random() * 0.55 * SR); m = int(0.18 * SR); tt = np.arange(m) / SR; f = 3000 + rng.random() * 2500
            seg = (np.sin(2 * np.pi * f * tt) + 0.5 * np.sin(2 * np.pi * f * 1.51 * tt)) * np.exp(-tt / 0.04)
            out[s:s + m] += seg[:n - s] * 0.09
        return out
    if kind == 'hit':
        n = int(0.7 * SR); tt = np.arange(n) / SR; f = 45 + 90 * np.exp(-tt / 0.04)
        return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.25) * 0.7 + lp(rng.standard_normal(n), 3000) * np.exp(-tt / 0.03) * 0.35)
    if kind == 'bass':
        n = int(1.4 * SR); tt = np.arange(n) / SR; f = 38 + 60 * np.exp(-tt / 0.08)
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.6) * 0.8
    if kind == 'knock':
        out = np.zeros(int(0.45 * SR))
        for s in (0, 0.18):
            m = int(0.12 * SR); tt = np.arange(m) / SR
            seg = bp(rng.standard_normal(m), 120, 900) * np.exp(-tt / 0.025) * 1.2 + np.sin(2 * np.pi * 110 * tt) * np.exp(-tt / 0.04) * 0.5
            out[int(s * SR):int(s * SR) + m] += seg
        return out * 0.7
    if kind == 'rise':
        n = int(0.7 * SR); tt = np.arange(n) / SR; x = rng.standard_normal(n); out = np.zeros(n)
        for i in range(0, n, 512):
            fc = 400 + 5000 * (i / n) ** 2; seg = x[i:i + 512]; out[i:i + 512] = bp(seg, fc * 0.7, fc * 1.3)[:len(seg)]
        return out * (tt / tt[-1]) ** 2 * 0.35
    if kind == 'magic':
        n = int(1.2 * SR); out = np.zeros(n)
        for k, m in enumerate([81, 84, 88, 93, 96]):
            s = int(k * 0.07 * SR); tt = np.arange(n - s) / SR
            out[s:] += np.sin(2 * np.pi * note(m) * tt) * np.exp(-tt / 0.35) * 0.08
        return out
    if kind == 'tuut':  # deutsches Freizeichen 425 Hz, 1 s
        n = int(1.0 * SR); tt = np.arange(n) / SR
        return np.sin(2 * np.pi * 425 * tt) * np.minimum(1, np.minimum(tt, tt[-1] - tt) / 0.02) * 0.16
    if kind == 'busy':  # Besetztzeichen 425 Hz, 0,48 s an/aus
        n = int(1.9 * SR); tt = np.arange(n) / SR
        return np.sin(2 * np.pi * 425 * tt) * ((tt % 0.96) < 0.48) * 0.16
    return np.zeros(1)

fx = np.zeros(N)
for e in json.load(open(f'{vdir}/sfx.json')):
    x = sfx(e['type']); s = int(e['t'] * SR)
    if s >= N: continue
    x = x[:N - s]; fx[s:s + len(x)] += x

# Ducking der Musik unter der Stimme
v = np.zeros(N); v[:len(voice)] = voice
envv = lp(np.abs(v), 6)
duck = 1 - 0.45 * np.clip(envv / (envv.max() * 0.25), 0, 1)
mix = v * 1.0 + music * duck * 0.9 + fx * 0.8
mix = mix / max(1e-6, np.abs(mix).max()) * 0.95
wavfile.write(f'{vdir}/audio/mix.wav', SR, (mix * 32767).astype(np.int16))
print('mix ok', round(dur, 2), 's')
