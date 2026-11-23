// Salon Tekbas – „Einmal Taper Fade, bitte!“ (ca. 26 s, 9:16)
import { W, H, C, OL, clamp, lerp, easeOut, easeInOut, bounce, rr, box, circ, ell, line, text, emoji, alpha, scaled, person, bubble, stamp, fillStroke } from '../../engine/chibi.js';
import { setup, run } from '../../engine/timeline.js';

const DIR = 'videos/tekbas3';
const { words, w, chunks, duration } = await setup(DIR, { tail: 1.0, breakBefore: [28, 46] });
const norm = s => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, '');
function wi(word, after = 0) { const n = norm(word); for (let i = after; i < words.length; i++) if (norm(words[i].w).startsWith(n)) return i; return after; }
const sfx = []; const S = (t, type) => sfx.push({ t, type });
const loadImg = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = '/' + DIR + '/img/' + src; });
const IMG = Object.fromEntries(await Promise.all(['barber', 'front', 'chair'].map(async n => [n, await loadImg(n + '.jpg')])));
const K = { ink: '#141110', gold: '#d4a95c', goldD: '#a77d35', cream: '#f7f2ea', grey: '#8a847c', green: '#2fa36b', red: '#e0483e' };

// ---------- Anker ----------
const A = {};
A.einmal = wi('Einmal'); A.kein = wi('Kein', A.einmal); A.der = wi('Der', A.kein); A.normalen = wi('normalen', A.der); A.taper = wi('Taper', A.normalen);
A.kotel = wi('Koteletten', A.taper); A.nacken = wi('Nacken', A.kotel); A.rest = wi('Rest', A.nacken);
A.erst = wi('Erst', A.rest); A.drei = wi('drei', A.erst); A.zwei = wi('zwei', A.drei); A.eins = wi('eins', A.zwei); A.weich = wi('weich', A.eins);
A.kontur = wi('Konturen', A.weich); A.oben = wi('oben', A.kontur); A.styling = wi('Styling', A.oben); A.fertig = wi('fertig', A.styling);
A.und = wi('Und', A.fertig); A.sprachlos = wi('Sprachlos', A.und); A.outro = wi('Taper', A.sprachlos); A.jetzt = wi('jetzt', A.outro);
const t = {}; for (const k in A) t[k] = w(A[k]);

// ---------- Helfer ----------
const fade = (tt, a, b = 0.2) => clamp((tt - a) / b);
function cover(ctx, img, lt, dark = 0.6, zoom = 0.05) {
  ctx.fillStyle = K.ink; ctx.fillRect(0, 0, W, H); if (!img) return;
  const s = Math.max(W / img.width, H / img.height) * (1.02 + zoom * clamp(lt / 6));
  ctx.drawImage(img, (W - img.width * s) / 2, (H - img.height * s) / 2, img.width * s, img.height * s);
  ctx.fillStyle = `rgba(12,10,9,${dark})`; ctx.fillRect(0, 0, W, H);
}
function pillLabel(ctx, s, x, y, k, { bg = K.gold, color = K.ink, size = 38, spacing = 3 } = {}) {
  if (k <= 0) return;
  ctx.font = `900 ${size}px Nunito`; ctx.letterSpacing = spacing + 'px'; const ww = ctx.measureText(s).width + size * 1.4;
  scaled(ctx, x, y, k, () => { box(ctx, x - ww / 2, y - size * 0.85, ww, size * 1.7, size * 0.85, bg, 0); text(ctx, s, x, y + 2, { size, color, spacing }); });
}
const HAIR = '#4a2f1e';
function hexA(a) { return `rgba(74,47,30,${a})`; }

