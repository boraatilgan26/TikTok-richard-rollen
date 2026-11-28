// Richard 2.0 – YouTube-Engine (16:9, Canvas 2D). Kern: Canvas, Mathe, Kamera, UI-Bausteine, Untertitel, Timeline.
export const W = 1920, H = 1080, FPS = 30;
export const GOLD = '#F5C84B', RED = '#FF5A5A', WHITE = '#FFFFFF', GREEN = '#5CF2A0', BLUE = '#6FB7FF', TEAL = '#5FE0D0', GRAY = '#8A8A90', INK = '#17171d';
export const FLOOR = 820;

export const canvas = document.getElementById('c');
canvas.width = W; canvas.height = H;
export const x = canvas.getContext('2d');

// ---------- Mathe ----------
export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const easeOut = t => 1 - Math.pow(1 - clamp(t), 3);
export const easeIn = t => Math.pow(clamp(t), 3);
export const easeInOut = t => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
export const easeBack = t => { t = clamp(t); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
export const pop = (t, t0, d = 0.35) => (t < t0 ? 0 : easeBack((t - t0) / d));
export const fade = (t, t0, d = 0.3) => (t < t0 ? 0 : easeOut((t - t0) / d));
export const fadeOut = (t, t1, d = 0.3) => (t < t1 ? 1 : 1 - easeOut((t - t1) / d));
export function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let q = Math.imul(seed ^ seed >>> 15, 1 | seed); q = q + Math.imul(q ^ q >>> 7, 61 | q) ^ q; return ((q ^ q >>> 14) >>> 0) / 4294967296; }; }
export const fmt = v => Math.round(v).toLocaleString('de-DE');
export const fmtEUR = v => fmt(v) + ' €';

