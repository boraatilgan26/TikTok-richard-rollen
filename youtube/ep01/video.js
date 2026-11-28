// Folge 1 – „Warum zahlen Millionäre weniger Steuern als du?“ (Richard 2.0, 16:9, ~11:20)
// Fakten (Stand 11/2026): Abgeltungsteuer 25 % + Soli = 26,375 %; § 8b KStG: 95 % steuerfrei (5 % × ~30 % ≈ 1,5 %);
// Schenkung/Erbe Kind 400.000 € je Elternteil, alle 10 Jahre (§§ 14, 16 ErbStG), Enkel 200.000 €; StKl. I: 15 % bis 600k, 23 % bis 13 Mio, 27 % bis 26 Mio;
// §§ 13a/13b ErbStG: 85 % (5 J., Lohnsumme 400 %) bzw. 100 % (7 J., 700 %, Verwaltungsvermögen ≤ 20 %); > 26 Mio Abschmelzung/Verschonungsbedarfsprüfung;
// BVerfG mündliche Verhandlung 13.10.2026 (1 BvR 804/22), Urteil offen. Sparerpauschbetrag 1.000 €, Teilfreistellung 30 %, Grundfreibetrag 2026 12.348 €.
import {
  W, H, FLOOR, GOLD, RED, WHITE, GREEN, BLUE, TEAL, GRAY, x, clamp, lerp, easeOut, easeInOut, pop, fade, fadeOut,
  text, measure, pill, stamp, panel, neon, neonCircle, arrow, coin, coinFlow, bar, check, cross, strike, reflect, setup, wi, STATE,
} from '/engine/core.js';
import { actor } from '/engine/characters.js';
import { SETS, building, house, yacht, doc, chartLine, moneyStack, gift, hourglass, factory, calendar, paragraph, etfJar, scales } from '/engine/sets.js';

const base = new URL('.', import.meta.url);
const load = async f => (await fetch(new URL(f, base))).json();
const [words, mouth, chapters] = await Promise.all([load('words.json'), load('mouth.json'), load('chapters.json')]);
STATE.words = words;
const DURATION = words[words.length - 1].e + 1.6;

// ---------- Anker: Wörter in Skript-Reihenfolge ----------
let CUR = 0;
/** Startzeit des nächsten Worts, das mit prefix beginnt (Cursor läuft weiter) */
const w = prefix => { const i = wi(prefix, CUR); CUR = i + 1; return words[i].s; };
const toChapter = ci => { CUR = words.findIndex(q => q.c === ci); };
const CH = chapters;

// ---------- UI-Helfer ----------
function bubble(px, py, str, { width = 520, size = 34, color = WHITE, alpha = 1, scale = 1, tail = 'left' } = {}) {
  if (alpha <= 0.001 || scale <= 0.001) return;
  x.save(); x.font = `800 ${size}px Inter`;
  const wordsArr = str.split(' '), lines = []; let line = '';
  for (const q of wordsArr) { const tst = line ? line + ' ' + q : q; if (x.measureText(tst).width > width - 50 && line) { lines.push(line); line = q; } else line = tst; }
  lines.push(line);
  const bw = Math.min(width, Math.max(...lines.map(l => x.measureText(l).width)) + 56), bh = lines.length * size * 1.3 + 36;
  x.globalAlpha *= alpha; x.translate(px, py); x.scale(scale, scale);
  x.beginPath(); x.roundRect(-bw / 2, -bh, bw, bh, 22);
  const tx = tail === 'left' ? -bw / 2 + 40 : tail === 'right' ? bw / 2 - 40 : 0;
  x.moveTo(tx - 14, 0); x.lineTo(tx + (tail === 'right' ? 20 : -20), 30); x.lineTo(tx + 14, 0);
  x.fillStyle = 'rgba(10,10,14,0.92)'; x.fill(); x.strokeStyle = color; x.lineWidth = 4; x.shadowColor = color; x.shadowBlur = 18; x.stroke();
  x.restore();
  lines.forEach((l, i) => text(l, px, py - bh * scale + (36 / 2 + size * 0.65 + i * size * 1.3) * scale, { size: size * scale, color, glow: 0.1, alpha }));
}
function box(px, py, w_, h_, label, { color = GOLD, sub = '', scale = 1, alpha = 1 } = {}) {
  if (scale <= 0.001) return;
  panel(px, py, w_, h_, { color, scale, alpha });
  const ls = Math.min(38, 38 * (w_ - 36) / measure(label, 38, 900, 2));
  text(label, px, py - (sub ? 16 : 0) * scale, { size: ls * scale, color, weight: 900, glow: 0.3, alpha, spacing: 2 });
  if (sub) text(sub, px, py + 26 * scale, { size: 24 * scale, color: WHITE, weight: 700, glow: 0.05, alpha: alpha * 0.85 });
}
function chapterTag(label) { pill(label, 40 + measure(label, 22, 800, 2.6) / 2 + 24, 52, { size: 22, color: GOLD }); }
function calc(lines, px, py, t, { size = 54, gap = 78, align = 'center' } = {}) {
  lines.forEach((l, i) => { const s = pop(t, l.t); if (s > 0) text(l.s, px, py + i * gap, { size: l.size || size, color: l.c || WHITE, weight: l.weight || 900, glow: 0.35, scale: s, align }); });
}
function bigMerke(t, T, l1, l2) {
  const cx = 840;
  text('MERKE', cx, 250, { size: 34, color: GRAY, spacing: 14, weight: 800, glow: 0, alpha: fade(t, T) });
  text(l1, cx, 370, { size: 70, color: WHITE, weight: 900, glow: 0.25, scale: pop(t, T + 0.25) });
  text(l2.s, cx, 480, { size: 84, color: GOLD, weight: 900, glow: 0.55, scale: pop(t, l2.t) });
}
function card(t, lt, num, title, sub) {
  const k = pop(t, CHC + 0.05, 0.5);
  text(num, W / 2, 330, { size: 40, color: GOLD, spacing: 18, weight: 800, glow: 0.4, alpha: fade(t, CHC) });
  neon([[[W / 2 - 300 * easeOut(lt / 0.6), 385], [W / 2 + 300 * easeOut(lt / 0.6), 385]]], GOLD, 4);
  text(title, W / 2, 470, { size: 104, color: WHITE, weight: 900, glow: 0.3, scale: k });
  if (sub) text(sub, W / 2, 570, { size: 44, color: GOLD, weight: 800, glow: 0.3, alpha: fade(t, CHC + 0.4) });
  // Fortschritt
  for (let i = 0; i < 6; i++) { const on = i <= CHI; x.save(); x.fillStyle = on ? GOLD : 'rgba(255,255,255,0.18)'; if (on) { x.shadowColor = GOLD; x.shadowBlur = 14; } x.beginPath(); x.arc(W / 2 - 125 + i * 50, 680, i === CHI ? 11 : 7, 0, Math.PI * 2); x.fill(); x.restore(); }
}
let CHC = 0, CHI = 0;
const chip = (t, T, s, px, py, color = GOLD, size = 30) => pill(s, px, py, { size, color, scale: pop(t, T) });
const R = (keys, o = {}) => actor('richard', { x: 480, talk: true, keys, ...o });
const sc = [];
const S = (start, def) => sc.push({ start, ...def });
const stageOf = (set, actors, extra, after) => t => { SETS[set](t); extra && extra(t); reflect(() => actors.forEach(a => a.draw(t))); after && after(t); };
const push = (z0 = 1, z1 = 1.06, cx = W / 2, cy = H / 2) => ({ from: { z: z0, cx, cy }, to: { z: z1, cx, cy } });
const close = (cx, cy = 470, z0 = 1.55, z1 = 1.65) => ({ from: { z: z0, cx, cy }, to: { z: z1, cx, cy } });

// =====================================================================
// KAPITEL 0 – INTRO
// =====================================================================
toChapter(0);
{
  const T0 = w('Eine'), Tg = w('Gehaltserhöhung'), Th = w('Hälfte'), Tr = w('Rest');
  const n = actor('nurse', { x: 640, keys: [[0, { expr: 'neutral' }], [Tg, { expr: 'happy', armR: 'up' }], [Th, { expr: 'worried', armR: 'idle' }], [Tr, { expr: 'sad', armL: 'shrug', armR: 'shrug' }]] });
  S(0, {
    cam: push(1, 1.07, 800), stage: stageOf('hospital', [n]),
    sfx: [{ t: 0.05, type: 'bass' }, { t: Tg, type: 'ding' }, { t: Tr, type: 'hit' }],
    ui: t => {
      pill('KRANKENSCHWESTER', 640, 150, { size: 26, color: TEAL, scale: pop(t, 0.3) });
      text('45.000 €', 1380, 300, { size: 110, color: WHITE, weight: 900, glow: 0.3, scale: pop(t, 0.9) });
      text('BRUTTO IM JAHR', 1380, 380, { size: 30, color: GRAY, spacing: 6, weight: 800, glow: 0, alpha: fade(t, 1.1) });
      text('+100 € Gehaltserhöhung', 1380, 500, { size: 46, color: GREEN, weight: 900, glow: 0.3, scale: pop(t, Tg) });
      text('≈ 50 € bleiben', 1380, 590, { size: 64, color: GOLD, weight: 900, glow: 0.4, scale: pop(t, Th) });
      text('≈ 50 € Steuern + Sozialabgaben', 1380, 670, { size: 36, color: RED, weight: 800, glow: 0.3, scale: pop(t, Tr) });
    },
  });
}
{
  const T0 = w('Ich'), Tm = w('Million'), Tf = w('fünfzehntausend'), Te = w('Eins');
  const r = R([[T0, { expr: 'smug', armL: 'hip', armR: 'idle', x: 520 }], [Tm, { armR: 'present', expr: 'happy' }], [Tf, { expr: 'smug', armR: 'idle' }], [Te, { expr: 'wink', armR: 'count' }]], { enter: { t: T0, from: 'left' } });
  S(T0 - 0.15, {
    cam: push(1, 1.08, 760, 520), stage: stageOf('villa', [r]),
    sfx: [{ t: Tm, type: 'coins' }, { t: Te, type: 'hit' }],
    ui: t => {
      text('1.000.000 €', 1330, 300, { size: 120, color: GOLD, weight: 900, glow: 0.6, scale: pop(t, Tm) });
      text('AUS MEINER FIRMA', 1330, 385, { size: 30, color: GRAY, spacing: 6, weight: 800, glow: 0, alpha: fade(t, Tm + 0.3) });
      text('Steuern: 15.000 €', 1330, 520, { size: 56, color: RED, weight: 900, glow: 0.35, scale: pop(t, Tf) });
      stamp('1,5 %', 1330, 680, { size: 96, color: GOLD, scale: pop(t, Te) });
    },
  });
}
{
  const T0 = w('Hallo'), Tr = w('Richard'), Tm = w('Milliardär'), Tb = w('betrüge'), Tl = w('legal'), Tg = w('Gesetz'), To = w('offen'), Tn = w('niemand');
  const r = R([[T0, { expr: 'happy', armR: 'wave', x: 960 }], [Tm, { armR: 'idle', expr: 'smug', armL: 'hip' }], [Tb, { expr: 'serious', armR: 'pointUp', armL: 'idle' }], [Tl, { expr: 'happy', armR: 'present' }], [Tg, { expr: 'neutral', armR: 'count' }], [Tn, { expr: 'wink', armR: 'idle', armL: 'hip' }]]);
  S(T0 - 0.1, {
    cam: { from: { z: 1.45, cx: 960, cy: 520 }, to: { z: 1.25, cx: 960, cy: 540 } }, stage: stageOf('stage', [r]),
    sfx: [{ t: Tl, type: 'ding' }, { t: Tg, type: 'pop' }],
    ui: t => {
      const k = fade(t, Tr); if (k > 0) { panel(420, 820, 520, 120, { color: GOLD, alpha: k }); text('RICHARD', 420, 800, { size: 52, color: GOLD, weight: 900, glow: 0.4, alpha: k, spacing: 6 }); text('Milliardär · Steuer-Profi', 420, 850, { size: 26, color: WHITE, weight: 700, glow: 0, alpha: fade(t, Tm) }); }
      stamp('LEGAL', 1480, 330, { size: 80, color: GOLD, rot: -0.06, scale: pop(t, Tl) });
      if (t > Tg) { doc(1480, 640, 0.9 * pop(t, Tg), '§ GESETZ', GOLD); }
      if (t > To) pill('STEHT ÖFFENTLICH DRIN', 1480, 820, { size: 24, color: WHITE, scale: pop(t, To) });
    },
  });
}
{
  const T0 = w('Das'), Tf = w('Finanzamt'), Tk = w('kennt'), Tc = T0 + 2.6, Tm = w('mag');
  const r = R([[T0, { expr: 'smug', armR: 'wave', armL: 'idle', x: 520 }], [Tk + 0.6, { armR: 'idle', armL: 'hip' }], [Tm, { expr: 'laugh' }], [Tm + 0.8, { expr: 'smug' }]]);
  const f = actor('finanzamt', { x: 1400, keys: [[T0, { expr: 'serious', armL: 'hold', look: -0.6 }], [Tm, { expr: 'angry', armR: 'cross', armL: 'cross' }]], prop: null });
  S(T0 - 0.1, { cam: push(1, 1.06), stage: stageOf('finanzamt', [r, f]), sfx: [{ t: Tm, type: 'knock' }], ui: t => { bubble(1400, 260, 'Richard. Schon wieder.', { tail: 'center', color: RED, scale: pop(t, Tk + 0.4), width: 460 }); } });
}
{
  const T0 = w('Heute'), Tv = w('vier'), Tb = w('Bundesverfassungsgericht'), Te = w('Ende'), Tm = w('Milliarde');
  const labels = [['1', 'HOLDING'], ['2', 'LEIHEN'], ['3', 'VERSCHENKEN'], ['4', 'FIRMA ERBEN']];
  const r = R([[T0, { expr: 'happy', armR: 'present', x: 260 }], [Tb, { expr: 'serious', armR: 'point' }], [Te, { expr: 'happy', armR: 'present' }], [Tm, { expr: 'wink' }]], { s: 0.8 });
  S(T0 - 0.1, {
    cam: push(1, 1.03), stage: stageOf('stage', [r]),
    sfx: [0, 1, 2, 3].map(i => ({ t: Tv + 0.35 + i * 0.3, type: 'pop' })).concat([{ t: Tb, type: 'hit' }, { t: Te, type: 'ding' }]),
    ui: t => {
      text('4 TRICKS DER REICHEN', 1130, 170, { size: 60, color: GOLD, weight: 900, glow: 0.5, scale: pop(t, Tv), spacing: 4 });
      labels.forEach(([nm, l], i) => { const px = 640 + i * 330, s = pop(t, Tv + 0.35 + i * 0.3); box(px, 430, 300, 200, l, { sub: 'TRICK ' + nm, scale: s, color: i === 3 && t > Tb ? RED : GOLD }); });
      if (t > Tb) { pill('⚖ VOR GERICHT', 1580, 580, { size: 24, color: RED, scale: pop(t, Tb) }); }
      box(1130, 700, 520, 110, '+ WAS DU NUTZEN KANNST', { color: GREEN, scale: pop(t, Te) });
    },
  });
}
{
  const T0 = w('Kurzer'), Tu = w('Unterhaltung'), Tk = w('keine'), Tp = w('Profi');
  const r = R([[T0, { expr: 'serious', armR: 'pointUp', x: 460 }], [Tp, { expr: 'happy', armR: 'idle' }]]);
  S(T0 - 0.1, { cam: push(1.02, 1.06), stage: stageOf('stage', [r], null, null), cut: 'soft', ui: t => { panel(1240, 450, 900, 330, { color: WHITE, scale: pop(t, T0 + 0.1) }); text('HINWEIS', 1240, 345, { size: 34, color: GRAY, spacing: 12, glow: 0, alpha: fade(t, T0 + 0.2) }); text('Unterhaltung & Bildung', 1240, 430, { size: 54, weight: 900, glow: 0.2, alpha: fade(t, Tu) }); text('KEINE STEUERBERATUNG', 1240, 520, { size: 52, color: GOLD, weight: 900, glow: 0.4, scale: pop(t, Tk) }); } });
}
{
  const T0 = w('Fangen'), Tu = w('Unternehmer');
  const r = R([[T0, { expr: 'happy', armR: 'point', x: 760 }], [Tu, { expr: 'smug' }]]);
  S(T0 - 0.1, { cam: close(800, 470, 1.4, 1.6), stage: stageOf('office', [r]), ui: t => {} });
}

