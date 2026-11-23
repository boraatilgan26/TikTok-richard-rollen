// Salon Tekbas – Telefon vs. Online (30 s, 9:16): Tom ruft an, Lisa bucht mit Planity, am Ende der Vergleich
import { W, H, C, clamp, lerp, easeOut, easeInOut, bounce, rr, box, circ, line, text, emoji, alpha, scaled, person, bubble, stamp } from '../../engine/chibi.js';
import { setup, run } from '../../engine/timeline.js';

const DIR = 'videos/tekbas2';
const { words, w, chunks, duration } = await setup(DIR, { tail: 0.12, breakBefore: [18, 29, 68] });
const norm = s => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, '');
function wi(word, after = 0) { const n = norm(word); for (let i = after; i < words.length; i++) if (norm(words[i].w).startsWith(n)) return i; return after; }
const sfx = []; const S = (t, type) => sfx.push({ t, type });

const loadImg = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = '/' + DIR + '/img/' + src; });
const IMG = Object.fromEntries(await Promise.all(['front', 'salon', 'signatur'].map(async n => [n, await loadImg(n + (n === 'signatur' ? '.png' : '.jpg'))])));

const K = { ink: '#141110', gold: '#d4a95c', goldD: '#a77d35', cream: '#f7f2ea', grey: '#8a847c', line: '#e6e1da', green: '#2fa36b', red: '#e0483e', plan: '#111111' };

// ---------- Anker ----------
const A = {};
A.tekbas = wi('Tekbas'); A.tom = wi('Tom', A.tekbas); A.montag = wi('Montag', A.tom); A.tuut1 = wi('Tuut', A.montag); A.tuut2 = A.tuut1 + 1;
A.montags = wi('Montags', A.tuut2); A.geschl = wi('geschlossen', A.montags);
A.lisa = wi('Lisa', A.geschl); A.laedt = wi('lädt', A.lisa); A.reg = wi('registriert', A.laedt); A.haar = wi('Haarschnitt', A.reg);
A.friseurin = wi('Friseurin', A.haar); A.uhrzeit = wi('Uhrzeit', A.friseurin); A.gebucht = wi('Gebucht', A.uhrzeit); A.minute = wi('Minute', A.gebucht);
A.dienstag = wi('Dienstag', A.minute); A.besetzt = wi('besetzt', A.dienstag); A.team = wi('Team', A.besetzt);
A.lisa2 = wi('Lisa', A.team); A.erinn = wi('Erinnerung', A.lisa2); A.sms = wi('SMS', A.erinn);
A.vergleich = wi('Vergleich', A.sms); A.rund = wi('rund', A.vergleich); A.sofort = wi('sofort', A.rund); A.ohne = wi('ohne', A.sofort);
A.outro = wi('Salon', A.ohne); A.jetzt = wi('jetzt', A.outro);
const t = {}; for (const k in A) t[k] = w(A[k]);

// ---------- Helfer ----------
const fade = (tt, a, b = 0.2) => clamp((tt - a) / b);
const typed = (s, t0, t1, tt) => s.slice(0, Math.round(s.length * clamp((tt - t0) / (t1 - t0))));
function pillLabel(ctx, s, x, y, k, { bg = K.gold, color = '#fff', size = 38, spacing = 4 } = {}) {
  if (k <= 0) return;
  ctx.font = `900 ${size}px Nunito`; ctx.letterSpacing = spacing + 'px'; const ww = ctx.measureText(s).width + size * 1.4;
  scaled(ctx, x, y, k, () => { box(ctx, x - ww / 2, y - size * 0.85, ww, size * 1.7, size * 0.85, bg, 0); text(ctx, s, x, y + 2, { size, color, spacing }); });
}
function check(ctx, x, y, r, k, col = K.green) {
  if (k <= 0) return;
  scaled(ctx, x, y, bounce(k, 0, 1), () => {
    circ(ctx, x, y, r, col, 0);
    ctx.beginPath(); ctx.moveTo(x - r * 0.45, y + r * 0.02); ctx.lineTo(x - r * 0.12, y + r * 0.35); ctx.lineTo(x + r * 0.5, y - r * 0.32);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = r * 0.18; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
  });
}
function cross(ctx, x, y, r, k, col = K.red) {
  if (k <= 0) return;
  scaled(ctx, x, y, bounce(k, 0, 1), () => {
    circ(ctx, x, y, r, col, 0); const d = r * 0.36;
    line(ctx, x - d, y - d, x + d, y + d, '#fff', r * 0.18); line(ctx, x + d, y - d, x - d, y + d, '#fff', r * 0.18);
  });
}
function tap(ctx, x, y, tt, t0) {
  const d = tt - t0; if (d < -0.25 || d > 0.45) return;
  alpha(ctx, clamp((d + 0.25) / 0.15) * (1 - clamp((d - 0.25) / 0.2)), () => {
    if (d > 0) { const k = clamp(d / 0.4); ctx.beginPath(); ctx.arc(x, y, 30 + 60 * k, 0, 7); ctx.strokeStyle = `rgba(212,169,92,${1 - k})`; ctx.lineWidth = 8; ctx.stroke(); }
    circ(ctx, x, y, 34, 'rgba(255,255,255,0.85)', 0); ctx.beginPath(); ctx.arc(x, y, 34, 0, 7); ctx.strokeStyle = K.gold; ctx.lineWidth = 6; ctx.stroke();
  });
}
function cover(ctx, img, lt, dark = 0.6) {
  ctx.fillStyle = K.ink; ctx.fillRect(0, 0, W, H); if (!img) return;
  const s = Math.max(W / img.width, H / img.height) * (1.02 + 0.04 * clamp(lt / 4));
  ctx.drawImage(img, (W - img.width * s) / 2, (H - img.height * s) / 2, img.width * s, img.height * s);
  ctx.fillStyle = `rgba(12,10,9,${dark})`; ctx.fillRect(0, 0, W, H);
}