// ---------- Bens Frisur (Kopf-Koordinaten: Kopf-Ellipse 108×100 um 0,0) ----------
// st: { f: Fade 0..1, top: 0 = wild, 1 = gekürzt, style: 0..1 gestylt }
function benHair(ctx, st) {
  const f = st.f, top = st.top, sty = st.style;
  // Seiten / Koteletten
  for (const sd of [-1, 1]) {
    ctx.save(); ctx.scale(sd, 1);
    const bot = lerp(70, 34, f);
    const g = ctx.createLinearGradient(0, -50, 0, bot);
    g.addColorStop(0, hexA(1)); g.addColorStop(lerp(0.9, 0.25, f), hexA(lerp(1, 0.55, f))); g.addColorStop(1, hexA(lerp(1, 0.05, f)));
    ctx.beginPath(); ctx.moveTo(-96, -56); ctx.quadraticCurveTo(-128 + f * 10, -10, -116 + f * 6, bot); ctx.lineTo(-96, bot); ctx.lineTo(-90, -40); ctx.closePath();
    ctx.fillStyle = g; ctx.fill();
    if (f < 0.97) { const ry = 46 * (1 - f); ctx.beginPath(); ctx.ellipse(-114, -40 + ry, 30, ry, 0.15, 0, 7); ctx.fillStyle = HAIR; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = OL; ctx.stroke(); }
    if (f > 0) { const g2 = ctx.createLinearGradient(0, -60, 0, 50); g2.addColorStop(0, hexA(0.9 * f)); g2.addColorStop(0.5, hexA(0.4 * f)); g2.addColorStop(1, hexA(0)); ctx.beginPath(); ctx.ellipse(-92, -6, 22, 58, 0, 0, 7); ctx.fillStyle = g2; ctx.fill(); }
    ctx.restore();
  }
  // Oberkopf
  ctx.lineJoin = 'round';
  if (sty > 0) { // gestylter Quiff
    alpha(ctx, sty, () => {
      ctx.beginPath(); ctx.moveTo(-104, -20); ctx.bezierCurveTo(-118, -110, -40, -150, 20, -150); ctx.bezierCurveTo(90, -150, 128, -100, 104, -20);
      ctx.bezierCurveTo(80, -66, 30, -70, -10, -62); ctx.bezierCurveTo(-50, -56, -84, -50, -104, -20); ctx.closePath(); fillStroke(ctx, HAIR, 6);
      ctx.beginPath(); ctx.moveTo(-30, -130); ctx.quadraticCurveTo(20, -150, 70, -118); ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.stroke();
      for (const x of [-50, -10, 30, 64]) { ctx.beginPath(); ctx.moveTo(x, -70); ctx.quadraticCurveTo(x + 14, -110, x + 34, -134); ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 4; ctx.stroke(); }
    });
  }
  if (sty < 1) alpha(ctx, 1 - sty, () => {
    const L = lerp(1, 0.45, top); // Länge der Strähnen
    ctx.beginPath(); ctx.moveTo(-112, 12);
    const pts = [[-128, -40], [-112, -96], [-70, -112], [-50, -150], [-10, -118], [20, -158], [50, -116], [100, -116], [126, -50], [114, 12]];
    for (const [px, py] of pts) ctx.lineTo(px * lerp(1, 0.96, top), lerp(-40, py, L) + (py < -60 ? 0 : 0));
    ctx.bezierCurveTo(96, -20, 50, lerp(-10, -50, top), 0, lerp(-6, -48, top)); ctx.bezierCurveTo(-40, lerp(-10, -50, top), -94, -20, -112, 12); ctx.closePath(); fillStroke(ctx, HAIR, 6);
  });
}
// Ben/Can als Figur mit eigener Frisur
const BEN = { hair: 'bald', shirt: '#e8893a', pants: '#3b3f58', shoes: '#f2f2f2' };
const CAN = { hair: 'dad', hairColor: '#1b1515', shirt: '#1d1d1f', pants: '#1d1d1f', shoes: '#111', stubble: true, badge: '✂️' };
function ben(ctx, x, y, o, st) {
  person(ctx, x, y, { ...BEN, ...o });
  const s = o.s ?? 1, br = Math.sin((o.t ?? 0) * 2.2) * 3 * 0.5;
  ctx.save(); ctx.translate(x, y - (o.hop ? Math.abs(Math.sin((o.t ?? 0) * 6)) * 18 * s : 0)); ctx.scale(s, s); ctx.translate(0, -360 + br); benHair(ctx, st); ctx.restore();
}
const MESSY = { f: 0, top: 0, style: 0 }, FRESH = { f: 1, top: 1, style: 1 };