// ---------- Zeichen-Grundlagen ----------
export function text(str, px, py, { size = 60, color = WHITE, weight = 800, glow = 0.35, align = 'center', spacing = 0, rot = 0, alpha = 1, scale = 1, stroke = 0, base = 'middle' } = {}) {
  if (alpha <= 0.001 || scale <= 0.001) return;
  x.save(); x.globalAlpha *= alpha; x.translate(px, py); x.rotate(rot); x.scale(scale, scale);
  x.font = `${weight} ${size}px Inter`; x.letterSpacing = spacing + 'px'; x.textAlign = align; x.textBaseline = base;
  if (stroke) { x.lineWidth = stroke; x.strokeStyle = 'rgba(0,0,0,0.92)'; x.lineJoin = 'round'; x.strokeText(str, 0, 0); }
  x.fillStyle = color;
  if (glow) { x.shadowColor = color; x.shadowBlur = size * glow; x.fillText(str, 0, 0); x.shadowBlur = 0; }
  x.fillText(str, 0, 0); x.restore();
}
export function measure(str, size, weight = 800, spacing = 0) { x.save(); x.font = `${weight} ${size}px Inter`; x.letterSpacing = spacing + 'px'; const w = x.measureText(str).width; x.restore(); return w; }
export function pill(str, px, py, { size = 30, color = WHITE, alpha = 1, scale = 1, fill = 'rgba(0,0,0,0.62)' } = {}) {
  if (alpha <= 0.001 || scale <= 0.001) return;
  const sp = size * 0.12, w = measure(str, size, 800, sp) + size * 1.1, h = size * 1.75;
  x.save(); x.globalAlpha *= alpha; x.translate(px, py); x.scale(scale, scale);
  x.beginPath(); x.roundRect(-w / 2, -h / 2, w, h, h * 0.32); x.fillStyle = fill; x.fill();
  x.strokeStyle = color; x.lineWidth = 3; x.shadowColor = color; x.shadowBlur = 16; x.stroke(); x.restore();
  text(str, px + sp / 2 * scale, py + 2 * scale, { size, color, glow: 0.15, spacing: sp, alpha, scale });
}
export function stamp(str, px, py, { size = 70, color = RED, rot = -0.07, alpha = 1, scale = 1 } = {}) {
  if (alpha <= 0.001 || scale <= 0.001) return;
  const sp = size * 0.08, w = measure(str, size, 900, sp) + size * 0.9, h = size * 1.5;
  x.save(); x.globalAlpha *= alpha; x.translate(px, py); x.rotate(rot); x.scale(scale, scale);
  x.beginPath(); x.roundRect(-w / 2, -h / 2, w, h, 12); x.fillStyle = 'rgba(30,0,0,0.55)'; x.fill();
  x.strokeStyle = color; x.lineWidth = 7; x.shadowColor = color; x.shadowBlur = 24; x.stroke(); x.restore();
  text(str, px, py + 3 * scale, { size, color, weight: 900, glow: 0.4, spacing: sp, rot, alpha, scale });
}
export function panel(px, py, w, h, { color = GOLD, alpha = 1, scale = 1, fill = 'rgba(8,8,12,0.86)', r = 22 } = {}) {
  if (alpha <= 0.001 || scale <= 0.001) return;
  x.save(); x.globalAlpha *= alpha; x.translate(px, py); x.scale(scale, scale);
  x.beginPath(); x.roundRect(-w / 2, -h / 2, w, h, r); x.fillStyle = fill; x.fill();
  x.strokeStyle = color; x.lineWidth = 4; x.shadowColor = color; x.shadowBlur = 22; x.stroke(); x.restore();
}
export function neon(paths, color = GOLD, lw = 5, alpha = 1, blur = 26) {
  if (alpha <= 0.001) return;
  x.save(); x.globalAlpha *= alpha; x.strokeStyle = color; x.lineWidth = lw; x.lineJoin = 'round'; x.lineCap = 'round'; x.shadowColor = color; x.shadowBlur = blur;
  for (const p of paths) { x.beginPath(); p.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.stroke(); }
  x.restore();
}
export function neonCircle(cx, cy, r, color = GOLD, lw = 5, alpha = 1) { x.save(); x.globalAlpha *= alpha; x.strokeStyle = color; x.lineWidth = lw; x.shadowColor = color; x.shadowBlur = 24; x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.stroke(); x.restore(); }
export function arrow(x1, y1, x2, y2, { color = GOLD, lw = 6, head = 22, alpha = 1, p = 1, dash = false } = {}) {
  if (p <= 0.001 || alpha <= 0.001) return;
  const ex = lerp(x1, x2, p), ey = lerp(y1, y2, p), a = Math.atan2(ey - y1, ex - x1);
  x.save(); x.globalAlpha *= alpha; x.strokeStyle = color; x.lineWidth = lw; x.lineCap = 'round'; x.shadowColor = color; x.shadowBlur = 20;
  if (dash) x.setLineDash([16, 14]);
  x.beginPath(); x.moveTo(x1, y1); x.lineTo(ex, ey); x.stroke(); x.setLineDash([]);
  x.beginPath(); x.moveTo(ex - Math.cos(a - 0.45) * head, ey - Math.sin(a - 0.45) * head); x.lineTo(ex, ey); x.lineTo(ex - Math.cos(a + 0.45) * head, ey - Math.sin(a + 0.45) * head); x.stroke();
  x.restore();
}
export function coin(px, py, r = 18, a = 0, alpha = 1) {
  if (alpha <= 0.001) return;
  x.save(); x.globalAlpha *= alpha; x.translate(px, py); x.scale(Math.abs(Math.cos(a)) * 0.8 + 0.2, 1);
  x.fillStyle = GOLD; x.shadowColor = GOLD; x.shadowBlur = 20; x.beginPath(); x.arc(0, 0, r, 0, Math.PI * 2); x.fill();
  x.shadowBlur = 0; x.strokeStyle = '#fff3c4'; x.lineWidth = Math.max(2, r * 0.14); x.beginPath(); x.arc(0, 0, r * 0.66, 0, Math.PI * 2); x.stroke(); x.restore();
}
/** animierter Münzstrom entlang einer Parabel */
export function coinFlow(t, x1, y1, x2, y2, { h = 120, n = 9, speed = 0.8, r = 16, t0 = 0, alpha = 1, color } = {}) {
  if (t < t0) return;
  for (let i = 0; i < n; i++) {
    const raw = (t - t0) * speed - i / n; if (raw < 0) continue;
    const q = raw % 1, s = Math.min(1, q * 8, (1 - q) * 8);
    coin(lerp(x1, x2, q), lerp(y1, y2, q) - Math.sin(q * Math.PI) * h, r * s, t * 5 + i, alpha);
  }
}
export function bar(cx, base, w, h, color, label, value, { alpha = 1, p = 1 } = {}) {
  if (alpha <= 0.001) return;
  const hh = Math.max(6, h * easeOut(p));
  x.save(); x.globalAlpha *= alpha; x.beginPath(); x.roundRect(cx - w / 2, base - hh, w, hh, 14); x.fillStyle = color + '40'; x.fill();
  x.strokeStyle = color; x.lineWidth = 6; x.shadowColor = color; x.shadowBlur = 26; x.stroke(); x.restore();
  if (value) text(value, cx, base - hh - 46, { size: 54, color, glow: 0.4, alpha: alpha * clamp(p * 3) });
  if (label) text(label, cx, base + 44, { size: 30, weight: 700, spacing: 4, glow: 0.1, alpha });
}
export function check(px, py, s, p, color = GOLD) { if (p <= 0) return; const pts = [[-0.5, 0], [-0.15, 0.38], [0.55, -0.45]].map(([a, b]) => [px + a * s, py + b * s]); const k = clamp(p * 2); neon([k < 0.5 ? [pts[0], [lerp(pts[0][0], pts[1][0], k * 2), lerp(pts[0][1], pts[1][1], k * 2)]] : [pts[0], pts[1], [lerp(pts[1][0], pts[2][0], (k - 0.5) * 2), lerp(pts[1][1], pts[2][1], (k - 0.5) * 2)]]], color, s * 0.16); }
export function cross(px, py, s, p, color = RED) { if (p <= 0) return; const k1 = clamp(p * 2), k2 = clamp(p * 2 - 1); neon([[[px - s / 2, py - s / 2], [px - s / 2 + s * k1, py - s / 2 + s * k1]]], color, s * 0.16); if (k2 > 0) neon([[[px + s / 2, py - s / 2], [px + s / 2 - s * k2, py - s / 2 + s * k2]]], color, s * 0.16); }
export function strike(x1, y, w, p, color = RED) { if (p > 0) neon([[[x1, y], [x1 + w * clamp(p), y]]], color, 8); }

