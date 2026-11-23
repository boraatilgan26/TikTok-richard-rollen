// Hintergründe im Flat-Stil. Boden-/Fußlinie FLOOR.
import { W, H, OL, LW, C, box, circ, ell, poly, line, rr, fillStroke, text, emoji, alpha, clamp } from './chibi.js';
export const FLOOR = 1300;

function grad(ctx, y0, y1, a, b) { const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, a); g.addColorStop(1, b); return g; }

export function sky(ctx, top, bottom, y1 = FLOOR) { ctx.fillStyle = grad(ctx, 0, y1, top, bottom); ctx.fillRect(0, 0, W, y1 + 2); }
export function sun(ctx, x, y, r = 110, col = '#fbefc0', halo = 'rgba(255,255,255,0.18)') {
  circ(ctx, x, y, r * 1.45, halo, 0); circ(ctx, x, y, r, col, 0);
}
export function cloud(ctx, x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 40, 0, 7); ctx.arc(45, -18, 52, 0, 7); ctx.arc(95, 0, 40, 0, 7); ctx.rect(0, 0, 95, 40); ctx.fill(); ctx.restore(); }

/** Innenraum: Wand mit Streifen + Holzboden */
export function room(ctx, wall = '#f6d9a8', floor = '#c98a54', stripe = 'rgba(255,255,255,0.18)') {
  ctx.fillStyle = wall; ctx.fillRect(0, 0, W, FLOOR);
  ctx.fillStyle = stripe; for (let x = 0; x < W; x += 54) ctx.fillRect(x, 0, 18, FLOOR);
  woodFloor(ctx, floor);
}
export function woodFloor(ctx, floor = '#c98a54') {
  ctx.fillStyle = floor; ctx.fillRect(0, FLOOR, W, H - FLOOR);
  ctx.fillStyle = 'rgba(0,0,0,0.08)'; for (let y = FLOOR + 70; y < H; y += 90) ctx.fillRect(0, y, W, 5);
  ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(0, FLOOR, W, 8);
}
export function pavement(ctx, col = '#6c6a78', line2 = 'rgba(255,255,255,0.35)') {
  ctx.fillStyle = '#9a96a6'; ctx.fillRect(0, FLOOR - 10, W, 70);
  ctx.fillStyle = col; ctx.fillRect(0, FLOOR + 60, W, H - FLOOR);
  ctx.fillStyle = line2; for (let x = -40; x < W; x += 180) ctx.fillRect(x, FLOOR + 330, 100, 14);
}

// ---------- Hook-Bühne: Richards Villa ----------
export function villa(ctx, top = '#3a2a6a', bottom = '#b07ad0') {
  sky(ctx, top, bottom, 1500);
  sun(ctx, 250, 760, 105);
  // Villa
  const vx = W / 2, vy = 1120;
  box(ctx, vx - 400, vy - 250, 800, 260, 6, '#fbf4e6');
  poly(ctx, [[vx - 440, vy - 250], [vx + 440, vy - 250], [vx + 360, vy - 330], [vx - 360, vy - 330]], '#e0b850');
  box(ctx, vx - 150, vy - 420, 300, 430, 6, '#fffaf0');
  poly(ctx, [[vx - 180, vy - 420], [vx + 180, vy - 420], [vx, vy - 520]], C.gold);
  for (let i = 0; i < 4; i++) box(ctx, vx - 120 + i * 72, vy - 380, 26, 380, 6, '#fff', 5);
  for (const sx of [-1, 1]) for (let i = 0; i < 3; i++) box(ctx, vx + sx * (210 + i * 70) - 22, vy - 200, 44, 70, 6, '#bfe0f2', 5);
  text(ctx, '€', vx, vy - 455, { size: 54, color: '#fff' });
  // Hecken + Rasen
  ctx.fillStyle = '#7fae5a'; ctx.fillRect(0, vy, W, 900);
  for (const [x, r] of [[60, 70], [150, 55], [930, 70], [1020, 60]]) circ(ctx, x, vy - 10, r, '#c85a4a', 0);
  for (const [x, r] of [[40, 50], [1050, 48]]) circ(ctx, x, vy + 40, r, '#b04a3e', 0);
  // Weg
  ctx.fillStyle = '#e9b49a'; ctx.beginPath(); ctx.moveTo(vx - 70, vy); ctx.lineTo(vx + 70, vy); ctx.lineTo(vx + 420, H); ctx.lineTo(vx - 420, H); ctx.fill();
}