// ---------- Profil-Kopf für die Erklärung ----------
function profileHead(ctx, x, y, mode, tt, hl) { // mode 'fade' | 'taper', hl: {kot, nack, rest}
  const R = 170;
  // Hals
  box(ctx, x - 70, y + 110, 120, 150, 30, C.skin, 6);
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, R, 0, 7); ctx.fillStyle = C.skin; ctx.fill(); ctx.clip();
  // Haarbereich: oben + Hinterkopf
  ctx.beginPath(); ctx.moveTo(x + 130, y - 120); ctx.quadraticCurveTo(x + 40, y - 70, x + 70, y - 10);
  ctx.lineTo(x + 70, y + 60); ctx.lineTo(x + 30, y + 60); ctx.lineTo(x + 20, y - 20); ctx.lineTo(x - 60, y + 10); ctx.lineTo(x - 120, y + 120); ctx.lineTo(x - 220, y + 200); ctx.lineTo(x - 220, y - 220); ctx.lineTo(x + 220, y - 220); ctx.closePath();
  ctx.fillStyle = HAIR; ctx.fill();
  // Ausblendung zur Haut
  const skin = a => `rgba(255,217,191,${a})`;
  if (mode === 'fade') {
    const g = ctx.createLinearGradient(0, y - 40, 0, y + 150); g.addColorStop(0, skin(0)); g.addColorStop(0.55, skin(0.75)); g.addColorStop(1, skin(1));
    ctx.fillStyle = g; ctx.fillRect(x - 220, y - 40, 300, 260);
  } else {
    let g = ctx.createLinearGradient(0, y - 5, 0, y + 60); g.addColorStop(0, skin(0)); g.addColorStop(1, skin(0.95)); ctx.fillStyle = g; ctx.fillRect(x + 20, y - 5, 60, 70);
    g = ctx.createLinearGradient(0, y + 70, 0, y + 190); g.addColorStop(0, skin(0)); g.addColorStop(1, skin(1)); ctx.fillStyle = g; ctx.fillRect(x - 220, y + 70, 140, 140);
  }
  ctx.restore();
  ctx.beginPath(); ctx.arc(x, y, R, 0, 7); ctx.lineWidth = 7; ctx.strokeStyle = OL; ctx.stroke();
  // Nase, Auge, Mund (Blick nach rechts)
  ctx.beginPath(); ctx.moveTo(x + 165, y - 10); ctx.quadraticCurveTo(x + 205, y + 25, x + 160, y + 40); ctx.fillStyle = C.skin; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = OL; ctx.stroke();
  ell(ctx, x + 112, y - 20, 10, 15, OL, 0);
  ctx.beginPath(); ctx.arc(x + 130, y + 70, 16, 0.3, 1.6); ctx.lineWidth = 6; ctx.stroke();
  // Ohr
  ell(ctx, x - 10, y + 15, 28, 40, C.skin, 6);
  // Highlights
  const hiBox = (bx, by, bw, bh, k, label, lx, ly) => {
    if (k <= 0) return;
    alpha(ctx, k, () => {
      ctx.save(); ctx.setLineDash([14, 10]); ctx.lineDashOffset = -tt * 40; rr(ctx, bx, by, bw, bh, 22); ctx.strokeStyle = K.gold; ctx.lineWidth = 7; ctx.stroke(); ctx.restore();
      pillLabel(ctx, label, lx, ly, bounce(k, 0, 1), { size: 30, spacing: 0 });
    });
  };
  if (mode === 'fade') hiBox(x - 200, y - 50, 290, 230, hl.all, 'Seiten komplett', x, y + 330);
  else {
    hiBox(x + 10, y - 20, 85, 95, hl.kot, 'Koteletten', x + 150, y - 140 + 340 * 0);
    hiBox(x - 200, y + 60, 150, 130, hl.nack, 'Nacken', x - 150, y + 270);
    if (hl.rest > 0) pillLabel(ctx, '✓ Länge bleibt', x + 10, y - 210, bounce(hl.rest, 0, 1), { bg: K.green, color: '#fff', size: 30, spacing: 0 });
  }
}