// =====================================================================
// KAPITEL 1 – HOLDING
// =====================================================================
function chapterCardScene(ci, num, title, sub, iconFn) {
  const c = CH[ci]; toChapter(ci);
  S(c.card, { noCaption: false, cut: 'none', sfx: [{ t: c.card + 0.05, type: 'rise' }, { t: c.card + 0.5, type: 'hit' }], stage: t => { SETS.stage(t, { a: 0.24 }); iconFn && iconFn(t); }, ui: (t, lt) => { CHC = c.card; CHI = ci; card(t, lt, num, title, sub); } });
}
chapterCardScene(1, 'TRICK #1', 'DIE HOLDING', '95 % steuerfrei', t => { x.save(); x.globalAlpha = 0.25; building(1650, 800, 160, 340); building(270, 800, 120, 240); x.restore(); });
{
  w('Holding');
  const T0 = w('Ich'), Tm = w('Million'), Ts = w('Steuern'), Tk = w('Körperschaftsteuer'), Tg = w('Gewerbesteuer'), Td = w('dreißig'), Tdr = w('drumherum');
  const r = R([[T0, { expr: 'happy', armR: 'present', x: 380 }], [Tk, { expr: 'neutral', armR: 'idle' }], [Tdr, { expr: 'worried', armL: 'shrug', armR: 'shrug' }]]);
  const f = actor('finanzamt', { x: 1650, keys: [[Ts, { expr: 'happy', armL: 'give', look: -0.5 }]], enter: { t: Ts, from: 'right' } });
  S(T0 - 0.1, {
    cam: push(1, 1.05), stage: stageOf('office', [r, f], t => factory(1000, FLOOR, 1.1, GOLD, t), t => { if (t > Tk) coinFlow(t, 1080, 520, 1600, 420, { t0: Tk, h: 120, n: 6, speed: 0.7 }); }),
    sfx: [{ t: Tm, type: 'coins' }, { t: Ts, type: 'whoosh' }, { t: Td, type: 'hit' }],
    ui: t => {
      chapterTag('TRICK 1 · HOLDING');
      pill('MEINE FIRMA', 1000, 330, { size: 28, scale: pop(t, T0 + 0.6) });
      text('1.000.000 € Gewinn', 1000, 180, { size: 66, color: GOLD, weight: 900, glow: 0.5, scale: pop(t, Tm) });
      text('nach Steuern', 1000, 245, { size: 30, color: GRAY, weight: 800, glow: 0, alpha: fade(t, Ts) });
      chip(t, Tk, 'KÖRPERSCHAFTSTEUER', 1500, 160, RED, 24); chip(t, Tg, 'GEWERBESTEUER', 1500, 225, RED, 24);
      text('≈ 30 %', 1500, 310, { size: 72, color: RED, weight: 900, glow: 0.4, scale: pop(t, Td) });
    },
  });
}
{
  const T0 = w('Aber'), Tw = w('Wie'), Tmi = w('Million');
  const r = R([[T0, { expr: 'thinking', armR: 'chin', x: 960, look: 0.3 }], [Tw, { look: -0.3 }], [Tmi, { expr: 'smug', armR: 'idle', armL: 'hip' }]]);
  S(T0 - 0.1, { cam: close(960, 470, 1.35, 1.5), stage: stageOf('stage', [r]), ui: t => { text('?', 1450, 380, { size: 260, color: GOLD, weight: 900, glow: 0.6, scale: pop(t, Tw) }); text('Wie kommt die Million zu mir?', W / 2, 140, { size: 52, weight: 900, glow: 0.2, scale: pop(t, Tw + 0.2) }); } });
}
{
  const T0 = w('Weg'), Tp = w('Privatkonto'), Ta = w('Ausschüttung'), Tab = w('Abgeltungsteuer'), Ts = w('sechsundzwanzig'), Tz = w('zweihundertdreiundsechzigtausend'), Tweg = w('Weg');
  const r = R([[T0, { expr: 'happy', armL: 'up', x: 1560 }], [Tab, { expr: 'worried', armL: 'idle' }], [Tweg, { expr: 'shock', armL: 'up', armR: 'up' }]]);
  const f = actor('finanzamt', { x: 960, keys: [[Tab, { expr: 'happy', armR: 'up', armL: 'give' }]], enter: { t: Tab, from: 'pop' } });
  S(T0 - 0.1, {
    cam: push(1, 1.04), stage: stageOf('stage', [r, f], t => factory(380, FLOOR, 1, GOLD, t), t => { if (t > Ta) coinFlow(t, 480, 520, Tab < t ? 960 : 1500, Tab < t ? 300 : 420, { t0: Ta, h: 120, n: 8 }); }),
    sfx: [{ t: Ta, type: 'coins' }, { t: Tab, type: 'knock' }, { t: Tz, type: 'hit' }, { t: Tweg, type: 'bass' }],
    ui: t => {
      chapterTag('TRICK 1 · HOLDING');
      text('WEG 1: DIREKT AUSZAHLEN', W / 2, 120, { size: 52, color: WHITE, weight: 900, glow: 0.2, scale: pop(t, T0) });
      chip(t, Tp, 'PRIVATKONTO', 1560, 250, WHITE, 26); chip(t, Ta, 'AUSSCHÜTTUNG', 960, 205, GOLD, 26);
      text('Abgeltungsteuer + Soli = 26,4 %', W / 2, 300, { size: 46, color: RED, weight: 900, glow: 0.35, scale: pop(t, Ts) });
      text('−263.750 €', 960, 420, { size: 100, color: RED, weight: 900, glow: 0.55, scale: pop(t, Tz) });
      stamp('WEG.', 1250, 560, { size: 80, color: RED, scale: pop(t, Tweg) });
    },
  });
}
{
  const T0 = w('Weg'), Tz = w('Zwischen'), Th = w('Holding'), Tg = w('gehört'), Tu = w('Und');
  const r = R([[T0, { expr: 'smug', armR: 'pointUp', x: 380 }], [Tz, { armR: 'point' }], [Tu, { expr: 'wink', armR: 'idle', armL: 'hip' }]]);
  S(T0 - 0.1, {
    cam: push(1, 1.03), stage: stageOf('stage', [r]),
    sfx: [{ t: T0, type: 'ding' }, { t: Th, type: 'pop' }, { t: Tg, type: 'pop' }, { t: Tu, type: 'pop' }],
    ui: t => {
      chapterTag('TRICK 1 · HOLDING');
      text('WEG 2: MEIN WEG', 1150, 110, { size: 52, color: GOLD, weight: 900, glow: 0.4, scale: pop(t, T0) });
      box(1150, 250, 380, 110, 'RICHARD', { color: WHITE, sub: 'privat', scale: pop(t, Tz) });
      box(1150, 520, 420, 130, 'HOLDING GMBH', { color: GOLD, sub: 'Zwischenfirma', scale: pop(t, Th) });
      box(1150, 790, 380, 110, 'MEINE FIRMA', { color: WHITE, sub: 'macht den Gewinn', scale: pop(t, Tz + 0.4) });
      arrow(1150, 310, 1150, 450, { p: easeOut((t - Tg) / 0.4), color: GOLD }); if (t > Tg) pill('100 %', 1260, 380, { size: 22, color: GOLD, scale: pop(t, Tg) });
      arrow(1150, 590, 1150, 730, { p: easeOut((t - Tu) / 0.4), color: GOLD }); if (t > Tu) pill('100 %', 1260, 660, { size: 22, color: GOLD, scale: pop(t, Tu) });
    },
  });
}
{
  const T0 = w('Jetzt'), Tp = w('Paragraf'), T95 = w('Fünfundneunzig'), Tv = w('Versteuert'), T50 = w('Fünfzigtausend'), Td = w('Darauf'), T15 = w('fünfzehntausend');
  S(T0 - 0.1, {
    cam: push(1, 1.04), stage: t => { SETS.office(t); x.save(); x.globalAlpha = 0.9; building(420, FLOOR, 200, 330, GOLD, 7, 3); x.restore(); },
    sfx: [{ t: T0, type: 'coins' }, { t: Tp, type: 'magic' }, { t: T95, type: 'ding' }, { t: T15, type: 'hit' }],
    ui: t => {
      chapterTag('TRICK 1 · HOLDING');
      pill('HOLDING', 470, 400, { size: 26, color: GOLD, scale: pop(t, T0) });
      coinFlow(t, 1900, 300, 520, 430, { t0: T0, h: 100, n: 10, speed: 0.6 });
      panel(1220, 230, 760, 140, { color: GOLD, scale: pop(t, Tp) }); text('§ 8b KStG', 1220, 230, { size: 70, color: GOLD, weight: 900, glow: 0.5, scale: pop(t, Tp) });
      // 95/5-Balken
      const p = easeOut((t - T95) / 0.7);
      if (t > T95) { x.save(); x.beginPath(); x.roundRect(860, 360, 720 * p, 90, 18); x.fillStyle = 'rgba(245,200,75,0.35)'; x.fill(); x.strokeStyle = GOLD; x.lineWidth = 4; x.stroke(); x.restore(); text('95 % STEUERFREI', 860 + 360 * p, 405, { size: 40, color: GOLD, weight: 900, glow: 0.3, alpha: p }); }
      if (t > Tv) { x.save(); x.beginPath(); x.roundRect(1590, 360, 40, 90, 10); x.fillStyle = 'rgba(255,90,90,0.5)'; x.fill(); x.restore(); text('5 %', 1610, 490, { size: 34, color: RED, weight: 900, glow: 0.3, scale: pop(t, Tv) }); }
      calc([{ t: T50, s: '5 % von 1 Mio. = 50.000 €', c: WHITE }, { t: Td, s: '× ≈ 30 % Steuer', c: RED }, { t: T15, s: '≈ 15.000 €', c: GOLD, size: 96 }], 1220, 590, t, { size: 50, gap: 90 });
    },
  });
}
{
  const T0 = w('Zweihundertdreiundsechzigtausend'), Tg = w('gegen'), Td = w('dieselbe');
  const r = R([[T0, { expr: 'happy', armR: 'point', x: 330 }], [Td, { expr: 'laugh', armR: 'up', armL: 'up' }]]);
  S(T0 - 0.1, {
    cam: push(1, 1.05, 1000), stage: stageOf('stage', [r], null), sfx: [{ t: Tg, type: 'pop' }, { t: Td, type: 'hit' }],
    ui: t => {
      chapterTag('TRICK 1 · HOLDING');
      text('1 MIO. € GEWINN', 1150, 120, { size: 56, weight: 900, glow: 0.3 });
      bar(930, 760, 220, 480, RED, 'PRIVAT', '263.750 €', { p: (t - T0) / 0.6 });
      bar(1370, 760, 220, 27, GOLD, 'HOLDING', '≈ 15.000 €', { p: (t - Tg) / 0.6, alpha: fade(t, Tg) });
      stamp('−94 %', 1370, 520, { color: GOLD, scale: pop(t, Td) });
    },
  });
}
{
  const T0 = w('Jetzt'), Tm = w('Moment'), Td = w('Dann'), Tr = w('Richtig'), Tg = w('genau');
  const v = actor('normal', { x: 1420, keys: [[T0, { expr: 'thinking', armR: 'pointUp', look: -0.6 }], [Td, { expr: 'worried', armR: 'shrug', armL: 'shrug' }], [Tr, { expr: 'shock', armR: 'idle', armL: 'idle' }]] });
  const r = R([[T0, { expr: 'smug', armL: 'hip', x: 520, look: 0.6 }], [Tr, { expr: 'happy', armR: 'pointUp' }], [Tg, { expr: 'wink', armR: 'point' }]]);
  S(T0 - 0.1, { cam: push(1, 1.05), stage: stageOf('stage', [r, v]), cut: 'soft', ui: t => { chapterTag('TRICK 1 · HOLDING'); bubble(1420, 300, t < Td ? 'Moment, Richard!' : 'Dann liegt das Geld ja in der Holding – nicht bei dir!', { tail: 'center', scale: pop(t, Tm), width: 600 }); if (t > Tr) bubble(560, 300, 'Richtig. Genau das ist der Punkt.', { tail: 'center', color: GOLD, scale: pop(t, Tr), width: 520 }); } });
}
{
  const T0 = w('Ich'), Th = w('Holding'), Ta = w('Aktien'), Ti = w('Immobilien'), Tf = w('Firmen'), Tar = w('arbeitet');
  const r = R([[T0, { expr: 'neutral', armR: 'idle', armL: 'idle', x: 300 }], [Th, { expr: 'happy', armR: 'present' }], [Tar, { expr: 'smug', armR: 'idle', armL: 'hip' }]], { s: 0.85 });
  S(T0 - 0.1, {
    cam: push(1, 1.05), stage: stageOf('office', [r], t => { building(960, FLOOR, 180, 300, GOLD, 6, 3); }),
    sfx: [{ t: Ta, type: 'pop' }, { t: Ti, type: 'pop' }, { t: Tf, type: 'pop' }, { t: Tar, type: 'coins' }],
    ui: t => {
      chapterTag('TRICK 1 · HOLDING'); pill('HOLDING', 960, 470, { size: 24, color: GOLD, scale: pop(t, Th) });
      const items = [[Ta, 1440, 250, 'AKTIEN'], [Ti, 1560, 520, 'IMMOBILIEN'], [Tf, 1440, 780, 'NEUE FIRMEN']];
      items.forEach(([T, px, py, l]) => { if (t < T) return; arrow(1080, 560, px - 150, py, { p: easeOut((t - T) / 0.4), color: GOLD, dash: true }); box(px, py, 260, 110, l, { scale: pop(t, T + 0.2) }); });
      if (t > Tar) text('arbeitet weiter – fast ungekürzt', 960, 140, { size: 50, color: GOLD, weight: 900, glow: 0.4, scale: pop(t, Tar) });
    },
  });
}
{
  const T0 = w('Erst'), Tpr = w('privat'), Tb = w('besteuert'), Ts = w('schiebe'), Tj = w('Jahrzehnte');
  const r = R([[T0, { expr: 'neutral', armR: 'present', x: 380 }], [Ts, { expr: 'smug', armR: 'idle', armL: 'hip' }], [Tj, { expr: 'wink' }]]);
  S(T0 - 0.1, {
    cam: push(1, 1.04), stage: stageOf('stage', [r], t => hourglass(1500, 420, 1.3, GOLD, clamp((t - Ts) / 6))),
    sfx: [{ t: Tb, type: 'knock' }, { t: Tj, type: 'ding' }],
    ui: t => {
      chapterTag('TRICK 1 · HOLDING');
      text('Steuer erst beim Rausnehmen', 1000, 150, { size: 54, weight: 900, glow: 0.2, scale: pop(t, Tpr) });
      if (t > Ts) { const yr = Math.round(lerp(2026, 2056, clamp((t - Ts) / Math.max(1, Tj - Ts + 1.2)))); text(String(yr), 1000, 420, { size: 150, color: GOLD, weight: 900, glow: 0.6, scale: pop(t, Ts) }); }
      if (t > Tj) pill('JAHRZEHNTE SPÄTER', 1000, 560, { size: 30, color: GOLD, scale: pop(t, Tj) });
    },
  });
}
{
  const T0 = w('Warum'), Td = w('doppelt'), Tdr = w('dreifach'), Tf = w('Firma'), Tv = w('vernünftig'), Tn = w('nutzen');
  const r = R([[T0, { expr: 'thinking', armR: 'chin', x: 300 }], [Tv, { expr: 'neutral', armR: 'present' }], [Tn, { expr: 'smug', armR: 'idle', armL: 'hip' }]], { s: 0.85 });
  S(T0 - 0.1, {
    cam: push(1, 1.04), stage: stageOf('stage', [r]),
    sfx: [{ t: Td, type: 'pop' }, { t: Tdr, type: 'pop' }, { t: Tv, type: 'ding' }],
    ui: t => {
      chapterTag('TRICK 1 · HOLDING');
      text('Warum gibt es diese Regel?', 1100, 130, { size: 56, weight: 900, glow: 0.2, scale: pop(t, T0) });
      [700, 1100, 1500].forEach((px, i) => { box(px, 400, 280, 110, 'FIRMA ' + 'ABC'[i], { scale: pop(t, T0 + 0.3 + i * 0.2), color: WHITE }); if (i < 2) arrow(px + 150, 400, px + 250, 400, { p: easeOut((t - Tf) / 0.4) }); });
      if (t > Td) text('Steuer?', 900, 530, { size: 40, color: RED, weight: 900, scale: pop(t, Td) });
      if (t > Tdr) text('Steuer??', 1300, 530, { size: 40, color: RED, weight: 900, scale: pop(t, Tdr) });
      if (t > Tv) { cross(900, 530, 70, (t - Tv) / 0.4); cross(1300, 530, 70, (t - Tv - 0.2) / 0.4); text('Nur einmal besteuern ✓', 1100, 680, { size: 50, color: GREEN, weight: 900, glow: 0.3, scale: pop(t, Tv) }); }
      if (t > Tn) text('Profitieren tun vor allem die Reichen', 1100, 800, { size: 44, color: GOLD, weight: 900, glow: 0.3, scale: pop(t, Tn) });
    },
  });
}
{
  const T0 = w('Und'), Tk = w('keine'), Tg = w('Gehalt'), Tv = w('versteuert'), Ts = w('sieht');
  const n = actor('nurse', { x: 620, keys: [[T0, { expr: 'neutral' }], [Tk, { expr: 'worried', armL: 'shrug', armR: 'shrug' }], [Tv, { expr: 'sad', armL: 'idle', armR: 'hold' }]] });
  S(T0 - 0.1, {
    cam: push(1, 1.05, 900), stage: stageOf('hospital', [n]), sfx: [{ t: Tv, type: 'knock' }],
    ui: t => {
      chapterTag('TRICK 1 · HOLDING');
      text('Holding?', 1350, 220, { size: 70, color: WHITE, weight: 900, glow: 0.2, scale: pop(t, Tk) }); cross(1350, 220, 120, (t - Tk - 0.2) / 0.4);
      if (t > Tg) doc(1350, 560, pop(t, Tg), 'LOHNZETTEL', WHITE);
      stamp('LOHNSTEUER', 1350, 600, { size: 48, color: RED, scale: pop(t, Tv) });
      text('…bevor sie es sieht.', 1350, 790, { size: 40, color: GRAY, weight: 800, glow: 0, alpha: fade(t, Ts) });
    },
  });
}
{
  const T0 = w('Merke'), Tr = w('Reiche'), Ts = w('Sie');
  const r = R([[T0, { expr: 'serious', armR: 'pointUp', x: 1720 }], [Ts, { expr: 'smug', armR: 'idle', armL: 'hip' }]], { s: 0.75 });
  S(T0 - 0.1, { cam: push(1, 1.03), stage: stageOf('stage', [r]), sfx: [{ t: T0, type: 'bass' }, { t: Ts, type: 'ding' }], ui: t => bigMerke(t, T0, 'Reiche nehmen ihr Geld nicht raus.', { s: 'Sie lassen es arbeiten.', t: Ts }) });
}
{
  const T0 = w('Aber'), Tb = w('brauche'), Tv = w('Villa'), Tj = w('Jacht'), Td = w('Dafür');
  const r = R([[T0, { expr: 'thinking', armR: 'chin', x: 420 }], [Tv, { expr: 'happy', armR: 'present' }], [Td, { expr: 'smug', armR: 'pointUp' }]]);
  S(T0 - 0.1, { cam: push(1, 1.06, 900), stage: stageOf('villa', [r], null, t => { if (t > Tj) yacht(1200, FLOOR + 70, 0.55 * pop(t, Tj), WHITE, t); }), sfx: [{ t: Tv, type: 'pop' }, { t: Tj, type: 'pop' }, { t: Td, type: 'rise' }], ui: t => { chapterTag('TRICK 1 · HOLDING'); chip(t, Tv, 'VILLA?', 1150, 160, GOLD, 34); chip(t, Tj, 'JACHT?', 1450, 160, GOLD, 34); } });
}

