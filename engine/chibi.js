// Richard-Rollen – 2D-Engine im Flat-Chibi-Stil (Canvas, 1080x1920)
export const W = 1080, H = 1920;
export const OL = '#3a2626';           // Outline-Farbe
export const LW = 7;                    // Outline-Breite
export const FONT = 'Nunito';
export const C = {
  skin: '#ffd9bf', blush: '#f7a8a0', hairR: '#5a3a24', hairDark: '#2b2020', gold: '#f5c84b', goldDark: '#c99a1e',
  white: '#ffffff', cream: '#fdf3e2', red: '#e8504a', navy: '#2d2a4a', badge: '#4a1f1f',
};

// ---------- Mathe / Easing ----------
export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a, b, k) => a + (b - a) * k;
export const easeOut = k => 1 - Math.pow(1 - clamp(k), 3);
export const easeInOut = k => { k = clamp(k); return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
/** Pop-in mit Überschwinger: 0 → 1.12 → 1 */
export function bounce(t, t0, d = 0.3) { if (t < t0) return 0; const k = clamp((t - t0) / d); return easeOut(k) + Math.sin(k * Math.PI) * 0.15; }

// ---------- Grundformen ----------
export function rr(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2); ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
export function fillStroke(ctx, fill, lw = LW, stroke = OL) {
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); }
}
export function box(ctx, x, y, w, h, r, fill, lw = LW) { rr(ctx, x, y, w, h, r); fillStroke(ctx, fill, lw); }
export function circ(ctx, x, y, r, fill, lw = LW) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); fillStroke(ctx, fill, lw); }
export function ell(ctx, x, y, rx, ry, fill, lw = LW) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); fillStroke(ctx, fill, lw); }
export function poly(ctx, pts, fill, lw = LW) { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); fillStroke(ctx, fill, lw); }
export function line(ctx, x1, y1, x2, y2, col = OL, lw = LW) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.stroke(); }

