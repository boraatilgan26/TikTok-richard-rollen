// Richard 2.0 – Figuren mit Gesicht, Frisuren, Gesten, Lippensync, Blinzeln und weichen Pose-Übergängen.
import { x, lerp, clamp, easeInOut, easeOut, easeBack, rng, mouthAt, GOLD, RED, WHITE, BLUE, TEAL, INK, FLOOR } from './core.js';

export const CAST = {
  richard: { hi: '#ffffff', lo: '#d2d4dc', rim: '#ffffff', hair: 'richard', tie: GOLD, lapels: true, cuffs: true },
  finanzamt: { hi: '#ff9a9a', lo: '#c63636', rim: RED, hair: 'flat', glasses: true, badge: '§', tie: '#7a1414', lapels: true },
  nurse: { hi: '#f0fffc', lo: '#a7dcd3', rim: TEAL, hair: 'bun', cap: true },
  son: { hi: '#ffffff', lo: '#d2d4dc', rim: '#ffffff', hair: 'young', hoodie: true },
  daughter: { hi: '#ffffff', lo: '#d2d4dc', rim: '#ffffff', hair: 'pony', hoodie: true },
  wife: { hi: '#ffffff', lo: '#d6d2dc', rim: '#ffffff', hair: 'long', necklace: true },
  banker: { hi: '#eaf3ff', lo: '#98b6da', rim: BLUE, hair: 'side', glasses: true, tie: BLUE, lapels: true },
  judge: { hi: '#ff8080', lo: '#a51f1f', rim: RED, hair: 'gray', robe: true, barett: true },
  normal: { hi: '#f2f2f4', lo: '#c4c5cc', rim: '#ffffff', hair: 'short' },
};

// Arm-Posen (rechte Seite aus Betrachtersicht; links wird gespiegelt): [Ellbogen, Hand, Handform]
const POSES = {
  idle: [[94, -195], [88, -118], 'fist'],
  point: [[160, -300], [242, -330], 'point'],
  pointUp: [[146, -350], [150, -468], 'up'],
  pointDown: [[150, -250], [215, -190], 'point'],
  up: [[122, -385], [110, -478], 'open'],
  hip: [[146, -218], [88, -162], 'fist'],
  hold: [[112, -205], [44, -214], 'fist'],
  shrug: [[146, -250], [178, -334], 'open'],
  chin: [[118, -235], [36, -350], 'fist'],
  wave: [[156, -330], [178, -446], 'open'],
  present: [[152, -250], [238, -262], 'open'],
  count: [[124, -290], [126, -380], 'up'],
  fist: [[132, -300], [114, -385], 'fist'],
  phone: [[120, -250], [62, -390], 'fist'],
  cross: [[70, -230], [-40, -235], 'fist'],
  give: [[150, -235], [230, -238], 'open'],
};
// Gesichtsausdrücke als Zahlen -> weich überblendbar
const EXPR = {
  neutral: { eye: 22, lid: 0.12, bl: [0, -46], br: [0, -46], smile: 0.15, asym: 0, white: 0, open: 0 },
  smug: { eye: 18, lid: 0.48, bl: [0.05, -42], br: [-0.32, -57], smile: 0.5, asym: 0.75, white: 0, open: 0 },
  happy: { eye: 22, lid: 0, bl: [-0.12, -50], br: [-0.12, -50], smile: 1, asym: 0, white: 0, open: 0 },
  laugh: { eye: 3, lid: 0, bl: [-0.15, -52], br: [-0.15, -52], smile: 1, asym: 0, white: 0, open: 0.55 },
  shock: { eye: 30, lid: 0, bl: [-0.25, -64], br: [-0.25, -64], smile: -0.15, asym: 0, white: 1, open: 0.75 },
  angry: { eye: 18, lid: 0.2, bl: [0.45, -36], br: [0.45, -36], smile: -0.65, asym: 0, white: 0, open: 0 },
  worried: { eye: 22, lid: 0, bl: [-0.4, -48], br: [-0.4, -48], smile: -0.45, asym: 0.25, white: 0, open: 0 },
  sad: { eye: 19, lid: 0.32, bl: [-0.35, -44], br: [-0.35, -44], smile: -0.7, asym: 0, white: 0, open: 0 },
  thinking: { eye: 20, lid: 0.25, bl: [-0.12, -52], br: [0.22, -40], smile: 0, asym: -0.45, white: 0, open: 0 },
  serious: { eye: 20, lid: 0.22, bl: [0.15, -42], br: [0.15, -42], smile: -0.1, asym: 0, white: 0, open: 0 },
  wink: { eye: 22, lid: 0, bl: [-0.1, -50], br: [0.2, -42], smile: 0.8, asym: 0.4, white: 0, open: 0, wink: 1 },
};

