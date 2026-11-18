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