// ---------- Werkzeuge ----------
function clipper(ctx, x, y, rot, guard) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  box(ctx, -34, 0, 68, 190, 26, '#222226', 6); box(ctx, -24, 120, 48, 50, 12, K.gold, 0);
  box(ctx, -40, -26, 80, 32, 8, '#c8ccd4', 6); // Klinge
  if (guard) { box(ctx, -44, -44, 88, 24, 8, 'rgba(60,60,70,0.85)', 4); }
  circ(ctx, 50, 110, 34, C.skin, 6); // Hand
  ctx.restore();
}
function trimmer(ctx, x, y, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); box(ctx, -18, 0, 36, 150, 16, '#b8bcc4', 6); box(ctx, -22, -16, 44, 18, 5, '#e6e8ec', 5); circ(ctx, 34, 90, 30, C.skin, 6); ctx.restore(); }
function scissors(ctx, x, y, open) {
  ctx.save(); ctx.translate(x, y);
  for (const sd of [-1, 1]) { ctx.save(); ctx.rotate(sd * open * 0.35); box(ctx, -8, -120, 16, 120, 6, '#d7dae0', 5); ctx.restore(); }
  for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(sd * 26, 34, 22, 0, 7); ctx.lineWidth = 10; ctx.strokeStyle = K.gold; ctx.stroke(); }
  circ(ctx, 0, 0, 9, '#555', 0); ctx.restore();
}
function hairBits(ctx, x, y, t0, tt, n = 14, spread = 60) {
  const d = tt - t0; if (d < 0) return;
  for (let i = 0; i < n; i++) {
    const ph = (d * 1.6 + i / n) % 1; const px = x + Math.sin(i * 12.9) * spread + Math.sin(ph * 6 + i) * 10, py = y + ph * 520;
    alpha(ctx, 1 - ph, () => { ctx.save(); ctx.translate(px, py); ctx.rotate(i + ph * 4); ctx.fillStyle = HAIR; ctx.fillRect(-9, -2, 18, 4); ctx.restore(); });
  }
}
function sparkle(ctx, x, y, s, k) { if (k <= 0) return; alpha(ctx, k, () => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); for (let i = 0; i < 8; i++) { const r = i % 2 ? 10 : 34, a = i * Math.PI / 4; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fillStyle = '#fff6d0'; ctx.fill(); ctx.restore(); }); }

// ---------- SFX ----------
S(0.1, 'knock'); S(t.einmal, 'pop'); S(t.kein, 'pop');
S(t.normalen, 'pop'); S(t.taper, 'pop'); S(t.kotel, 'pop'); S(t.nacken, 'pop'); S(t.rest, 'ding');
[t.drei, t.zwei, t.eins, t.weich].forEach(x => S(x - 0.1, 'buzz')); S(t.kontur, 'buzz');
S(t.oben + 0.1, 'snip'); S(t.oben + 0.45, 'snip'); S(t.styling, 'spray'); S(t.fertig, 'magic');
S(t.sprachlos - 0.1, 'hit'); S(t.jetzt, 'ding');

