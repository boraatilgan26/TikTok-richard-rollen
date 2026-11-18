// Folge 1 – „Heute ist Richard obdachlos.“
import { W, H, OL, C, clamp, lerp, easeOut, easeInOut, bounce, box, circ, line, text, emoji, alpha, scaled,
  person, RICHARD, RICHARD_HOMELESS, BUTLER, clockBadge, bubble, iconCard, stamp, pill, questionCard, commentSign,
  ROLES, rouletteBar, roulettePos } from '../../engine/chibi.js';
import * as B from '../../engine/bg.js';
import { setup, run } from '../../engine/timeline.js';

const F = B.FLOOR;
const { w, chunks, duration } = await setup('videos/r01', {
  tail: 1.4,
  capMap: {
    'Sieben Uhr.': '7 Uhr.', 'Zehn Uhr.': '10 Uhr.', 'Zwölf Uhr.': '12 Uhr.', 'Sechzehn Uhr.': '16 Uhr.', 'Einundzwanzig Uhr.': '21 Uhr.',
    'Fünfundzwanzig Cent': '25 Cent', 'eine Million braucht': '1 Million braucht', 'vier Millionen': '4 Millionen', 'zweitausendvierundzwanzig': '2024',
    'zweitausendacht': '2008', 'siebzig Prozent': '70 %', 'drei Euro fünfzig': '3,50 €', 'eine Million Euro': '1 Million Euro',
  },
});
const sfx = [];
const S = (t, type) => sfx.push({ t, type });

const iHomeless = ROLES.findIndex(r => r.name === 'obdachlos');
const iPsycho = ROLES.findIndex(r => r.name === 'Psychopath');
const ROLE_LOOK = {
  Psychopath: { shirt: '#2a2a32', badge: '🔪' }, Veganer: { shirt: '#5fb06a', badge: '🥦' }, Influencer: { shirt: '#f08cc0', badge: '🤳' },
  Mönch: { shirt: '#e88a2a', badge: '🙏', hair: 'bald' }, Kommunist: { shirt: '#c83a34', badge: '⭐' }, Minimalist: { shirt: '#f2f2f2', badge: '⚪' },
  Gangster: { shirt: '#22222a', badge: '🕶️' }, Hausmeister: { shirt: '#3a7ab0', badge: '🧹' }, Prepper: { shirt: '#7a8a4a', badge: '🥫' },
  Astronaut: { shirt: '#e8e8f0', badge: '🚀' }, Lehrer: { shirt: '#8a5ab0', badge: '📚' },
};
const lookFor = name => name === 'obdachlos' ? RICHARD_HOMELESS : { ...RICHARD, ...ROLE_LOOK[name], tie: true };

// Roulette-Ticks als SFX
function tickSfx(t0, target, tStop, spins) {
  let last = Math.round(roulettePos(0, target, { tStop, spins }));
  for (let t = 0; t < tStop; t += 1 / 120) { const p = Math.round(roulettePos(t, target, { tStop, spins })); if (p !== last) { S(t0 + t, 'pop'); last = p; } }
}

/** Hook-/Ende-Kopfzeile: kleiner Satz + großer Rollenname */
function header(ctx, small, big, y = 150) {
  text(ctx, small, W / 2, y, { size: 50, color: '#fff', shadow: true });
  text(ctx, big, W / 2, y + 120, { size: 128, color: '#fff', shadow: true });
}

const scenes = [];