// ---------- „Bedeutet:“ – roter Sonnenuntergang ----------
export function sunset(ctx) {
  sky(ctx, '#d8434a', '#f28a6a', 1150);
  sun(ctx, W / 2, 520, 120, '#fbe6a0', 'rgba(255,230,180,0.25)');
  ctx.fillStyle = '#a3373c';
  for (let x = 0; x < W; x += 95) { const h = 40 + ((x * 7) % 50); ctx.fillRect(x + 10, 1150 - h, 52, h); poly(ctx, [[x + 6, 1150 - h], [x + 66, 1150 - h], [x + 36, 1150 - h - 28]], '#a3373c', 0); }
  ctx.fillStyle = '#e8836a'; ctx.fillRect(0, 1150, W, H);
  ctx.fillStyle = 'rgba(255,220,200,0.35)'; ctx.beginPath(); ctx.moveTo(W / 2 - 60, 1150); ctx.lineTo(W / 2 + 60, 1150); ctx.lineTo(W / 2 + 380, H); ctx.lineTo(W / 2 - 380, H); ctx.fill();
}

// ---------- Park am Morgen ----------
export function park(ctx) {
  sky(ctx, '#8fd0f0', '#d8f0fa');
  sun(ctx, 860, 430, 80, '#fff2b0');
  cloud(ctx, 120, 420, 1.1); cloud(ctx, 640, 560, 0.8);
  // Bäume
  for (const [x, s] of [[110, 1.1], [980, 1.25], [560, 0.75]]) {
    box(ctx, x - 22 * s, FLOOR - 330 * s, 44 * s, 340 * s, 10, '#8a5a3a');
    circ(ctx, x, FLOOR - 400 * s, 150 * s, '#6fb35a'); circ(ctx, x - 70 * s, FLOOR - 330 * s, 90 * s, '#5ea04a'); circ(ctx, x + 80 * s, FLOOR - 340 * s, 95 * s, '#5ea04a');
  }
  ctx.fillStyle = '#8fc46a'; ctx.fillRect(0, FLOOR - 40, W, H);
  ctx.fillStyle = '#e8c9a0'; ctx.fillRect(0, FLOOR + 10, W, 210);
  ctx.fillStyle = '#7ab35a'; ctx.fillRect(0, FLOOR + 220, W, H);
}
export function bench(ctx, x, y = FLOOR, s = 1, col = '#b8743e') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  box(ctx, -190, -170, 380, 34, 8, col); box(ctx, -190, -120, 380, 34, 8, col);
  box(ctx, -200, -78, 400, 30, 8, col);
  box(ctx, -170, -50, 22, 52, 4, '#555'); box(ctx, 148, -50, 22, 52, 4, '#555');
  ctx.restore();
}
export function lamp(ctx, x, y = FLOOR, on = false) {
  if (on) { ctx.save(); const g = ctx.createRadialGradient(x, y - 560, 10, x, y - 560, 420); g.addColorStop(0, 'rgba(255,220,120,0.55)'); g.addColorStop(1, 'rgba(255,220,120,0)'); ctx.fillStyle = g; ctx.fillRect(x - 450, y - 1000, 900, 1100); ctx.restore(); }
  box(ctx, x - 12, y - 560, 24, 560, 6, '#3d3d4d'); box(ctx, x - 50, y - 620, 100, 70, 16, on ? '#ffe28a' : '#e8e8e8');
}