const scenes = [];
// ---------- 1: Hook ----------
scenes.push({ start: 0, draw(ctx, lt) {
  cover(ctx, IMG.barber, lt, 0.5);
  pillLabel(ctx, '✂️  SALON TEKBAS · BARBER', W / 2, 140, bounce(lt, 0.05, 0.3), { size: 34 });
  scaled(ctx, W / 2, 260, bounce(lt, t.einmal - 0.05, 0.35), () => text(ctx, 'TAPER FADE', W / 2, 270, { size: 120, color: '#fff', spacing: 6, shadow: true }));
  const bx = lerp(1350, 720, easeOut(lt / 0.9));
  person(ctx, 330, 1520, { ...CAN, s: 1.2, t: lt, expr: lt > t.kein ? 'happy' : 'smile', wave: lt > t.kein && lt < t.kein + 1.2 });
  ben(ctx, bx, 1520, { s: 1.2, t: lt, flip: true, talk: lt > t.einmal && lt < t.einmal + 1.1, hop: lt < 0.9 }, MESSY);
  if (lt > t.einmal - 0.1) bubble(ctx, 'Einmal Taper Fade, bitte!', 720, 880, lt - t.einmal + 0.1, { size: 44, max: 520, dur: t.kein - t.einmal + 0.05 });
  if (lt > t.kein - 0.05) bubble(ctx, 'Kein Problem! 👊', 330, 880, lt - t.kein + 0.05, { size: 44 });
  text(ctx, 'Can', 330, 1570, { size: 36, color: '#fff' }); text(ctx, 'Ben', 720 + (bx - 720), 1570, { size: 36, color: '#fff' });
}, subY: 1690 });

// ---------- 2: Fade vs. Taper ----------
scenes.push({ start: t.der - 0.05, draw(ctx, lt, tt) {
  ctx.fillStyle = '#1b1714'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(212,169,92,0.06)'; for (let i = 0; i < 12; i++) ctx.fillRect(0, i * 170, W, 85);
  text(ctx, 'Der Unterschied', W / 2, 160, { size: 52, color: '#ffffffcc' });
  const kF = bounce(tt, t.normalen - 0.1, 0.35), kT = bounce(tt, t.taper - 0.1, 0.35);
  scaled(ctx, 280, 760, kF, () => {
    pillLabel(ctx, 'FADE', 280, 420, 1, { bg: '#ffffff', size: 50 });
    profileHead(ctx, 260, 760, 'fade', tt, { all: fade(tt, t.normalen + 0.3, 0.25) });
  });
  scaled(ctx, 800, 760, kT, () => {
    pillLabel(ctx, 'TAPER', 800, 420, 1, { bg: K.gold, size: 50 });
    profileHead(ctx, 780, 760, 'taper', tt, { kot: fade(tt, t.kotel - 0.05), nack: fade(tt, t.nacken - 0.05), rest: fade(tt, t.rest - 0.1) });
  });
  if (tt > t.taper) alpha(ctx, fade(tt, t.taper), () => { line(ctx, W / 2, 470, W / 2, 1150, 'rgba(255,255,255,0.15)', 4); });
}, subY: 1350 });

