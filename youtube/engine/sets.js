// Kulissen (Büro, Finanzamt, Villa, Bank, Gericht, Krankenhaus, Wohnzimmer, Bühne) und Requisiten im Neon-Stil.
import { x, W, H, FLOOR, GOLD, RED, WHITE, GREEN, BLUE, TEAL, GRAY, clamp, lerp, easeOut, rng, neon, neonCircle, text, floorGrid, coin } from './core.js';

const dim = (c, a) => c + Math.round(a * 255).toString(16).padStart(2, '0');

function wallGlow(color, gx = W / 2, gy = 380, r = 950, a = 0.16) {
  const g = x.createRadialGradient(gx, gy, 30, gx, gy, r); g.addColorStop(0, dim(color, a)); g.addColorStop(1, '#00000000'); x.fillStyle = g; x.fillRect(-W, -H, W * 3, H * 3);
}

export const SETS = {
  stage(t, o = {}) { floorGrid(FLOOR, o.glow || GOLD, o.gx ?? W / 2, o.a ?? 0.19); },

  office(t) {
    floorGrid(FLOOR, GOLD, W / 2, 0.12);
    // Panoramafenster mit Skyline
    const L = 240, R = 1680, T = 90, B = 690;
    x.save(); x.beginPath(); x.rect(L, T, R - L, B - T); x.clip();
    const sky = x.createLinearGradient(0, T, 0, B); sky.addColorStop(0, '#05060f'); sky.addColorStop(1, '#141024'); x.fillStyle = sky; x.fillRect(L, T, R - L, B - T);
    const r = rng(11);
    for (let i = 0; i < 60; i++) { x.fillStyle = `rgba(255,255,255,${0.2 + r() * 0.5})`; x.fillRect(L + r() * (R - L), T + r() * 250, 2, 2); }
    x.fillStyle = '#f5f0d8'; x.shadowColor = '#fff2c0'; x.shadowBlur = 30; x.beginPath(); x.arc(1460, 200, 38, 0, Math.PI * 2); x.fill(); x.shadowBlur = 0;
    let bx = L - 20;
    while (bx < R) {
      const bw = 70 + r() * 110, bh = 140 + r() * 330;
      x.fillStyle = '#0a0a12'; x.fillRect(bx, B - bh, bw, bh);
      x.strokeStyle = dim(GOLD, 0.35); x.lineWidth = 2; x.strokeRect(bx, B - bh, bw, bh);
      for (let wy = B - bh + 16; wy < B - 10; wy += 22) for (let wx = bx + 10; wx < bx + bw - 12; wx += 18) if (r() < 0.32) { x.fillStyle = dim(r() < 0.8 ? GOLD : WHITE, 0.55 + r() * 0.3); x.fillRect(wx, wy, 7, 10); }
      bx += bw + 8 + r() * 20;
    }
    x.restore();
    neon([[[L, T], [R, T], [R, B], [L, B], [L, T]], [[W / 2, T], [W / 2, B]], [[L + (R - L) / 4, T], [L + (R - L) / 4, B]], [[L + (R - L) * 3 / 4, T], [L + (R - L) * 3 / 4, B]]], dim(GOLD, 0.9), 5);
    // Wandkante + Regal links
    neon([[[0, 740], [W, 740]]], dim(GOLD, 0.3), 2, 1, 6);
  },

  finanzamt(t) {
    floorGrid(FLOOR, RED, W / 2, 0.14);
    wallGlow(RED, W / 2, 300, 900, 0.1);
    // Aktenregale
    const r = rng(5);
    for (const sx of [120, 1340]) {
      neon([[[sx, 150], [sx + 460, 150], [sx + 460, 740], [sx, 740], [sx, 150]]], dim(RED, 0.6), 4);
      for (let row = 0; row < 5; row++) {
        const y0 = 170 + row * 114; neon([[[sx, y0 + 104], [sx + 460, y0 + 104]]], dim(RED, 0.5), 3, 1, 10);
        let fx = sx + 14; while (fx < sx + 440) { const fw = 22 + r() * 18, fh = 70 + r() * 28; x.fillStyle = r() < 0.5 ? 'rgba(255,90,90,0.18)' : 'rgba(200,200,210,0.12)'; x.strokeStyle = r() < 0.7 ? dim(RED, 0.55) : 'rgba(220,220,230,0.4)'; x.lineWidth = 2; x.fillRect(fx, y0 + 104 - fh, fw, fh); x.strokeRect(fx, y0 + 104 - fh, fw, fh); fx += fw + 4; }
      }
    }
    // Schild
    x.save(); x.beginPath(); x.roundRect(700, 90, 520, 110, 18); x.fillStyle = 'rgba(40,0,0,0.7)'; x.fill(); x.restore();
    neon([[[700, 90], [1220, 90], [1220, 200], [700, 200], [700, 90]]], RED, 5);
    text('FINANZAMT', 960, 147, { size: 64, color: RED, weight: 900, spacing: 8, glow: 0.6 });
    // Uhr
    neonCircle(960, 330, 60, dim(RED, 0.8), 4); const a = t * 0.5; neon([[[960, 330], [960 + Math.cos(a) * 44, 330 + Math.sin(a) * 44]], [[960, 330], [960 + Math.cos(a / 12 - 1) * 30, 330 + Math.sin(a / 12 - 1) * 30]]], dim(RED, 0.9), 4);
  },

  villa(t) {
    x.fillStyle = '#03040a'; x.fillRect(-W, -H, W * 3, H * 3);
    const sky = x.createLinearGradient(0, 0, 0, FLOOR); sky.addColorStop(0, '#04050f'); sky.addColorStop(1, '#151a33'); x.fillStyle = sky; x.fillRect(-W, -H, W * 3, FLOOR + H);
    const r = rng(3); for (let i = 0; i < 120; i++) { x.fillStyle = `rgba(255,255,255,${0.2 + r() * 0.6})`; const s = r() * 2 + 1; x.fillRect(r() * W * 1.4 - W * 0.2, r() * 520, s, s); }
    x.fillStyle = '#fff7dc'; x.shadowColor = '#fff2c0'; x.shadowBlur = 50; x.beginPath(); x.arc(330, 170, 54, 0, Math.PI * 2); x.fill(); x.shadowBlur = 0;
    floorGridTerrace();
    // Villa (moderne Kuben)
    const vx = 760, vy = FLOOR;
    x.fillStyle = 'rgba(10,10,16,0.95)'; x.fillRect(vx, vy - 300, 780, 300); x.fillRect(vx + 140, vy - 470, 560, 170);
    neon([[[vx - 40, vy - 300], [vx + 820, vy - 300]], [[vx, vy], [vx, vy - 300]], [[vx + 780, vy], [vx + 780, vy - 300]], [[vx + 100, vy - 470], [vx + 740, vy - 470]], [[vx + 140, vy - 300], [vx + 140, vy - 470]], [[vx + 700, vy - 300], [vx + 700, vy - 470]]], GOLD, 5);
    for (let i = 0; i < 4; i++) { x.fillStyle = 'rgba(245,200,75,0.35)'; x.shadowColor = GOLD; x.shadowBlur = 30; x.fillRect(vx + 40 + i * 185, vy - 250, 150, 200); }
    for (let i = 0; i < 3; i++) x.fillRect(vx + 180 + i * 170, vy - 440, 130, 110);
    x.shadowBlur = 0;
    // Pool
    const pg = x.createLinearGradient(0, FLOOR + 30, 0, FLOOR + 110); pg.addColorStop(0, 'rgba(95,224,208,0.55)'); pg.addColorStop(1, 'rgba(95,224,208,0.15)');
    x.fillStyle = pg; x.beginPath(); x.moveTo(700, FLOOR + 30); x.lineTo(1600, FLOOR + 30); x.lineTo(1680, FLOOR + 110); x.lineTo(640, FLOOR + 110); x.closePath(); x.fill();
    neon([[[700, FLOOR + 30], [1600, FLOOR + 30], [1680, FLOOR + 110], [640, FLOOR + 110], [700, FLOOR + 30]]], TEAL, 4);
    for (let i = 0; i < 5; i++) { const yy = FLOOR + 50 + i * 12, ph = t * 1.5 + i; neon([[[760 + Math.sin(ph) * 20, yy], [860 + Math.sin(ph) * 20, yy]], [[1200 + Math.cos(ph) * 20, yy], [1320 + Math.cos(ph) * 20, yy]]], dim(WHITE, 0.4), 2, 1, 6); }
    palm(1720, FLOOR, 1.1, t); palm(620, FLOOR, 0.9, t + 1);
  },

  bank(t) {
    floorGrid(FLOOR, BLUE, W / 2, 0.15);
    wallGlow(BLUE, W / 2, 320, 900, 0.1);
    neon([[[520, 250], [960, 90], [1400, 250], [520, 250]], [[480, 270], [1440, 270]], [[480, 740], [1440, 740]]], BLUE, 5);
    for (let i = 0; i < 6; i++) { const cx = 580 + i * 152; neon([[[cx - 22, 290], [cx - 22, 720]], [[cx + 22, 290], [cx + 22, 720]], [[cx - 34, 290], [cx + 34, 290]], [[cx - 34, 720], [cx + 34, 720]]], dim(BLUE, 0.75), 3); }
    text('BANK', 960, 200, { size: 70, color: BLUE, weight: 900, spacing: 18, glow: 0.6 });
  },

  court(t) {
    floorGrid(FLOOR, RED, W / 2, 0.16);
    wallGlow(RED, W / 2, 250, 1000, 0.12);
    // Richterbank
    x.fillStyle = 'rgba(20,6,8,0.92)'; x.fillRect(360, 520, 1200, 230);
    neon([[[360, 520], [1560, 520], [1560, 750], [360, 750], [360, 520]], [[340, 520], [1580, 520]]], RED, 5);
    text('BUNDESVERFASSUNGSGERICHT', 960, 150, { size: 46, color: RED, weight: 900, spacing: 6, glow: 0.5 });
    scales(960, 330, 1, dim(GOLD, 0.95));
    for (let i = 0; i < 8; i++) neon([[[140 + i * 30, 120], [140 + i * 30, 740]], [[1780 - i * 30, 120], [1780 - i * 30, 740]]], dim(RED, 0.25), 3, 1, 6);
  },

  hospital(t) {
    floorGrid(FLOOR, TEAL, W / 2, 0.15);
    wallGlow(TEAL, W / 2, 300, 900, 0.1);
    for (const dx of [90, 1640]) { neon([[[dx, 740], [dx, 320], [dx + 200, 320], [dx + 200, 740]]], dim(TEAL, 0.7), 4); neonCircle(dx + 170, 530, 8, dim(TEAL, 0.8), 3); }
    x.fillStyle = 'rgba(0,30,28,0.7)'; x.fillRect(1500, 120, 340, 110);
    neon([[[1500, 120], [1840, 120], [1840, 230], [1500, 230], [1500, 120]]], TEAL, 4);
    x.fillStyle = '#ff6b6b'; x.shadowColor = '#ff6b6b'; x.shadowBlur = 20; x.fillRect(1522, 167, 50, 16); x.fillRect(1539, 150, 16, 50); x.shadowBlur = 0;
    text('STATION 3', 1710, 177, { size: 38, color: TEAL, weight: 800, spacing: 4, glow: 0.4 });
  },

  living(t) {
    floorGrid(FLOOR, GOLD, W / 2, 0.13);
    wallGlow(GOLD, 1840, 300, 600, 0.12);
    // Lampe + Bilderrahmen + Sofa (hinten)
    neon([[[1840, 740], [1840, 330]], [[1780, 330], [1900, 330], [1870, 250], [1810, 250], [1780, 330]]], dim(GOLD, 0.9), 4);
    neon([[[60, 110], [300, 110], [300, 270], [60, 270], [60, 110]], [[80, 250], [150, 180], [200, 220], [240, 170], [285, 250]]], dim(GOLD, 0.7), 4);
    neon([[[700, 740], [700, 610], [1220, 610], [1220, 740]], [[660, 740], [660, 660], [700, 660]], [[1260, 740], [1260, 660], [1220, 660]], [[700, 680], [1220, 680]]], dim(GOLD, 0.6), 4);
  },
};