// ---------- Hintergrund / Welt ----------
export function floorGrid(floor = FLOOR, glow = GOLD, gx = W / 2, glowA = 0.19) {
  x.fillStyle = '#040406'; x.fillRect(-W, -H, W * 3, H * 3);
  let g = x.createRadialGradient(gx, floor - 220, 40, gx, floor - 220, 1000);
  g.addColorStop(0, glow + Math.round(glowA * 255).toString(16).padStart(2, '0')); g.addColorStop(1, '#00000000'); x.fillStyle = g; x.fillRect(-W, -H, W * 3, H * 3);
  g = x.createLinearGradient(0, floor, 0, H + 200); g.addColorStop(0, '#0e0e14'); g.addColorStop(1, '#040406');
  x.fillStyle = g; x.fillRect(-W, floor, W * 3, H * 2);
  x.save(); x.strokeStyle = 'rgba(160,160,175,0.16)'; x.lineWidth = 2; x.setLineDash([14, 16]);
  for (let i = -12; i <= 12; i++) { x.beginPath(); x.moveTo(W / 2 + i * 70, floor); x.lineTo(W / 2 + i * 380, H + 200); x.stroke(); }
  for (const yy of [floor + 40, floor + 110, floor + 220]) { x.beginPath(); x.moveTo(-W, yy); x.lineTo(W * 2, yy); x.stroke(); }
  x.restore();
}
export function dust(t, seed = 7, n = 220) {
  const r = rng(seed); x.save(); x.fillStyle = 'rgba(170,170,185,0.5)';
  for (let i = 0; i < n; i++) { const s = r() * 2.4 + 0.6, px = r() * W * 1.2 - W * 0.1, py = ((r() * H * 1.2 - t * (6 + r() * 10)) % (H * 1.2) + H * 1.2) % (H * 1.2) - H * 0.1; x.globalAlpha = 0.3 + r() * 0.5; x.fillRect(px, py, s, s); }
  x.restore();
}
/** zeichnet fn normal + als Bodenreflexion */
export function reflect(fn, floor = FLOOR, strength = 0.2) {
  fn();
  x.save(); x.translate(0, floor * 2); x.scale(1, -1); x.globalAlpha = strength; fn(); x.restore();
  const g = x.createLinearGradient(0, floor, 0, floor + 300); g.addColorStop(0, 'rgba(4,4,6,0.3)'); g.addColorStop(1, 'rgba(4,4,6,1)');
  x.fillStyle = g; x.fillRect(-W, floor + 1, W * 3, H * 2);
}
export function vignette(a = 0.62) { const g = x.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 1.02); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`); x.fillStyle = g; x.fillRect(0, 0, W, H); }

// ---------- Untertitel (Satzstücke, aktives Wort gold) ----------
let CHUNKS = [];
const norm = s => s.toLowerCase().replace(/[.,!?:;„“"()…–-]/g, '');
export function buildCaptions(words, capMap = {}, maxWords = 6) {
  CHUNKS = []; let cur = [];
  const flush = () => { if (cur.length) CHUNKS.push(cur); cur = []; };
  words.forEach((w, i) => {
    const disp = capMap[norm(w.w)] ?? w.w.replace(/[„“"]/g, '');
    const prev = words[i - 1];
    if (cur.length && prev && w.s - prev.e > 0.55) flush();
    cur.push({ ...w, d: disp });
    if (/[.!?:]$/.test(w.w) || cur.length >= maxWords || (/,$/.test(w.w) && cur.length >= 3)) flush();
  });
  flush();
  // "26 Komma 4" -> "26,4"
  const DIG = { null: '0', eins: '1', zwei: '2', drei: '3', vier: '4', fünf: '5', sechs: '6', sieben: '7', acht: '8', neun: '9' };
  const num = s => DIG[norm(s)] ?? (/^\d[\d.]*$/.test(s.replace(/[.,]$/, '')) ? s.replace(/[.,]$/, '') : null);
  CHUNKS = CHUNKS.map(c => {
    const o = [];
    for (let i = 0; i < c.length; i++) {
      if (norm(c[i].w) === 'komma' && o.length && c[i + 1] && num(o[o.length - 1].w) && num(c[i + 1].w)) {
        const a = o.pop(), b = c[i + 1];
        o.push({ ...a, e: b.e, w: b.w, d: num(a.d) + ',' + num(b.w) + (/[.,:!?]$/.test(b.w) ? b.w.slice(-1) : '') }); i++;
      } else o.push(c[i]);
    }
    return o;
  });
  return CHUNKS;
}
export function drawCaption(t, { y = H * 0.915, size = 50 } = {}) {
  const ci = CHUNKS.findIndex((c, i) => t >= c[0].s - 0.05 && t < (CHUNKS[i + 1] ? Math.min(CHUNKS[i + 1][0].s - 0.05, c[c.length - 1].e + 0.7) : c[c.length - 1].e + 0.7));
  if (ci < 0) return;
  const c = CHUNKS[ci], parts = c.map(w => w.d.replace(/[,;]$/, '')).map(s => s.replace(/[.:!?]$/, m => (m === '?' || m === '!') ? m : ''));
  const sp = size * 0.28, ws = parts.map(p => measure(p, size, 800)), total = ws.reduce((a, b) => a + b, 0) + sp * (parts.length - 1);
  let s = size; if (total > 1500) s = size * 1500 / total;
  const k = s / size; let px = W / 2 - total * k / 2;
  const appear = clamp((t - c[0].s + 0.05) / 0.12);
  c.forEach((w, i) => {
    const active = t >= w.s && t < (c[i + 1] ? c[i + 1].s : w.e + 0.3);
    const col = active ? GOLD : WHITE;
    text(parts[i], px + ws[i] * k / 2, y + (1 - appear) * 10, { size: s, color: col, glow: active ? 0.25 : 0.06, stroke: 9, alpha: appear });
    px += (ws[i] + sp) * k;
  });
}

// ---------- Timeline ----------
export const STATE = { words: [], mouth: [], chapters: [], scenes: [], sfx: [], duration: 0 };
export function wordTime(i) { return STATE.words[Math.max(0, Math.min(STATE.words.length - 1, i))].s; }
/** Mundöffnung 0..1 aus Audio-Hüllkurve */
export function mouthAt(t) { const m = STATE.mouth, i = t * FPS, a = Math.floor(i); if (a < 0 || a >= m.length - 1) return 0; return lerp(m[a], m[a + 1], i - a); }
/** Wortsuche: wi('Holding', ab) -> Index (Wortanfang, case-insensitive) */
export function wi(prefix, after = 0) {
  const p = norm(prefix);
  for (let i = Math.max(0, after); i < STATE.words.length; i++) if (norm(STATE.words[i].w).startsWith(p)) return i;
  throw new Error(`wi: "${prefix}" nach ${after} nicht gefunden`);
}
export function sfx(t, type) { STATE.sfx.push({ t, type }); }

// Kamera: {z, cx, cy} interpoliert über die Szene
function camAt(S, lt, dur) {
  const c = S.cam || {}, a = c.from || { z: 1, cx: W / 2, cy: H / 2 }, b = c.to || a;
  const k = (c.ease || easeInOut)(clamp(lt / dur));
  return { z: lerp(a.z ?? 1, b.z ?? 1, k), cx: lerp(a.cx ?? W / 2, b.cx ?? W / 2, k), cy: lerp(a.cy ?? H / 2, b.cy ?? H / 2, k) };
}
export function setup({ words, mouth, chapters, scenes, duration, capMap }) {
  Object.assign(STATE, { words, mouth, chapters, duration });
  buildCaptions(words, capMap);
  STATE.scenes = scenes.map((s, i) => ({ ...s, end: scenes[i + 1] ? scenes[i + 1].start : duration }));
  STATE.scenes.forEach((s, i) => { if (i > 0 && !s.noWhoosh) STATE.sfx.push({ t: Math.max(0, s.start - 0.1), type: s.cut === 'soft' ? 'swipe' : 'whoosh' }); (s.sfx || []).forEach(e => STATE.sfx.push(e)); });
  STATE.sfx.sort((a, b) => a.t - b.t);
  window.SFX_EVENTS = STATE.sfx; window.DURATION = duration; window.SCENE_T = STATE.scenes.map(s => [s.start, s.end]);
}

export function renderFrame(t) {
  const SC = STATE.scenes; let si = SC.findIndex(s => t >= s.start && t < s.end); if (si < 0) si = SC.length - 1;
  const S = SC[si], lt = t - S.start, dur = S.end - S.start;
  const cam = camAt(S, lt, dur);
  // Übergang: kurzer Schwenk/Blur am Szenenanfang
  const tin = si === 0 || S.cut === 'none' ? 1 : easeOut(clamp(lt / 0.3));
  const dir = si % 2 ? -1 : 1, slide = (1 - tin) * 140 * dir;
  x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.shadowBlur = 0;
  x.fillStyle = '#040406'; x.fillRect(0, 0, W, H);
  x.save();
  x.translate(W / 2 + slide, H / 2); x.scale(cam.z, cam.z); x.translate(-cam.cx, -cam.cy);
  S.stage && S.stage(t, lt, S);
  x.restore();
  dust(t);
  vignette();
  x.save(); x.globalAlpha = 1 - (1 - tin) * 0.7; S.ui && S.ui(t, lt, S); x.restore();
  if (!S.noCaption) drawCaption(t);
  // Szenenstart-Flash
  if (si > 0 && lt < 0.12 && S.cut !== 'none') { x.fillStyle = `rgba(255,255,255,${0.07 * (1 - lt / 0.12)})`; x.fillRect(0, 0, W, H); }
  return si;
}