// ---------- Bahnhof ----------
export function station(ctx) {
  ctx.fillStyle = '#dfe6ea'; ctx.fillRect(0, 0, W, FLOOR);
  ctx.strokeStyle = 'rgba(0,0,0,0.07)'; ctx.lineWidth = 4;
  for (let x = 0; x < W; x += 90) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, FLOOR); ctx.stroke(); }
  for (let y = 0; y < FLOOR; y += 90) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  box(ctx, 90, 320, 560, 120, 14, '#1f4f8a'); text(ctx, 'Hauptbahnhof', 370, 382, { size: 66, color: '#fff' });
  circ(ctx, 880, 380, 70, '#fff'); line(ctx, 880, 380, 880, 335, OL, 7); line(ctx, 880, 380, 915, 380, OL, 7);
  // Gleis-Fenster
  box(ctx, 0, 640, W, 330, 0, '#a8c8da', 0); box(ctx, 0, 820, W, 150, 0, '#c84a3e', 0);
  for (let x = 40; x < W; x += 220) box(ctx, x, 845, 150, 80, 10, '#bfe0f2', 5);
  line(ctx, 0, 640, W, 640, OL, 7); line(ctx, 0, 970, W, 970, OL, 7);
  ctx.fillStyle = '#b7b7c2'; ctx.fillRect(0, FLOOR, W, H); ctx.fillStyle = '#f5d24a'; ctx.fillRect(0, FLOOR + 6, W, 20);
  ctx.fillStyle = 'rgba(0,0,0,0.08)'; for (let x = 0; x < W; x += 120) ctx.fillRect(x, FLOOR + 26, 6, H);
}
export function pfandAutomat(ctx, x, y = FLOOR) {
  box(ctx, x - 110, y - 470, 220, 470, 18, '#2f8a5a'); box(ctx, x - 80, y - 430, 160, 90, 10, '#bfe0f2', 5);
  text(ctx, 'PFAND', x, y - 300, { size: 44, color: '#fff' }); circ(ctx, x, y - 200, 46, '#1b4a32'); circ(ctx, x, y - 200, 22, '#0d2a1c', 0);
}
export function bottle(ctx, x, y, s = 1, col = '#5fa86a') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(ctx, -20, -80, 40, 80, 12); fillStroke(ctx, col, 5); rr(ctx, -9, -112, 18, 36, 5); fillStroke(ctx, col, 5);
  box(ctx, -20, -56, 40, 24, 4, '#fff', 4); ctx.restore();
}

// ---------- Suppenküche ----------
export function soupKitchen(ctx) {
  room(ctx, '#f2c98f', '#b97a48');
  box(ctx, 230, 330, 620, 120, 16, '#7a3a2a'); text(ctx, 'Suppenküche', W / 2, 392, { size: 68, color: '#fff' });
  box(ctx, 120, 520, 280, 240, 10, '#bfe0f2'); line(ctx, 260, 520, 260, 760, OL, 7);
  box(ctx, 690, 520, 280, 240, 10, '#bfe0f2'); line(ctx, 830, 520, 830, 760, OL, 7);
}
export function counter(ctx, y = FLOOR) {
  box(ctx, 470, y - 260, 620, 260, 10, '#d9d9e0'); box(ctx, 450, y - 290, 660, 40, 10, '#a8a8b6');
  // Topf
  box(ctx, 500, y - 400, 190, 120, 22, '#8a8a9a'); box(ctx, 480, y - 410, 230, 26, 10, '#6a6a7a');
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(540 + i * 50, y - 430); ctx.bezierCurveTo(520 + i * 50, y - 470, 570 + i * 50, y - 490, 545 + i * 50, y - 530); ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 8; ctx.stroke(); }
}

// ---------- Straße (Tag) mit Bildschirm ----------
export function streetDay(ctx) {
  sky(ctx, '#f4b48a', '#fbe0c0');
  for (let i = 0; i < 6; i++) { const x = i * 190 - 20, h = 330 + (i % 3) * 70, col = ['#e8a07a', '#d98c6a', '#f0b890'][i % 3];
    box(ctx, x, FLOOR - h, 170, h, 4, col); for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) box(ctx, x + 30 + c * 70, FLOOR - h + 40 + r * 95, 40, 55, 4, '#fbe6c8', 4); }
  pavement(ctx);
}
export function screen(ctx, x, y, w, h, fn) {
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowOffsetY = 10; ctx.shadowBlur = 20; box(ctx, x - w / 2, y - h / 2, w, h, 26, '#1d2236'); ctx.restore();
  box(ctx, x - w / 2, y - h / 2, w, h, 26, null, 9);
  ctx.save(); rr(ctx, x - w / 2 + 16, y - h / 2 + 16, w - 32, h - 32, 16); ctx.clip(); ctx.fillStyle = '#26304e'; ctx.fillRect(x - w / 2, y - h / 2, w, h); fn && fn(); ctx.restore();
}