const lp2 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
function blendExpr(a, b, k) {
  const o = {};
  for (const key of Object.keys(EXPR.neutral)) o[key] = Array.isArray(a[key]) ? lp2(a[key], b[key], k) : lerp(a[key] ?? 0, b[key] ?? 0, k);
  o.wink = lerp(a.wink || 0, b.wink || 0, k);
  return o;
}

/**
 * Figur mit Keyframes.
 * keys: [[zeit, { armL, armR, expr, look, tilt, x }], ...]  (fehlende Felder werden übernommen)
 * opts: x, y (Fußlinie), s (Skalierung), talk (Lippensync), enter: {t, from:'left'|'right'|'pop'|'fade'}, exit: {t, to}
 */
export function actor(kind, opts = {}) {
  const cfg = CAST[kind];
  const base = { armL: 'idle', armR: 'idle', expr: 'neutral', look: 0, tilt: 0, x: opts.x ?? 960 };
  const keys = (opts.keys || []).slice().sort((a, b) => a[0] - b[0]);
  const states = []; let cur = { ...base };
  for (const [t, k] of keys) { cur = { ...cur, ...k }; states.push([t, cur]); }
  const blinkR = rng(opts.seed ?? (kind.length * 97 + Math.round((opts.x || 0))));
  const blinks = []; for (let tt = blinkR() * 2; tt < 4000; tt += 2.4 + blinkR() * 2.8) blinks.push(tt);
  const dur = opts.blend ?? 0.3;

  function stateAt(t) {
    let i = -1; for (let j = 0; j < states.length; j++) if (states[j][0] <= t) i = j;
    if (i < 0) { const f = states.length ? states[0][1] : base; return { st: f, prev: f, k: 1 }; }
    if (i === 0) return { st: states[0][1], prev: states[0][1], k: 1 };
    return { st: states[i][1], prev: states[i - 1][1], k: easeInOut((t - states[i][0]) / dur) };
  }
  function draw(t) {
    const { st, prev, k } = stateAt(t);
    let px = lerp(prev.x, st.x, k), sc = opts.s ?? 1, alpha = 1;
    const e = opts.enter, ex = opts.exit;
    if (e) {
      if (t < e.t) return;
      const p = clamp((t - e.t) / 0.5);
      if (e.from === 'left') px = lerp(-300, px, easeOut(p));
      else if (e.from === 'right') px = lerp(2220, px, easeOut(p));
      else if (e.from === 'pop') sc *= easeBack(p);
      else alpha = p;
    }
    if (ex && t > ex.t) {
      const p = clamp((t - ex.t) / 0.45);
      if (ex.to === 'left') px = lerp(px, -300, easeOut(p) * 1);
      else if (ex.to === 'right') px = lerp(px, 2220, easeOut(p));
      else alpha *= 1 - p;
      if (p >= 1) return;
    }
    const exA = EXPR[prev.expr] || EXPR.neutral, exB = EXPR[st.expr] || EXPR.neutral;
    const fx = blendExpr(exA, exB, clamp(k * 1.3));
    const talkAmp = opts.talk ? mouthAt(t) : 0;
    const bt = blinks.find(b => t >= b && t < b + 0.16); const blink = bt !== undefined ? Math.sin(((t - bt) / 0.16) * Math.PI) : 0;
    const arm = side => {
      const a = POSES[prev[side]] || POSES.idle, b = POSES[st[side]] || POSES.idle, sg = side === 'armL' ? -1 : 1;
      const el = lp2(a[0], b[0], k), ha = lp2(a[1], b[1], k);
      return { e: [el[0] * sg, el[1]], h: [ha[0] * sg, ha[1]], form: k < 0.5 ? a[2] : b[2], sg };
    };
    person(cfg, px, opts.y ?? FLOOR, sc, {
      armL: arm('armL'), armR: arm('armR'), fx, blink, talk: talkAmp, t, alpha,
      look: lerp(prev.look, st.look, k), tilt: lerp(prev.tilt, st.tilt, k), flip: opts.flip, prop: opts.prop,
    });
  }
  return { draw, kind };
}

