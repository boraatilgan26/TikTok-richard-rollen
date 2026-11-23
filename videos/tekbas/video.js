// Salon Tekbas – Planity-Erklärvideo (30 s, 9:16): Registrierung, Terminbuchung, Vorteile
import { W, H, clamp, lerp, easeOut, easeInOut, bounce, rr, box, circ, line, text, emoji, alpha, scaled } from '../../engine/chibi.js';
import { setup, run } from '../../engine/timeline.js';

const DIR = 'videos/tekbas';
const { words, w, chunks, duration } = await setup(DIR, { tail: 0.64, breakBefore: [20, 48, 56, 58, 62], capMap: { 'Schritt eins:': 'Schritt 1:', 'Schritt zwei:': 'Schritt 2:', 'Schritt drei:': 'Schritt 3:' } });
const norm = s => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, '');
function wi(word, after = 0) { const n = norm(word); for (let i = after; i < words.length; i++) if (norm(words[i].w).startsWith(n)) return i; return after; }
const sfx = []; const S = (t, type) => sfx.push({ t, type });

const loadImg = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = '/' + DIR + '/img/' + src; });
const IMG = Object.fromEntries(await Promise.all(['front', 'salon', 'chair', 'barber', 'damen', 'signatur'].map(async n => [n, await loadImg(n + (n === 'signatur' ? '.png' : '.jpg'))])));

// ---------- Farben (Salon: Schwarz/Weiß, Holz, Gold) ----------
const K = { ink: '#141110', gold: '#d4a95c', goldD: '#a77d35', cream: '#f7f2ea', grey: '#8a847c', line: '#e6e1da', green: '#2fa36b', plan: '#111111' };

// ---------- Anker ----------
const A = {};
A.tekbas = wi('Tekbas'); A.so = wi('So', A.tekbas); A.planity = wi('Planity', A.so);
A.s1 = wi('Schritt', A.planity); A.lade = wi('Lade', A.s1); A.kostenlos = wi('kostenlos', A.lade); A.erstelle = wi('erstelle', A.kostenlos);
A.name = wi('Name', A.erstelle); A.email = wi('E-Mail', A.name); A.handy = wi('Handynummer', A.email);
A.s2 = wi('Schritt', A.handy); A.such = wi('Such', A.s2); A.essen = wi('Essen', A.such); A.leistung = wi('Leistung', A.essen);
A.friseur = wi('Friseur', A.leistung); A.wunsch = wi('Wunschzeit', A.friseur);
A.s3 = wi('Schritt', A.wunsch); A.best = wi('Bestätigen', A.s3); A.fertig = wi('fertig', A.best);
A.vorteile = wi('Vorteile', A.fertig); A.buchen = wi('Buchen', A.vorteile); A.sofort = wi('sofortige', A.buchen); A.erinn = wi('Erinnerung', A.sofort);
A.kein = wi('kein', A.erinn); A.outro = wi('Salon', A.kein); A.jetzt = wi('jetzt', A.outro);
const t = {}; for (const k in A) t[k] = w(A[k]);