// ---------- Nacht ----------
export function night(ctx, { bakery = true } = {}) {
  sky(ctx, '#1e1840', '#4a3a78');
  for (let i = 0; i < 40; i++) { const x = (i * 263) % W, y = (i * 137) % 700 + 60; circ(ctx, x, y, 3 + (i % 3), 'rgba(255,255,255,0.7)', 0); }
  ctx.beginPath(); ctx.arc(860, 300, 70, 0, Math.PI * 2); ctx.fillStyle = '#f6e7a8'; ctx.fill();
  ctx.beginPath(); ctx.arc(890, 280, 62, 0, Math.PI * 2); ctx.fillStyle = '#2a2250'; ctx.fill();
  for (let i = 0; i < 6; i++) { const x = i * 190 - 20, h = 360 + (i % 3) * 80; box(ctx, x, FLOOR - h, 170, h, 4, '#2f2860');
    for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) box(ctx, x + 30 + c * 70, FLOOR - h + 40 + r * 95, 40, 55, 4, (i + r + c) % 3 ? '#3d3570' : '#f5d77a', 4); }
  if (bakery) { box(ctx, 600, FLOOR - 420, 420, 420, 6, '#7a4a3a'); box(ctx, 630, FLOOR - 380, 360, 80, 10, '#f5c84b'); text(ctx, 'Bäckerei', 810, FLOOR - 338, { size: 52, color: OL });
    box(ctx, 640, FLOOR - 270, 340, 200, 10, '#ffe7a8'); emoji(ctx, '🥐', 720, FLOOR - 170, 70); emoji(ctx, '🥖', 830, FLOOR - 170, 70); emoji(ctx, '🥨', 920, FLOOR - 170, 64); }
  pavement(ctx, '#3e3a5a', 'rgba(255,255,255,0.15)');
}
export function blanket(ctx, x, y, w = 220, h = 150, col = '#c8504a') {
  box(ctx, x - w / 2, y - h / 2, w, h, 18, col); ctx.save(); rr(ctx, x - w / 2, y - h / 2, w, h, 18); ctx.clip();
  ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 10; for (let i = -w; i < w; i += 50) { ctx.beginPath(); ctx.moveTo(x + i, y - h); ctx.lineTo(x + i + 30, y + h); ctx.stroke(); }
  ctx.restore(); box(ctx, x - w / 2, y - h / 2, w, h, 18, null);
}
export function finlandFlag(ctx, x, y, w = 240) {
  const h = w * 0.62; box(ctx, x - w / 2, y - h / 2, w, h, 8, '#fff');
  ctx.fillStyle = '#1f4fa0'; ctx.fillRect(x - w / 2 + w * 0.28, y - h / 2 + 4, w * 0.18, h - 8); ctx.fillRect(x - w / 2 + 4, y - h * 0.11, w - 8, h * 0.22);
  box(ctx, x - w / 2, y - h / 2, w, h, 8, null);
}

// ---------- Villa-Esszimmer ----------
export function diningRoom(ctx) {
  room(ctx, '#e9dcc6', '#8a5a3a', 'rgba(255,255,255,0.22)');
  // Gemälde mit Goldrahmen (Richard-Portrait)
  box(ctx, 360, 380, 360, 300, 10, C.gold); box(ctx, 385, 405, 310, 250, 6, '#6a8ab0', 5);
  circ(ctx, 540, 500, 60, '#ffd9bf', 5); box(ctx, 480, 560, 120, 95, 30, '#fff', 5); box(ctx, 532, 565, 16, 70, 4, C.gold, 4);
  // Kronleuchter
  line(ctx, 540, 0, 540, 180, OL, 6); box(ctx, 420, 180, 240, 30, 15, C.gold);
  for (let i = 0; i < 5; i++) { circ(ctx, 440 + i * 50, 230, 14, '#fff3b0', 4); }
  // Fenster
  box(ctx, 60, 420, 220, 360, 10, '#bfe0f2'); line(ctx, 170, 420, 170, 780, OL, 7);
  box(ctx, 800, 420, 220, 360, 10, '#bfe0f2'); line(ctx, 910, 420, 910, 780, OL, 7);
}
export function longTable(ctx, y = FLOOR) {
  box(ctx, 120, y - 250, 840, 40, 12, '#fff'); box(ctx, 160, y - 212, 30, 210, 6, '#7a4a2a'); box(ctx, 890, y - 212, 30, 210, 6, '#7a4a2a');
  for (const x of [300, 540, 780]) { ell(ctx, x, y - 258, 60, 14, '#f4f4f4', 5); }
  box(ctx, 525, y - 340, 30, 80, 6, '#fff', 4); ell(ctx, 540, y - 350, 10, 16, '#ffb84a', 0);
}
export function brokenPlates(ctx, x, y) {
  for (const [dx, dy, r] of [[-60, 0, 0.4], [-10, 10, -0.6], [50, -4, 0.9], [90, 8, -0.2]]) {
    ctx.save(); ctx.translate(x + dx, y + dy); ctx.rotate(r); poly(ctx, [[-30, 0], [0, -14], [34, -4], [10, 12]], '#fff', 5); ctx.restore();
  }
  box(ctx, x - 110, y + 14, 220, 16, 6, '#c0c0c8', 5);
}