// ---------- Handy (Original-Maße, wird skaliert gezeichnet) ----------
const PH = { x: 262, y: 395, w: 556, h: 1110 };
const SC = { x: PH.x + 16, y: PH.y + 16, w: PH.w - 32, h: PH.h - 32 };
const X0 = SC.x + 34, XW = SC.w - 68, XC = SC.x + SC.w / 2;
function phoneAt(ctx, cx, top, s, drawScreen, { dark = false } = {}) {
  ctx.save(); ctx.translate(cx, top); ctx.scale(s, s); ctx.translate(-(PH.x + PH.w / 2), -PH.y);
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 18; box(ctx, PH.x, PH.y, PH.w, PH.h, 78, '#0b0b0c', 0); ctx.restore();
  ctx.save(); rr(ctx, SC.x, SC.y, SC.w, SC.h, 62); ctx.clip();
  ctx.fillStyle = dark ? '#1c1c1e' : '#fff'; ctx.fillRect(SC.x, SC.y, SC.w, SC.h);
  drawScreen(ctx);
  const fg = dark ? '#fff' : K.ink;
  text(ctx, '10:05', SC.x + 70, SC.y + 40, { size: 26, color: fg });
  text(ctx, '▮▮▮  ◔', SC.x + SC.w - 80, SC.y + 40, { size: 20, color: fg });
  box(ctx, W / 2 - 70, SC.y + 18, 140, 42, 21, '#0b0b0c', 0);
  ctx.restore(); ctx.restore();
}
function appBar(ctx, title) {
  ctx.fillStyle = '#fff'; ctx.fillRect(SC.x, SC.y, SC.w, 170);
  text(ctx, '‹', X0 + 6, SC.y + 118, { size: 60, color: K.ink, weight: 800, align: 'left' });
  text(ctx, title, XC, SC.y + 118, { size: 36, color: K.ink });
  line(ctx, SC.x, SC.y + 168, SC.x + SC.w, SC.y + 168, K.line, 2);
}
const planityLogo = (ctx, x, y, size, color = K.plan) => text(ctx, 'PLANITY', x, y, { size, color, spacing: size * 0.22 });

// --- Toms Anruf-Bildschirm ---
function scrCall(ctx, tt, mode) { // mode: 'ring' | 'closed' | 'busy'
  const g = ctx.createLinearGradient(0, SC.y, 0, SC.y + SC.h); g.addColorStop(0, '#3a3f4a'); g.addColorStop(1, '#15171c');
  ctx.fillStyle = g; ctx.fillRect(SC.x, SC.y, SC.w, SC.h);
  circ(ctx, XC, SC.y + 260, 90, '#5b6070', 0); text(ctx, 'ST', XC, SC.y + 264, { size: 64, color: '#fff' });
  text(ctx, 'Salon Tekbas', XC, SC.y + 420, { size: 50, color: '#fff' });
  text(ctx, '05472 – 967 99 33', XC, SC.y + 480, { size: 30, weight: 800, color: '#ffffffaa' });
  let status = 'Wird gewählt …', col = '#ffffffcc';
  if (mode === 'ring') status = 'Klingelt' + '.'.repeat(1 + Math.floor(tt * 3) % 3);
  if (mode === 'closed') { status = 'Keine Antwort'; col = '#ff8a80'; }
  if (mode === 'busy') { status = 'Besetzt'; col = '#ff8a80'; }
  text(ctx, status, XC, SC.y + 560, { size: 38, color: col });
  // Tasten
  [['🔇', 'stumm'], ['⌨️', 'Tasten'], ['🔊', 'Lautspr.']].forEach(([e, l], i) => {
    const x = X0 + XW / 6 + i * XW / 3; circ(ctx, x, SC.y + 720, 58, '#ffffff22', 0); emoji(ctx, e, x, SC.y + 720, 46);
    text(ctx, l, x, SC.y + 805, { size: 22, weight: 800, color: '#ffffffaa' });
  });
  circ(ctx, XC, SC.y + 940, 66, '#ff3b30', 0); emoji(ctx, '📞', XC, SC.y + 940, 56);
}