// =====================================================================
// KAPITEL 2 – LEIHEN STATT VERKAUFEN
// =====================================================================
chapterCardScene(2, 'TRICK #2', 'LEIHEN STATT VERKAUFEN', 'Der Lombardkredit', t => { x.save(); x.globalAlpha = 0.25; chartLine(200, 760, 300, 260, [0.1, 0.3, 0.25, 0.6, 0.9], GOLD); x.restore(); });
{
  w('verkaufen');
  const T0 = w('Ich'), Tv = w('Viele'), Tg = w('Gekauft'), Th = w('Heute');
  const r = R([[T0, { expr: 'smug', armR: 'present', x: 330 }], [Th, { expr: 'happy', armR: 'up' }]], { s: 0.9 });
  const pts = [0.08, 0.15, 0.12, 0.25, 0.3, 0.28, 0.45, 0.52, 0.5, 0.7, 0.82, 0.95];
  S(T0 - 0.1, {
    cam: push(1, 1.05), stage: stageOf('office', [r]), sfx: [{ t: Tg, type: 'pop' }, { t: Th, type: 'ding' }],
    ui: t => {
      chapterTag('TRICK 2 · LEIHEN');
      panel(1180, 480, 1000, 620, { color: GOLD, alpha: fade(t, T0) });
      text('MEIN DEPOT', 1180, 220, { size: 40, color: GOLD, weight: 900, spacing: 6, alpha: fade(t, T0) });
      const end = chartLine(760, 720, 840, 420, pts, GOLD, clamp((t - Tg) / Math.max(0.5, Th - Tg + 0.3)));
      if (t > Tg) text('2 Mio. €', 820, 650, { size: 40, color: WHITE, weight: 900, glow: 0.2, scale: pop(t, Tg) });
      if (t > Th) text('10 Mio. €', 1500, 260, { size: 64, color: GOLD, weight: 900, glow: 0.5, scale: pop(t, Th) });
    },
  });
}
{
  const T0 = w('Jetzt'), Tf = w('Ferienhaus'), Tm = w('Million');
  const r = R([[T0, { expr: 'happy', armR: 'point', x: 520 }], [Tm, { expr: 'smug' }]]);
  S(T0 - 0.1, { cam: push(1, 1.06, 1000), stage: stageOf('stage', [r], t => house(1300, FLOOR, 1.6 * pop(t, Tf))), sfx: [{ t: Tf, type: 'pop' }, { t: Tm, type: 'coins' }], ui: t => { chapterTag('TRICK 2 · LEIHEN'); pill('FERIENHAUS', 1300, 330, { size: 30, color: GOLD, scale: pop(t, Tf) }); text('1.000.000 €', 1300, 200, { size: 80, color: GOLD, weight: 900, glow: 0.5, scale: pop(t, Tm) }); } });
}
{
  const T0 = w('Der'), Tve = w('verkaufe'), Ta = w('achtzig'), T8 = w('Achthunderttausend'), Tf = w('Finanzamt'), Ts = w('sechsundzwanzig'), T211 = w('zweihundertelftausend'), Te = w('eigenes');
  const r = R([[T0, { expr: 'neutral', armR: 'present', x: 330 }], [Tf, { expr: 'worried', armR: 'idle' }], [Te, { expr: 'angry', armR: 'fist' }]], { s: 0.85 });
  const f = actor('finanzamt', { x: 1700, s: 0.85, keys: [[Tf, { expr: 'happy', armL: 'give', look: -0.6 }]], enter: { t: Tf, from: 'right' } });
  S(T0 - 0.1, {
    cam: push(1, 1.04), stage: stageOf('stage', [r, f]),
    sfx: [{ t: Tve, type: 'swipe' }, { t: Ta, type: 'pop' }, { t: Tf, type: 'knock' }, { t: T211, type: 'hit' }],
    ui: t => {
      chapterTag('TRICK 2 · LEIHEN');
      text('DER NORMALE WEG: VERKAUFEN', 1000, 120, { size: 50, weight: 900, glow: 0.2, scale: pop(t, T0) });
      // 1 Mio = 200k Einsatz + 800k Gewinn
      const k = easeOut((t - Tve) / 0.6);
      if (t > Tve) { x.save(); x.beginPath(); x.roundRect(560, 260, 180 * k, 110, 16); x.fillStyle = 'rgba(200,200,210,0.25)'; x.fill(); x.strokeStyle = 'rgba(220,220,230,0.8)'; x.lineWidth = 3; x.stroke(); x.restore(); text('200.000 € Einsatz', 650, 410, { size: 28, color: GRAY, weight: 800, glow: 0, alpha: k }); }
      const k2 = easeOut((t - Ta) / 0.6);
      if (t > Ta) { x.save(); x.beginPath(); x.roundRect(750, 260, 720 * k2, 110, 16); x.fillStyle = 'rgba(245,200,75,0.3)'; x.fill(); x.strokeStyle = GOLD; x.lineWidth = 4; x.shadowColor = GOLD; x.shadowBlur = 18; x.stroke(); x.restore(); text('800.000 € GEWINN', 1110, 315, { size: 44, color: GOLD, weight: 900, glow: 0.3, alpha: k2 }); }
      calc([{ t: Ts, s: '800.000 € × 26,4 %', c: WHITE }, { t: T211, s: '≈ 211.000 € Steuern', c: RED, size: 76 }], 1000, 560, t, { gap: 110 });
      if (t > Te) text('…nur für mein eigenes Geld!', 1000, 800, { size: 40, color: GRAY, weight: 800, glow: 0, alpha: fade(t, Te) });
    },
  });
}
{
  const T0 = w('Also'), Tb = w('Bank'), Tl = w('Leih'), Ts = w('Sicherheit'), Tlo = w('Lombardkredit');
  const r = R([[T0, { expr: 'smug', armL: 'hip', x: 520, look: 0.6 }], [Tl, { expr: 'happy', armR: 'present' }], [Ts, { armR: 'give' }], [Tlo, { expr: 'wink', armR: 'idle' }]]);
  const b = actor('banker', { x: 1420, keys: [[T0, { expr: 'neutral', armL: 'idle', look: -0.6 }], [Ts, { expr: 'happy', armL: 'give' }]], enter: { t: Tb, from: 'right' } });
  S(T0 - 0.1, {
    cam: push(1, 1.05), stage: stageOf('bank', [r, b]), sfx: [{ t: Tl, type: 'pop' }, { t: Ts, type: 'swipe' }, { t: Tlo, type: 'ding' }],
    ui: t => {
      chapterTag('TRICK 2 · LEIHEN');
      if (t > Tl) bubble(560, 300, 'Leih mir eine Million.', { tail: 'center', color: GOLD, scale: pop(t, Tl), width: 480 });
      if (t > Ts) { const k = easeInOut((t - Ts) / 1.2); doc(lerp(700, 1220, k), 520, 0.55, 'DEPOT', GOLD); pill('SICHERHEIT', lerp(700, 1220, k), 640, { size: 20, color: GOLD }); }
      text('LOMBARDKREDIT', W / 2, 130, { size: 72, color: BLUE, weight: 900, glow: 0.5, scale: pop(t, Tlo), spacing: 6 });
    },
  });
}
{
  const T0 = w('Die'), Tf = w('freut'), Tbe = w('bekomme'), Tk = w('Kredit'), Ta = w('Auf'), Tn = w('Null');
  const r = R([[T0, { expr: 'smug', armL: 'hip', x: 520 }], [Tbe, { expr: 'happy', armR: 'up' }], [Tk, { expr: 'neutral', armR: 'pointUp' }], [Tn, { expr: 'laugh', armR: 'up', armL: 'up' }]]);
  const b = actor('banker', { x: 1420, keys: [[T0, { expr: 'happy', armL: 'present', look: -0.6 }], [Tbe, { armL: 'give' }]] });
  S(T0 - 0.1, {
    cam: push(1, 1.05), stage: stageOf('bank', [r, b], null, t => { if (t > Tbe) coinFlow(t, 1300, 470, 640, 470, { t0: Tbe, n: 10, h: 140, speed: 0.7 }); }),
    sfx: [{ t: Tbe, type: 'coins' }, { t: Tk, type: 'pop' }, { t: Tn, type: 'hit' }],
    ui: t => {
      chapterTag('TRICK 2 · LEIHEN');
      if (t > Tf && t < Tk) bubble(1420, 300, 'Sehr gerne, Herr Richard!', { tail: 'center', color: BLUE, scale: pop(t, Tf), width: 460 });
      if (t > Tk) { panel(960, 220, 860, 130, { color: WHITE, scale: pop(t, Tk) }); text('KREDIT ≠ EINKOMMEN', 960, 220, { size: 60, weight: 900, glow: 0.3, scale: pop(t, Tk) }); }
      stamp('0 € STEUERN', 960, 420, { size: 80, color: GOLD, scale: pop(t, Tn) });
    },
  });
}
{
  const T0 = w('Meine'), Tw = w('wachsen'), Ts = w('Steuern'), Tv = w('Vielleicht'), Tz = w('zehn'), Tvn = w('Vielleicht'), Tnie = w('nie');
  const r = R([[T0, { expr: 'smug', armL: 'hip', x: 320 }], [Tvn, { expr: 'wink', armR: 'pointUp' }]], { s: 0.85 });
  S(T0 - 0.1, {
    cam: push(1, 1.04), stage: stageOf('office', [r]), sfx: [{ t: Tz, type: 'pop' }, { t: Tnie, type: 'hit' }],
    ui: t => {
      chapterTag('TRICK 2 · LEIHEN');
      panel(1180, 470, 1000, 560, { color: GOLD, alpha: 1 });
      chartLine(760, 680, 840, 380, [0.2, 0.3, 0.28, 0.42, 0.5, 0.48, 0.62, 0.7, 0.75, 0.88, 0.95], GOLD, clamp((t - Tw + 0.5) / 4));
      text('Depot wächst weiter', 1180, 250, { size: 42, color: GOLD, weight: 900, glow: 0.3, alpha: fade(t, Tw) });
      if (t > Ts) pill('STEUER ERST BEIM VERKAUF', 1180, 790, { size: 26, color: WHITE, scale: pop(t, Ts) });
      if (t > Tz) calendar(1540, 470, pop(t, Tz) * 0.8, '+10 J.');
      stamp('NIE?', 1540, 640, { size: 70, color: GOLD, scale: pop(t, Tnie) });
    },
  });
}
{
  const T0 = w('Kostet'), Tz = w('Zinsen'), Tv = w('vier'), T40 = w('vierzigtausend'), Ts = w('sieben'), T700 = w('siebenhunderttausend'), Tp = w('Portokasse');
  const r = R([[T0, { expr: 'thinking', armR: 'chin', x: 330 }], [Tz, { expr: 'neutral', armR: 'present' }], [Tp, { expr: 'laugh', armR: 'idle', armL: 'hip' }]], { s: 0.9 });
  S(T0 - 0.1, {
    cam: push(1, 1.04, 1000), stage: stageOf('stage', [r]), sfx: [{ t: T40, type: 'pop' }, { t: T700, type: 'coins' }, { t: Tp, type: 'ding' }],
    ui: t => {
      chapterTag('TRICK 2 · LEIHEN');
      text('Kostet das nichts?', 1150, 120, { size: 52, weight: 900, glow: 0.2, scale: pop(t, T0) });
      bar(930, 780, 240, 22, RED, 'ZINSEN (4 %)', '40.000 €', { p: (t - T40) / 0.5, alpha: fade(t, Tv) });
      bar(1380, 780, 240, 420, GOLD, 'DEPOT +7 % / JAHR', '700.000 €', { p: (t - T700) / 0.8, alpha: fade(t, Ts) });
      if (t > Tp) pill('PORTOKASSE', 930, 620, { size: 28, color: GOLD, scale: pop(t, Tp) });
    },
  });
}
{
  const T0 = w('In'), Tb = w('Buy'), Tbo = w('Borrow'), Td = w('Die'), Tk = w('Kaufen'), Tv = w('Viele');
  const r = R([[T0, { expr: 'happy', armR: 'present', x: 1640 }], [Tv, { expr: 'smug', armR: 'idle', armL: 'hip' }]], { s: 0.75 });
  S(T0 - 0.1, {
    cam: push(1, 1.04), stage: stageOf('stage', [r], null), sfx: [{ t: Tb, type: 'hit' }, { t: Tbo, type: 'hit' }, { t: Td, type: 'hit' }],
    ui: t => {
      chapterTag('TRICK 2 · LEIHEN');
      text('IN AMERIKA HEISST DAS:', 800, 160, { size: 36, color: GRAY, spacing: 4, weight: 800, glow: 0, alpha: fade(t, T0) });
      [['BUY', Tb, 'kaufen'], ['BORROW', Tbo, 'leihen'], ['DIE', Td, 'sterben']].forEach(([s, T, de], i) => { text(s, 380 + i * 420, 400, { size: 120, color: i === 1 ? GOLD : WHITE, weight: 900, glow: 0.5, scale: pop(t, T) }); text(de, 380 + i * 420, 500, { size: 38, color: GRAY, weight: 800, glow: 0, alpha: fade(t, Tk + i * 0.3) }); });
      if (t > Tv) text('Kredite auf Aktien statt verkaufen', 800, 680, { size: 46, color: GOLD, weight: 900, glow: 0.3, scale: pop(t, Tv) });
    },
  });
}
{
  const T0 = w('Aber'), Tr = w('Risiko'), Tf = w('Fällt'), Tb = w('Bank'), Tw = w('Wer'), Td = w('Deshalb');
  const r = R([[T0, { expr: 'serious', armR: 'pointUp', x: 320 }], [Tf, { expr: 'worried', armR: 'idle', armL: 'shrug' }], [Td, { expr: 'neutral', armR: 'present', armL: 'idle' }]], { s: 0.85 });
  S(T0 - 0.1, {
    cam: push(1, 1.04), stage: stageOf('stage', [r], null), sfx: [{ t: Tr, type: 'knock' }, { t: Tf, type: 'bass' }, { t: Td, type: 'ding' }],
    ui: t => {
      chapterTag('TRICK 2 · LEIHEN');
      stamp('RISIKO', 1200, 150, { size: 64, color: RED, scale: pop(t, Tr) });
      if (t < Td) { panel(1200, 520, 900, 480, { color: RED, alpha: fade(t, Tf) }); const k = clamp((t - Tf) / 2); chartLine(800, 700, 800, 300, [0.85, 0.9, 0.7, 0.75, 0.4, 0.3, 0.2], k > 0.4 ? RED : GOLD, k); if (t > Tb) pill('BANK WILL MEHR SICHERHEIT', 1200, 340, { size: 26, color: RED, scale: pop(t, Tb) }); if (t > Tw) text('Zwangsverkauf im Crash', 1200, 760, { size: 40, color: RED, weight: 900, glow: 0.3, scale: pop(t, Tw) }); }
      else { text('Depot 10 Mio. €', 1200, 330, { size: 48, weight: 900, glow: 0.2, scale: pop(t, Td) }); const k = easeOut((t - Td) / 0.6); x.save(); x.beginPath(); x.roundRect(800, 400, 800 * k, 100, 18); x.strokeStyle = WHITE; x.lineWidth = 4; x.stroke(); x.beginPath(); x.roundRect(800, 400, 90 * k, 100, 18); x.fillStyle = 'rgba(245,200,75,0.6)'; x.fill(); x.restore(); text('Kredit: nur ein kleiner Teil', 1200, 570, { size: 44, color: GOLD, weight: 900, glow: 0.3, alpha: k }); }
    },
  });
}
{
  const T0 = w('Merke'), Ta = w('Arme'), Tr = w('Reiche');
  const r = R([[T0, { expr: 'serious', armR: 'pointUp', x: 1720 }], [Tr, { expr: 'smug', armR: 'idle', armL: 'hip' }]], { s: 0.68 });
  S(T0 - 0.1, { cam: push(1, 1.03), stage: stageOf('stage', [r]), sfx: [{ t: T0, type: 'bass' }, { t: Tr, type: 'ding' }], ui: t => bigMerke(t, T0, 'Arme verkaufen, um Geld zu haben.', { s: 'Reiche leihen.', t: Tr }) });
}
{
  const T0 = w('Okay'), Tk = w('Kinder'), Tf = w('Finanzamt'), Te = w('Erbschaftsteuer'), Ta = w('Außer');
  const r = R([[T0, { expr: 'smug', armL: 'hip', x: 520 }], [Tk, { expr: 'happy', armR: 'present' }], [Tf, { expr: 'worried', armR: 'idle' }], [Ta, { expr: 'smug', armR: 'pointUp' }]], { s: 0.95 });
  const so = actor('son', { x: 930, s: 0.75, keys: [[Tk, { expr: 'happy' }], [Te, { expr: 'shock', armL: 'up', armR: 'up' }]], enter: { t: Tk, from: 'pop' } });
  const da = actor('daughter', { x: 1140, s: 0.7, keys: [[Tk, { expr: 'happy', armR: 'wave' }], [Te, { expr: 'worried', armR: 'idle' }]], enter: { t: Tk + 0.15, from: 'pop' } });
  const f = actor('finanzamt', { x: 1620, keys: [[Tf, { expr: 'smug', armL: 'hold', look: -0.6 }]], enter: { t: Tf, from: 'right' } });
  S(T0 - 0.1, { cam: push(1, 1.04), stage: stageOf('living', [r, so, da, f]), sfx: [{ t: Tk, type: 'pop' }, { t: Tf, type: 'knock' }, { t: Te, type: 'hit' }, { t: Ta, type: 'rise' }], ui: t => { chapterTag('TRICK 2 · LEIHEN'); if (t > Te) { panel(1620, 200, 470, 150, { color: RED, scale: pop(t, Te) }); text('ERBSCHAFTSTEUER', 1620, 180, { size: 36, color: RED, weight: 900, glow: 0.3, scale: pop(t, Te) }); text('bis 30 %', 1620, 232, { size: 40, weight: 900, glow: 0.2, scale: pop(t, Te + 0.2) }); } } });
}