function bodyGrad(cfg) { const g = x.createLinearGradient(-90, -330, 90, 0); g.addColorStop(0, cfg.hi); g.addColorStop(1, cfg.lo); return g; }

export function person(cfg, cx, fy, s, o) {
  const { fx, t } = o;
  x.save(); x.globalAlpha *= o.alpha ?? 1; x.translate(cx, fy); x.scale(s * (o.flip ? -1 : 1), s); x.rotate(o.tilt * 0.4);
  const breathe = 1 + Math.sin(t * 2.1 + cx) * 0.008;
  x.scale(1, breathe);
  // Haare hinten (lang)
  if (cfg.hair === 'long') { x.save(); x.translate(0, -420); x.fillStyle = '#e8b849'; x.shadowColor = GOLD; x.shadowBlur = 16; x.beginPath(); x.moveTo(-100, -40); x.bezierCurveTo(-130, 60, -120, 150, -95, 175); x.lineTo(95, 175); x.bezierCurveTo(120, 150, 130, 60, 100, -40); x.closePath(); x.fill(); x.restore(); }
  // Körper
  x.shadowColor = cfg.rim; x.shadowBlur = 40;
  x.fillStyle = bodyGrad(cfg);
  x.beginPath();
  if (cfg.robe) { x.moveTo(-105, 0); x.bezierCurveTo(-100, -120, -104, -220, -96, -262); x.quadraticCurveTo(-90, -314, -40, -320); x.lineTo(40, -320); x.quadraticCurveTo(90, -314, 96, -262); x.bezierCurveTo(104, -220, 100, -120, 105, 0); x.quadraticCurveTo(0, 16, -105, 0); }
  else { x.moveTo(-70, 0); x.bezierCurveTo(-78, -90, -98, -200, -92, -262); x.quadraticCurveTo(-88, -312, -40, -318); x.lineTo(40, -318); x.quadraticCurveTo(88, -312, 92, -262); x.bezierCurveTo(98, -200, 78, -90, 70, 0); x.quadraticCurveTo(0, 14, -70, 0); }
  x.fill(); x.shadowBlur = 0;
  // Beine / Details
  x.strokeStyle = 'rgba(0,0,0,0.16)'; x.lineWidth = 4; x.beginPath(); x.moveTo(0, -4); x.lineTo(0, cfg.robe ? -60 : -96); x.stroke();
  if (cfg.lapels) { x.strokeStyle = 'rgba(0,0,0,0.22)'; x.lineWidth = 5; x.beginPath(); x.moveTo(-48, -318); x.lineTo(-14, -250); x.lineTo(-40, -170); x.moveTo(48, -318); x.lineTo(14, -250); x.lineTo(40, -170); x.stroke(); x.fillStyle = 'rgba(0,0,0,0.18)'; for (const yy of [-150, -110]) { x.beginPath(); x.arc(0, yy, 5, 0, Math.PI * 2); x.fill(); } }
  if (cfg.tie) { x.fillStyle = cfg.tie; x.shadowColor = cfg.tie; x.shadowBlur = 16; x.beginPath(); x.moveTo(-11, -300); x.lineTo(11, -300); x.lineTo(17, -205); x.lineTo(0, -180); x.lineTo(-17, -205); x.closePath(); x.fill(); x.beginPath(); x.moveTo(-14, -316); x.lineTo(14, -316); x.lineTo(9, -298); x.lineTo(-9, -298); x.closePath(); x.fill(); x.shadowBlur = 0; }
  if (cfg.badge) { x.fillStyle = 'rgba(90,10,10,0.85)'; x.beginPath(); x.roundRect(36, -275, 40, 30, 6); x.fill(); x.fillStyle = '#ffd6d6'; x.font = '900 22px Inter'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('§', 56, -259); }
  if (cfg.hoodie) { x.strokeStyle = 'rgba(0,0,0,0.2)'; x.lineWidth = 5; x.beginPath(); x.moveTo(-60, -318); x.quadraticCurveTo(0, -270, 60, -318); x.stroke(); x.beginPath(); x.moveTo(-18, -292); x.lineTo(-20, -240); x.moveTo(18, -292); x.lineTo(20, -240); x.stroke(); x.beginPath(); x.roundRect(-46, -150, 92, 50, 12); x.stroke(); }
  if (cfg.necklace) { x.strokeStyle = GOLD; x.lineWidth = 4; x.shadowColor = GOLD; x.shadowBlur = 12; x.beginPath(); x.moveTo(-40, -316); x.quadraticCurveTo(0, -268, 40, -316); x.stroke(); x.fillStyle = GOLD; x.beginPath(); x.arc(0, -282, 8, 0, Math.PI * 2); x.fill(); x.shadowBlur = 0; }
  if (cfg.robe) { x.fillStyle = '#ffffff'; x.beginPath(); x.moveTo(-34, -318); x.lineTo(34, -318); x.lineTo(18, -250); x.lineTo(0, -262); x.lineTo(-18, -250); x.closePath(); x.fill(); }
  if (cfg.cap) { /* Schwesternkreuz auf der Brust */ x.fillStyle = '#e04848'; x.fillRect(38, -268, 30, 9); x.fillRect(48.5, -278.5, 9, 30); }
  // Arme
  for (const a of [o.armL, o.armR]) drawArm(cfg, a, o);
  // Kopf
  const bob = -o.talk * 5;
  x.save(); x.translate(0, -420 + bob); x.rotate(o.tilt * 0.6 + o.look * 0.04);
  drawHead(cfg, o);
  x.restore();
  x.restore();
}