function floorGridTerrace() {
  const g = x.createLinearGradient(0, FLOOR, 0, H + 200); g.addColorStop(0, '#0d0d14'); g.addColorStop(1, '#040406');
  x.fillStyle = g; x.fillRect(-W, FLOOR, W * 3, H * 2);
  x.save(); x.strokeStyle = 'rgba(160,160,175,0.14)'; x.lineWidth = 2; x.setLineDash([14, 16]);
  for (let i = -12; i <= 12; i++) { x.beginPath(); x.moveTo(W / 2 + i * 70, FLOOR); x.lineTo(W / 2 + i * 380, H + 200); x.stroke(); }
  x.restore();
}

// ---------- Requisiten ----------
export function palm(px, py, s, t) {
  x.save(); x.translate(px, py); x.scale(s, s);
  neon([[[0, 0], [10, -120], [24, -240], [30, -330]]], dim(GOLD, 0.8), 7);
  const sway = Math.sin(t * 0.8) * 0.05;
  for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.55 + sway; const ex = 30 + Math.cos(a) * 170, ey = -330 + Math.sin(a) * 90 + 50; neon([[[30, -330], [30 + Math.cos(a) * 90, -330 + Math.sin(a) * 60], [ex, ey]]], dim(GREEN, 0.85), 6); }
  x.restore();
}
export function scales(px, py, s = 1, color = GOLD, tiltA = 0) {
  x.save(); x.translate(px, py); x.scale(s, s);
  neon([[[0, -110], [0, 110]], [[-70, 110], [70, 110]]], color, 6);
  x.rotate(tiltA); neon([[[-140, -90], [140, -90]]], color, 6);
  for (const sx of [-140, 140]) { x.save(); x.translate(sx, -90); x.rotate(-tiltA); neon([[[0, 0], [-46, 90]], [[0, 0], [46, 90]], [[-56, 90], [56, 90]]], color, 4); x.beginPath(); x.ellipse(0, 92, 56, 14, 0, 0, Math.PI); x.strokeStyle = color; x.lineWidth = 4; x.stroke(); x.restore(); }
  x.restore();
}
export function building(cx, fy, w, h, color = GOLD, floors = 8, cols = 3) {
  const d = w * 0.35, P = [];
  P.push([[cx - w / 2, fy], [cx - w / 2, fy - h], [cx + w / 2, fy - h], [cx + w / 2, fy], [cx - w / 2, fy]]);
  P.push([[cx + w / 2, fy - h], [cx + w / 2 + d, fy - h - d * 0.5], [cx + w / 2 + d, fy - d * 0.5], [cx + w / 2, fy]]);
  P.push([[cx - w / 2, fy - h], [cx - w / 2 + d, fy - h - d * 0.5], [cx + w / 2 + d, fy - h - d * 0.5]]);
  for (let i = 1; i < floors; i++) P.push([[cx - w / 2, fy - h * i / floors], [cx + w / 2, fy - h * i / floors], [cx + w / 2 + d, fy - h * i / floors - d * 0.5]]);
  for (let i = 1; i < cols; i++) P.push([[cx - w / 2 + w * i / cols, fy], [cx - w / 2 + w * i / cols, fy - h]]);
  x.save(); x.fillStyle = dim(color.length === 7 ? color : GOLD, 0.07); x.fillRect(cx - w / 2, fy - h, w, h); x.restore();
  neon(P, color, 4);
}
export function house(cx, fy, s = 1, color = GOLD) {
  x.save(); x.translate(cx, fy); x.scale(s, s);
  x.fillStyle = 'rgba(245,200,75,0.06)'; x.fillRect(-90, -130, 180, 130);
  neon([[[-90, 0], [-90, -130], [90, -130], [90, 0], [-90, 0]], [[-115, -120], [0, -215], [115, -120]], [[-25, 0], [-25, -70], [25, -70], [25, 0]], [[45, -110], [75, -110], [75, -80], [45, -80], [45, -110]]], color, 5);
  x.restore();
}
export function yacht(cx, cy, s = 1, color = WHITE, t = 0) {
  x.save(); x.translate(cx, cy + Math.sin(t * 1.4) * 5); x.scale(s, s);
  neon([[[-220, 0], [220, 0], [170, 60], [-180, 60], [-220, 0]], [[-120, 0], [-90, -60], [120, -60], [160, 0]], [[-60, -60], [-40, -110], [80, -110], [100, -60]]], color, 5);
  for (let i = 0; i < 5; i++) { x.fillStyle = 'rgba(245,200,75,0.5)'; x.fillRect(-70 + i * 40, -48, 26, 30); }
  x.restore();
}
export function doc(cx, cy, s = 1, title = '', color = WHITE, lines = 5) {
  x.save(); x.translate(cx, cy); x.scale(s, s);
  x.beginPath(); x.roundRect(-90, -120, 180, 240, 10); x.fillStyle = 'rgba(10,10,14,0.9)'; x.fill();
  neon([[[-90, -120], [60, -120], [90, -90], [90, 120], [-90, 120], [-90, -120]], [[60, -120], [60, -90], [90, -90]]], color, 4);
  if (title) text(title, 0, -72, { size: 26, color, weight: 900, glow: 0.3 });
  for (let i = 0; i < lines; i++) neon([[[-60, -30 + i * 30], [i === lines - 1 ? 10 : 60, -30 + i * 30]]], dim(color.length === 7 ? color : '#ffffff', 0.55), 4, 1, 6);
  x.restore();
}
export function chartLine(x0, y0, w, h, pts, color = GOLD, p = 1, lw = 7) {
  const n = pts.length - 1, upto = p * n;
  neon([[[x0, y0 - h], [x0, y0], [x0 + w, y0]]], 'rgba(255,255,255,0.4)', 3, 1, 0);
  const path = [];
  for (let i = 0; i <= Math.floor(upto); i++) path.push([x0 + w * i / n, y0 - h * pts[i]]);
  const f = upto - Math.floor(upto); if (f > 0 && Math.floor(upto) < n) { const i = Math.floor(upto); path.push([x0 + w * (i + f) / n, y0 - h * lerp(pts[i], pts[i + 1], f)]); }
  if (path.length > 1) neon([path], color, lw);
  return path[path.length - 1];
}
export function moneyStack(cx, fy, n = 5, s = 1, color = GREEN) {
  x.save(); x.translate(cx, fy); x.scale(s, s);
  for (let i = 0; i < n; i++) { x.fillStyle = 'rgba(30,60,40,0.9)'; x.beginPath(); x.roundRect(-70, -18 - i * 20, 140, 18, 4); x.fill(); x.strokeStyle = color; x.lineWidth = 3; x.shadowColor = color; x.shadowBlur = 12; x.stroke(); }
  x.shadowBlur = 0; text('€', 0, -9 - (n - 1) * 20, { size: 18, color, weight: 900, glow: 0.2 });
  x.restore();
}
export function gift(cx, fy, s = 1, color = GOLD, open = 0) {
  x.save(); x.translate(cx, fy); x.scale(s, s);
  x.fillStyle = 'rgba(245,200,75,0.08)'; x.fillRect(-70, -110, 140, 110);
  neon([[[-70, 0], [-70, -110], [70, -110], [70, 0], [-70, 0]], [[0, 0], [0, -110]]], color, 5);
  x.save(); x.translate(0, -110 - open * 60); x.rotate(-open * 0.4);
  neon([[[-80, 0], [80, 0], [80, -26], [-80, -26], [-80, 0]], [[0, -26], [-30, -60], [-6, -26]], [[0, -26], [30, -60], [6, -26]]], color, 5);
  x.restore(); x.restore();
}
export function hourglass(cx, cy, s = 1, color = GOLD, p = 0.5) {
  x.save(); x.translate(cx, cy); x.scale(s, s);
  neon([[[-60, -90], [60, -90]], [[-60, 90], [60, 90]], [[-50, -90], [-8, 0], [-50, 90]], [[50, -90], [8, 0], [50, 90]]], color, 5);
  x.fillStyle = dim(GOLD, 0.6); x.beginPath(); const top = (1 - p) * 70; x.moveTo(-44 * (top / 70), -10 - top); x.lineTo(44 * (top / 70), -10 - top); x.lineTo(0, -6); x.closePath(); x.fill();
  x.beginPath(); const bot = p * 70; x.moveTo(-44, 86); x.lineTo(44, 86); x.lineTo(44 * (1 - bot / 70) + 6, 86 - bot); x.lineTo(-44 * (1 - bot / 70) - 6, 86 - bot); x.closePath(); x.fill();
  x.restore();
}
export function factory(cx, fy, s = 1, color = GOLD, t = 0) {
  x.save(); x.translate(cx, fy); x.scale(s, s);
  x.fillStyle = 'rgba(245,200,75,0.06)'; x.fillRect(-180, -160, 360, 160);
  neon([[[-180, 0], [-180, -160], [-90, -110], [-90, -160], [0, -110], [0, -160], [90, -110], [90, -160], [180, -110], [180, 0], [-180, 0]], [[110, -110], [110, -290], [150, -290], [150, -125]]], color, 5);
  for (let i = 0; i < 4; i++) { x.fillStyle = 'rgba(245,200,75,0.45)'; x.fillRect(-150 + i * 85, -70, 40, 40); }
  for (let i = 0; i < 4; i++) { const q = (t * 0.4 + i / 4) % 1; x.fillStyle = `rgba(200,200,210,${0.35 * (1 - q)})`; x.beginPath(); x.arc(130 + q * 60, -300 - q * 140, 18 + q * 30, 0, Math.PI * 2); x.fill(); }
  x.restore();
}
export function calendar(cx, cy, s = 1, label = '', color = GOLD) {
  x.save(); x.translate(cx, cy); x.scale(s, s);
  x.beginPath(); x.roundRect(-80, -80, 160, 160, 14); x.fillStyle = 'rgba(10,10,14,0.9)'; x.fill();
  neon([[[-80, -80], [80, -80], [80, 80], [-80, 80], [-80, -80]], [[-80, -40], [80, -40]], [[-40, -96], [-40, -64]], [[40, -96], [40, -64]]], color, 5);
  if (label) text(label, 0, 22, { size: 54, color, weight: 900, glow: 0.4 });
  x.restore();
}
export function paragraph(cx, cy, s = 1, color = GOLD) { text('§', cx, cy, { size: 180 * s, color, weight: 900, glow: 0.6 }); }
export function etfJar(cx, fy, s = 1, fill = 0.5, color = GOLD, t = 0) {
  x.save(); x.translate(cx, fy); x.scale(s, s);
  x.fillStyle = 'rgba(245,200,75,0.25)'; x.fillRect(-70, -fill * 200, 140, fill * 200);
  for (let i = 0; i < Math.round(fill * 10); i++) coin(-40 + (i % 3) * 40, -14 - Math.floor(i / 3) * 34 - (i % 2) * 6, 14, i);
  neon([[[-80, -230], [-80, 0], [80, 0], [80, -230]], [[-95, -230], [95, -230]]], color, 5);
  x.restore();
}