// =====================================================================
// KAPITEL 3 – VERSCHENKEN IN RATEN
// =====================================================================
chapterCardScene(3, 'TRICK #3', 'VERSCHENKEN IN RATEN', 'Alle 10 Jahre steuerfrei', t => { x.save(); x.globalAlpha = 0.25; gift(1650, 800, 1.3); gift(280, 800, 1); x.restore(); });
{
  w('Raten');
  const T0 = w('Wenn'), Tz = w('zehn'), Tt = w('teuer'), Tf = w('Freibetrag'), Td = w('dreiundzwanzig'), Tzw = w('zwei');
  const r = R([[T0, { expr: 'neutral', armR: 'idle', x: 330 }], [Tt, { expr: 'worried' }], [Tzw, { expr: 'shock', armL: 'up', armR: 'up' }]], { s: 0.85 });
  const so = actor('son', { x: 640, s: 0.75, keys: [[T0, { expr: 'happy', look: -0.5 }], [Tzw, { expr: 'shock' }]] });
  S(T0 - 0.1, {
    cam: push(1, 1.04), stage: stageOf('living', [r, so]), sfx: [{ t: Tz, type: 'coins' }, { t: Tf, type: 'pop' }, { t: Tzw, type: 'hit' }],
    ui: t => {
      chapterTag('TRICK 3 · VERSCHENKEN');
      text('ERBE FÜR MEINEN SOHN', 1300, 140, { size: 44, color: GRAY, spacing: 4, weight: 800, glow: 0, alpha: fade(t, T0) });
      calc([{ t: Tz, s: '10.000.000 €', c: GOLD }, { t: Tf, s: '− 400.000 € Freibetrag', c: WHITE, size: 44 }, { t: Td, s: '9,6 Mio. × 23 %', c: WHITE, size: 44 }, { t: Tzw, s: '≈ 2.208.000 € Steuer', c: RED, size: 66 }], 1300, 270, t, { gap: 120 });
    },
  });
}
{
  const T0 = w('Aber'), Tl = w('Lücke'), Te = w('Einladung'), Tf = w('Freibetrag'), Tz = w('zehn');
  const r = R([[T0, { expr: 'smug', armR: 'present', x: 380 }], [Te, { expr: 'wink' }], [Tz, { expr: 'happy', armR: 'count' }]], { s: 0.9 });
  S(T0 - 0.1, {
    cam: push(1, 1.05), stage: stageOf('stage', [r], t => { if (t > Tl) doc(1100, 470, 1.3 * pop(t, Tl), 'ErbStG', GOLD); }),
    sfx: [{ t: Tl, type: 'pop' }, { t: Te, type: 'magic' }, { t: Tz, type: 'ding' }],
    ui: t => {
      chapterTag('TRICK 3 · VERSCHENKEN');
      chip(t, Te, 'EHER EINE EINLADUNG', 1100, 160, GOLD, 30);
      if (t > Tz) { calendar(1550, 430, pop(t, Tz), '10 J.'); text('Freibetrag gilt alle 10 Jahre neu', 1250, 740, { size: 46, color: GOLD, weight: 900, glow: 0.35, scale: pop(t, Tz + 0.2) }); pill('§ 14 ErbStG', 1550, 590, { size: 22, color: WHITE, scale: pop(t, Tz + 0.4) }); }
    },
  });
}
{
  const T0 = w('Das'), Th = w('heute'), Ts = w('Steuerfrei'), Tz = w('zehn'), Tzw = w('zwanzig');
  const r = R([[T0, { expr: 'happy', armR: 'give', x: 360 }], [Tz, { armR: 'idle' }], [Tzw, { expr: 'smug', armL: 'hip' }]], { s: 0.85, prop: { side: 'R', draw: () => gift(10, 30, 0.35) } });
  const so = actor('son', { x: 640, s: 0.72, keys: [[T0, { expr: 'happy', look: -0.5 }], [Ts, { expr: 'laugh', armL: 'up' }]] });
  const nodes = [[Th, 'HEUTE'], [Tz, '+10 JAHRE'], [Tzw, '+20 JAHRE']];
  S(T0 - 0.1, {
    cam: push(1, 1.04), stage: stageOf('living', [r, so]), sfx: nodes.map(([T]) => ({ t: T, type: 'ding' })),
    ui: t => {
      chapterTag('TRICK 3 · VERSCHENKEN');
      neon([[[920, 450], [920 + 880 * easeOut((t - Th) / 3), 450]]], 'rgba(255,255,255,0.5)', 4);
      nodes.forEach(([T, l], i) => { const px = 1000 + i * 340, s = pop(t, T); if (s <= 0) return; neonCircle(px, 450, 16 * s, GOLD, 5); text(l, px, 380, { size: 30, color: GRAY, weight: 800, glow: 0, scale: s, spacing: 3 }); text('400.000 €', px, 530, { size: 46, color: GOLD, weight: 900, glow: 0.4, scale: s }); check(px, 610, 60, (t - T - 0.3) / 0.4, GREEN); });
      if (t > Ts) pill('STEUERFREI', 1340, 230, { size: 34, color: GREEN, scale: pop(t, Ts) });
    },
  });
}
{
  const T0 = w('Und'), Te = w('Elternteil'), Tf = w('Frau'), Tm = w('Macht'), Tj = w('jedes');
  const r = R([[T0, { expr: 'happy', armR: 'present', x: 360 }], [Tf, { armR: 'idle', look: 0.6 }], [Tm, { expr: 'smug', armL: 'hip' }]], { s: 0.85 });
  const wf = actor('wife', { x: 620, s: 0.85, keys: [[Tf, { expr: 'happy', armR: 'wave', look: -0.4 }], [Tm, { armR: 'idle' }]], enter: { t: Tf, from: 'left' } });
  S(T0 - 0.1, {
    cam: push(1, 1.04), stage: stageOf('living', [r, wf]), sfx: [{ t: Tf, type: 'pop' }, { t: Tm, type: 'coins' }],
    ui: t => {
      chapterTag('TRICK 3 · VERSCHENKEN');
      text('PRO ELTERNTEIL', 1320, 160, { size: 44, color: GRAY, spacing: 6, weight: 800, glow: 0, alpha: fade(t, Te) });
      calc([{ t: Te, s: 'Richard: 400.000 €', c: WHITE }, { t: Tf, s: '+ Frau: 400.000 €', c: WHITE }, { t: Tm, s: '= 800.000 € / 10 Jahre', c: GOLD, size: 66 }], 1320, 300, t, { gap: 120 });
      if (t > Tj) pill('FÜR JEDES KIND', 1320, 700, { size: 32, color: GOLD, scale: pop(t, Tj) });
    },
  });
}
{
  const T0 = w('Ich'), Tdr = w('dreißig'), T8 = w('achthunderttausend'), Tk = w('mal'), Tr = w('mal'), Tv = w('Vier'), Tko = w('Komplett');
  const r = R([[T0, { expr: 'happy', armR: 'count', x: 300 }], [Tv, { expr: 'laugh', armR: 'up', armL: 'up' }]], { s: 0.8 });
  const so = actor('son', { x: 540, s: 0.65, keys: [[T0, { expr: 'happy' }]] }), da = actor('daughter', { x: 700, s: 0.62, keys: [[T0, { expr: 'happy', armR: 'wave' }]] });
  S(T0 - 0.1, {
    cam: push(1, 1.04), stage: stageOf('living', [r, so, da]), sfx: [{ t: T8, type: 'pop' }, { t: Tk, type: 'pop' }, { t: Tr, type: 'pop' }, { t: Tv, type: 'hit' }, { t: Tko, type: 'ding' }],
    ui: t => {
      chapterTag('TRICK 3 · VERSCHENKEN');
      text('2 Kinder · 30 Jahre', 1300, 160, { size: 46, color: GRAY, weight: 800, glow: 0, alpha: fade(t, T0 + 0.5) });
      let s = ''; if (t > T8) s = '800.000 €'; if (t > Tk) s += '  × 2'; if (t > Tr) s += '  × 3';
      text(s, 1300, 320, { size: 64, weight: 900, glow: 0.2 });
      text('4.800.000 €', 1300, 480, { size: 120, color: GOLD, weight: 900, glow: 0.6, scale: pop(t, Tv) });
      stamp('STEUERFREI', 1300, 660, { size: 70, color: GREEN, scale: pop(t, Tko) });
    },
  });
}
{
  const T0 = w('Und'), Te = w('Enkel'), Tz = w('Zweihunderttausend'), Te2 = w('Ebenfalls');
  const r = R([[T0, { expr: 'happy', armR: 'present', x: 300 }]], { s: 0.8 });
  S(T0 - 0.1, {
    cam: push(1, 1.03), stage: stageOf('stage', [r]), sfx: [{ t: Te, type: 'pop' }, { t: Tz, type: 'ding' }],
    ui: t => {
      chapterTag('TRICK 3 · VERSCHENKEN');
      const node = (px, py, l, c, T) => { const s = pop(t, T); if (s <= 0) return; neonCircle(px, py, 46 * s, c, 5); text(l, px, py, { size: 22 * s, color: c, weight: 900, glow: 0.2 }); };
      node(1100, 220, 'RICHARD', GOLD, T0); node(1300, 220, 'FRAU', GOLD, T0 + 0.2);
      [[900, 'KIND'], [1500, 'KIND']].forEach(([px, l], i) => { if (t > T0 + 0.4) neon([[[1200, 266], [px, 380]]], 'rgba(255,255,255,0.4)', 3); node(px, 420, l, WHITE, T0 + 0.4 + i * 0.1); });
      [760, 1040, 1360, 1640].forEach((px, i) => { if (t > Te) neon([[[i < 2 ? 900 : 1500, 466], [px, 600]]], 'rgba(255,255,255,0.3)', 3); node(px, 640, 'ENKEL', GREEN, Te + i * 0.12); });
      text('200.000 € pro Großelternteil', 1200, 790, { size: 50, color: GREEN, weight: 900, glow: 0.35, scale: pop(t, Tz) });
      if (t > Te2) pill('ALLE 10 JAHRE', 1200, 880, { size: 28, color: GOLD, scale: pop(t, Te2) });
    },
  });
}
{
  const T0 = w('Der'), Tz = w('Zeit'), Ta = w('achtzig'), Tf = w('fünfzig'), Td = w('drei');
  const r = R([[T0, { expr: 'neutral', armR: 'pointUp', x: 330 }], [Tz, { expr: 'serious' }], [Td, { expr: 'smug', armR: 'idle', armL: 'hip' }]], { s: 0.85 });
  S(T0 - 0.1, {
    cam: push(1, 1.04), stage: stageOf('stage', [r], t => hourglass(1650, 420, 1, GOLD, clamp((t - Tz) / 8))), sfx: [{ t: Tz, type: 'ding' }, { t: Ta, type: 'pop' }, { t: Tf, type: 'pop' }],
    ui: t => {
      chapterTag('TRICK 3 · VERSCHENKEN');
      text('DER TRICK BRAUCHT: ZEIT', 1050, 160, { size: 56, color: GOLD, weight: 900, glow: 0.4, scale: pop(t, Tz) });
      const row = (py, l, n, T) => { if (t < T) return; text(l, 760, py, { size: 46, weight: 900, glow: 0.2, align: 'left', scale: pop(t, T) }); for (let i = 0; i < n; i++) gift(1180 + i * 150, py + 50, 0.45 * pop(t, T + 0.2 + i * 0.25)); };
      row(380, 'Start mit 80:', 1, Ta); row(600, 'Start mit 50:', 3, Tf);
    },
  });
}
{
  const T0 = w('Und'), Ti = w('Immobilie'), Tm = w('Mieten'), Tn = w('Nießbrauch'), Ts = w('Sohn'), Tw = w('weniger'), Tp = w('passt');
  const r = R([[T0, { expr: 'smug', armR: 'present', x: 330 }], [Tm, { expr: 'happy', armR: 'up' }], [Tw, { expr: 'wink', armR: 'idle', armL: 'hip' }]], { s: 0.85 });
  const so = actor('son', { x: 1650, s: 0.72, keys: [[Ts, { expr: 'worried', armL: 'shrug', armR: 'shrug', look: -0.5 }]], enter: { t: Ts, from: 'right' } });
  S(T0 - 0.1, {
    cam: push(1, 1.04), stage: stageOf('stage', [r, so], t => house(1000, FLOOR, 1.5 * pop(t, Ti)), t => { if (t > Tm) coinFlow(t, 1000, 520, 400, 440, { t0: Tm, n: 8, h: 110, speed: 0.7 }); }),
    sfx: [{ t: Ti, type: 'pop' }, { t: Tm, type: 'coins' }, { t: Tn, type: 'ding' }, { t: Tw, type: 'swipe' }],
    ui: t => {
      chapterTag('TRICK 3 · VERSCHENKEN');
      if (t > Ti) pill(t > Ts ? 'GEHÖRT DEM SOHN' : 'IMMOBILIE', 1000, 380, { size: 26, color: GOLD, scale: pop(t, Ti) });
      if (t > Tm) pill('MIETEN → RICHARD', 680, 260, { size: 24, color: GOLD, scale: pop(t, Tm) });
      text('NIESSBRAUCH', 1100, 130, { size: 76, color: GOLD, weight: 900, glow: 0.5, scale: pop(t, Tn), spacing: 6 });
      if (t > Tw) { const k = easeOut((t - Tw) / 0.8); bar(1450, 760, 120, lerp(380, 170, k), GOLD, 'WERT FÜRS FINANZAMT', k > 0.5 ? '↓ weniger' : '', { alpha: fade(t, Tw) }); }
      if (t > Tp) pill('MEHR PASST IN DEN FREIBETRAG', 1100, 900, { size: 26, color: GREEN, scale: pop(t, Tp) });
    },
  });
}
{
  const T0 = w('Merke'), Tr = w('Reiche'), Ts = w('Sie'), Tre = w('Rechtzeitig');
  const r = R([[T0, { expr: 'serious', armR: 'pointUp', x: 1720 }], [Tre, { expr: 'wink', armR: 'idle', armL: 'hip' }]], { s: 0.68 });
  S(T0 - 0.1, { cam: push(1, 1.03), stage: stageOf('stage', [r]), sfx: [{ t: T0, type: 'bass' }, { t: Ts, type: 'ding' }, { t: Tre, type: 'pop' }], ui: t => { bigMerke(t, T0, 'Reiche vererben nicht.', { s: 'Sie verschenken.', t: Ts }); text('RECHTZEITIG.', 840, 600, { size: 60, color: WHITE, weight: 900, glow: 0.3, scale: pop(t, Tre), spacing: 8 }); } });
}
{
  const T0 = w('Aber'), Tf = w('Firma'), Ts = w('Scheibchen'), Tm = w('Muss'), Tg = w('größte');
  const r = R([[T0, { expr: 'thinking', armR: 'chin', x: 460 }], [Tm, { expr: 'smug', armR: 'idle', armL: 'hip' }], [Tg, { expr: 'happy', armR: 'pointUp' }]]);
  S(T0 - 0.1, { cam: push(1, 1.08, 900), stage: stageOf('office', [r], t => factory(1300, FLOOR, 1.3, GOLD, t)), sfx: [{ t: Ts, type: 'swipe' }, { t: Tg, type: 'rise' }], ui: t => { chapterTag('TRICK 3 · VERSCHENKEN'); pill('MEINE FIRMA', 1300, 370, { size: 30, scale: pop(t, Tf) }); if (t > Ts && t < Tm + 0.5) { cross(1300, 620, 160, (t - Ts) / 0.4); } } });
}