export function text(ctx, s, x, y, { size = 60, weight = 900, color = '#fff', align = 'center', stroke = 0, strokeColor = OL, base = 'middle', spacing = 0, shadow = false } = {}) {
  ctx.font = `${weight} ${size}px ${FONT}, "Noto Color Emoji", sans-serif`;
  ctx.textAlign = align; ctx.textBaseline = base;
  if (spacing) ctx.letterSpacing = spacing + 'px'; else ctx.letterSpacing = '0px';
  if (shadow) { ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillText(s, x + 4, y + 6); }
  if (stroke) { ctx.lineWidth = stroke; ctx.strokeStyle = strokeColor; ctx.lineJoin = 'round'; ctx.strokeText(s, x, y); }
  ctx.fillStyle = color; ctx.fillText(s, x, y);
}
export function emoji(ctx, e, x, y, size) {
  ctx.font = `${size}px "Noto Color Emoji"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.letterSpacing = '0px';
  ctx.fillText(e, x, y + size * 0.05);
}
/** skaliert um (x,y) */
export function scaled(ctx, x, y, s, fn) { if (s <= 0.001) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.translate(-x, -y); fn(); ctx.restore(); }
export function alpha(ctx, a, fn) { if (a <= 0.001) return; ctx.save(); ctx.globalAlpha *= clamp(a); fn(); ctx.restore(); }

// ---------- Figuren ----------
/**
 * Chibi-Figur, Füße bei (x,y). o: { s, hair, hairColor, shirt, pants, tie, collar, coat, expr, look, talk, t, mustache, glasses,
 *  beanie, bald, bun, stubble, prop, flip, shoes, cheeks }
 */
export function person(ctx, x, y, o = {}) {
  const s = o.s ?? 1, t = o.t ?? 0;
  const talk = o.talk ? Math.abs(Math.sin(t * 14)) : 0;
  const hop = o.hop ? Math.abs(Math.sin(t * 6)) * 18 : 0;
  const breathe = Math.sin(t * 2.2 + (o.phase || 0)) * 3;
  ctx.save(); ctx.translate(x, y - hop * s); ctx.scale(s * (o.flip ? -1 : 1), s);
  // Bodenschatten
  ctx.save(); ctx.globalAlpha = 0.18; ell(ctx, 0, hop + 4, 95, 16, '#000', 0); ctx.restore();
  const shirt = o.shirt || '#4f8fd6', pants = o.pants || '#7fa8d8';
  // Beine
  box(ctx, -42, -120, 36, 92, 12, pants); box(ctx, 6, -120, 36, 92, 12, pants);
  // Schuhe
  for (const sx of [-48, 2]) { box(ctx, sx, -40, 48, 38, 14, o.shoes || '#fff'); if (!o.shoes) line(ctx, sx + 10, -16, sx + 38, -24, C.red, 6); }
  // Arme
  const armCol = o.coat || shirt;
  const armSwing = o.wave ? Math.sin(t * 9) * 0.5 : 0;
  ctx.save(); ctx.translate(-66, -228); ctx.rotate(0.18); box(ctx, -18, 0, 34, 92, 14, armCol); circ(ctx, -1, 98, 17, C.skin); ctx.restore();
  ctx.save(); ctx.translate(66, -228); ctx.rotate(-0.18 - (o.wave ? 2.4 + armSwing : 0) - (o.armUp || 0)); box(ctx, -16, 0, 34, 92, 14, armCol); circ(ctx, 1, 98, 17, C.skin); ctx.restore();
  // Torso
  box(ctx, -70, -250 + breathe * 0.3, 140, 140, 34, o.coat || shirt);
  if (o.coat) { // offener Mantel mit Hemd + Flicken
    box(ctx, -30, -246, 60, 132, 10, o.shirtUnder || '#fff', 0);
    line(ctx, -30, -246, -30, -114, OL, 5); line(ctx, 30, -246, 30, -114, OL, 5);
    if (o.patch) { box(ctx, -62, -170, 26, 26, 4, o.patch, 4); line(ctx, -58, -166, -40, -148, OL, 3); }
  }
  if (o.tie) { // goldene Krawatte – Richards Markenzeichen
    poly(ctx, [[-14, -246], [14, -246], [8, -228], [-8, -228]], C.gold, 5);
    poly(ctx, [[-8, -228], [8, -228], [18, -150], [0, -128], [-18, -150]], C.gold, 5);
  }
  if (o.collar !== false && !o.coat) poly(ctx, [[-30, -250], [0, -228], [30, -250]], null, 5);
  if (o.badge) emoji(ctx, o.badge, 0, -180, 56);
  // Kopf
  const hy = -360;
  ctx.save(); ctx.translate(0, hy + breathe * 0.5); ctx.rotate(o.tilt || 0);
  // Ohren
  circ(ctx, -104, 12, 22, C.skin); circ(ctx, 104, 12, 22, C.skin);
  // Haare hinten
  if (o.hair === 'mom') { ell(ctx, 0, 10, 122, 118, o.hairColor || '#6b4026'); }
  if (o.hair === 'grandma') { circ(ctx, 0, -112, 42, '#e6e6ea'); }
  ell(ctx, 0, 0, 108, 100, C.skin);
  // Haare vorne
  drawHair(ctx, o);
  // Gesicht
  const ex = 40, ey = 18, lk = (o.look || 0) * 8;
  const expr = o.expr || 'smile';
  if (expr === 'happy') { // geschlossene Lach-Augen
    for (const sx of [-ex, ex]) { ctx.beginPath(); ctx.arc(sx + lk, ey + 6, 14, Math.PI * 1.1, Math.PI * 1.9); ctx.lineWidth = 7; ctx.strokeStyle = OL; ctx.stroke(); }
  } else if (expr === 'sleep') {
    for (const sx of [-ex, ex]) { ctx.beginPath(); ctx.arc(sx, ey, 13, Math.PI * 0.1, Math.PI * 0.9); ctx.lineWidth = 7; ctx.strokeStyle = OL; ctx.stroke(); }
  } else {
    const big = expr === 'shock' || expr === 'wow' ? 1.25 : 1;
    for (const sx of [-ex, ex]) { ell(ctx, sx + lk, ey, 12 * big, 16 * big, OL, 0); circ(ctx, sx + lk + 4, ey - 6, 4.5, '#fff', 0); }
    if (expr === 'sad' || expr === 'angry') { // Augenbrauen
      const d = expr === 'sad' ? -1 : 1;
      line(ctx, -ex - 16, ey - 30 - d * 6, -ex + 14, ey - 30 + d * 6, OL, 6); line(ctx, ex + 16, ey - 30 - d * 6, ex - 14, ey - 30 + d * 6, OL, 6);
    }
  }
  if (o.glasses) { ctx.lineWidth = 5; ctx.strokeStyle = OL; ctx.beginPath(); ctx.arc(-ex, ey, 24, 0, Math.PI * 2); ctx.moveTo(ex + 24, ey); ctx.arc(ex, ey, 24, 0, Math.PI * 2); ctx.moveTo(-ex + 24, ey); ctx.lineTo(ex - 24, ey); ctx.stroke(); }
  // Bäckchen
  ctx.save(); ctx.globalAlpha = 0.55; ell(ctx, -64, 46, 17, 10, C.blush, 0); ell(ctx, 64, 46, 17, 10, C.blush, 0); ctx.restore();
  if (o.stubble) { ctx.save(); ctx.globalAlpha = 0.18; ell(ctx, 0, 64, 62, 34, '#3a2a20', 0); ctx.restore(); }
  // Mund
  const my = 56;
  if (o.mustache) { ctx.beginPath(); ctx.ellipse(-14, my - 6, 16, 8, 0.2, 0, Math.PI * 2); ctx.ellipse(14, my - 6, 16, 8, -0.2, 0, Math.PI * 2); ctx.fillStyle = o.mustacheColor || '#5a3a24'; ctx.fill(); }
  if (talk > 0.15 || expr === 'shock' || expr === 'wow') {
    const oh = expr === 'shock' || expr === 'wow' ? 18 : 6 + talk * 12;
    ell(ctx, 0, my + 4, 13, oh, '#8a2c2c', 5);
  } else if (expr === 'sad' || expr === 'angry') {
    ctx.beginPath(); ctx.arc(0, my + 18, 16, Math.PI * 1.2, Math.PI * 1.8); ctx.lineWidth = 6; ctx.strokeStyle = OL; ctx.stroke();
  } else if (expr === 'neutral' || expr === 'sleep') {
    line(ctx, -12, my + 4, 12, my + 4, OL, 6);
  } else if (expr === 'happy') {
    ctx.beginPath(); ctx.moveTo(-22, my - 4); ctx.quadraticCurveTo(0, my + 34, 22, my - 4); ctx.closePath(); fillStroke(ctx, '#8a2c2c', 5);
  } else { ctx.beginPath(); ctx.arc(0, my - 6, 16, Math.PI * 0.2, Math.PI * 0.8); ctx.lineWidth = 6; ctx.strokeStyle = OL; ctx.stroke(); }
  if (o.beanie) { // Mütze
    ctx.beginPath(); ctx.ellipse(0, -46, 112, 78, 0, Math.PI, Math.PI * 2); ctx.closePath(); fillStroke(ctx, o.beanie);
    box(ctx, -116, -58, 232, 36, 16, o.beanie2 || '#b8463e');
    circ(ctx, 0, -128, 20, o.beanie2 || '#b8463e');
  }
  if (o.hat === 'top') { box(ctx, -130, -92, 260, 24, 12, '#222'); box(ctx, -78, -230, 156, 146, 10, '#222'); box(ctx, -78, -120, 156, 22, 0, C.gold, 5); }
  if (o.hat === 'chef') { ell(ctx, 0, -110, 90, 60, '#fff'); box(ctx, -80, -100, 160, 60, 10, '#fff'); }
  ctx.restore();
  if (o.prop) o.prop(ctx);
  ctx.restore();
}

function drawHair(ctx, o) {
  const col = o.hairColor || C.hairR;
  switch (o.hair) {
    case 'richard': // gepflegter Seitenscheitel
      ctx.beginPath(); ctx.moveTo(-110, 10); ctx.bezierCurveTo(-120, -90, -40, -118, 20, -112);
      ctx.bezierCurveTo(90, -108, 122, -60, 110, 8); ctx.bezierCurveTo(96, -30, 70, -50, 30, -56);
      ctx.bezierCurveTo(10, -40, -30, -30, -60, -44); ctx.bezierCurveTo(-80, -36, -96, -16, -110, 10); ctx.closePath(); fillStroke(ctx, col);
      ctx.beginPath(); ctx.moveTo(-20, -108); ctx.quadraticCurveTo(-30, -70, -60, -44); ctx.lineWidth = 5; ctx.strokeStyle = OL; ctx.stroke();
      break;
    case 'messy': // zerzaust (obdachlos)
      ctx.beginPath(); ctx.moveTo(-112, 14);
      const pts = [[-124, -40], [-100, -92], [-60, -100], [-40, -128], [0, -104], [36, -130], [60, -100], [104, -96], [120, -40], [112, 14]];
      for (const [px, py] of pts) ctx.lineTo(px, py);
      ctx.bezierCurveTo(90, -40, 40, -50, 0, -44); ctx.bezierCurveTo(-40, -50, -90, -40, -112, 14); ctx.closePath(); fillStroke(ctx, col);
      break;
    case 'dad': // kurz
      ctx.beginPath(); ctx.moveTo(-108, 0); ctx.bezierCurveTo(-110, -100, 110, -100, 108, 0); ctx.bezierCurveTo(90, -50, -90, -50, -108, 0); ctx.closePath(); fillStroke(ctx, col);
      break;
    case 'butler': // streng gegelt, Mittelscheitel
      ctx.beginPath(); ctx.moveTo(-108, -4); ctx.bezierCurveTo(-112, -104, 112, -104, 108, -4); ctx.bezierCurveTo(70, -60, 10, -60, 0, -70); ctx.bezierCurveTo(-10, -60, -70, -60, -108, -4); ctx.closePath(); fillStroke(ctx, col);
      break;
    case 'mom':
      ctx.beginPath(); ctx.moveTo(-116, 30); ctx.bezierCurveTo(-130, -110, 130, -110, 116, 30); ctx.bezierCurveTo(100, -40, 40, -60, 10, -40); ctx.bezierCurveTo(-30, -60, -100, -40, -116, 30); ctx.closePath(); fillStroke(ctx, col);
      break;
    case 'grandma':
      ctx.beginPath(); ctx.moveTo(-112, 10); ctx.bezierCurveTo(-120, -100, 120, -100, 112, 10); ctx.bezierCurveTo(90, -50, -90, -50, -112, 10); ctx.closePath(); fillStroke(ctx, '#e6e6ea');
      break;
    case 'bald': break;
    default:
      ctx.beginPath(); ctx.moveTo(-108, 0); ctx.bezierCurveTo(-110, -100, 110, -100, 108, 0); ctx.bezierCurveTo(90, -50, -90, -50, -108, 0); ctx.closePath(); fillStroke(ctx, col);
  }
}

// Richard-Presets
export const RICHARD = { hair: 'richard', shirt: '#ffffff', pants: '#3b3f58', tie: true, shoes: '#2b2b2b' };
export const RICHARD_HOMELESS = { hair: 'messy', coat: '#8a6a4a', shirtUnder: '#ffffff', pants: '#5b5f6e', tie: true, patch: '#c9a36a', stubble: true, shoes: '#6b5a4a', beanie: '#4a6a8a', beanie2: '#33506e' };
export const BUTLER = { hair: 'butler', hairColor: '#8a8a8a', shirt: '#222428', pants: '#222428', mustache: true, mustacheColor: '#8a8a8a', shoes: '#111', collar: true };

// ---------- UI ----------
export function clockBadge(ctx, time, t = 1, x = W / 2, y = 225) {
  const s = bounce(t, 0, 0.25);
  scaled(ctx, x, y, s, () => {
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowOffsetY = 6; ctx.shadowBlur = 10;
    box(ctx, x - 125, y - 44, 250, 88, 44, C.badge, 0); ctx.restore();
    const night = Number(time.slice(0, 2)) >= 20;
    if (night) { ctx.beginPath(); ctx.arc(x - 72, y, 16, 0.6, Math.PI * 1.75 + 0.3); ctx.fillStyle = '#f5d76e'; ctx.fill(); }
    else { circ(ctx, x - 72, y, 11, '#f5c84b', 0); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; line(ctx, x - 72 + Math.cos(a) * 17, y + Math.sin(a) * 17, x - 72 + Math.cos(a) * 23, y + Math.sin(a) * 23, '#f5c84b', 4); } }
    text(ctx, time, x + 22, y + 3, { size: 52, color: '#fff' });
  });
}

/** Sprechblase; tail: 'down'|'left'|'right' */
export function bubble(ctx, s, x, y, t, { size = 40, max = 520, tail = 'down', tx = 0, color = '#fff', textColor = OL, dur = 99 } = {}) {
  if (t > dur) return; const k = bounce(t, 0, 0.25) * (t > dur - 0.15 ? clamp((dur - t) / 0.15) : 1); if (k <= 0) return;
  ctx.font = `800 ${size}px ${FONT}`; ctx.letterSpacing = '0px';
  const lines = wrap(ctx, s, max); const lh = size * 1.2;
  const w = Math.max(...lines.map(l => ctx.measureText(l).width)) + size * 1.2, h = lines.length * lh + size * 0.8;
  scaled(ctx, x, y, k, () => {
    rr(ctx, x - w / 2, y - h, w, h, 22); fillStroke(ctx, color, 6);
    if (tail === 'down') { poly(ctx, [[x - 18 + tx, y - 3], [x + 18 + tx, y - 3], [x + tx + (tx >= 0 ? 6 : -6), y + 30]], color, 6); ctx.fillStyle = color; ctx.fillRect(x - 15 + tx, y - 10, 30, 9); }
    lines.forEach((l, i) => text(ctx, l, x, y - h + size * 0.4 + lh * (i + 0.5), { size, weight: 800, color: textColor }));
  });
}
export function wrap(ctx, s, max) {
  const words = s.split(' '); const out = []; let cur = '';
  for (const w of words) { const n = cur ? cur + ' ' + w : w; if (ctx.measureText(n).width > max && cur) { out.push(cur); cur = w; } else cur = n; }
  if (cur) out.push(cur); return out;
}

/** Runde Icon-Karte mit Label (für „Bedeutet:“-Block, Tafel, TV) */
export function iconCard(ctx, x, y, r, t, { icon, label, cross = false, bg = '#fff', labelBg = '#3aa58f', draw } = {}) {
  const k = bounce(t, 0, 0.28); if (k <= 0) return;
  scaled(ctx, x, y, k, () => {
    circ(ctx, x, y, r, bg, 7);
    if (draw) draw(ctx, x, y, r); else if (icon) emoji(ctx, icon, x, y, r * 1.05);
    if (cross) { ctx.save(); ctx.beginPath(); ctx.arc(x, y, r - 4, 0, Math.PI * 2); ctx.clip(); line(ctx, x - r * 0.75, y + r * 0.75, x + r * 0.75, y - r * 0.75, C.red, r * 0.16); ctx.restore(); circ(ctx, x, y, r, null, 7); ctx.beginPath(); ctx.arc(x, y, r - 10, 0, Math.PI * 2); ctx.strokeStyle = C.red; ctx.lineWidth = 12; ctx.stroke(); }
    if (label) { const ls = Math.max(30, r * 0.36); ctx.font = `900 ${ls}px ${FONT}`; const lw = ctx.measureText(label).width + 34; box(ctx, x - lw / 2, y + r + 10, lw, ls * 1.5, 14, labelBg, 0); text(ctx, label, x, y + r + 10 + ls * 0.78, { size: ls, color: '#fff' }); }
  });
}

/** schräger Stempel */
export function stamp(ctx, s, x, y, t, { color = C.red, size = 64, rot = -0.12, fill = '#fff' } = {}) {
  if (t < 0) return; const k = clamp(t / 0.18); const sc = lerp(2.2, 1, easeOut(k));
  alpha(ctx, k, () => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
    ctx.font = `900 ${size}px ${FONT}`; ctx.letterSpacing = '3px'; const w = ctx.measureText(s).width + size;
    box(ctx, -w / 2, -size * 0.75, w, size * 1.5, 14, fill, 0); rr(ctx, -w / 2 + 8, -size * 0.75 + 8, w - 16, size * 1.5 - 16, 10); ctx.strokeStyle = color; ctx.lineWidth = 7; ctx.stroke();
    text(ctx, s, 0, 4, { size, color, spacing: 3 }); ctx.restore();
  });
}

/** kleines Label-Pill (z. B. „Pfand 0,25 €“) */
export function pill(ctx, s, x, y, t, { bg = OL, color = '#fff', size = 36 } = {}) {
  const k = bounce(t, 0, 0.22); if (k <= 0) return;
  ctx.font = `900 ${size}px ${FONT}`; ctx.letterSpacing = '0px'; const w = ctx.measureText(s).width + size * 1.1;
  scaled(ctx, x, y, k, () => { box(ctx, x - w / 2, y - size * 0.8, w, size * 1.6, size * 0.5, bg, 5); text(ctx, s, x, y + 2, { size, color }); });
}

/** Weißes Fragekärtchen oben (Ende) */
export function questionCard(ctx, s, t, y = 330) {
  const k = bounce(t, 0, 0.3); if (k <= 0) return;
  ctx.font = `900 50px ${FONT}`; ctx.letterSpacing = '0px'; const lines = wrap(ctx, s, 760);
  const h = lines.length * 62 + 56, w = 880;
  scaled(ctx, W / 2, y, k, () => {
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowOffsetY = 8; ctx.shadowBlur = 16; box(ctx, W / 2 - w / 2, y - h / 2, w, h, 26, '#fff', 0); ctx.restore();
    lines.forEach((l, i) => text(ctx, l, W / 2, y - h / 2 + 28 + 62 * (i + 0.5), { size: 50, color: OL }));
  });
}
/** „Sag's mir unten“ Schild mit Pfeil */
export function commentSign(ctx, x, y, t) {
  const k = bounce(t, 0, 0.25); if (k <= 0) return;
  const bob = Math.sin(t * 7) * 8;
  scaled(ctx, x, y, k, () => {
    box(ctx, x - 130, y - 36, 260, 64, 10, '#fff', 5); text(ctx, "Sag's mir unten", x, y - 2, { size: 32, color: OL });
    poly(ctx, [[x + 100, y + 44 + bob], [x + 140, y + 44 + bob], [x + 140, y + 90 + bob], [x + 165, y + 90 + bob], [x + 120, y + 140 + bob], [x + 75, y + 90 + bob], [x + 100, y + 90 + bob]], C.red, 5);
  });
}

// ---------- Roulette / Hook ----------
export const ROLES = [
  { name: 'Psychopath', icon: '🔪', bg: ['#2a1630', '#5a2340'] },
  { name: 'Veganer', icon: '🥦', bg: ['#2f6b3a', '#7cc47f'] },
  { name: 'Influencer', icon: '🤳', bg: ['#b0408a', '#f08cc0'] },
  { name: 'obdachlos', icon: '🛏️', bg: ['#3a4a66', '#8aa0c2'] },
  { name: 'Mönch', icon: '🙏', bg: ['#b86a1e', '#f0b060'] },
  { name: 'Kommunist', icon: '☭', bg: ['#8a1c1c', '#d8504a'] },
  { name: 'Minimalist', icon: '⚪', bg: ['#6a7078', '#c8ccd2'] },
  { name: 'Gangster', icon: '🕶️', bg: ['#1e1e24', '#4a4a58'] },
  { name: 'Hausmeister', icon: '🧹', bg: ['#2f5a7a', '#6aa0c8'] },
  { name: 'Prepper', icon: '🥫', bg: ['#4a5a2a', '#9aae5a'] },
  { name: 'Astronaut', icon: '🚀', bg: ['#141a3a', '#3a4a9a'] },
  { name: 'Lehrer', icon: '📚', bg: ['#6a3a8a', '#b07ad0'] },
];

/**
 * Roulette-Leiste. pos = fortlaufende Position (Index, float). Zeichnet Icons, der aktuelle (gerundet) unter dem goldenen Ring.
 */
export function rouletteBar(ctx, pos, y = 470, { roles = ROLES, ring = true } = {}) {
  const sp = 128, n = roles.length;
  box(ctx, -20, y - 66, W + 40, 132, 0, '#1f1a2a', 0);
  ctx.save(); ctx.beginPath(); ctx.rect(0, y - 66, W, 132); ctx.clip();
  const first = Math.floor(pos) - 5;
  for (let i = first; i <= first + 11; i++) {
    const r = roles[((i % n) + n) % n]; const x = W / 2 + (i - pos) * sp;
    circ(ctx, x, y, 48, '#fff', 0); circ(ctx, x, y, 44, r.bg[1], 0);
    if (r.icon === '☭') text(ctx, '☭', x, y + 2, { size: 56, color: '#ffd84a' }); else emoji(ctx, r.icon, x, y, 52);
  }
  ctx.restore();
  if (ring) { ctx.beginPath(); ctx.arc(W / 2, y, 62, 0, Math.PI * 2); ctx.lineWidth = 9; ctx.strokeStyle = C.gold; ctx.stroke();
    poly(ctx, [[W / 2 - 14, y + 66], [W / 2 + 14, y + 66], [W / 2, y + 84]], C.gold, 0); }
}
/** Position der Roulette-Animation: dreht schnell, bremst bis tStop auf targetIndex ab */
export function roulettePos(t, targetIndex, { tStop = 1.6, spins = 14 } = {}) {
  const k = clamp(t / tStop); const e = 1 - Math.pow(1 - k, 3);
  return targetIndex - spins * (1 - e);
}

// ---------- Untertitel ----------
export function subtitle(ctx, s, t, y = 1250) {
  if (!s) return;
  ctx.font = `900 64px ${FONT}`; ctx.letterSpacing = '0px';
  const lines = wrap(ctx, s, 860); const k = clamp(t / 0.08);
  alpha(ctx, k, () => lines.forEach((l, i) => text(ctx, l, W / 2, y + i * 74 - (lines.length - 1) * 37, { size: 64, color: '#fff', stroke: 14, strokeColor: '#2a1d1d' })));
}