// ---------- 0: HOOK ----------
const HOOK_STOP = w(3) + 0.05, HOOK_SPINS = 15;
tickSfx(0, iHomeless, HOOK_STOP, HOOK_SPINS);
S(HOOK_STOP, 'ding'); S(w(3) + 0.55, 'hit');
scenes.push({ start: 0, draw(ctx, lt) {
  const pos = roulettePos(lt, iHomeless, { tStop: HOOK_STOP, spins: HOOK_SPINS });
  const role = ROLES[((Math.round(pos) % ROLES.length) + ROLES.length) % ROLES.length];
  B.villa(ctx, role.bg[0], role.bg[1]);
  header(ctx, 'Heute ist Richard', role.name + '.');
  rouletteBar(ctx, pos, 470);
  // Vermögen (Brücke zum Haupt-Account)
  const crash = w(3) + 0.55;
  const k = bounce(lt, 0.15, 0.3);
  scaled(ctx, W / 2, 650, k, () => {
    box(ctx, W / 2 - 290, 590, 580, 124, 62, 'rgba(30,20,40,0.85)', 0);
    text(ctx, 'VERMÖGEN', W / 2, 622, { size: 30, color: '#ffffffaa', spacing: 5 });
    if (lt < crash) text(ctx, '47.683.594 €', W / 2, 672, { size: 62, color: C.gold });
    else text(ctx, '0 €', W / 2, 672, { size: 68, color: '#ff6a6a' });
  });
  const look = lookFor(role.name);
  const sq = lt > HOOK_STOP ? 1 + Math.sin(clamp((lt - HOOK_STOP) / 0.25) * Math.PI) * 0.06 : 1;
  scaled(ctx, W / 2, 1640, sq, () => person(ctx, W / 2, 1640, { ...look, s: 1.25, t: lt, expr: lt > crash ? 'shock' : 'happy' }));
} });

// ---------- 1: BEDEUTET ----------
const t1 = w(4);
[w(5), w(7), w(9)].forEach(t => S(t, 'pop'));
scenes.push({ start: t1, subY: 1290, draw(ctx, lt, t) {
  B.sunset(ctx);
  person(ctx, W / 2, 1230, { ...RICHARD_HOMELESS, s: 1.2, t, expr: t > w(9) ? 'sad' : 'neutral' });
  iconCard(ctx, 200, 330, 120, t - w(5), { icon: '🏰', label: 'keine Villa', cross: true });
  iconCard(ctx, 540, 330, 120, t - w(7), { icon: '💳', label: 'keine Karte', cross: true });
  iconCard(ctx, 880, 330, 120, t - w(9), { icon: '🤵', label: 'kein Butler', cross: true });
} });

// ---------- 2: 07:00 PARKBANK ----------
const t2 = w(11);
S(w(19), 'pop'); S(w(23), 'pop'); S(w(25) + 0.3, 'knock');
const coffeeTray = ctx => { box(ctx, 50, -150, 110, 16, 6, '#c0c0c8', 5); box(ctx, 82, -205, 46, 56, 10, '#fff', 5); ctx.beginPath(); ctx.arc(132, -178, 14, -1.4, 1.4); ctx.lineWidth = 6; ctx.strokeStyle = OL; ctx.stroke();
  for (let i = 0; i < 2; i++) { ctx.beginPath(); ctx.moveTo(96 + i * 18, -215); ctx.quadraticCurveTo(86 + i * 18, -240, 100 + i * 18, -262); ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 6; ctx.stroke(); } };
scenes.push({ start: t2, draw(ctx, lt, t) {
  B.park(ctx); B.lamp(ctx, 700);
  B.bench(ctx, 330, F + 10, 1.05);
  clockBadge(ctx, '07:00', lt);
  const awake = t > w(15);
  person(ctx, 300, F + 20, { ...RICHARD_HOMELESS, s: 1.12, t, expr: awake ? (t > w(23) ? 'neutral' : 'shock') : 'sleep', talk: t > w(23) && t < w(25) + 0.6, tilt: awake ? 0 : 0.18 });
  if (!awake) { text(ctx, 'z', 420, 760 - (lt * 40) % 60, { size: 60, color: '#fff', stroke: 8 }); text(ctx, 'Z', 470, 700 - (lt * 40) % 60, { size: 76, color: '#fff', stroke: 8 }); }
  const bx = lerp(1300, 780, easeOut((t - w(15)) / 1.0));
  person(ctx, bx, F + 20, { ...BUTLER, s: 1.12, t, flip: true, hop: t < w(15) + 1.0 && t > w(15), expr: t > w(25) ? 'sad' : 'smile', talk: t > w(19) && t < w(21) + 0.5, prop: coffeeTray });
  bubble(ctx, 'Ihr Kaffee, Sir. ☕', 780, 640, t - w(19), { size: 46, dur: w(23) - w(19) });
  bubble(ctx, 'Heute nicht, Johann.', 330, 580, t - w(23), { size: 48, color: '#fff7d6' });
} });