// =====================================================================
// KAPITEL 4 – FIRMA ERBEN FÜR 0 €
// =====================================================================
chapterCardScene(4, 'TRICK #4', 'DIE FIRMA ERBEN', 'für 0 € Steuern', t => { x.save(); x.globalAlpha = 0.25; factory(1650, 800, 1, GOLD, t); factory(270, 800, 0.8, GOLD, t); x.restore(); });
{
  w('Euro');
  const T0 = w('Meine'), Tz = w('zwanzig'), Ts = w('Sohn'), Tsi = w('siebenundzwanzig'), Tu = w('Über');
  const so = actor('son', { x: 520, s: 0.8, keys: [[Ts, { expr: 'happy' }], [Tu, { expr: 'shock', armL: 'up', armR: 'up' }]], enter: { t: Ts, from: 'left' } });
  S(T0 - 0.1, {
    cam: push(1, 1.04), stage: stageOf('stage', [so], t => factory(1000, FLOOR, 1.2, GOLD, t)), sfx: [{ t: Tz, type: 'coins' }, { t: Tsi, type: 'pop' }, { t: Tu, type: 'hit' }],
    ui: t => {
      chapterTag('TRICK 4 · FIRMA ERBEN');
      text('FIRMA: 20.000.000 €', 1000, 140, { size: 66, color: GOLD, weight: 900, glow: 0.5, scale: pop(t, Tz) });
      calc([{ t: Tsi, s: '(20 Mio. − 400.000 €) × 27 %', c: WHITE, size: 44 }, { t: Tu, s: '≈ 5.292.000 €', c: RED, size: 84 }], 1520, 330, t, { gap: 120 });
    },
  });
}
{
  const T0 = w('Das'), Tb = w('Bargeld'), Tm = w('Maschinen'), Tg = w('Gebäuden'), Tmi = w('Mitarbeitern'), Tv = w('verkaufen'), Tz = w('zerschlagen');
  const so = actor('son', { x: 420, s: 0.8, keys: [[T0, { expr: 'worried', armL: 'shrug', armR: 'shrug' }], [Tz, { expr: 'shock', armL: 'up', armR: 'up' }]] });
  const workers = [0, 1, 2].map(i => actor('normal', { x: 1420 + i * 130, s: 0.42, keys: [[Tmi, { expr: i === 1 ? 'worried' : 'neutral' }], [Tz, { expr: 'shock' }]], enter: { t: Tmi + i * 0.1, from: 'pop' } }));
  S(T0 - 0.1, {
    cam: push(1, 1.04), stage: stageOf('stage', [so, ...workers], t => factory(950, FLOOR, 1.1, t > Tz ? RED : GOLD, t)), sfx: [{ t: Tb, type: 'pop' }, { t: Tm, type: 'pop' }, { t: Tg, type: 'pop' }, { t: Tmi, type: 'pop' }, { t: Tz, type: 'hit' }],
    ui: t => {
      chapterTag('TRICK 4 · FIRMA ERBEN');
      text('So viel Bargeld?', 420, 180, { size: 46, weight: 900, glow: 0.2, scale: pop(t, Tb) }); cross(420, 260, 70, (t - Tb - 0.4) / 0.4);
      chip(t, Tm, 'MASCHINEN', 820, 330, WHITE, 26); chip(t, Tg, 'GEBÄUDE', 1080, 260, WHITE, 26); chip(t, Tmi, 'MITARBEITER', 1550, 470, WHITE, 26);
      stamp('VERKAUFEN?', 950, 130, { size: 56, color: RED, scale: pop(t, Tv) });
      stamp('ZERSCHLAGEN?', 1250, 640, { size: 60, color: RED, rot: 0.06, scale: pop(t, Tz) });
    },
  });
}
{
  const T0 = w('Und'), Ts = w('Staat'), Tp = w('Paragrafen'), Tv = w('Verschonung');
  const r = R([[T0, { expr: 'neutral', armR: 'present', x: 360 }], [Tv, { expr: 'smug', armR: 'idle', armL: 'hip' }]]);
  S(T0 - 0.1, {
    cam: push(1, 1.05), stage: stageOf('stage', [r], t => { if (t > Tp) doc(1150, 430, 1.4 * pop(t, Tp), 'ErbStG', GOLD); }), sfx: [{ t: Tp, type: 'magic' }, { t: Tv, type: 'ding' }],
    ui: t => {
      chapterTag('TRICK 4 · FIRMA ERBEN');
      text('Der Staat will das nicht.', 1150, 130, { size: 50, weight: 900, glow: 0.2, scale: pop(t, Ts) });
      text('§§ 13a + 13b', 1150, 450, { size: 70, color: GOLD, weight: 900, glow: 0.5, scale: pop(t, Tp + 0.3) });
      text('VERSCHONUNG VON BETRIEBSVERMÖGEN', 1150, 760, { size: 46, color: GOLD, weight: 900, glow: 0.4, scale: pop(t, Tv), spacing: 2 });
    },
  });
}
{
  const T0 = w('Variante'), T85 = w('Fünfundachtzig'), Tf = w('fünf'), Ta = w('Arbeitsplätze'), T2 = w('Variante'), Th = w('Hundert'), Ts = w('sieben'), Tl = w('Lohnsumme'), Tve = w('Verwaltungsvermögen'), Tm = w('Mietshäuser');
  S(T0 - 0.1, {
    cam: push(1, 1.03), stage: t => SETS.stage(t), sfx: [{ t: T85, type: 'ding' }, { t: Th, type: 'hit' }],
    ui: t => {
      chapterTag('TRICK 4 · FIRMA ERBEN');
      const col = (px, T, title, big, items, c) => { const s = pop(t, T); if (s <= 0) return; panel(px, 500, 700, 700, { color: c, scale: s }); text(title, px, 220, { size: 34, color: GRAY, weight: 800, spacing: 6, glow: 0, scale: s }); text(big, px, 340, { size: 120, color: c, weight: 900, glow: 0.6, scale: s }); text('steuerfrei', px, 430, { size: 36, weight: 800, glow: 0.1, scale: s }); items.forEach(([T2_, l], i) => { if (t < T2_) return; check(px - 260, 540 + i * 90, 40, (t - T2_) / 0.4, c); text(l, px - 220, 540 + i * 90, { size: 36, weight: 800, glow: 0.05, align: 'left', alpha: fade(t, T2_) }); }); };
      col(560, T0, 'VARIANTE 1', '85 %', [[Tf, '5 Jahre weiterführen'], [Ta, 'Arbeitsplätze erhalten']], GOLD);
      col(1360, T2, 'VARIANTE 2', '100 %', [[Ts, '7 Jahre durchhalten'], [Tl, 'Lohnsumme stabil'], [Tve, 'wenig Verwaltungsvermögen']], GREEN);
      if (t > Tm) pill('KEINE REINE MIETHAUS- ODER AKTIEN-FIRMA', 1360, 900, { size: 22, color: WHITE, scale: pop(t, Tm) });
    },
  });
}
{
  const T0 = w('Ergebnis'), Ts = w('Sohn'), Tz = w('zahlt'), Tn = w('null');
  const so = actor('son', { x: 700, keys: [[T0, { expr: 'happy' }], [Tn, { expr: 'laugh', armL: 'up', armR: 'up' }]] });
  const f = actor('finanzamt', { x: 1500, keys: [[T0, { expr: 'neutral', armL: 'hold', look: -0.5 }], [Tn, { expr: 'shock', armL: 'up', armR: 'up' }]] });
  S(T0 - 0.1, { cam: push(1, 1.06), stage: stageOf('stage', [so, f], t => { x.save(); x.globalAlpha = 0.35; factory(1100, FLOOR, 0.9, GOLD, t); x.restore(); }), sfx: [{ t: Tn, type: 'hit' }, { t: Tn + 0.1, type: 'coins' }], ui: t => { chapterTag('TRICK 4 · FIRMA ERBEN'); text('20 MIO. GEERBT', W / 2, 140, { size: 60, weight: 900, glow: 0.2, scale: pop(t, Ts) }); text('0 €', W / 2, 330, { size: 220, color: GOLD, weight: 900, glow: 0.7, scale: pop(t, Tn) }); } });
}
{
  const T0 = w('Jetzt'), Tk = w('Krankenschwester'), Ta = w('Aktiendepot'), Tf = w('Freibetrag'), Tn = w('neunzigtausend');
  const n = actor('nurse', { x: 520, keys: [[T0, { expr: 'neutral' }], [Ta, { expr: 'happy' }], [Tn, { expr: 'sad', armL: 'shrug', armR: 'shrug' }]], enter: { t: Tk, from: 'left' } });
  S(T0 - 0.1, {
    cam: push(1, 1.04), stage: stageOf('hospital', [n]), sfx: [{ t: Ta, type: 'coins' }, { t: Tn, type: 'hit' }],
    ui: t => {
      chapterTag('TRICK 4 · FIRMA ERBEN');
      text('ERBT AKTIENDEPOT', 1300, 150, { size: 44, color: GRAY, spacing: 4, weight: 800, glow: 0, alpha: fade(t, Ta) });
      calc([{ t: Ta, s: '1.000.000 €', c: GOLD, size: 80 }, { t: Tf, s: '− 400.000 € = 600.000 €', c: WHITE, size: 44 }, { t: Tf + 1.2, s: '× 15 %', c: WHITE, size: 44 }, { t: Tn, s: '= 90.000 € Steuer', c: RED, size: 70 }], 1300, 290, t, { gap: 120 });
    },
  });
}
{
  const T0 = w('Neunzigtausend'), Tm = w('Million'), Tnu = w('Null'), Tz = w('zwanzig');
  S(T0 - 0.1, {
    cam: push(1, 1.04), stage: t => { SETS.stage(t); scales(W / 2, 600, 1.4, GOLD, lerp(0, -0.22, easeInOut((t - Tnu) / 0.8))); },
    sfx: [{ t: T0, type: 'pop' }, { t: Tnu, type: 'hit' }],
    ui: t => {
      chapterTag('TRICK 4 · FIRMA ERBEN');
      box(480, 300, 560, 200, '1 Mio. Depot', { color: TEAL, sub: 'Krankenschwester', scale: pop(t, T0) }); text('90.000 €', 480, 470, { size: 80, color: RED, weight: 900, glow: 0.5, scale: pop(t, T0 + 0.3) });
      box(1440, 300, 560, 200, '20 Mio. Firma', { color: GOLD, sub: 'Richards Sohn', scale: pop(t, Tnu) }); text('0 €', 1440, 470, { size: 100, color: GOLD, weight: 900, glow: 0.6, scale: pop(t, Tz) });
    },
  });
}
{
  const T0 = w('Klingt'), Tg = w('Genau'), Tb = w('Bundesverfassungsgericht'), Td = w('dreizehnten'), Tgk = w('Geklagt'), Tu = w('Urteil'), Te = w('eingeschränkt');
  const judges = [0, 1, 2].map(i => actor('judge', { x: 760 + i * 200, s: 0.62, y: 760, keys: [[T0, { expr: i === 1 ? 'serious' : 'neutral', look: (i - 1) * 0.3 }], [Te, { expr: i === 0 ? 'thinking' : 'serious' }]] }));
  S(T0 - 0.1, {
    cam: { from: { z: 1, cx: 960, cy: 540 }, to: { z: 1.08, cx: 960, cy: 480 } }, stage: t => { SETS.court(t); judges.forEach(j => j.draw(t)); x.fillStyle = 'rgba(20,6,8,0.95)'; x.fillRect(360, 620, 1200, 140); neon([[[340, 620], [1580, 620]]], RED, 5); },
    sfx: [{ t: Tb, type: 'bass' }, { t: Td, type: 'pop' }, { t: Tu, type: 'knock' }, { t: Te, type: 'hit' }],
    ui: t => {
      text('Unfair?', 300, 200, { size: 70, color: WHITE, weight: 900, glow: 0.3, scale: pop(t, T0) });
      if (t > Td) { calendar(1650, 330, pop(t, Td) * 0.9, '13.10.'); text('2026', 1650, 460, { size: 40, color: GOLD, weight: 900, glow: 0.3, alpha: fade(t, Td) }); }
      if (t > Tgk) { panel(960, 880, 900, 110, { color: WHITE, scale: pop(t, Tgk) }); text('Klage: Privatvermögen geerbt – voll gezahlt', 960, 880, { size: 34, weight: 800, glow: 0.05, scale: pop(t, Tgk) }); }
      stamp('URTEIL: OFFEN', 300, 360, { size: 50, color: RED, scale: pop(t, Tu) });
      if (t > Te) text('Trick bald eingeschränkt?', 300, 490, { size: 36, color: GOLD, weight: 900, glow: 0.3, scale: pop(t, Te) });
      pill('Az. 1 BvR 804/22', 1650, 560, { size: 20, color: GRAY, alpha: fade(t, Tb) });
    },
  });
}
{
  const T0 = w('Übrigens'), Ts = w('sechsundzwanzig'), Tsc = w('schmilzt'), Tz = w('zeigen'), Tv = w('Viele'), Tj = w('Jedes');
  const so = actor('son', { x: 1250, s: 0.7, keys: [[Tv, { expr: 'happy', look: 0.4 }]], enter: { t: Tv, from: 'pop' } });
  const da = actor('daughter', { x: 1650, s: 0.67, keys: [[Tv, { expr: 'happy', look: -0.4 }]], enter: { t: Tv + 0.15, from: 'pop' } });
  S(T0 - 0.1, {
    cam: push(1, 1.03), stage: stageOf('stage', [so, da], t => { if (t < Tv) return; factory(1250, FLOOR - 330, 0.45, GOLD, t); factory(1650, FLOOR - 320, 0.45, GOLD, t); }),
    sfx: [{ t: Ts, type: 'pop' }, { t: Tsc, type: 'swipe' }, { t: Tv, type: 'magic' }],
    ui: t => {
      chapterTag('TRICK 4 · FIRMA ERBEN');
      text('ÜBER 26 MIO. €', 560, 160, { size: 64, color: GOLD, weight: 900, glow: 0.5, scale: pop(t, Ts) });
      if (t > Tsc) { const k = clamp((t - Tsc) / 2); bar(560, 760, 200, lerp(420, 120, easeOut(k)), GOLD, 'VERSCHONUNG', k > 0.5 ? 'schmilzt ab' : '', { alpha: fade(t, Tsc) }); }
      if (t > Tz) pill('ODER: BEDÜRFTIGKEIT ZEIGEN', 560, 880, { size: 22, color: WHITE, scale: pop(t, Tz) });
      if (t > Tj) { pill('EIGENE GRENZE', 1250, 200, { size: 22, color: GREEN, scale: pop(t, Tj) }); pill('EIGENE GRENZE', 1650, 200, { size: 22, color: GREEN, scale: pop(t, Tj + 0.15) }); }
    },
  });
}
{
  const T0 = w('Die'), Tf = w('Familienunternehmen'), Tn = w('Niemand'), Tp = w('pleitegeht'), Ta = w('Aber'), Tg = w('großen');
  const r = R([[T0, { expr: 'neutral', armR: 'present', x: 330 }], [Ta, { expr: 'serious', armR: 'pointUp' }], [Tg, { expr: 'smug', armR: 'idle', armL: 'hip' }]], { s: 0.85 });
  const ws = [0, 1, 2, 3].map(i => actor('normal', { x: 900 + i * 150, s: 0.45, keys: [[Tf, { expr: 'happy' }], [Tp, { expr: 'worried' }], [Ta, { expr: 'neutral' }]], enter: { t: Tf + i * 0.1, from: 'pop' } }));
  S(T0 - 0.1, {
    cam: push(1, 1.04), stage: stageOf('stage', [r, ...ws], t => { if (t < Ta) factory(1130, FLOOR - 300, 0.6, GOLD, t); else scales(1500, 430, 1, GOLD, lerp(0, -0.25, easeInOut((t - Ta) / 0.8))); }),
    sfx: [{ t: Tf, type: 'pop' }, { t: Ta, type: 'swipe' }],
    ui: t => {
      chapterTag('TRICK 4 · FIRMA ERBEN');
      text('Familienunternehmen sichern Jobs', 1150, 150, { size: 50, weight: 900, glow: 0.2, scale: pop(t, Tf), alpha: fadeOut(t, Ta) });
      if (t > Tg) { text('Profitieren: vor allem', 1300, 150, { size: 44, weight: 900, glow: 0.2, scale: pop(t, Tg) }); text('die ganz großen Vermögen', 1300, 220, { size: 52, color: GOLD, weight: 900, glow: 0.4, scale: pop(t, Tg + 0.2) }); }
    },
  });
}
{
  const T0 = w('Merke'), Tw = w('Wer'), Tw2 = w('Wer');
  const r = R([[T0, { expr: 'serious', armR: 'pointUp', x: 1720 }], [Tw2, { expr: 'smug', armR: 'idle', armL: 'hip' }]], { s: 0.68 });
  S(T0 - 0.1, { cam: push(1, 1.03), stage: stageOf('stage', [r]), sfx: [{ t: T0, type: 'bass' }, { t: Tw2, type: 'ding' }], ui: t => bigMerke(t, T0, 'Wer Geld erbt, zahlt Steuern.', { s: 'Wer eine Firma erbt, oft nicht.', t: Tw2 }) });
}
{
  const T0 = w('So'), Tb = w('bringt'), Th = w('Holding'), Tn = w('Noch'), Tk = w('kleinem');
  const r = R([[T0, { expr: 'smug', armL: 'hip', x: 960 }], [Tb, { expr: 'thinking', armR: 'chin', armL: 'idle' }], [Tn, { expr: 'wink', armR: 'pointUp' }], [Tk, { expr: 'happy', armR: 'present' }]]);
  S(T0 - 0.1, { cam: close(960, 470, 1.3, 1.5), stage: stageOf('office', [r]), sfx: [{ t: Tn, type: 'ding' }], ui: t => { if (t > Tn) pill('NOCH NICHT.', 1430, 300, { size: 36, color: GOLD, scale: pop(t, Tn) }); } });
}