// --- Lisas App-Bildschirme ---
const L = { store: t.laedt - 0.2, signup: t.reg - 0.15, service: t.haar - 0.3, team: t.friseurin - 0.25, time: t.uhrzeit - 0.25, done: t.gebucht - 0.1 };
function scrStore(ctx, tt) {
  const iy = SC.y + 200;
  box(ctx, X0, iy, 190, 190, 46, K.plan, 0); text(ctx, 'P', X0 + 95, iy + 100, { size: 120, color: '#fff' });
  text(ctx, 'Planity', X0 + 220, iy + 55, { size: 46, color: K.ink, align: 'left' });
  text(ctx, 'Beauty-Termine', X0 + 220, iy + 105, { size: 28, weight: 800, color: K.grey, align: 'left' });
  const bx = X0 + 220, by = iy + 130, bw = 210, bh = 64, tP = L.store + 0.25, tD = L.store + 0.75;
  if (tt < tP) { box(ctx, bx, by, bw, bh, 32, '#1b74e8', 0); text(ctx, 'LADEN', bx + bw / 2, by + bh / 2 + 2, { size: 30, color: '#fff' }); }
  else if (tt < tD) { const k = clamp((tt - tP) / (tD - tP)); ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(bx + 40, by + bh / 2, 26, 0, 7); ctx.strokeStyle = K.line; ctx.stroke(); ctx.beginPath(); ctx.arc(bx + 40, by + bh / 2, 26, -Math.PI / 2, -Math.PI / 2 + k * 7); ctx.strokeStyle = '#1b74e8'; ctx.stroke(); }
  else { box(ctx, bx, by, bw, bh, 32, '#eef0f4', 0); text(ctx, 'ÖFFNEN', bx + bw / 2, by + bh / 2 + 2, { size: 30, color: '#1b74e8' }); }
  tap(ctx, bx + bw / 2, by + bh / 2, tt, tP);
  [['4,9 ★', 'Bewertung'], ['Gratis', 'Preis'], ['24/7', 'Buchung']].forEach(([a, b], i) => { const x = X0 + XW / 6 + i * XW / 3; text(ctx, a, x, iy + 300, { size: 36, color: K.ink }); text(ctx, b, x, iy + 342, { size: 24, weight: 800, color: K.grey }); });
  for (let i = 0; i < 3; i++) { box(ctx, X0 + i * (XW / 3) + 6, iy + 400, XW / 3 - 12, 400, 26, ['#f1ede7', '#ece7df', '#f4f0ea'][i], 0); planityLogo(ctx, X0 + i * (XW / 3) + XW / 6, iy + 600, 18, '#b9b2a7'); }
}
function field(ctx, label, value, y, active, done) {
  text(ctx, label, X0, y, { size: 28, weight: 800, color: K.grey, align: 'left' });
  rr(ctx, X0, y + 22, XW, 96, 22); ctx.fillStyle = '#f6f5f3'; ctx.fill(); ctx.strokeStyle = active ? K.ink : K.line; ctx.lineWidth = active ? 4 : 2; ctx.stroke();
  text(ctx, value, X0 + 26, y + 72, { size: 34, weight: 800, color: K.ink, align: 'left' });
  if (done) check(ctx, X0 + XW - 44, y + 70, 24, 1);
}
function scrSignup(ctx, tt) {
  appBar(ctx, 'Konto erstellen');
  planityLogo(ctx, XC, SC.y + 250, 44);
  const span = (L.service - L.signup - 0.35) / 3;
  [['Name', 'Lisa Müller'], ['E-Mail', 'lisa@mail.de'], ['Handynummer', '+49 170 1234567']].forEach(([lab, val], i) => {
    const t0 = L.signup + 0.1 + i * span, y = SC.y + 330 + i * 165;
    field(ctx, lab, typed(val, t0, t0 + span * 0.85, tt), y, tt >= t0 && tt < t0 + span, tt > t0 + span * 0.9);
  });
  const tB = L.service - 0.22, done = tt > tB + 0.05;
  box(ctx, X0, SC.y + 850, XW, 100, 50, done ? K.green : K.plan, 0); text(ctx, done ? '✓ Registriert' : 'Konto erstellen', XC, SC.y + 902, { size: 36, color: '#fff' });
  tap(ctx, XC + 100, SC.y + 900, tt, tB);
}
function scrService(ctx, tt) {
  appBar(ctx, 'Salon Tekbas');
  text(ctx, 'Damen · Haarschnitt', X0, SC.y + 225, { size: 28, color: K.goldD, align: 'left' });
  const list = [['Damenhaarschnitt', '30 Min. · 32 €'], ['Waschen, Schneiden & Föhnen', '45 Min. · 48 €'], ['Waschen, Föhnen & Legen', '30 Min. · 29 €']];
  const tS = L.service + 0.3;
  list.forEach(([n, d], i) => {
    const y = SC.y + 270 + i * 175, sel = i === 0 && tt > tS;
    rr(ctx, X0, y, XW, 150, 24); ctx.fillStyle = sel ? '#fbf6ec' : '#fff'; ctx.fill(); ctx.strokeStyle = sel ? K.gold : K.line; ctx.lineWidth = sel ? 5 : 2; ctx.stroke();
    text(ctx, n, X0 + 24, y + 55, { size: 26, color: K.ink, align: 'left' });
    text(ctx, d, X0 + 24, y + 105, { size: 26, weight: 800, color: K.grey, align: 'left' });
    if (sel) check(ctx, X0 + XW - 50, y + 75, 28, (tt - tS) / 0.2);
  });
  tap(ctx, X0 + XW - 50, SC.y + 345, tt, tS);
}
const TEAM = ['Lusin', 'Larysa', 'Aliona', 'Julia'];
function scrTeam(ctx, tt) {
  appBar(ctx, 'Mit wem?');
  const tS = L.team + 0.35, cols = ['#8e5b6e', '#5b6e8e', '#7a6a4a', '#4f7a6a'];
  TEAM.forEach((n, i) => {
    const cx = X0 + XW / 4 + (i % 2) * XW / 2, cy = SC.y + 350 + Math.floor(i / 2) * 280, sel = n === 'Larysa' && tt > tS;
    circ(ctx, cx, cy, 90, cols[i], 0); text(ctx, n[0], cx, cy + 4, { size: 80, color: '#fff' });
    if (sel) { ctx.beginPath(); ctx.arc(cx, cy, 100, 0, 7); ctx.strokeStyle = K.gold; ctx.lineWidth = 9; ctx.stroke(); }
    text(ctx, n, cx, cy + 135, { size: 32, color: sel ? K.ink : K.grey });
  });
  tap(ctx, X0 + XW * 0.75, SC.y + 350, tt, tS);
}
function scrTime(ctx, tt) {
  appBar(ctx, 'Wunschzeit');
  const tD = L.time + 0.15, tS = L.time + 0.45;
  [['Di', 24], ['Mi', 25], ['Do', 26], ['Fr', 27]].forEach(([d, n], i) => {
    const bw = XW / 4 - 10, x = X0 + i * (XW / 4) + 5, y = SC.y + 210, sel = i === 1 && tt > tD;
    box(ctx, x, y, bw, 130, 22, sel ? K.ink : '#f3f1ee', 0);
    text(ctx, d, x + bw / 2, y + 42, { size: 26, weight: 800, color: sel ? '#fff' : K.grey }); text(ctx, String(n), x + bw / 2, y + 92, { size: 40, color: sel ? '#fff' : K.ink });
  });
  ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00'].forEach((s, i) => {
    const bw = XW / 3 - 14, x = X0 + (i % 3) * (XW / 3) + 7, y = SC.y + 400 + Math.floor(i / 3) * 120, sel = s === '10:30' && tt > tS;
    rr(ctx, x, y, bw, 96, 20); ctx.fillStyle = sel ? K.gold : '#fff'; ctx.fill(); ctx.strokeStyle = sel ? K.gold : K.line; ctx.lineWidth = 3; ctx.stroke();
    text(ctx, s, x + bw / 2, y + 50, { size: 32, color: K.ink });
  });
  tap(ctx, X0 + XW / 6, SC.y + 568, tt, tS);
}
function scrDone(ctx, tt) {
  check(ctx, XC, SC.y + 330, 130, (tt - L.done) / 0.35);
  alpha(ctx, fade(tt, L.done + 0.2), () => {
    text(ctx, 'Gebucht!', XC, SC.y + 560, { size: 64, color: K.ink });
    text(ctx, 'Damenhaarschnitt · Larysa', XC, SC.y + 640, { size: 30, weight: 800, color: K.grey });
    text(ctx, 'Mi, 25. Nov · 10:30 Uhr', XC, SC.y + 690, { size: 30, weight: 800, color: K.grey });
    text(ctx, 'Bezahlung vor Ort', XC, SC.y + 760, { size: 28, color: K.goldD });
  });
  const d = tt - L.done;
  if (d > 0 && d < 1.4) for (let i = 0; i < 40; i++) {
    const a = (i * 137.5) % 360 * Math.PI / 180, sp = 240 + (i * 53) % 260;
    const x = XC + Math.cos(a) * sp * d * 1.2, y = SC.y + 330 + Math.sin(a) * sp * d + 500 * d * d;
    alpha(ctx, 1 - clamp((d - 0.7) / 0.6), () => { ctx.save(); ctx.translate(x, y); ctx.rotate(d * 8 + i); ctx.fillStyle = [K.gold, K.green, K.red, '#3a7bd5'][i % 4]; ctx.fillRect(-10, -6, 20, 12); ctx.restore(); });
  }
}
function scrLock(ctx, tt) { // Sperrbildschirm mit SMS-Erinnerung
  const g = ctx.createLinearGradient(0, SC.y, 0, SC.y + SC.h); g.addColorStop(0, '#c9a46a'); g.addColorStop(1, '#5a4430');
  ctx.fillStyle = g; ctx.fillRect(SC.x, SC.y, SC.w, SC.h);
  text(ctx, 'Dienstag, 24. November', XC, SC.y + 160, { size: 30, weight: 800, color: '#fff' });
  text(ctx, '18:00', XC, SC.y + 270, { size: 130, color: '#fff' });
  const k = easeOut((tt - t.erinn + 0.25) / 0.3);
  if (k > 0) {
    const y = SC.y + 400 + (1 - k) * -150;
    alpha(ctx, k, () => {
      box(ctx, X0 - 10, y, XW + 20, 260, 34, 'rgba(255,255,255,0.92)', 0);
      box(ctx, X0 + 14, y + 26, 54, 54, 14, K.green, 0); text(ctx, '💬', X0 + 41, y + 55, { size: 30 });
      text(ctx, 'SMS · Erinnerung', X0 + 84, y + 54, { size: 26, color: K.ink, align: 'left' });
      text(ctx, 'jetzt', X0 + XW - 6, y + 54, { size: 22, weight: 800, color: K.grey, align: 'right' });
      text(ctx, 'Dein Termin morgen um 10:30', X0 + 14, y + 128, { size: 28, color: K.ink, align: 'left' });
      text(ctx, 'bei Salon Tekbas, Bad Essen.', X0 + 14, y + 172, { size: 28, weight: 800, color: K.ink, align: 'left' });
      text(ctx, 'Wir freuen uns auf dich! ✂️', X0 + 14, y + 216, { size: 26, weight: 800, color: K.grey, align: 'left' });
    });
  }
}
function lisaScreen(ctx, tt) {
  if (tt >= t.lisa2 - 0.2) return scrLock(ctx, tt);
  ctx.fillStyle = '#fff'; ctx.fillRect(SC.x, SC.y, SC.w, SC.h);
  if (tt < L.store) { planityLogo(ctx, XC, SC.y + 500, 56); text(ctx, 'Schnell • Einfach • 24/7', XC, SC.y + 580, { size: 30, weight: 800, color: K.grey }); return; }
  if (tt < L.signup) return scrStore(ctx, tt);
  if (tt < L.service) return scrSignup(ctx, tt);
  if (tt < L.team) return scrService(ctx, tt);
  if (tt < L.time) return scrTeam(ctx, tt);
  if (tt < L.done) return scrTime(ctx, tt);
  return scrDone(ctx, tt);
}