// ---------- 3: Der Schnitt (Close-up) ----------
const fAt = tt => { const k = [[t.drei, 0.35], [t.zwei, 0.62], [t.eins, 0.86], [t.weich, 1]]; let f = 0; for (const [a, v] of k) { const prev = f; f = tt > a ? lerp(prev, v, clamp((tt - a) / 0.6)) : f; if (tt < a) break; } return f; };
scenes.push({ start: t.erst - 0.05, draw(ctx, lt, tt) {
  cover(ctx, IMG.chair, lt, 0.62, 0.08);
  const s = 2.5, hx = W / 2, hy = 820; const py = hy + 360 * s;
  const st = { f: fAt(tt), top: clamp((tt - t.oben - 0.1) / 0.8), style: clamp((tt - t.styling) / 0.5) };
  // Körper + Umhang
  ben(ctx, hx, py, { s, t: tt * 0.3, expr: tt > t.fertig ? 'happy' : 'neutral', look: Math.sin(tt * 1.3) * 0.4 }, st);
  ctx.beginPath(); ctx.moveTo(hx - 330, 1920); ctx.quadraticCurveTo(hx - 300, 1100, hx - 90, 1060); ctx.quadraticCurveTo(hx, 1090, hx + 90, 1060); ctx.quadraticCurveTo(hx + 300, 1100, hx + 330, 1920); ctx.closePath();
  fillStroke(ctx, '#2a2a30', 7);
  text(ctx, 'TEKBAS', hx, 1460, { size: 54, color: K.gold, spacing: 10 });
  // Werkzeuge
  const steps = [[t.drei, '3', -1], [t.zwei, '2', 1], [t.eins, '1', -1], [t.weich, '0,5', 1]];
  let cur = null; for (const sp of steps) if (tt >= sp[0] - 0.25) cur = sp;
  if (tt < t.kontur - 0.1 && tt >= t.drei - 0.4) {
    const sd = cur ? cur[2] : -1, ph = Math.sin((tt - (cur ? cur[0] : 0)) * 7);
    const cx = hx + sd * (108 * s + 30), cy = hy + 60 - ph * 70;
    clipper(ctx, cx, cy, sd * -0.15 + (sd > 0 ? Math.PI * 0 : 0), true);
    hairBits(ctx, cx, cy, t.drei, tt, 16, 40);
  }
  if (tt >= t.kontur - 0.1 && tt < t.oben) {
    const ph = Math.sin(tt * 9); trimmer(ctx, hx - 108 * s - 10, hy + 70 + ph * 30, 0.1); hairBits(ctx, hx - 270, hy + 90, t.kontur, tt, 6, 20);
  }
  if (tt >= t.oben - 0.05 && tt < t.styling) { const op = Math.abs(Math.sin(tt * 10)); scissors(ctx, hx + 60, hy - 330, op); hairBits(ctx, hx + 40, hy - 260, t.oben, tt, 12, 120); }
  if (tt >= t.styling - 0.05) {
    const k = clamp((tt - t.styling) / 0.8);
    for (let i = 0; i < 7; i++) sparkle(ctx, hx + Math.cos(i * 2.1) * 260, hy - 250 + Math.sin(i * 1.7) * 120, 0.8 + (i % 3) * 0.4, Math.sin(clamp(k * 1.3 - i * 0.08) * Math.PI));
  }
  // Labels
  if (cur && tt < t.kontur - 0.1) {
    pillLabel(ctx, 'AUFSATZ ' + cur[1], W / 2, 150, bounce(tt, cur[0] - 0.1, 0.3), { size: 46 });
    // Fade-Fortschritt
    const fw = 600; box(ctx, W / 2 - fw / 2, 230, fw, 26, 13, 'rgba(255,255,255,0.2)', 0); box(ctx, W / 2 - fw / 2, 230, Math.max(26, fw * st.f), 26, 13, K.gold, 0);
    text(ctx, 'Fade ' + Math.round(st.f * 100) + ' %', W / 2, 290, { size: 30, color: '#ffffffcc' });
  } else if (tt >= t.kontur - 0.1 && tt < t.oben) pillLabel(ctx, 'KONTUREN · TRIMMER', W / 2, 150, bounce(tt, t.kontur - 0.1, 0.3), { size: 42 });
  else if (tt >= t.oben && tt < t.styling) pillLabel(ctx, 'OBEN · SCHERE ✂️', W / 2, 150, bounce(tt, t.oben, 0.3), { size: 42 });
  else if (tt >= t.styling) pillLabel(ctx, tt > t.fertig ? 'FERTIG ✨' : 'STYLING', W / 2, 150, bounce(tt, tt > t.fertig ? t.fertig : t.styling, 0.3), { size: 46, bg: tt > t.fertig ? K.green : K.gold, color: tt > t.fertig ? '#fff' : K.ink });
}, subY: 1700 });