// =====================================================================
// KAPITEL 5 – WAS DU NUTZEN KANNST
// =====================================================================
chapterCardScene(5, 'UND DU?', 'WAS DU NUTZEN KANNST', '4 Prinzipien für kleines Geld', t => { x.save(); x.globalAlpha = 0.25; etfJar(1650, 800, 1.2, 0.6); x.restore(); });
const TIPS = ['Geld arbeiten lassen', 'Freibeträge nutzen', 'In Generationen denken', 'Vermögen statt Konsum'];
function tipList(t, active, px = 1480) {
  TIPS.forEach((l, i) => { const on = i <= active; text(`${i + 1}. ${l}`, px - 250, 190 + i * 62, { size: 32, color: i === active ? GOLD : on ? WHITE : GRAY, weight: 800, glow: i === active ? 0.3 : 0, align: 'left', alpha: on ? 1 : 0.45 }); });
}
{
  w('kannst');
  const T0 = w('Erstens'), Tp = w('Prinzip'), Te = w('ETF'), Tt = w('thesaurierenden'), Tv = w('Vorabpauschale'), Tr = w('Rest'), Tg = w('Genau');
  const r = R([[T0, { expr: 'happy', armR: 'count', x: 330 }], [Te, { armR: 'present' }], [Tg, { expr: 'wink', armR: 'idle', armL: 'hip' }]], { s: 0.9 });
  S(T0 - 0.1, {
    cam: push(1, 1.04), stage: stageOf('stage', [r], t => etfJar(900, FLOOR, 1.3, clamp((t - Te) / 10) * 0.9 + 0.05, GOLD, t)),
    sfx: [{ t: T0, type: 'ding' }, { t: Te, type: 'coins' }, { t: Tv, type: 'pop' }],
    ui: t => {
      tipList(t, 0);
      text('ETF', 900, 330, { size: 50, color: GOLD, weight: 900, glow: 0.4, scale: pop(t, Te) });
      chip(t, Tt, 'THESAURIEREND', 900, 260, GOLD, 24);
      if (t > Tv) { panel(1480, 620, 620, 220, { color: WHITE, scale: pop(t, Tv) }); text('Pro Jahr: kleine', 1480, 580, { size: 34, weight: 800, glow: 0.05, scale: pop(t, Tv) }); text('Vorabpauschale', 1480, 630, { size: 44, color: GOLD, weight: 900, glow: 0.3, scale: pop(t, Tv) }); }
      if (t > Tr) text('Rest erst beim Verkauf', 1480, 690, { size: 30, color: GRAY, weight: 800, glow: 0, alpha: fade(t, Tr) });
    },
  });
}
{
  const T0 = w('Zweitens'), Ts = w('Sparerpauschbetrag'), Tf = w('Freistellungsauftrag'), Tm = w('Minuten'), Ta = w('Aktien-ETFs'), Tt = w('Teilfreistellung');
  const r = R([[T0, { expr: 'happy', armR: 'count', x: 330 }], [Tf, { armR: 'present' }], [Tm, { expr: 'wink' }], [Ta, { expr: 'happy', armR: 'present' }]], { s: 0.9 });
  S(T0 - 0.1, {
    cam: push(1, 1.04), stage: stageOf('stage', [r], t => { if (t > Tf) doc(880, 560, 0.9 * pop(t, Tf), 'FREISTELLUNG', GREEN); }),
    sfx: [{ t: T0, type: 'ding' }, { t: Ts, type: 'pop' }, { t: Tf, type: 'pop' }, { t: Tt, type: 'pop' }],
    ui: t => {
      tipList(t, 1);
      text('1.000 € / Jahr', 900, 220, { size: 70, color: GOLD, weight: 900, glow: 0.5, scale: pop(t, Ts) }); text('Kapitalerträge steuerfrei', 900, 290, { size: 30, color: WHITE, weight: 800, glow: 0, alpha: fade(t, Ts + 0.3) });
      if (t > Tf) check(980, 640, 70, (t - Tm) / 0.4, GREEN);
      if (t > Tm) pill('DAUERT 2 MINUTEN', 880, 760, { size: 24, color: GREEN, scale: pop(t, Tm) });
      if (t > Ta) { panel(1480, 620, 620, 200, { color: GOLD, scale: pop(t, Ta) }); text('Aktien-ETFs:', 1480, 585, { size: 34, weight: 800, glow: 0.05, scale: pop(t, Ta) }); text('30 % Teilfreistellung', 1480, 640, { size: 44, color: GOLD, weight: 900, glow: 0.3, scale: pop(t, Tt) }); }
    },
  });
}
{
  const T0 = w('Drittens'), Tsc = w('Schenkungen'), Te = w('Eltern'), Tl = w('Lebzeiten'), Tk = w('Kinder'), Td = w('Depot'), Tg = w('Grundfreibetrag'), Tz = w('Zwölftausenddreihundertachtundvierzig'), Tt = w('tausend'), Tu = w('Über'), Ta = w('Achtung');
  const r = R([[T0, { expr: 'happy', armR: 'count', x: 330 }], [Td, { armR: 'present' }], [Ta, { expr: 'serious', armR: 'pointUp' }]], { s: 0.9 });
  const da = actor('daughter', { x: 620, s: 0.62, keys: [[Td, { expr: 'happy', armR: 'wave' }], [Ta, { expr: 'neutral', armR: 'idle' }]], enter: { t: Td, from: 'pop' } });
  S(T0 - 0.1, {
    cam: push(1, 1.04), stage: stageOf('living', [r, da]), sfx: [{ t: T0, type: 'ding' }, { t: Tl, type: 'pop' }, { t: Tz, type: 'pop' }, { t: Tu, type: 'coins' }, { t: Ta, type: 'knock' }],
    ui: t => {
      tipList(t, 2);
      if (t < Td) { chip(t, Te, 'ELTERN → DIR', 1000, 470, WHITE, 30); text('Schenken zu Lebzeiten', 1000, 580, { size: 46, color: GOLD, weight: 900, glow: 0.3, scale: pop(t, Tl) }); text('statt Testament', 1000, 650, { size: 34, color: GRAY, weight: 800, glow: 0, alpha: fade(t, Tl + 0.5) }); }
      else {
        chip(t, Td, 'KINDERDEPOT', 1000, 470, GOLD, 28);
        calc([{ t: Tz, s: '12.348 € Grundfreibetrag', c: WHITE, size: 38 }, { t: Tt, s: '+ 1.000 € Sparerpauschbetrag', c: WHITE, size: 38 }, { t: Tu, s: '> 13.000 € / Jahr steuerfrei', c: GOLD, size: 46 }], 1300, 580, t, { gap: 75 });
        stamp('GEHÖRT DEM KIND', 1300, 860, { size: 40, color: RED, scale: pop(t, Ta) });
      }
    },
  });
}
{
  const T0 = w('Viertens'), Tf = w('Firmen'), Ta = w('Auto'), Tj = w('Jeder'), Tg = w('großzügigsten');
  const r = R([[T0, { expr: 'happy', armR: 'count', x: 330 }], [Ta, { expr: 'smug', armR: 'idle', armL: 'hip' }], [Tg, { expr: 'wink' }]], { s: 0.9 });
  S(T0 - 0.1, {
    cam: push(1, 1.04), stage: stageOf('stage', [r]), sfx: [{ t: T0, type: 'ding' }, { t: Tf, type: 'pop' }, { t: Ta, type: 'pop' }],
    ui: t => {
      tipList(t, 3);
      const s1 = pop(t, T0 + 0.6); if (s1 > 0) { panel(870, 640, 460, 380, { color: GOLD, scale: s1 }); text('VERMÖGEN', 870, 490, { size: 44, color: GOLD, weight: 900, glow: 0.4, scale: s1 }); chartLine(720, 760, 300, 200, [0.1, 0.3, 0.35, 0.6, 0.9], GOLD, clamp((t - Tf) / 1.2)); }
      const s2 = pop(t, Ta); if (s2 > 0) { panel(1420, 640, 460, 380, { color: RED, scale: s2 }); text('KONSUM', 1420, 490, { size: 44, color: RED, weight: 900, glow: 0.4, scale: s2 }); x.save(); x.translate(1420, 660); x.scale(s2, s2); neon([[[-150, 30], [-130, -10], [-60, -30], [-10, -70], [80, -70], [130, -30], [160, -20], [160, 30], [-150, 30]]], RED, 5); neonCircle(-80, 34, 26, RED, 5); neonCircle(90, 34, 26, RED, 5); x.restore(); cross(1420, 650, 160, (t - Ta - 0.4) / 0.4); }
    },
  });
}
{
  const T0 = w('Das'), Tb = w('belohnt'), Tj = w('jeder'), Tf = w('fünfzig');
  const r = R([[T0, { expr: 'neutral', armR: 'present', x: 420 }], [Tb, { expr: 'smug' }], [Tj, { expr: 'happy', armR: 'present', look: 0.6 }]]);
  const n = actor('nurse', { x: 1060, keys: [[T0, { expr: 'neutral', look: -0.5 }], [Tj, { expr: 'happy' }], [Tf, { expr: 'laugh', armR: 'up' }]], enter: { t: Tj - 0.4, from: 'right' } });
  S(T0 - 0.1, {
    cam: push(1, 1.04), stage: stageOf('stage', [r, n], t => etfJar(1500, FLOOR, 1, clamp((t - Tf) / 3) * 0.4 + 0.05, GOLD, t), t => { if (t > Tf) coinFlow(t, 1140, 440, 1500, 600, { t0: Tf, n: 5, h: 120, speed: 0.6 }); }),
    sfx: [{ t: Tb, type: 'ding' }, { t: Tf, type: 'coins' }],
    ui: t => {
      text('Das System belohnt BESITZ.', W / 2, 150, { size: 60, color: GOLD, weight: 900, glow: 0.4, scale: pop(t, Tb) });
      text('50 € / Monat', 1500, 330, { size: 60, color: WHITE, weight: 900, glow: 0.3, scale: pop(t, Tf) });
    },
  });
}
{
  const T0 = w('Wenn'), Ta = w('abonnier'), Tn = w('nächsten'), Tw = w('Wirecard'), Ta2 = w('aufgeflogen');
  const r = R([[T0, { expr: 'happy', armR: 'pointDown', x: 420 }], [Tn, { expr: 'serious', armR: 'present' }], [Ta2, { expr: 'smug', armR: 'idle', armL: 'hip' }]]);
  S(T0 - 0.1, {
    cam: push(1, 1.04), stage: stageOf('stage', [r]), sfx: [{ t: Ta, type: 'pop' }, { t: Tw, type: 'bass' }, { t: Ta2, type: 'hit' }],
    ui: t => {
      const s = pop(t, Ta); if (s > 0 && t < Tn + 0.3) { x.save(); x.translate(1250, 470); x.scale(s, s); x.beginPath(); x.roundRect(-260, -70, 520, 140, 30); x.fillStyle = '#e52d27'; x.shadowColor = '#e52d27'; x.shadowBlur = 30; x.fill(); x.restore(); text('ABONNIEREN', 1250, 472, { size: 56, weight: 900, glow: 0.1, scale: s }); }
      if (t > Tn) { panel(1250, 470, 900, 480, { color: RED, scale: pop(t, Tn) }); text('NÄCHSTES VIDEO', 1250, 300, { size: 34, color: GRAY, weight: 800, spacing: 8, glow: 0, scale: pop(t, Tn) }); text('WIRECARD', 1250, 420, { size: 110, color: RED, weight: 900, glow: 0.5, scale: pop(t, Tw) }); text('1,9 Mrd. € – einfach weg?', 1250, 540, { size: 48, weight: 900, glow: 0.2, scale: pop(t, Tw + 0.5) }); stamp('AUFGEFLOGEN', 1250, 650, { size: 44, color: RED, scale: pop(t, Ta2) }); }
    },
  });
}
{
  const T0 = w('Ich'), Tr = w('Richard'), Tb = w('Bis'), Tf = w('Finanzamt');
  const r = R([[T0, { expr: 'happy', armR: 'wave', x: 760 }], [Tb, { expr: 'smug', armR: 'wave' }], [Tf, { expr: 'wink', armR: 'idle', armL: 'hip' }]]);
  const f = actor('finanzamt', { x: 1520, keys: [[Tf, { expr: 'angry', armL: 'hold', look: -0.6 }]], enter: { t: Tf - 0.1, from: 'right' } });
  S(T0 - 0.1, { cam: push(1.1, 1.18, 960, 520), stage: stageOf('office', [r, f]), sfx: [{ t: Tf, type: 'knock' }], ui: t => { text('RICHARD', 760, 140, { size: 60, color: GOLD, weight: 900, glow: 0.5, spacing: 10, scale: pop(t, Tr) }); if (t > Tf + 0.6) bubble(1520, 300, 'Wir sehen uns, Richard.', { tail: 'center', color: RED, scale: pop(t, Tf + 0.6), width: 440 }); } });
}

const capMap = {
  fünfundvierzigtausend: '45.000', fünfzehntausend: '15.000', zweihundertdreiundsechzigtausend: '263.000', fünfzigtausend: '50.000', fünfundneunzig: '95', fünf: '5',
  dreißig: '30', sechsundzwanzig: '26', eins: '1', zwei: '2', drei: '3', vier: '4', sieben: '7', acht: '8', zehn: '10', zwanzig: '20', achtzig: '80', fünfzig: '50',
  achthunderttausend: '800.000', zweihundertelftausend: '211.000', vierzigtausend: '40.000', siebenhunderttausend: '700.000', vierhunderttausend: '400.000',
  dreiundzwanzig: '23', zweihunderttausend: '200.000', siebenundzwanzig: '27', fünfundachtzig: '85', hundert: '100', fünfzehn: '15', neunzigtausend: '90.000',
  dreizehnten: '13.', zweitausendsechsundzwanzig: '2026', dreizehn: '13', tausend: '1.000', zwölftausenddreihundertachtundvierzig: '12.348', dreizehntausend: '13.000',
  prozent: '%', paragraf: '§', paragrafen: '§§',
};
setup({ words, mouth, chapters, scenes: sc, duration: DURATION, capMap });