// ---------- Figuren ----------
const phoneEar = ctx => { box(ctx, 86, -398, 44, 84, 10, '#2b2b35', 5); };
const phoneHand = ctx => { box(ctx, -112, -150, 50, 86, 10, '#2b2b35', 5); box(ctx, -106, -144, 38, 66, 4, '#9ad8f0', 0); };
const TOM = { hair: 'dad', hairColor: '#3a2a20', shirt: '#4a7ab8', pants: '#3b3f58', shoes: '#2b2b2b', stubble: true };
const LISA = { hair: 'long', hairColor: '#7a4a2a', shirt: '#2fa36b', pants: '#3b3f58', shoes: '#f2f2f2' };

// ---------- Hälften ----------
const TOP = { y: 0, h: 850 }, BOT = { y: 1070, h: 850 };
function halfBg(ctx, r, wall, floor, label, labelBg) {
  ctx.fillStyle = wall; ctx.fillRect(0, r.y, W, r.h);
  ctx.fillStyle = 'rgba(255,255,255,0.12)'; for (let x = 0; x < W; x += 90) ctx.fillRect(x, r.y, 45, r.h - 140);
  ctx.fillStyle = floor; ctx.fillRect(0, r.y + r.h - 140, W, 140);
  ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(0, r.y + r.h - 140, W, 8);
}
function dayBadge(ctx, s, x, y, k, bg = K.ink) { pillLabel(ctx, s, x, y, k, { bg, size: 34, spacing: 1 }); }
function dim(ctx, r, a) { if (a > 0) { ctx.fillStyle = `rgba(10,8,8,${0.55 * a})`; ctx.fillRect(0, r.y, W, r.h); } }
// Fokus: 0 = beide, 1 = oben (Tom), 2 = unten (Lisa)
function focusAt(tt) { if (tt < t.tom - 0.1) return 0; if (tt < t.lisa - 0.1) return 1; if (tt < t.dienstag - 0.1) return 2; if (tt < t.lisa2 - 0.1) return 1; return 2; }
function dimAmt(tt, half) {
  const ev = [0, t.tom - 0.1, t.lisa - 0.1, t.dienstag - 0.1, t.lisa2 - 0.1];
  let i = 0; ev.forEach((e, j) => { if (tt >= e) i = j; });
  const f = focusAt(tt), pf = focusAt(ev[i] - 0.01);
  const want = f => (f === 0 ? 0 : (f === 1) === (half === 'top') ? 0 : 1);
  return lerp(want(pf), want(f), clamp((tt - ev[i]) / 0.25));
}