// ---------- Vorstand ----------
export function boardroom(ctx) {
  ctx.fillStyle = '#dfe4ec'; ctx.fillRect(0, 0, W, FLOOR);
  box(ctx, 0, 300, W, 600, 0, '#9ac0e0', 0);
  for (let i = 0; i < 8; i++) { const x = i * 140 - 10, h = 200 + (i * 53) % 230; box(ctx, x, 900 - h, 110, h, 4, '#6a8ab0', 4); }
  for (let x = 0; x <= W; x += 270) line(ctx, x, 300, x, 900, '#ffffff', 10);
  line(ctx, 0, 300, W, 300, OL, 7); line(ctx, 0, 900, W, 900, OL, 7);
  woodFloor(ctx, '#7a6a6a');
}
export function boardTable(ctx, y = FLOOR) { box(ctx, 60, y - 230, 960, 50, 14, '#5a3a2a'); box(ctx, 120, y - 182, 840, 180, 6, '#4a2e22'); }
export function stockChart(ctx, x, y, w, h, k) {
  box(ctx, x - w / 2, y - h / 2, w, h, 20, '#1d2236');
  const pts = [[0, 0.3], [0.2, 0.25], [0.35, 0.35], [0.5, 0.28], [0.62, 0.32], [0.75, 0.6], [0.88, 0.75], [1, 0.82]];
  ctx.beginPath(); const n = Math.max(2, Math.ceil(pts.length * clamp(k)));
  pts.slice(0, n).forEach(([px, py], i) => { const X = x - w / 2 + 40 + px * (w - 80), Y = y - h / 2 + 40 + py * (h - 80); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); });
  ctx.strokeStyle = '#ff5a5a'; ctx.lineWidth = 12; ctx.lineJoin = 'round'; ctx.stroke();
}

// ---------- Restaurant ----------
export function restaurant(ctx) {
  room(ctx, '#7a2e3a', '#4a2a2a', 'rgba(255,255,255,0.06)');
  for (const x of [160, 540, 920]) { box(ctx, x - 90, 420, 180, 140, 8, C.gold); box(ctx, x - 70, 440, 140, 100, 4, '#e8d8b8', 4); }
  for (const x of [160, 540, 920]) { line(ctx, x, 0, x, 260, OL, 5); ell(ctx, x, 280, 60, 30, '#f5c84b'); }
}
export function dinnerTable(ctx, x, y = FLOOR) {
  box(ctx, x - 200, y - 230, 400, 40, 10, '#fff'); poly(ctx, [[x - 200, y - 190], [x + 200, y - 190], [x + 180, y - 60], [x - 180, y - 60]], '#fff');
  box(ctx, x - 20, y - 60, 40, 60, 4, '#3a2626'); ell(ctx, x - 80, y - 236, 50, 12, '#f4f4f4', 5);
  box(ctx, x + 60, y - 310, 14, 80, 4, '#fff', 4); ell(ctx, x + 67, y - 318, 8, 13, '#ffb84a', 0);
}