function drawArm(cfg, a, o) {
  const sh = [a.sg * 76, -284];
  x.strokeStyle = bodyGrad(cfg); x.lineCap = 'round'; x.lineJoin = 'round'; x.lineWidth = cfg.robe ? 48 : 40;
  x.shadowColor = cfg.rim; x.shadowBlur = 24;
  x.beginPath(); x.moveTo(sh[0], sh[1]); x.quadraticCurveTo(a.e[0], a.e[1], a.h[0], a.h[1]); x.stroke();
  if (o.prop && o.prop.side === (a.sg < 0 ? 'L' : 'R')) { x.save(); x.shadowBlur = 0; x.translate(a.h[0], a.h[1]); o.prop.draw(a.sg); x.restore(); }
  x.fillStyle = cfg.hi; x.beginPath(); x.arc(a.h[0], a.h[1], 24, 0, Math.PI * 2); x.fill();
  x.strokeStyle = cfg.hi; x.lineWidth = 13;
  if (a.form === 'point') { const ang = Math.atan2(a.h[1] - a.e[1], a.h[0] - a.e[0]); x.beginPath(); x.moveTo(a.h[0], a.h[1]); x.lineTo(a.h[0] + Math.cos(ang) * 34, a.h[1] + Math.sin(ang) * 34); x.stroke(); }
  if (a.form === 'up') { x.beginPath(); x.moveTo(a.h[0], a.h[1]); x.lineTo(a.h[0] + a.sg * 2, a.h[1] - 36); x.stroke(); }
  if (a.form === 'open') { x.lineWidth = 10; for (const d of [-0.5, -0.1, 0.3]) { x.beginPath(); x.moveTo(a.h[0], a.h[1]); x.lineTo(a.h[0] + Math.sin(d) * 30 * a.sg, a.h[1] - Math.cos(d) * 30); x.stroke(); } }
  if (cfg.cuffs) { const ang = Math.atan2(a.h[1] - a.e[1], a.h[0] - a.e[0]); x.fillStyle = GOLD; x.shadowColor = GOLD; x.shadowBlur = 10; x.beginPath(); x.arc(a.h[0] - Math.cos(ang) * 26, a.h[1] - Math.sin(ang) * 26, 5, 0, Math.PI * 2); x.fill(); }
  x.shadowBlur = 0;
}