// ---------- SFX ----------
S(t.tom, 'pop'); S(t.montag, 'pop'); S(t.tuut1 - 0.05, 'tuut'); S(t.geschl - 0.1, 'hit');
S(L.store + 0.25, 'pop'); [L.signup, L.service, L.team, L.time].forEach(x => S(x, 'swipe')); S(L.service + 0.3, 'pop'); S(L.team + 0.35, 'pop'); S(L.time + 0.45, 'pop');
S(L.done, 'magic'); S(L.done + 0.05, 'ding');
S(t.dienstag, 'pop'); S(t.besetzt - 0.1, 'busy'); S(t.erinn - 0.2, 'ding');
S(t.vergleich, 'whoosh'); [t.rund, t.sofort, t.ohne].forEach(x => S(x, 'pop'));

const scenes = [];
// ---------- 1: Geteiltes Bild ----------
scenes.push({ start: 0, noSlide: true, draw(ctx, tt) {
  ctx.fillStyle = K.ink; ctx.fillRect(0, 0, W, H);
  const tuesday = tt >= t.dienstag;
  // ===== OBEN: Tom (Telefon) =====
  ctx.save(); rr(ctx, 0, TOP.y, W, TOP.h, 0); ctx.clip();
  halfBg(ctx, TOP, '#f2d6b8', '#b98454');
  const tomPhone = tt > t.tom + 0.3;
  const tomExpr = tt > t.besetzt ? 'angry' : tt > t.geschl - 0.1 ? 'sad' : tt > t.tom ? 'neutral' : 'smile';
  person(ctx, 270, TOP.y + 800, { ...TOM, s: 0.95, t: tt, expr: tomExpr, armUp: tomPhone ? 2.5 : 0, prop: tomPhone ? phoneEar : null });
  if (tt < t.tom) bubble(ctx, 'Ich brauch’ einen Termin! ✂️', 290, TOP.y + 300, tt - 0.4, { size: 34, max: 420 });
  if (tt > t.tuut1 - 0.1 && tt < t.montags) bubble(ctx, 'Tuut … tuut …', 300, TOP.y + 290, tt - t.tuut1 + 0.1, { size: 40 });
  if (tt > t.besetzt - 0.1 && tt < t.lisa2 + 0.4) bubble(ctx, 'Schon wieder besetzt! 😤', 290, TOP.y + 300, tt - t.besetzt + 0.1, { size: 34, max: 420 });
  // Anrufbildschirm
  if (tt > t.tom + 0.1) {
    const k = easeOut((tt - t.tom - 0.1) / 0.35);
    const mode = tuesday ? (tt > t.besetzt - 0.1 ? 'busy' : 'ring') : tt > t.montags - 0.1 ? 'closed' : 'ring';
    phoneAt(ctx, 800, TOP.y + 110 + (1 - k) * 800, 0.6, c => scrCall(c, tt, mode), { dark: true });
  }
  pillLabel(ctx, '📞 PER TELEFON', 210, TOP.y + 60, bounce(tt, 0.15, 0.3), { bg: K.red, size: 32, spacing: 2 });
  if (tt > t.montag - 0.05) dayBadge(ctx, tuesday ? 'Di · 11:00' : 'Mo · 10:00', 210, TOP.y + 150, bounce(tt, tuesday ? t.dienstag : t.montag - 0.05, 0.3));
  if (tt > t.geschl - 0.1 && !tuesday) stamp(ctx, 'MONTAGS GESCHLOSSEN', W / 2, TOP.y + 735, tt - t.geschl + 0.1, { color: K.red, size: 54, rot: -0.1 });
  if (tt > t.team - 0.05 && tt < t.lisa2 + 0.4) {
    const k = bounce(tt, t.team - 0.05, 0.3);
    scaled(ctx, W / 2, TOP.y + 735, k, () => { box(ctx, W / 2 - 300, TOP.y + 690, 600, 90, 45, K.ink, 0); text(ctx, '✂️ Team ist mitten im Haarschnitt', W / 2, TOP.y + 737, { size: 32, color: '#fff' }); });
  }
  if (tuesday) pillLabel(ctx, 'Anrufversuch 2 ❌', 800, TOP.y + 60, bounce(tt, t.besetzt, 0.3), { bg: K.ink, size: 28, spacing: 0 });
  dim(ctx, TOP, dimAmt(tt, 'top'));
  ctx.restore();

  // ===== UNTEN: Lisa (Online) =====
  ctx.save(); rr(ctx, 0, BOT.y, W, BOT.h, 0); ctx.clip();
  halfBg(ctx, BOT, '#dfe9e1', '#8fa08f');
  const lisaPhone = tt > t.lisa;
  person(ctx, 270, BOT.y + 800, { ...LISA, s: 0.95, t: tt, expr: tt > L.done ? 'happy' : tt > t.lisa ? 'smile' : 'smile', prop: lisaPhone ? phoneHand : null, hop: tt > L.done && tt < L.done + 1.2 });
  if (tt < t.tom) bubble(ctx, 'Ich auch! 💇‍♀️', 290, BOT.y + 300, tt - 1.0, { size: 34 });
  if (tt > t.minute && tt < t.dienstag) bubble(ctx, 'Das ging schnell! 😍', 290, BOT.y + 300, tt - t.minute, { size: 34 });
  if (tt > t.lisa2 + 0.2) bubble(ctx, 'Perfekt, danke! 😊', 290, BOT.y + 300, tt - t.lisa2 - 0.2, { size: 34 });
  if (tt > t.lisa - 0.1) {
    const k = easeOut((tt - t.lisa + 0.1) / 0.35);
    phoneAt(ctx, 800, BOT.y + 110 + (1 - k) * 800, 0.6, c => lisaScreen(c, tt));
  }
  pillLabel(ctx, '📱 ONLINE', 160, BOT.y + 60, bounce(tt, 0.3, 0.3), { bg: K.green, size: 32, spacing: 2 });
  if (tt > t.lisa) dayBadge(ctx, tt >= t.lisa2 ? 'Di · 18:00' : 'Mo · 10:05', 160, BOT.y + 150, bounce(tt, tt >= t.lisa2 ? t.lisa2 : t.lisa, 0.3));
  if (tt > t.minute - 0.05 && tt < t.dienstag) stamp(ctx, '⏱ IN 1 MINUTE', W / 2, BOT.y + 735, tt - t.minute + 0.05, { color: K.green, size: 44, rot: -0.08 });
  dim(ctx, BOT, dimAmt(tt, 'bot'));
  ctx.restore();

  // ===== Mittelband =====
  ctx.fillStyle = K.ink; ctx.fillRect(0, TOP.h, W, BOT.y - TOP.h);
  ctx.fillStyle = K.gold; ctx.fillRect(0, TOP.h, W, 6); ctx.fillRect(0, BOT.y - 6, W, 6);
}, subY: 960 });