// ---------- 3: 10:00 BAHNHOF / PFAND ----------
const t3 = w(26);
S(w(30) + 0.3, 'pop'); S(w(33), 'coins'); S(w(37), 'pop'); S(w(44), 'ding');
const holdBottle = ctx => B.bottle(ctx, 92, -110, 0.9);
scenes.push({ start: t3, draw(ctx, lt, t) {
  B.station(ctx); B.pfandAutomat(ctx, 880, F + 10);
  clockBadge(ctx, '10:00', lt);
  // Flaschensammlung wächst
  const n = Math.floor(clamp((t - w(31)) / 0.5, 0, 6));
  for (let i = 0; i < n; i++) B.bottle(ctx, 560 + (i % 3) * 52, F + 30 - Math.floor(i / 3) * 0, 0.9, ['#5fa86a', '#8a5a2a', '#6ab0d8'][i % 3]);
  person(ctx, 360, F + 20, { ...RICHARD_HOMELESS, s: 1.12, t, expr: t > w(44) ? 'shock' : 'smile', prop: t > w(30) ? holdBottle : null, look: t > w(37) && t < w(44) ? -0.6 : 0 });
  pill(ctx, '0,25 € / Flasche', 860, 960, t - w(33), { bg: '#2f8a5a', size: 42 });
  // Rechnung
  if (t > w(37)) {
    const k = bounce(t - w(37), 0, 0.3);
    scaled(ctx, W / 2, 640, k, () => {
      box(ctx, 90, 490, 900, 300, 26, '#fff');
      text(ctx, '1.000.000 € ÷ 0,25 €', W / 2, 570, { size: 62, color: OL });
      if (t > w(44)) { text(ctx, '= 4.000.000', W / 2, 675, { size: 90, color: C.red }); text(ctx, 'Flaschen', W / 2, 750, { size: 42, color: OL }); }
      else text(ctx, '= ?', W / 2, 685, { size: 90, color: '#aaa' });
    });
  }
  pill(ctx, `Flasche ${n} / 4.000.000`, W / 2, 1480, t - w(44) - 0.4, { bg: OL, size: 36 });
} });

// ---------- 4: 12:00 SUPPENKÜCHE ----------
const t4 = w(47);
S(w(53), 'pop'); S(w(59), 'hit');
scenes.push({ start: t4, draw(ctx, lt, t) {
  B.soupKitchen(ctx);
  clockBadge(ctx, '12:00', lt);
  person(ctx, 840, F - 80, { hair: 'dad', hairColor: '#3a2a20', hat: 'chef', shirt: '#ffffff', pants: '#555', t, expr: t > w(59) ? 'neutral' : 'smile', talk: t > w(59) && t < w(59) + 0.5, flip: true, s: 0.95 });
  B.counter(ctx, F);
  person(ctx, 270, F + 20, { ...RICHARD_HOMELESS, s: 1.12, t, talk: t > w(53) && t < w(56) + 0.6, expr: t > w(59) ? 'sad' : 'smile' });
  bubble(ctx, 'Haben Sie eine Weinkarte? 🍷', 300, 600, t - w(53), { size: 48, max: 480, color: '#fff7d6' });
  bubble(ctx, 'Nein.', 840, 560, t - w(59), { size: 66 });
} });