// ---------- 4: Vorher / Nachher ----------
scenes.push({ start: t.und - 0.05, draw(ctx, lt, tt) {
  cover(ctx, IMG.barber, lt, 0.68);
  const kV = bounce(lt, 0.05, 0.3), kN = bounce(lt, 0.3, 0.3);
  scaled(ctx, 280, 900, kV, () => {
    box(ctx, 60, 330, 440, 1060, 40, 'rgba(255,255,255,0.1)', 0);
    pillLabel(ctx, 'VORHER', 280, 410, 1, { bg: '#ffffff', size: 40 });
    ben(ctx, 280, 1330, { s: 1.15, t: tt, expr: 'neutral' }, MESSY);
  });
  scaled(ctx, 800, 900, kN, () => {
    box(ctx, 580, 330, 440, 1060, 40, 'rgba(212,169,92,0.18)', 0);
    pillLabel(ctx, 'NACHHER', 800, 410, 1, { bg: K.gold, size: 40 });
    ben(ctx, 800, 1330, { s: 1.15, t: tt, expr: tt > t.sprachlos - 0.1 ? 'wow' : 'happy' }, FRESH);
    for (let i = 0; i < 5; i++) sparkle(ctx, 800 + Math.cos(i * 1.9 + tt) * 200, 760 + Math.sin(i * 2.3 + tt) * 150, 0.7, 0.5 + 0.5 * Math.sin(tt * 4 + i));
  });
  if (tt > t.sprachlos - 0.1) stamp(ctx, 'SPRACHLOS 😮', W / 2, 1490, tt - t.sprachlos + 0.1, { color: K.goldD, size: 64, rot: -0.08 });
}, subY: 1680 });

// ---------- 5: Outro ----------
scenes.push({ start: t.outro - 0.05, draw(ctx, lt, tt) {
  cover(ctx, IMG.front, lt, 0.62, 0.04);
  scaled(ctx, W / 2, 330, bounce(lt, 0.05, 0.35), () => {
    text(ctx, 'TAPER FADE', W / 2, 300, { size: 120, color: K.gold, spacing: 6, shadow: true });
    text(ctx, 'bei Salon Tekbas', W / 2, 410, { size: 56, color: '#fff' });
  });
  alpha(ctx, fade(lt, 0.4), () => {
    box(ctx, 140, 500, 800, 130, 30, 'rgba(255,255,255,0.92)', 0);
    text(ctx, 'Herrenhaarschnitt by Can', W / 2, 545, { size: 44, color: K.ink });
    text(ctx, '30 Min. · 33 €', W / 2, 598, { size: 34, weight: 800, color: K.goldD });
  });
  person(ctx, 360, 1300, { ...CAN, s: 0.95, t: tt, expr: 'happy', wave: true });
  ben(ctx, 720, 1300, { s: 0.95, t: tt, expr: 'happy' }, FRESH);
  scaled(ctx, W / 2, 1440, bounce(tt, t.jetzt - 0.1, 0.35), () => { box(ctx, 120, 1370, 840, 140, 70, K.gold, 0); text(ctx, 'Jetzt über Planity buchen!', W / 2, 1442, { size: 56, color: K.ink }); });
  alpha(ctx, fade(lt, 0.6), () => {
    text(ctx, 'Lindenstraße 37 · 49152 Bad Essen', W / 2, 1620, { size: 38, weight: 800, color: '#ffffffdd' });
    text(ctx, '☎ 05472 – 967 99 33 · salon-tekbas.de', W / 2, 1680, { size: 34, weight: 800, color: '#ffffffaa' });
  });
} });

run({ scenes, chunks, duration, sfx, subY: 1690, hideSubs: [[t.outro - 0.05, 99]] });