function drawHead(cfg, o) {
  const { fx } = o;
  x.shadowColor = cfg.rim; x.shadowBlur = 44;
  const hg = x.createRadialGradient(-30, -40, 20, 0, 0, 130); hg.addColorStop(0, cfg.hi); hg.addColorStop(1, cfg.lo);
  x.fillStyle = hg; x.beginPath(); x.ellipse(0, 0, 96, 104, 0, 0, Math.PI * 2); x.fill(); x.shadowBlur = 0;
  x.fillStyle = cfg.lo; for (const sx of [-1, 1]) { x.beginPath(); x.ellipse(sx * 94, 10, 14, 24, 0, 0, Math.PI * 2); x.fill(); }
  drawHair(cfg);
  drawFace(cfg, o);
  if (cfg.glasses) { const lx = o.look * 14; x.strokeStyle = cfg.hair === 'flat' ? '#3a0606' : '#1d2a3a'; x.lineWidth = 6; for (const sx of [-1, 1]) { x.beginPath(); x.roundRect(sx * 36 + lx - 27, -22, 54, 42, 12); x.stroke(); } x.beginPath(); x.moveTo(lx - 9, -4); x.lineTo(lx + 9, -4); x.stroke(); }
  if (cfg.barett) { x.fillStyle = '#b01818'; x.shadowColor = RED; x.shadowBlur = 18; x.beginPath(); x.ellipse(0, -92, 92, 34, 0, Math.PI, 0); x.lineTo(84, -78); x.quadraticCurveTo(0, -60, -84, -78); x.closePath(); x.fill(); x.shadowBlur = 0; }
  if (cfg.cap) { x.fillStyle = '#ffffff'; x.shadowColor = TEAL; x.shadowBlur = 14; x.beginPath(); x.moveTo(-62, -82); x.lineTo(62, -82); x.lineTo(50, -128); x.lineTo(-50, -128); x.closePath(); x.fill(); x.shadowBlur = 0; x.fillStyle = '#e04848'; x.fillRect(-13, -112, 26, 8); x.fillRect(-4, -121, 8, 26); }
}