// ---------- 5: 16:00 OMA-VIDEOCALL = FAKT ----------
const t5 = w(60);
S(w(62), 'ding'); S(w(67), 'whoosh'); S(w(68), 'pop'); S(w(71), 'pop'); S(w(75), 'pop'); S(w(79), 'magic'); S(w(81), 'rise'); S(w(87), 'ding'); S(w(89), 'pop');
scenes.push({ start: t5, draw(ctx, lt, t) {
  B.streetDay(ctx);
  clockBadge(ctx, '16:00', lt);
  const k = bounce(t - w(62), 0, 0.35);
  scaled(ctx, W / 2, 590, k, () => B.screen(ctx, W / 2, 590, 920, 560, () => {
    const cx = W / 2, cy = 590;
    if (t < w(67)) { // Oma live
      ctx.fillStyle = '#f6e6d6'; ctx.fillRect(cx - 450, cy - 300, 900, 600);
      box(ctx, cx - 434, cy - 284, 868, 60, 0, '#ffffff', 0); text(ctx, 'Oma · Videoanruf', cx - 220, cy - 254, { size: 32, color: OL });
      box(ctx, cx + 300, cy - 274, 100, 40, 10, C.red, 0); text(ctx, 'LIVE', cx + 350, cy - 253, { size: 28, color: '#fff' });
      person(ctx, cx, cy + 420, { hair: 'grandma', glasses: true, shirt: '#b07ad0', t, s: 1.05, talk: t > w(65), wave: t < w(65) });
    } else if (t < w(69)) { // Finnland 2008
      B.finlandFlag(ctx, cx - 210, cy - 20, 300); text(ctx, 'Finnland', cx - 210, cy + 150, { size: 40, color: '#fff' });
      scaled(ctx, cx + 200, cy, bounce(t - w(68), 0, 0.3), () => text(ctx, '2008', cx + 200, cy, { size: 150, color: C.gold }));
    } else if (t < w(79)) { // Wohnung zuerst, ohne Bedingungen
      iconCard(ctx, cx - 200, cy - 40, 120, t - w(71), { icon: '🏠', label: 'Wohnung zuerst', labelBg: '#3aa58f' });
      iconCard(ctx, cx + 200, cy - 40, 120, t - w(75), { icon: '📋', label: 'keine Bedingungen', cross: true, labelBg: '#3aa58f' });
    } else if (t < w(81)) {
      scaled(ctx, cx, cy, bounce(t - w(79), 0, 0.3), () => { text(ctx, 'HOUSING', cx, cy - 70, { size: 120, color: C.gold }); text(ctx, 'FIRST', cx, cy + 70, { size: 120, color: C.gold }); });
    } else { // Balken 2008 vs 2024
      text(ctx, 'LANGZEIT-OBDACHLOSE', cx, cy - 215, { size: 34, color: '#ffffffcc', spacing: 3 });
      const g = easeOut((t - w(82)) / 0.6), g2 = easeOut((t - w(86)) / 0.8);
      const base = cy + 170;
      box(ctx, cx - 250, base - 340 * g, 170, Math.max(1, 340 * g), 10, '#e8706a', 6); text(ctx, '2008', cx - 165, base + 40, { size: 40, color: '#fff' });
      box(ctx, cx + 80, base - lerp(340, 102, g2) * g, 170, Math.max(1, lerp(340, 102, g2) * g), 10, '#5fc47a', 6); text(ctx, '2024', cx + 165, base + 40, { size: 40, color: '#fff' });
      if (t > w(87)) stamp(ctx, '−70 %', cx + 165, cy - 130, t - w(87), { color: '#2f9a4a', size: 66 });
    }
  }));
  person(ctx, 190, F + 30, { ...RICHARD_HOMELESS, s: 1.12, t, look: 0.6, expr: t > w(89) ? 'wow' : 'smile' });
  if (t > w(89)) for (let i = 0; i < 3; i++) emoji(ctx, '✨', 120 + i * 110, 820 - Math.sin(t * 6 + i) * 14, 56);
} });