// ---------- Wohnzimmer mit TV ----------
export function livingRoom(ctx, dark = false) {
  room(ctx, dark ? '#3a3260' : '#f2c6a0', dark ? '#4a3a5a' : '#c98a54', dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.16)');
  box(ctx, 120, 1030, 70, 120, 10, '#a8603a'); ctx.beginPath(); ctx.moveTo(155, 1030); ctx.quadraticCurveTo(130, 960, 110, 950); ctx.moveTo(155, 1030); ctx.quadraticCurveTo(180, 950, 205, 960); ctx.strokeStyle = '#4a9a4a'; ctx.lineWidth = 12; ctx.stroke();
  line(ctx, 960, 1100, 960, 1300, OL, 7); poly(ctx, [[920, 1100], [1000, 1100], [985, 1040], [935, 1040]], '#f5c84b');
}
export function sofa(ctx, x, y = FLOOR, col = '#8a5ab0') {
  box(ctx, x - 280, y - 330, 560, 170, 40, col); box(ctx, x - 300, y - 200, 600, 140, 30, col);
  box(ctx, x - 320, y - 260, 80, 200, 30, col); box(ctx, x + 240, y - 260, 80, 200, 30, col);
  box(ctx, x - 260, y - 60, 30, 60, 6, '#3a2626'); box(ctx, x + 230, y - 60, 30, 60, 6, '#3a2626');
}
export function ukFlag(ctx, x, y, w = 260) {
  const h = w * 0.6; ctx.save(); rr(ctx, x - w / 2, y - h / 2, w, h, 8); ctx.clip();
  ctx.fillStyle = '#1f3f8a'; ctx.fillRect(x - w / 2, y - h / 2, w, h);
  ctx.strokeStyle = '#fff'; ctx.lineWidth = h * 0.2; ctx.beginPath(); ctx.moveTo(x - w / 2, y - h / 2); ctx.lineTo(x + w / 2, y + h / 2); ctx.moveTo(x + w / 2, y - h / 2); ctx.lineTo(x - w / 2, y + h / 2); ctx.stroke();
  ctx.strokeStyle = '#d8303a'; ctx.lineWidth = h * 0.07; ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.fillRect(x - w / 2, y - h * 0.17, w, h * 0.34); ctx.fillRect(x - w * 0.1, y - h / 2, w * 0.2, h);
  ctx.fillStyle = '#d8303a'; ctx.fillRect(x - w / 2, y - h * 0.1, w, h * 0.2); ctx.fillRect(x - w * 0.06, y - h / 2, w * 0.12, h);
  ctx.restore(); box(ctx, x - w / 2, y - h / 2, w, h, 8, null);
}

// ---------- Garage ----------
export function garage(ctx) {
  ctx.fillStyle = '#c8ccd4'; ctx.fillRect(0, 0, W, FLOOR);
  ctx.fillStyle = 'rgba(0,0,0,0.06)'; for (let y = 0; y < FLOOR; y += 60) ctx.fillRect(0, y, W, 4);
  box(ctx, 140, 300, 800, 120, 10, '#3a3f4a'); text(ctx, 'GARAGE', W / 2, 362, { size: 64, color: C.gold, spacing: 8 });
  for (let i = 0; i < 3; i++) { line(ctx, 260 + i * 280, 0, 260 + i * 280, 120, OL, 5); box(ctx, 200 + i * 280, 120, 120, 26, 10, '#fff8c0'); }
  ctx.fillStyle = '#8a8e98'; ctx.fillRect(0, FLOOR, W, H); ctx.fillStyle = 'rgba(255,255,255,0.12)'; for (let x = 0; x < W; x += 160) ctx.fillRect(x, FLOOR, 8, H);
}
export function sportsCar(ctx, x, y = FLOOR, col = '#d8303a') {
  ctx.save(); ctx.translate(x, y);
  poly(ctx, [[-300, -70], [-270, -150], [-120, -170], [-40, -250], [120, -250], [210, -160], [300, -140], [310, -70]], col);
  poly(ctx, [[-20, -235], [110, -235], [180, -165], [-80, -165]], '#bfe0f2', 5);
  box(ctx, -40, -160, 120, 60, 10, '#8a5a3a', 4); // Ledersitz
  circ(ctx, -180, -60, 58, '#2b2b2b'); circ(ctx, -180, -60, 24, '#c0c0c8'); circ(ctx, 190, -60, 58, '#2b2b2b'); circ(ctx, 190, -60, 24, '#c0c0c8');
  ctx.restore();
}
export function bambooBike(ctx, x, y = FLOOR) {
  ctx.save(); ctx.translate(x, y);
  for (const bx of [-110, 110]) { ctx.beginPath(); ctx.arc(bx, -80, 75, 0, Math.PI * 2); ctx.lineWidth = 12; ctx.strokeStyle = OL; ctx.stroke(); }
  for (const [a, b, c, d] of [[-110, -80, -10, -190], [-10, -190, 110, -80], [-110, -80, 30, -80], [30, -80, -10, -190], [-10, -190, 80, -190], [80, -190, 110, -80]]) line(ctx, a, b, c, d, '#c8a24a', 14);
  ctx.restore();
}
// ---------- Küche nachts ----------
export function kitchenNight(ctx) {
  room(ctx, '#3a3260', '#4a3a5a', 'rgba(255,255,255,0.04)');
  box(ctx, 80, 900, 420, 400, 10, '#5a4a7a'); box(ctx, 60, 870, 460, 40, 10, '#7a6a9a');
  box(ctx, 140, 500, 260, 220, 10, '#2a2450'); ctx.beginPath(); ctx.arc(330, 560, 34, 0, Math.PI * 2); ctx.fillStyle = '#f6e7a8'; ctx.fill();
}
export function fridge(ctx, x, y = FLOOR, open = 0) {
  if (open > 0) { ctx.save(); const g = ctx.createRadialGradient(x, y - 400, 20, x, y - 400, 500); g.addColorStop(0, 'rgba(220,240,255,0.6)'); g.addColorStop(1, 'rgba(220,240,255,0)'); ctx.fillStyle = g; ctx.fillRect(x - 520, y - 950, 1040, 950); ctx.restore(); }
  box(ctx, x - 150, y - 720, 300, 720, 22, '#eef2f6');
  if (open > 0) { box(ctx, x - 130, y - 700, 260, 680, 12, '#dff0ff', 5); for (let i = 1; i < 4; i++) line(ctx, x - 130, y - 700 + i * 170, x + 130, y - 700 + i * 170, '#9ab0c0', 6);
    emoji(ctx, '🥬', x - 60, y - 580, 70); emoji(ctx, '🥕', x + 50, y - 580, 70); emoji(ctx, '🍅', x - 40, y - 410, 70); emoji(ctx, '🧃', x + 60, y - 410, 70);
    box(ctx, x + 150, y - 720, 60 * open, 720, 10, '#d8dde4'); }
  else { line(ctx, x - 150, y - 460, x + 150, y - 460, OL, 6); box(ctx, x + 100, y - 640, 16, 120, 8, '#9aa0a8', 4); box(ctx, x + 100, y - 400, 16, 120, 8, '#9aa0a8', 4); }
}