// ---------- Helfer ----------
function cover(ctx, img, lt, { zoom = 0.05, dur = 8, dark = 0.55, px = 0.5 } = {}) {
  ctx.fillStyle = K.ink; ctx.fillRect(0, 0, W, H);
  if (!img) return;
  const s = Math.max(W / img.width, H / img.height) * (1.02 + zoom * clamp(lt / dur));
  const dw = img.width * s, dh = img.height * s;
  ctx.drawImage(img, (W - dw) * px, (H - dh) / 2, dw, dh);
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, `rgba(12,10,9,${dark + 0.2})`); g.addColorStop(0.45, `rgba(12,10,9,${dark})`); g.addColorStop(1, `rgba(12,10,9,${dark + 0.3})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
const typed = (s, t0, t1, tt) => s.slice(0, Math.round(s.length * clamp((tt - t0) / (t1 - t0))));
const fade = (tt, a, b = 0.2) => clamp((tt - a) / b);
function goldPill(ctx, s, x, y, k, { bg = K.gold, color = K.ink, size = 38 } = {}) {
  if (k <= 0) return;
  ctx.font = `900 ${size}px Nunito`; ctx.letterSpacing = '4px'; const ww = ctx.measureText(s).width + size * 1.4;
  scaled(ctx, x, y, k, () => { box(ctx, x - ww / 2, y - size * 0.85, ww, size * 1.7, size * 0.85, bg, 0); text(ctx, s, x, y + 2, { size, color, spacing: 4 }); });
}
function tap(ctx, x, y, tt, t0) { // Finger-Tipp mit Ripple
  const d = tt - t0; if (d < -0.35 || d > 0.6) return;
  const appear = clamp((d + 0.35) / 0.25);
  alpha(ctx, appear * (1 - clamp((d - 0.35) / 0.25)), () => {
    if (d > 0) { const k = clamp(d / 0.45); ctx.beginPath(); ctx.arc(x, y, 30 + 60 * k, 0, 7); ctx.strokeStyle = `rgba(212,169,92,${1 - k})`; ctx.lineWidth = 8; ctx.stroke(); }
    const sc = d > 0 && d < 0.15 ? 0.85 : 1;
    scaled(ctx, x, y, sc, () => { circ(ctx, x, y, 34, 'rgba(255,255,255,0.85)', 0); ctx.beginPath(); ctx.arc(x, y, 34, 0, 7); ctx.strokeStyle = K.gold; ctx.lineWidth = 6; ctx.stroke(); });
  });
}
function check(ctx, x, y, r, k, col = K.green) {
  if (k <= 0) return;
  scaled(ctx, x, y, bounce(k, 0, 1), () => {
    circ(ctx, x, y, r, col, 0);
    ctx.beginPath(); ctx.moveTo(x - r * 0.45, y + r * 0.02); ctx.lineTo(x - r * 0.12, y + r * 0.35); ctx.lineTo(x + r * 0.5, y - r * 0.32);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = r * 0.18; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
  });
}
function avatar(ctx, x, y, r, name, sel) {
  const cols = { Can: '#6b4f3a', Lusin: '#8e5b6e', Larysa: '#5b6e8e', Aliona: '#7a6a4a', Julia: '#4f7a6a', Natalia: '#8a5a4a' };
  circ(ctx, x, y, r, cols[name] || '#777', 0);
  text(ctx, name[0], x, y + 3, { size: r * 0.9, color: '#fff' });
  if (sel) { ctx.beginPath(); ctx.arc(x, y, r + 8, 0, 7); ctx.strokeStyle = K.gold; ctx.lineWidth = 7; ctx.stroke(); }
  text(ctx, name, x, y + r + 30, { size: 26, weight: 800, color: sel ? K.ink : K.grey });
}

// ---------- Handy ----------
const PH = { x: 262, y: 395, w: 556, h: 1110 };
const SC = { x: PH.x + 16, y: PH.y + 16, w: PH.w - 32, h: PH.h - 32 };
function phone(ctx, dy, drawScreen) {
  ctx.save(); ctx.translate(0, dy);
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 20;
  box(ctx, PH.x, PH.y, PH.w, PH.h, 78, '#0b0b0c', 0); ctx.restore();
  rr(ctx, PH.x + 2, PH.y + 2, PH.w - 4, PH.h - 4, 76); ctx.strokeStyle = '#3a3633'; ctx.lineWidth = 4; ctx.stroke();
  ctx.save(); rr(ctx, SC.x, SC.y, SC.w, SC.h, 62); ctx.clip();
  ctx.fillStyle = '#fff'; ctx.fillRect(SC.x, SC.y, SC.w, SC.h);
  drawScreen(ctx);
  // Statusleiste + Dynamic Island
  text(ctx, '16:35', SC.x + 70, SC.y + 40, { size: 26, color: K.ink, weight: 900 });
  text(ctx, '▮▮▮  ◔', SC.x + SC.w - 80, SC.y + 40, { size: 20, color: K.ink, weight: 900 });
  box(ctx, W / 2 - 70, SC.y + 18, 140, 42, 21, '#0b0b0c', 0);
  ctx.restore(); ctx.restore();
}
const X0 = SC.x + 34, XW = SC.w - 68, XC = SC.x + SC.w / 2;
function appBar(ctx, title, back = true) {
  ctx.fillStyle = '#fff'; ctx.fillRect(SC.x, SC.y, SC.w, 170);
  if (back) text(ctx, '‹', X0 + 6, SC.y + 118, { size: 60, color: K.ink, weight: 800, align: 'left' });
  text(ctx, title, XC, SC.y + 118, { size: 34, color: K.ink });
  line(ctx, SC.x, SC.y + 168, SC.x + SC.w, SC.y + 168, K.line, 2);
}
function blackBtn(ctx, s, y, k = 1, { bg = K.plan, h = 96 } = {}) {
  box(ctx, X0, y, XW, h, h / 2, bg, 0); text(ctx, s, XC, y + h / 2 + 2, { size: 34, color: '#fff' });
}
function field(ctx, label, value, y, active) {
  text(ctx, label, X0, y, { size: 26, weight: 800, color: K.grey, align: 'left' });
  rr(ctx, X0, y + 22, XW, 92, 22); ctx.fillStyle = '#f6f5f3'; ctx.fill(); ctx.strokeStyle = active ? K.ink : K.line; ctx.lineWidth = active ? 4 : 2; ctx.stroke();
  text(ctx, value, X0 + 26, y + 70, { size: 32, weight: 800, color: K.ink, align: 'left' });
  if (active) { ctx.font = '800 32px Nunito'; const cw = ctx.measureText(value).width; line(ctx, X0 + 30 + cw, y + 48, X0 + 30 + cw, y + 92, K.ink, 3); }
}
function planityLogo(ctx, x, y, size, color = K.plan) { text(ctx, 'PLANITY', x, y, { size, color, spacing: size * 0.22 }); }

// --- Bildschirm-Inhalte ---
function scrHome(ctx, tt) {
  ctx.fillStyle = '#fff'; ctx.fillRect(SC.x, SC.y, SC.w, SC.h);
  scaled(ctx, XC, SC.y + 300, bounce(tt, t.planity - 0.05, 0.35) || 0.0001, () => planityLogo(ctx, XC, SC.y + 300, 58));
  alpha(ctx, fade(tt, t.planity + 0.1), () => {
    text(ctx, 'Buchen Sie Ihren Style', XC, SC.y + 420, { size: 38, color: K.ink });
    text(ctx, 'Schnell • Einfach • 24/7', XC, SC.y + 475, { size: 30, weight: 800, color: K.grey });
  });
  if (IMG.salon) { ctx.save(); rr(ctx, X0, SC.y + 560, XW, 330, 30); ctx.clip(); const im = IMG.salon, s = XW / im.width * 1.25; ctx.drawImage(im, X0 - (im.width * s - XW) / 2, SC.y + 560 - 40, im.width * s, im.height * s); ctx.restore(); }
  alpha(ctx, fade(tt, 2.2), () => { box(ctx, X0, SC.y + 930, XW, 92, 46, '#f3f1ee', 0); text(ctx, '🔍  Friseur, Salon …', X0 + 30, SC.y + 978, { size: 30, weight: 800, color: K.grey, align: 'left' }); });
}
function scrStore(ctx, tt) { // App laden
  ctx.fillStyle = '#fff'; ctx.fillRect(SC.x, SC.y, SC.w, SC.h);
  const iy = SC.y + 200;
  box(ctx, X0, iy, 190, 190, 46, K.plan, 0); text(ctx, 'P', X0 + 95, iy + 100, { size: 120, color: '#fff' });
  text(ctx, 'Planity', X0 + 220, iy + 50, { size: 44, color: K.ink, align: 'left' });
  text(ctx, 'Beauty-Termine', X0 + 220, iy + 100, { size: 26, weight: 800, color: K.grey, align: 'left' });
  // Laden-Button: Laden -> Ladering -> Öffnen
  const bx = X0 + 220, by = iy + 130, bw = 200, bh = 60;
  const tPress = t.kostenlos - 0.15, tDone = t.kostenlos + 0.6;
  if (tt < tPress) { box(ctx, bx, by, bw, bh, 30, '#1b74e8', 0); text(ctx, 'LADEN', bx + bw / 2, by + bh / 2 + 2, { size: 28, color: '#fff' }); }
  else if (tt < tDone) { const k = clamp((tt - tPress) / (tDone - tPress)); ctx.beginPath(); ctx.arc(bx + 40, by + bh / 2, 26, 0, 7); ctx.strokeStyle = K.line; ctx.lineWidth = 6; ctx.stroke(); ctx.beginPath(); ctx.arc(bx + 40, by + bh / 2, 26, -Math.PI / 2, -Math.PI / 2 + k * Math.PI * 2); ctx.strokeStyle = '#1b74e8'; ctx.stroke(); }
  else { box(ctx, bx, by, bw, bh, 30, '#eef0f4', 0); text(ctx, 'ÖFFNEN', bx + bw / 2, by + bh / 2 + 2, { size: 28, color: '#1b74e8' }); }
  tap(ctx, bx + bw / 2, by + bh / 2, tt, tPress);
  // Infos
  const stats = [['4,9 ★', 'Bewertung'], ['Gratis', 'Preis'], ['24/7', 'Buchung']];
  stats.forEach(([a, b], i) => { const x = X0 + XW / 6 + i * XW / 3; text(ctx, a, x, iy + 290, { size: 34, color: K.ink }); text(ctx, b, x, iy + 330, { size: 22, weight: 800, color: K.grey }); });
  line(ctx, X0, iy + 380, X0 + XW, iy + 380, K.line, 2);
  for (let i = 0; i < 3; i++) { box(ctx, X0 + i * (XW / 3) + 6, iy + 410, XW / 3 - 12, 380, 26, ['#f1ede7', '#ece7df', '#f4f0ea'][i], 0); planityLogo(ctx, X0 + i * (XW / 3) + XW / 6, iy + 600, 18, '#b9b2a7'); }
  // kostenlos-Badge
  scaled(ctx, XC, SC.y + 1000, bounce(tt, t.kostenlos, 0.3), () => { box(ctx, XC - 170, SC.y + 960, 340, 80, 40, K.green, 0); text(ctx, '✓ KOSTENLOS', XC, SC.y + 1002, { size: 32, color: '#fff' }); });
}
function scrSignup(ctx, tt) { // Konto erstellen
  ctx.fillStyle = '#fff'; ctx.fillRect(SC.x, SC.y, SC.w, SC.h);
  appBar(ctx, 'Konto erstellen');
  text(ctx, 'Willkommen bei', X0, SC.y + 240, { size: 30, weight: 800, color: K.grey, align: 'left' });
  planityLogo(ctx, X0 + 128, SC.y + 290, 40);
  const f = [['Vor- und Nachname', 'Lisa Müller', t.name], ['E-Mail', 'lisa.mueller@mail.de', t.email], ['Handynummer', '+49 170 1234567', t.handy]];
  f.forEach(([lab, val, t0], i) => {
    const y = SC.y + 370 + i * 160;
    const next = i < 2 ? f[i + 1][2] : t.s2 - 0.6;
    field(ctx, lab, typed(val, t0, t0 + Math.min(0.55, next - t0 - 0.05), tt), y, tt >= t0 - 0.1 && tt < next);
    if (tt > Math.min(next, t0 + 0.6)) check(ctx, X0 + XW - 44, y + 68, 22, (tt - Math.min(next, t0 + 0.6)) / 0.25);
  });
  const tBtn = t.s2 - 0.55; const done = tt > tBtn + 0.1;
  blackBtn(ctx, done ? '✓ Konto erstellt' : 'Konto erstellen', SC.y + 880, 1, { bg: done ? K.green : K.plan });
  tap(ctx, XC + 120, SC.y + 928, tt, tBtn);
}
function scrSearch(ctx, tt) {
  ctx.fillStyle = '#fff'; ctx.fillRect(SC.x, SC.y, SC.w, SC.h);
  appBar(ctx, 'Suche', false);
  box(ctx, X0, SC.y + 200, XW, 92, 46, '#f3f1ee', 0);
  const q = typed('Salon Tekbas', t.such + 0.05, t.such + 1.0, tt);
  text(ctx, '🔍  ' + (q || ''), X0 + 30, SC.y + 248, { size: 32, weight: 800, color: q ? K.ink : K.grey, align: 'left' });
  if (!q) text(ctx, 'Friseur, Salon …', X0 + 90, SC.y + 248, { size: 32, weight: 800, color: K.grey, align: 'left' });
  const k = fade(tt, t.such + 1.1, 0.25);
  alpha(ctx, k, () => {
    const y = SC.y + 330 + (1 - k) * 40;
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.12)'; ctx.shadowBlur = 24; box(ctx, X0, y, XW, 560, 30, '#fff', 0); ctx.restore();
    if (IMG.salon) { ctx.save(); rr(ctx, X0, y, XW, 300, 30); ctx.rect(X0, y + 30, XW, 270); ctx.clip(); const im = IMG.salon, s = XW / im.width; ctx.drawImage(im, X0, y - 30, im.width * s, im.height * s); ctx.restore(); }
    text(ctx, 'Salon Tekbas', X0 + 28, y + 352, { size: 40, color: K.ink, align: 'left' });
    text(ctx, 'Lindenstraße 37, 49152 Bad Essen', X0 + 28, y + 402, { size: 25, weight: 800, color: K.grey, align: 'left' });
    text(ctx, '★ 4,9', X0 + 28, y + 452, { size: 30, color: K.goldD, align: 'left' });
    text(ctx, '(37 Bewertungen)', X0 + 128, y + 452, { size: 25, weight: 800, color: K.grey, align: 'left' });
    box(ctx, X0 + 28, y + 484, XW - 56, 56, 28, K.plan, 0); text(ctx, 'Termin buchen', XC, y + 513, { size: 27, color: '#fff' });
  });
  tap(ctx, XC + 100, SC.y + 330 + 512, tt, t.leistung - 0.6);
}
function scrService(ctx, tt) {
  ctx.fillStyle = '#fff'; ctx.fillRect(SC.x, SC.y, SC.w, SC.h);
  appBar(ctx, 'Leistung wählen');
  text(ctx, 'Herren · Haarschnitt & Rasur', X0, SC.y + 225, { size: 26, color: K.goldD, align: 'left' });
  const L = [['Herrenhaarschnitt', '30 Min.', '27 €'], ['Herrenhaarschnitt by Can', '30 Min.', '33 €'], ['Maschinenhaarschnitt', '15 Min.', '24 €'], ['Vollrasur / Nassrasur', '30 Min.', '26 €']];
  const tSel = t.leistung + 0.15;
  L.forEach(([n, d, p], i) => {
    const y = SC.y + 270 + i * 165; const sel = i === 0 && tt > tSel;
    alpha(ctx, fade(tt, t.leistung - 0.35 + i * 0.06, 0.15), () => {
      rr(ctx, X0, y, XW, 145, 24); ctx.fillStyle = sel ? '#fbf6ec' : '#fff'; ctx.fill(); ctx.strokeStyle = sel ? K.gold : K.line; ctx.lineWidth = sel ? 5 : 2; ctx.stroke();
      text(ctx, n, X0 + 24, y + 50, { size: 24, color: K.ink, align: 'left' });
      text(ctx, d + '  ·  ' + p, X0 + 24, y + 100, { size: 25, weight: 800, color: K.grey, align: 'left' });
      box(ctx, X0 + XW - 118, y + 44, 100, 56, 28, sel ? K.ink : '#fff', 0);
      if (!sel) { rr(ctx, X0 + XW - 118, y + 44, 100, 56, 28); ctx.strokeStyle = K.ink; ctx.lineWidth = 2; ctx.stroke(); }
      text(ctx, sel ? '✓' : 'Wählen', X0 + XW - 68, y + 73, { size: 21, color: sel ? '#fff' : K.ink });
    });
  });
  tap(ctx, X0 + XW - 68, SC.y + 270 + 72, tt, tSel);
}
const TEAM = ['Can', 'Lusin', 'Larysa', 'Aliona', 'Julia', 'Natalia'];
function scrTeam(ctx, tt) {
  ctx.fillStyle = '#fff'; ctx.fillRect(SC.x, SC.y, SC.w, SC.h);
  appBar(ctx, 'Mit wem?');
  box(ctx, X0, SC.y + 200, XW, 90, 24, '#fbf6ec', 0); text(ctx, '✓ Herrenhaarschnitt · 30 Min. · 27 €', XC, SC.y + 246, { size: 25, color: K.ink });
  const tSel = t.friseur + 0.1;
  TEAM.forEach((n, i) => {
    const cx = X0 + XW / 6 + (i % 3) * XW / 3, cy = SC.y + 420 + Math.floor(i / 3) * 230;
    scaled(ctx, cx, cy, bounce(tt, t.friseur - 0.45 + i * 0.05, 0.25), () => avatar(ctx, cx, cy, 70, n, n === 'Larysa' && tt > tSel));
  });
  alpha(ctx, fade(tt, t.friseur - 0.3), () => text(ctx, 'oder: Keine Präferenz', XC, SC.y + 900, { size: 27, weight: 800, color: K.grey }));
  tap(ctx, X0 + XW / 2, SC.y + 420, tt, tSel);
}
const DAYS = [['Di', 24], ['Mi', 25], ['Do', 26], ['Fr', 27], ['Sa', 28]];
const SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00'];
function scrTime(ctx, tt) {
  ctx.fillStyle = '#fff'; ctx.fillRect(SC.x, SC.y, SC.w, SC.h);
  appBar(ctx, 'Wunschzeit');
  text(ctx, 'November 2026', X0, SC.y + 225, { size: 28, color: K.ink, align: 'left' });
  const tDay = t.wunsch - 0.05, tSlot = t.wunsch + 0.45;
  DAYS.forEach(([d, n], i) => {
    const bw = XW / 5 - 10, x = X0 + i * (XW / 5) + 5, y = SC.y + 260, sel = i === 1 && tt > tDay;
    box(ctx, x, y, bw, 120, 22, sel ? K.ink : '#f3f1ee', 0);
    text(ctx, d, x + bw / 2, y + 40, { size: 24, weight: 800, color: sel ? '#fff' : K.grey });
    text(ctx, String(n), x + bw / 2, y + 85, { size: 36, color: sel ? '#fff' : K.ink });
  });
  SLOTS.forEach((s, i) => {
    const bw = XW / 3 - 14, x = X0 + (i % 3) * (XW / 3) + 7, y = SC.y + 430 + Math.floor(i / 3) * 110, sel = s === '10:30' && tt > tSlot;
    alpha(ctx, fade(tt, tDay + 0.05 + i * 0.03, 0.12), () => {
      rr(ctx, x, y, bw, 86, 20); ctx.fillStyle = sel ? K.gold : '#fff'; ctx.fill(); ctx.strokeStyle = sel ? K.gold : K.line; ctx.lineWidth = 3; ctx.stroke();
      text(ctx, s, x + bw / 2, y + 45, { size: 30, color: K.ink });
    });
  });
  tap(ctx, X0 + XW / 5 * 1.5, SC.y + 320, tt, tDay);
  tap(ctx, X0 + XW / 6, SC.y + 430 + 110 + 43, tt, tSlot);
}
function scrConfirm(ctx, tt) {
  ctx.fillStyle = '#fff'; ctx.fillRect(SC.x, SC.y, SC.w, SC.h);
  appBar(ctx, 'Zusammenfassung');
  const y0 = SC.y + 210;
  box(ctx, X0, y0, XW, 520, 30, '#faf8f5', 0);
  text(ctx, 'Salon Tekbas', X0 + 30, y0 + 60, { size: 36, color: K.ink, align: 'left' });
  text(ctx, 'Lindenstraße 37, Bad Essen', X0 + 30, y0 + 105, { size: 24, weight: 800, color: K.grey, align: 'left' });
  const rows = [['✂️', 'Herrenhaarschnitt'], ['👤', 'mit Larysa'], ['📅', 'Mi, 25. November'], ['🕥', '10:30 Uhr · 30 Min.'], ['💶', '27 € · Bezahlung vor Ort']];
  rows.forEach(([e, s], i) => { const y = y0 + 175 + i * 72; emoji(ctx, e, X0 + 52, y, 34); text(ctx, s, X0 + 95, y + 2, { size: 29, weight: 800, color: K.ink, align: 'left' }); });
  const tBtn = t.best + 0.1; const done = tt > tBtn + 0.08;
  blackBtn(ctx, 'Bestätigen', SC.y + 800, 1, { bg: done ? K.green : K.plan });
  tap(ctx, XC + 110, SC.y + 848, tt, tBtn);
  // Overlay „Termin bestätigt!“
  const k = fade(tt, t.fertig - 0.1, 0.2);
  if (k > 0) {
    alpha(ctx, k, () => { ctx.fillStyle = '#fff'; ctx.fillRect(SC.x, SC.y, SC.w, SC.h); });
    check(ctx, XC, SC.y + 420, 120, (tt - t.fertig + 0.05) / 0.35);
    // Konfetti
    const d = tt - t.fertig;
    if (d > 0) for (let i = 0; i < 46; i++) {
      const a = (i * 137.5) % 360 * Math.PI / 180, sp = 260 + (i * 53) % 280;
      const x = XC + Math.cos(a) * sp * d * 1.2, y = SC.y + 420 + Math.sin(a) * sp * d - 0 + 520 * d * d;
      alpha(ctx, 1 - clamp((d - 0.6) / 0.5), () => { ctx.save(); ctx.translate(x, y); ctx.rotate(d * 8 + i); ctx.fillStyle = [K.gold, K.green, '#e8504a', '#3a7bd5', K.ink][i % 5]; ctx.fillRect(-9, -5, 18, 10); ctx.restore(); });
    }
    alpha(ctx, fade(tt, t.fertig + 0.2), () => {
      text(ctx, 'Termin bestätigt!', XC, SC.y + 640, { size: 46, color: K.ink });
      text(ctx, 'Mi, 25. Nov · 10:30 Uhr', XC, SC.y + 705, { size: 30, weight: 800, color: K.grey });
      text(ctx, 'Bestätigung per E-Mail ✉️', XC, SC.y + 790, { size: 28, weight: 800, color: K.goldD });
    });
  }
}

// ---------- Header ----------
function stepHeader(ctx, tt, t0, n, title) {
  const k = bounce(tt, t0, 0.3);
  goldPill(ctx, 'SCHRITT ' + n, W / 2, 150, k);
  alpha(ctx, fade(tt, t0 + 0.08), () => text(ctx, title, W / 2, 265, { size: 66, color: '#fff', shadow: true }));
}

const scenes = [];
// ---------- 1: Hook + Schritte 1–3 (durchgehendes Handy) ----------
S(t.tekbas, 'pop'); S(t.planity, 'ding');
S(t.kostenlos - 0.15, 'pop'); S(t.kostenlos, 'coins'); S(t.erstelle - 0.05, 'swipe');
[t.name, t.email, t.handy].forEach(x => S(x, 'pop')); S(t.s2 - 0.45, 'ding');
S(t.such + 1.1, 'pop'); S(t.leistung - 0.4, 'swipe'); S(t.leistung + 0.15, 'pop'); S(t.friseur - 0.45, 'swipe'); S(t.friseur + 0.1, 'pop');
S(t.wunsch - 0.25, 'swipe'); S(t.wunsch - 0.05, 'pop'); S(t.wunsch + 0.45, 'pop');
S(t.best + 0.1, 'pop'); S(t.fertig - 0.05, 'magic'); S(t.fertig, 'ding');
[t.s1, t.s2, t.s3].forEach(x => S(x, 'whoosh'));

const tPhone = t.so - 0.05;
scenes.push({ start: 0, noSlide: true, draw: null });

// Header-Overlay als eigene Logik (vereinfachte Neuzeichnung)
scenes[0].draw = (ctx, lt) => {
  const tt = lt;
  const hdr = tt >= t.s3 ? [t.s3, 3, 'Bestätigen – fertig!'] : tt >= t.s2 ? [t.s2, 2, 'Salon & Termin wählen'] : tt >= t.s1 ? [t.s1, 1, 'App laden & registrieren'] : null;
  // Hintergrund + Hook + Handy (ohne Header)
  const cuts = [0, t.s1, t.s2, t.s3]; let ci = 0; cuts.forEach((c, i) => { if (tt >= c) ci = i; });
  const imgs = [IMG.front, IMG.damen, IMG.salon, IMG.chair];
  cover(ctx, imgs[ci], tt - cuts[ci], { dark: ci === 0 ? 0.45 : 0.6 });
  if (ci > 0 && tt - cuts[ci] < 0.35) alpha(ctx, 1 - (tt - cuts[ci]) / 0.35, () => cover(ctx, imgs[ci - 1], tt - cuts[ci - 1], { dark: 0.6 }));
  if (tt < t.s1 + 0.25) {
    const m = easeInOut((tt - tPhone) / 0.5); const y = lerp(860, 170, m), sc = lerp(1, 0.6, m);
    alpha(ctx, 1 - fade(tt, t.s1 - 0.28, 0.2), () => {
      alpha(ctx, fade(tt, 0.02, 0.2), () => text(ctx, 'Termin bei', W / 2, y - 120 * sc, { size: 80 * sc, color: '#fff', shadow: true }));
      scaled(ctx, W / 2, y + 20 * sc, bounce(tt, t.tekbas - 0.3, 0.35), () => text(ctx, 'SALON TEKBAS?', W / 2, y + 20 * sc, { size: 128 * sc, color: K.gold, spacing: 6 * sc, shadow: true }));
      alpha(ctx, fade(tt, tPhone + 0.3), () => text(ctx, 'So einfach geht’s mit Planity!', W / 2, y + 120, { size: 50, color: '#fff', shadow: true }));
      if (tt < tPhone) alpha(ctx, fade(tt, 0.5, 0.3), () => text(ctx, 'Friseur & Barber · Bad Essen', W / 2, y + 170, { size: 44, weight: 800, color: '#ffffffd0' }));
    });
  }
  if (hdr) stepHeader(ctx, tt, hdr[0], hdr[1], hdr[2]);
  if (tt > tPhone) {
    const dy = (1 - easeOut((tt - tPhone) / 0.55)) * 1400;
    phone(ctx, dy, c => {
      if (tt < t.s1 + 0.6) scrHome(c, tt);
      else if (tt < t.erstelle) scrStore(c, tt);
      else if (tt < t.s2) scrSignup(c, tt);
      else if (tt < t.leistung - 0.4) scrSearch(c, tt);
      else if (tt < t.friseur - 0.45) scrService(c, tt);
      else if (tt < t.wunsch - 0.25) scrTeam(c, tt);
      else if (tt < t.s3 + 0.1) scrTime(c, tt);
      else scrConfirm(c, tt);
    });
  }
  footer(ctx);
};
function footer(ctx) { text(ctx, 'SALON TEKBAS  ·  Lindenstraße 37  ·  Bad Essen', W / 2, 1862, { size: 28, weight: 800, color: '#ffffffaa', spacing: 2 }); }

// ---------- 2: Vorteile ----------
const BEN = [
  [t.buchen, '🕐', 'Rund um die Uhr buchen', '24/7 – auch nach Feierabend'],
  [t.sofort, '⚡', 'Sofortige Bestätigung', 'Dein Termin steht in Sekunden'],
  [t.erinn, '🔔', 'Erinnerung per SMS', 'Nie wieder einen Termin vergessen'],
  [t.kein, '📵', 'Kein Warten am Telefon', 'Keine Warteschleife, kein Besetzt'],
];
BEN.forEach(([x]) => S(x, 'pop'));
scenes.push({ start: w(A.vorteile - 1) - 0.05, draw(ctx, lt, tt) {
  cover(ctx, IMG.barber, lt, { dark: 0.62 });
  goldPill(ctx, 'DEINE VORTEILE', W / 2, 190, bounce(lt, 0.1, 0.3), { size: 44 });
  BEN.forEach(([t0, e, a, b], i) => {
    const y = 360 + i * 270, k = easeOut((tt - t0 + 0.12) / 0.3); if (k <= 0) return;
    ctx.save(); ctx.translate((1 - k) * 700, 0); ctx.globalAlpha = clamp(k * 1.5);
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 30; box(ctx, 80, y, 920, 220, 40, K.cream, 0); ctx.restore();
    circ(ctx, 200, y + 110, 78, K.ink, 0); emoji(ctx, e, 200, y + 110, 76);
    text(ctx, a, 310, y + 88, { size: 50, color: K.ink, align: 'left' });
    text(ctx, b, 310, y + 148, { size: 34, weight: 800, color: '#6f675d', align: 'left' });
    ctx.restore();
  });
  footer(ctx);
} });

// ---------- 3: Outro ----------
S(t.jetzt, 'ding');
scenes.push({ start: t.outro - 0.05, draw(ctx, lt, tt) {
  cover(ctx, IMG.front, lt, { dark: 0.6, zoom: 0.04, dur: 4 });
  scaled(ctx, W / 2, 560, bounce(lt, 0.05, 0.35), () => {
    text(ctx, 'SALON', W / 2, 470, { size: 60, color: '#fff', spacing: 18 });
    text(ctx, 'TEKBAS', W / 2, 580, { size: 150, color: K.gold, spacing: 16, shadow: true });
  });
  if (IMG.signatur) alpha(ctx, fade(lt, 0.3, 0.3), () => { ctx.save(); ctx.filter = 'invert(1)'; ctx.drawImage(IMG.signatur, W / 2 - 230, 670, 460, 226); ctx.restore(); });
  const kb = bounce(tt, t.jetzt - 0.1, 0.35);
  scaled(ctx, W / 2, 1040, kb, () => { box(ctx, 140, 970, 800, 140, 70, K.gold, 0); text(ctx, 'Jetzt online buchen!', W / 2, 1042, { size: 62, color: K.ink }); });
  alpha(ctx, fade(tt, t.jetzt + 0.15), () => {
    text(ctx, 'In der Planity-App „Salon Tekbas“ suchen', W / 2, 1190, { size: 40, weight: 800, color: '#fff' });
    text(ctx, '★ 4,9 auf Planity  ·  37 Bewertungen', W / 2, 1260, { size: 38, color: K.gold });
  });
  alpha(ctx, fade(lt, 0.5), () => {
    text(ctx, 'Lindenstraße 37 · 49152 Bad Essen', W / 2, 1480, { size: 40, weight: 800, color: '#ffffffdd' });
    text(ctx, '☎ 05472 – 967 99 33  ·  salon-tekbas.de', W / 2, 1545, { size: 36, weight: 800, color: '#ffffffaa' });
  });
} });

run({ scenes, chunks, duration, sfx, subY: 1640, hideSubs: [[t.outro - 0.05, 99]] });