// ---------- 2: Vergleich ----------
const ROWS = [[t.rund, 'Rund um die Uhr'], [t.sofort, 'Sofort bestätigt'], [t.ohne, 'Ohne Warteschleife'], [t.ohne + 0.45, 'Erinnerung per SMS']];
scenes.push({ start: w(A.vergleich - 1) - 0.05, draw(ctx, lt, tt) {
  ctx.fillStyle = K.ink; ctx.fillRect(0, 0, W, H);
  if (IMG.salon) alpha(ctx, 0.25, () => cover(ctx, IMG.salon, lt, 0.3));
  pillLabel(ctx, 'DER VERGLEICH', W / 2, 150, bounce(lt, 0.05, 0.3), { size: 46, color: K.ink });
  const cT = 640, cO = 880, y0 = 300;
  scaled(ctx, cT, y0, bounce(lt, 0.15, 0.3), () => { box(ctx, cT - 110, y0 - 55, 220, 110, 30, K.red, 0); text(ctx, '📞', cT, y0 - 8, { size: 44 }); text(ctx, 'Telefon', cT, y0 + 32, { size: 28, color: '#fff' }); });
  scaled(ctx, cO, y0, bounce(lt, 0.25, 0.3), () => { box(ctx, cO - 110, y0 - 55, 220, 110, 30, K.green, 0); text(ctx, '📱', cO, y0 - 8, { size: 44 }); text(ctx, 'Online', cO, y0 + 32, { size: 28, color: '#fff' }); });
  ROWS.forEach(([t0, label], i) => {
    const y = 470 + i * 175, k = easeOut((tt - t0 + 0.1) / 0.25); if (k <= 0) return;
    alpha(ctx, k, () => { box(ctx, 50, y - 70, 980, 140, 30, 'rgba(255,255,255,0.08)', 0); text(ctx, label, 80, y + 2, { size: 44, color: '#fff', align: 'left' }); });
    cross(ctx, cT, y, 46, (tt - t0) / 0.3);
    check(ctx, cO, y, 46, (tt - t0 - 0.12) / 0.3);
  });
  // Tom & Lisa
  person(ctx, 300, 1840, { ...TOM, s: 0.75, t: tt, expr: 'sad' });
  person(ctx, 780, 1840, { ...LISA, s: 0.75, t: tt, expr: 'happy', hop: true });
  text(ctx, 'Tom', 300, 1880, { size: 30, color: '#ffffffaa' }); text(ctx, 'Lisa', 780, 1880, { size: 30, color: '#ffffffaa' });
}, subY: 1240 });