// ---------- Kloster ----------
export function monastery(ctx, dark = false) {
  ctx.fillStyle = dark ? '#3a3448' : '#d8c8a8'; ctx.fillRect(0, 0, W, FLOOR);
  ctx.strokeStyle = dark ? 'rgba(0,0,0,0.25)' : 'rgba(120,90,50,0.25)'; ctx.lineWidth = 4;
  for (let y = 0; y < FLOOR; y += 70) { const off = (y / 70) % 2 ? 60 : 0; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); for (let x = off; x < W; x += 120) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 70); ctx.stroke(); } }
  for (const x of [200, 540, 880]) { ctx.beginPath(); ctx.moveTo(x - 110, 900); ctx.lineTo(x - 110, 560); ctx.arc(x, 560, 110, Math.PI, 0); ctx.lineTo(x + 110, 900); ctx.closePath(); fillStroke(ctx, dark ? '#1e1a30' : '#8ab0d0'); }
  ctx.fillStyle = dark ? '#2e2a3a' : '#a89070'; ctx.fillRect(0, FLOOR, W, H - FLOOR);
  ctx.fillStyle = 'rgba(0,0,0,0.12)'; for (let x = 0; x < W; x += 140) ctx.fillRect(x, FLOOR, 6, H);
}
export function candle(ctx, x, y, t = 0) {
  box(ctx, x - 14, y - 70, 28, 70, 6, '#fff8e0', 4);
  const f = 1 + Math.sin(t * 13 + x) * 0.12;
  ctx.save(); ctx.translate(x, y - 84); ctx.scale(1, f); ell(ctx, 0, 0, 9, 16, '#ffb84a', 0); ctx.restore();
  ctx.save(); const g = ctx.createRadialGradient(x, y - 84, 2, x, y - 84, 90); g.addColorStop(0, 'rgba(255,200,100,0.35)'); g.addColorStop(1, 'rgba(255,200,100,0)'); ctx.fillStyle = g; ctx.fillRect(x - 90, y - 174, 180, 180); ctx.restore();
}
export function gong(ctx, x, y = FLOOR, hit = 0) {
  box(ctx, x - 130, y - 520, 20, 520, 6, '#6a3a1a'); box(ctx, x + 110, y - 520, 20, 520, 6, '#6a3a1a'); box(ctx, x - 150, y - 540, 300, 30, 8, '#6a3a1a');
  const sh = Math.sin(hit * 40) * 6 * Math.max(0, 1 - hit);
  circ(ctx, x + sh, y - 330, 100, C.gold); circ(ctx, x + sh, y - 330, 60, null, 5);
}