function drawHair(cfg) {
  const h = cfg.hair;
  if (h === 'richard') {
    // zurückgegelte Tolle, blond-gold mit Glanz und Seitenscheitel
    const g = x.createLinearGradient(-90, -140, 90, -20); g.addColorStop(0, '#ffe7a0'); g.addColorStop(0.55, '#e9b84e'); g.addColorStop(1, '#b8862a');
    x.fillStyle = g; x.shadowColor = GOLD; x.shadowBlur = 18;
    x.beginPath(); x.moveTo(-97, -6);
    x.bezierCurveTo(-104, -70, -70, -118, -24, -128);
    x.bezierCurveTo(10, -146, 70, -140, 92, -104);
    x.bezierCurveTo(104, -82, 102, -40, 97, -8);
    x.bezierCurveTo(90, -40, 80, -58, 62, -66);
    x.bezierCurveTo(30, -60, 0, -72, -28, -66);
    x.bezierCurveTo(-60, -60, -84, -48, -97, -6);
    x.closePath(); x.fill(); x.shadowBlur = 0;
    x.strokeStyle = 'rgba(255,248,220,0.85)'; x.lineWidth = 5; x.lineCap = 'round';
    x.beginPath(); x.moveTo(-50, -100); x.quadraticCurveTo(0, -128, 58, -110); x.stroke();
    x.beginPath(); x.moveTo(-30, -84); x.quadraticCurveTo(15, -100, 66, -88); x.stroke();
    x.strokeStyle = 'rgba(120,80,20,0.6)'; x.lineWidth = 4; x.beginPath(); x.moveTo(-44, -66); x.quadraticCurveTo(-52, -100, -36, -124); x.stroke();
  } else if (h === 'flat') {
    x.fillStyle = '#5c0f0f'; x.beginPath(); x.moveTo(-97, -10); x.bezierCurveTo(-100, -80, -50, -112, 0, -110); x.bezierCurveTo(60, -112, 100, -80, 97, -10); x.bezierCurveTo(85, -55, 60, -70, 20, -72); x.lineTo(-30, -60); x.bezierCurveTo(-70, -60, -88, -40, -97, -10); x.fill();
    x.strokeStyle = '#2a0404'; x.lineWidth = 4; x.beginPath(); x.moveTo(-30, -62); x.lineTo(-38, -108); x.stroke();
  } else if (h === 'bun') {
    x.fillStyle = '#6a4a2a'; x.beginPath(); x.arc(0, -112, 34, 0, Math.PI * 2); x.fill();
    x.beginPath(); x.moveTo(-97, -6); x.bezierCurveTo(-100, -80, -50, -108, 0, -106); x.bezierCurveTo(50, -108, 100, -80, 97, -6); x.bezierCurveTo(80, -60, 40, -70, 0, -68); x.bezierCurveTo(-40, -70, -80, -60, -97, -6); x.fill();
  } else if (h === 'young' || h === 'pony') {
    const g = x.createLinearGradient(-90, -140, 90, -20); g.addColorStop(0, '#fff0b8'); g.addColorStop(1, '#d9a843'); x.fillStyle = g;
    x.beginPath(); x.moveTo(-97, -6); x.lineTo(-92, -70); x.lineTo(-70, -108); x.lineTo(-40, -118); x.lineTo(-30, -136); x.lineTo(0, -120); x.lineTo(24, -140); x.lineTo(40, -118); x.lineTo(80, -110); x.lineTo(96, -60); x.lineTo(97, -6); x.bezierCurveTo(80, -50, 50, -70, 10, -62); x.bezierCurveTo(-40, -72, -80, -50, -97, -6); x.fill();
    if (h === 'pony') { x.beginPath(); x.moveTo(80, -80); x.quadraticCurveTo(150, -40, 120, 60); x.quadraticCurveTo(110, -10, 70, -50); x.fill(); }
  } else if (h === 'long') {
    x.fillStyle = '#f0c45a'; x.beginPath(); x.moveTo(-98, 0); x.bezierCurveTo(-104, -90, -40, -118, 10, -112); x.bezierCurveTo(70, -110, 104, -70, 98, 0); x.bezierCurveTo(80, -60, 30, -70, -10, -66); x.bezierCurveTo(-50, -60, -84, -40, -98, 0); x.fill();
  } else if (h === 'side') {
    x.fillStyle = '#2c3a4e'; x.beginPath(); x.moveTo(-97, -8); x.bezierCurveTo(-100, -84, -40, -112, 10, -108); x.bezierCurveTo(70, -108, 100, -76, 97, -8); x.bezierCurveTo(88, -50, 70, -66, 34, -70); x.lineTo(-20, -62); x.bezierCurveTo(-60, -58, -86, -40, -97, -8); x.fill();
  } else if (h === 'gray') {
    x.fillStyle = '#c9c9cf'; x.beginPath(); x.moveTo(-97, 0); x.bezierCurveTo(-102, -50, -90, -78, -60, -82); x.lineTo(60, -82); x.bezierCurveTo(90, -78, 102, -50, 97, 0); x.bezierCurveTo(88, -40, 70, -60, 50, -64); x.lineTo(-50, -64); x.bezierCurveTo(-70, -60, -88, -40, -97, 0); x.fill();
  } else if (h === 'short') {
    x.fillStyle = '#5a4630'; x.beginPath(); x.moveTo(-96, -10); x.bezierCurveTo(-98, -84, -40, -110, 0, -108); x.bezierCurveTo(40, -110, 98, -84, 96, -10); x.bezierCurveTo(84, -56, 40, -70, 0, -70); x.bezierCurveTo(-40, -70, -84, -56, -96, -10); x.fill();
  }
}