// ---------- 6+7+8: 21:00 NACHT, FRAGE, NÄCHSTE ROLLE ----------
const t6 = w(91);
S(w(98), 'coins'); S(w(103), 'pop'); S(w(105) + 0.2, 'whoosh'); S(w(112), 'pop'); S(w(120), 'pop'); S(w(122), 'ding'); S(w(133), 'pop');
const END = w(138), END_STOP = w(143) + 0.1 - END, END_SPINS = 13;
tickSfx(END, iPsycho, END_STOP, END_SPINS); S(END + END_STOP, 'bass');
const holdBlanket = ctx => B.blanket(ctx, 90, -160, 150, 110);
function nightScene(ctx, lt, t, clock = true) {
  B.night(ctx); B.lamp(ctx, 330, F, true); B.bench(ctx, 200, F + 10, 0.9, '#6a4a3a');
  if (clock) clockBadge(ctx, '21:00', lt);
  // Mann neben Richard
  const gotBread = t > w(105) + 0.6;
  person(ctx, 170, F + 20, { hair: 'messy', hairColor: '#8a8a8a', coat: '#5a6a4a', shirtUnder: '#c8c0a8', pants: '#4a4a5a', beanie: '#8a3a3a', beanie2: '#6a2a2a', stubble: true, mustache: true, mustacheColor: '#8a8a8a', shoes: '#4a3a30', t, s: 0.92, expr: gotBread ? 'happy' : 'sad', phase: 1 });
  if (gotBread) emoji(ctx, '🥖', 250, F - 140, 70);
  const shiver = t < w(98) ? Math.sin(t * 40) * 3 : 0;
  person(ctx, 470 + shiver, F + 20, { ...RICHARD_HOMELESS, s: 1.12, t, expr: t > w(120) ? 'happy' : t > w(105) ? 'smile' : 'sad', talk: t > w(120) && t < w(121) + 0.5 });
  if (t < w(105)) pill(ctx, '3,50 €', 470, 720, t - w(98), { bg: C.gold, color: OL, size: 52 });
  if (t > w(103) && !gotBread) {
    const k = clamp((t - w(105) - 0.1) / 0.5);
    emoji(ctx, '🥖', lerp(560, 250, easeInOut(k)), lerp(F - 140, F - 140, k) - Math.sin(k * Math.PI) * 120, 70);
  }
  if (t > w(103)) emoji(ctx, '🥖', 560, F - 140, 70);
  // Johann mit Decke
  const jx = lerp(1300, 820, easeOut((t - w(112)) / 1.0));
  person(ctx, jx, F + 20, { ...BUTLER, s: 1.12, t, flip: true, hop: t > w(112) && t < w(112) + 1.0, expr: t > w(121) ? 'happy' : 'smile', prop: holdBlanket });
  bubble(ctx, 'Bring zwei.', 480, 640, t - w(120), { size: 56, color: '#fff7d6', dur: w(122) - w(120) + 0.4 });
}
scenes.push({ start: t6, draw: nightScene });
scenes.push({ start: w(122), noSlide: true, noWhoosh: true, draw(ctx, lt, t) {
  nightScene(ctx, t - t6, t);
  questionCard(ctx, 'Würdest du 1 Tag obdachlos sein – für 1 Million €?', lt, 400);
  commentSign(ctx, 860, 1120, t - w(133));
} });
scenes.push({ start: END, noSlide: true, draw(ctx, lt, t) {
  nightScene(ctx, t - t6, t, false);
  ctx.fillStyle = 'rgba(20,14,40,0.35)'; ctx.fillRect(0, 0, W, 620);
  const pos = roulettePos(lt, iPsycho, { tStop: END_STOP, spins: END_SPINS });
  const role = ROLES[((Math.round(pos) % ROLES.length) + ROLES.length) % ROLES.length];
  const small = role.name === 'obdachlos' ? 'Nächstes Mal ist Richard' : 'Nächstes Mal ist Richard ein';
  header(ctx, small, role.name + '.', 170);
  rouletteBar(ctx, pos, 480);
  commentSign(ctx, 860, 1120, 1);
} });

run({ scenes, chunks, duration, sfx, subY: 1300, hideSubs: [[0, w(4) - 0.05]] });