// ---------- 3: Outro ----------
S(t.jetzt, 'ding');
scenes.push({ start: t.outro - 0.05, draw(ctx, lt, tt) {
  cover(ctx, IMG.front, lt, 0.6);
  scaled(ctx, W / 2, 470, bounce(lt, 0.05, 0.35), () => {
    text(ctx, 'SALON', W / 2, 380, { size: 60, color: '#fff', spacing: 18 });
    text(ctx, 'TEKBAS', W / 2, 490, { size: 150, color: K.gold, spacing: 16, shadow: true });
  });
  if (IMG.signatur) alpha(ctx, fade(lt, 0.25, 0.3), () => { ctx.save(); ctx.filter = 'invert(1)'; ctx.drawImage(IMG.signatur, W / 2 - 200, 570, 400, 196); ctx.restore(); });
  scaled(ctx, W / 2, 930, bounce(tt, t.jetzt - 0.1, 0.35), () => { box(ctx, 110, 860, 860, 140, 70, K.gold, 0); text(ctx, 'Jetzt online buchen!', W / 2, 932, { size: 62, color: K.ink }); });
  alpha(ctx, fade(tt, t.jetzt + 0.1), () => {
    text(ctx, 'Planity-App laden · „Salon Tekbas“ suchen', W / 2, 1080, { size: 38, weight: 800, color: '#fff' });
    text(ctx, '★ 4,9 auf Planity · 37 Bewertungen', W / 2, 1150, { size: 36, color: K.gold });
  });
  person(ctx, 330, 1560, { ...TOM, s: 0.6, t: tt, expr: 'happy', prop: phoneHand });
  person(ctx, 750, 1560, { ...LISA, s: 0.6, t: tt, expr: 'happy', prop: phoneHand });
  alpha(ctx, fade(lt, 0.4), () => {
    text(ctx, 'Lindenstraße 37 · 49152 Bad Essen', W / 2, 1680, { size: 38, weight: 800, color: '#ffffffdd' });
    text(ctx, '☎ 05472 – 967 99 33 · salon-tekbas.de', W / 2, 1740, { size: 34, weight: 800, color: '#ffffffaa' });
  });
} });

run({ scenes, chunks, duration, sfx, subY: 960, hideSubs: [[t.outro - 0.05, 99]] });