// ---------- Weltall ----------
export function spaceStation(ctx, t = 0) {
  ctx.fillStyle = '#d8dde6'; ctx.fillRect(0, 0, W, H);
  for (let x = 0; x < W; x += 180) { box(ctx, x + 10, 0, 160, H, 0, '#cfd5df', 0); line(ctx, x, 0, x, H, '#b8c0cc', 6); }
  for (const [x, y] of [[270, 560], [810, 560]]) { circ(ctx, x, y, 150, '#9aa4b4'); circ(ctx, x, y, 120, '#0b1030'); for (let i = 0; i < 14; i++) circ(ctx, x - 100 + (i * 53) % 200, y - 90 + (i * 37) % 180, 3, '#fff', 0); }
  box(ctx, 0, FLOOR, W, H - FLOOR, 0, '#bfc6d2', 0); line(ctx, 0, FLOOR, W, FLOOR, OL, 6);
  for (let i = 0; i < 6; i++) box(ctx, 60 + i * 170, 900, 110, 40, 8, ['#e8504a', '#5fc47a', '#f5c84b'][i % 3], 4);
}
export function space(ctx, t = 0) {
  ctx.fillStyle = '#070a24'; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 90; i++) { const x = (i * 263) % W, y = (i * 137) % H; circ(ctx, x, y, 2 + (i % 3), 'rgba(255,255,255,' + (0.4 + (i % 5) / 10) + ')', 0); }
  // Erde unten
  circ(ctx, W / 2, H + 500, 1100, '#3a8ad8', 0);
  ctx.save(); ctx.beginPath(); ctx.arc(W / 2, H + 500, 1100, 0, Math.PI * 2); ctx.clip();
  for (const [x, y, r] of [[200, 1500, 220], [700, 1430, 260], [950, 1700, 180], [420, 1800, 200]]) circ(ctx, x, y, r, '#5fb06a', 0);
  ctx.restore();
  ctx.save(); ctx.globalAlpha = 0.25; circ(ctx, W / 2, H + 500, 1130, null, 30); ctx.restore();
}

// ---------- Klassenzimmer ----------
export function classroom(ctx) {
  room(ctx, '#f6e2b8', '#b88050');
  box(ctx, 140, 330, 800, 420, 14, '#7a4a2a'); box(ctx, 165, 355, 750, 370, 8, '#2f5a46');
  box(ctx, 300, 735, 480, 18, 6, '#c8a070', 4);
  circ(ctx, 980, 420, 50, '#fff'); line(ctx, 980, 420, 980, 390, OL, 6); line(ctx, 980, 420, 1000, 420, OL, 6);
}

// ---------- Bunker ----------
export function bunker(ctx, dark = false) {
  ctx.fillStyle = dark ? '#2a2e34' : '#7a8088'; ctx.fillRect(0, 0, W, H);
  for (let y = 0; y < FLOOR; y += 120) for (let x = (y / 120) % 2 ? 0 : -110; x < W; x += 220) box(ctx, x, y, 220, 120, 4, dark ? '#343a42' : '#8a9098', 4);
  ctx.fillStyle = dark ? '#1e2228' : '#5a6068'; ctx.fillRect(0, FLOOR, W, H - FLOOR); line(ctx, 0, FLOOR, W, FLOOR, OL, 6);
  // Tür mit Rad
  circ(ctx, 900, 760, 170, '#9aa0a8'); circ(ctx, 900, 760, 140, '#b0b6be');
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 4; line(ctx, 900 + Math.cos(a) * 70, 760 + Math.sin(a) * 70, 900 - Math.cos(a) * 70, 760 - Math.sin(a) * 70, '#c84a3e', 12); }
  circ(ctx, 900, 760, 70, null, 12); circ(ctx, 900, 760, 20, '#c84a3e');
}
export function cans(ctx, x, y, n = 12, s = 1) {
  for (let i = 0; i < n; i++) { const cx = x + (i % 6) * 64 * s, cy = y - Math.floor(i / 6) * 92 * s; box(ctx, cx, cy - 86 * s, 56 * s, 86 * s, 8, '#c8ccd4', 4); box(ctx, cx, cy - 64 * s, 56 * s, 40 * s, 0, '#e8504a', 0); }
}