function drawFace(cfg, o) {
  const fx = o.fx, lx = o.look * 14;
  const lidCol = x.createRadialGradient(-30, -40, 20, 0, 0, 130); lidCol.addColorStop(0, cfg.hi); lidCol.addColorStop(1, cfg.lo);
  x.fillStyle = INK; x.strokeStyle = INK; x.lineCap = 'round'; x.lineJoin = 'round';
  const eyeH = fx.eye * (1 - o.blink);
  for (const s of [-1, 1]) {
    const wink = s === 1 ? fx.wink : 0;
    const eh = eyeH * (1 - wink);
    x.save(); x.translate(s * 36 + lx, -2);
    if (fx.eye < 6 || eh < 4) { // geschlossene, lachende Augen / Blinzeln
      x.lineWidth = 6; x.beginPath();
      if (fx.eye < 6 || wink > 0.5) { x.moveTo(-14, 4); x.quadraticCurveTo(0, -12, 14, 4); } else { x.moveTo(-13, 0); x.lineTo(13, 0); }
      x.stroke();
    } else if (fx.white > 0.5) {
      x.fillStyle = '#fff'; x.beginPath(); x.ellipse(0, 0, 20, eh, 0, 0, Math.PI * 2); x.fill(); x.strokeStyle = 'rgba(0,0,0,0.25)'; x.lineWidth = 2; x.stroke();
      x.fillStyle = INK; x.beginPath(); x.arc(lx * 0.2, 2, 8, 0, Math.PI * 2); x.fill();
    } else {
      x.beginPath(); x.ellipse(0, 0, 11, eh / 1.4, 0, 0, Math.PI * 2); x.fill();
      x.fillStyle = '#fff'; x.beginPath(); x.arc(4, -4, 3.5, 0, Math.PI * 2); x.fill(); x.fillStyle = INK;
      if (fx.lid > 0.05) { const lh = eh / 1.4; x.save(); x.translate(-(s * 36 + lx), 2); x.fillStyle = lidCol; x.fillRect(s * 36 + lx - 16, -2 - lh - 2, 32, lh * 2 * fx.lid + 2); x.restore(); x.fillStyle = INK; x.lineWidth = 5; x.beginPath(); x.moveTo(-15, -lh + lh * 2 * fx.lid); x.lineTo(15, -lh + lh * 2 * fx.lid); x.stroke(); }
    }
    x.restore();
    const [a, dy] = s < 0 ? fx.bl : fx.br;
    x.save(); x.translate(s * 36 + lx * 0.6, dy - o.talk * 3); x.rotate(s < 0 ? a : -a); x.lineWidth = 11; x.beginPath(); x.moveTo(-20, 0); x.lineTo(20, 0); x.stroke(); x.restore();
  }
  // Mund (parametrisch): Lächeln, Asymmetrie, Öffnung
  const open = clamp(Math.max(fx.open, o.talk * 0.95));
  const mx = lx * 0.7, my = 50, w = 32 * (1 + fx.smile * 0.15) * (1 - open * 0.2);
  const yl = my - fx.smile * 12 + fx.asym * 6, yr = my - fx.smile * 12 - fx.asym * 12;
  const cU = my + fx.smile * 9 - open * 4, cL = my + fx.smile * 16 + open * 30;
  if (open < 0.08) {
    x.lineWidth = 8; x.beginPath(); x.moveTo(mx - w, yl); x.quadraticCurveTo(mx + fx.asym * 6, my + fx.smile * 16, mx + w, yr); x.stroke();
  } else {
    x.beginPath(); x.moveTo(mx - w, yl); x.quadraticCurveTo(mx, cU, mx + w, yr); x.quadraticCurveTo(mx, cL, mx - w, yl); x.closePath();
    x.fillStyle = INK; x.fill(); x.lineWidth = 5; x.stroke();
    x.save(); x.clip();
    if (fx.smile > 0.2 || open > 0.4) { x.fillStyle = '#fff'; x.fillRect(mx - w, Math.min(yl, yr) - 20, w * 2, (cU - Math.min(yl, yr)) * 0.5 + 26); }
    if (open > 0.35) { x.fillStyle = '#c4505a'; x.beginPath(); x.ellipse(mx, cL - 4, w * 0.55, 10, 0, 0, Math.PI * 2); x.fill(); }
    x.restore();
  }
}
