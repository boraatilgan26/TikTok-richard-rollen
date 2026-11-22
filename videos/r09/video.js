// Folge 9 – „Heute ist Richard ein Lehrer.“
import { W, H, OL, C, clamp, lerp, easeOut, easeInOut, bounce, box, circ, line, rr, poly, text, emoji, alpha, scaled,
  person, RICHARD, BUTLER, clockBadge, bubble, iconCard, stamp, pill, questionCard, commentSign,
  ROLES, rouletteBar, roulettePos } from '../../engine/chibi.js';
import * as B from '../../engine/bg.js';
import { setup, run } from '../../engine/timeline.js';

const F = B.FLOOR;
const { words, w, chunks, duration } = await setup('videos/r09', {
  tail: 1.4,
  capMap: {
    'Sieben Uhr.': '7 Uhr.', 'Neun Uhr.': '9 Uhr.', 'Zwölf Uhr.': '12 Uhr.', 'Sechzehn Uhr.': '16 Uhr.', 'Einundzwanzig Uhr.': '21 Uhr.',
    'Dreißig Kinder': '30 Kinder', 'siebzehnhundertsiebzehn': '1717', 'der Erste': 'I.', 'dreißig Tests': '30 Tests', 'dem zehnten': 'dem 10.', 'eine Eins': 'eine 1',
  },
});
// Wortindex per Text finden (robust gegen Transkriptions-Abweichungen)
const norm = s => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, '');
function wi(word, after = 0) { const n = norm(word); for (let i = after; i < words.length; i++) if (norm(words[i].w).startsWith(n)) return i; return after; }
const sfx = []; const S = (t, type) => sfx.push({ t, type });

const iPsycho = ROLES.findIndex(r => r.name === 'Psychopath');
const iVegan = ROLES.findIndex(r => r.name === 'Veganer');
const ROLE_LOOK = {
  Psychopath: { shirt: '#2a2a32', badge: '🔪' }, Veganer: { shirt: '#5fb06a', badge: '🥦' }, Influencer: { shirt: '#f08cc0', badge: '🤳' },
  obdachlos: { shirt: '#8a6a4a', badge: '🛏️' }, Mönch: { shirt: '#e88a2a', badge: '🙏', hair: 'bald' }, Kommunist: { shirt: '#c83a34', badge: '⭐' },
  Minimalist: { shirt: '#f2f2f2', badge: '⚪' }, Gangster: { shirt: '#22222a', badge: '🕶️' }, Hausmeister: { shirt: '#3a7ab0', badge: '🧹' },
  Prepper: { shirt: '#7a8a4a', badge: '🥫' }, Astronaut: { shirt: '#e8e8f0', badge: '🚀' }, Lehrer: { shirt: '#8a5ab0', badge: '📚' },
};
// Psycho-Richard: Anzug-Look, schwarzes Hemd, goldene Krawatte, kühles Lächeln
const PSYCHO = { ...RICHARD, shirt: '#24242c', pants: '#24242c', tie: true };
const lookFor = name => name === 'Psychopath' ? PSYCHO : { ...RICHARD, ...ROLE_LOOK[name], tie: true };
function tickSfx(t0, target, tStop, spins) {
  let last = Math.round(roulettePos(0, target, { tStop, spins }));
  for (let t = 0; t < tStop; t += 1 / 120) { const p = Math.round(roulettePos(t, target, { tStop, spins })); if (p !== last) { S(t0 + t, 'pop'); last = p; } }
}
function header(ctx, small, big, y = 150) { text(ctx, small, W / 2, y, { size: 50, color: '#fff', shadow: true }); text(ctx, big, W / 2, y + 120, { size: 120, color: '#fff', shadow: true }); }
const roleAt = pos => ROLES[((Math.round(pos) % ROLES.length) + ROLES.length) % ROLES.length];
const art = n => n === 'obdachlos' ? '' : ' ein';

// Anker
const A = {};
A.bedeutet = wi('Bedeutet'); A.frueh = wi('Früh', A.bedeutet); A.geld = wi('Geld', A.frueh); A.kinder = wi('Kinder', A.geld);
A.sieben = wi('Sieben', A.kinder); A.gold = wi('Goldkrawatte', A.sieben); A.fragen = wi('fragen', A.gold); A.direktor = wi('Direktor', A.fragen); A.gekauft = wi('gekauft', A.direktor);
A.neun = wi('Neun', A.gekauft); A.prozent = wi('Prozentrechnung', A.neun); A.taschen = wi('Taschengeld', A.prozent); A.rechnet = wi('rechnet', A.taschen); A.gibt = wi('gibt', A.rechnet);
A.zwoelf = wi('Zwölf', A.gibt); A.tauscht = wi('tauscht', A.zwoelf); A.rolex = wi('Rolex', A.tauscht); A.holt = wi('holt', A.rolex); A.zinsen = wi('Zinsen', A.holt);
A.sechzehn = wi('Sechzehn', A.zinsen); A.oma = wi('Oma', A.sechzehn); A.preussen = wi('Preußen', A.oma); A.koenig = wi('König', A.preussen); A.pflicht = wi('Schulpflicht', A.koenig);
A.abjetzt = wi('Ab', A.pflicht); A.staunt = wi('staunt', A.abjetzt); A.haus = wi('Hausaufgaben', A.staunt);
A.einund = wi('Einundzwanzig', A.haus); A.korrigiert = wi('korrigiert', A.einund); A.schlaeft = wi('schläft', A.korrigiert); A.rest = wi('Rest', A.schlaeft); A.eins = wi('Eins', A.rest);
A.wuerdest = wi('Würdest', A.eins); A.schreib = wi('Schreib', A.wuerdest); A.naechstes = wi('Nächstes', A.schreib); A.prepper = wi('Prepper', A.naechstes);

const iLehrer = ROLES.findIndex(r => r.name === 'Lehrer');
const iPrepper = ROLES.findIndex(r => r.name === 'Prepper');
const LEHRER = { ...RICHARD, shirt: '#8a5ab0', tie: true, badge: '📚', glasses: true };
const chalk = ctx => { line(ctx, 90, -150, 120, -190, '#fff', 10); };
const KIDS = [{ hair: 'dad', hairColor: '#3a2a20', shirt: '#e8504a' }, { hair: 'mom', hairColor: '#c88a3a', shirt: '#5fb06a' }, { hair: 'dad', hairColor: '#e0c060', shirt: '#4f8fd6' }, { hair: 'mom', hairColor: '#2b2020', shirt: '#f0a040' }];
function kids(ctx, t, expr = 'smile', y = F + 40) { KIDS.forEach((k, i) => person(ctx, 560 + i * 140, y, { ...k, s: 0.62, t, phase: i, expr: typeof expr === 'function' ? expr(i) : expr })); }

const scenes = [];
// ---------- 0: HOOK ----------
const iWord = wi('Lehrer');
const HOOK_STOP = w(iWord) + 0.1, HOOK_SPINS = 15;
tickSfx(0, iLehrer, HOOK_STOP, HOOK_SPINS); S(HOOK_STOP, 'ding');
scenes.push({ start: 0, draw(ctx, lt) {
  const pos = roulettePos(lt, iLehrer, { tStop: HOOK_STOP, spins: HOOK_SPINS }); const role = roleAt(pos);
  B.villa(ctx, role.bg[0], role.bg[1]);
  header(ctx, 'Heute ist Richard' + art(role.name), role.name + '.');
  rouletteBar(ctx, pos, 470);
  scaled(ctx, W / 2, 650, bounce(lt, 0.15, 0.3), () => {
    box(ctx, W / 2 - 290, 590, 580, 124, 62, 'rgba(30,20,40,0.85)', 0);
    text(ctx, 'VERMÖGEN', W / 2, 622, { size: 30, color: '#ffffffaa', spacing: 5 });
    text(ctx, '47.683.594 €', W / 2, 672, { size: 62, color: C.gold });
  });
  const done = lt > HOOK_STOP;
  const look = role.name === 'Lehrer' ? { ...LEHRER, prop: chalk } : lookFor(role.name);
  person(ctx, W / 2, 1640, { ...look, s: 1.25, t: lt, expr: 'happy' });
  if (done) stamp(ctx, 'NOTE: 1+', W / 2, 860, lt - HOOK_STOP - 0.2, { size: 60, rot: -0.08, color: '#8a5ab0' });
} });

// ---------- 1: BEDEUTET ----------
[A.frueh, A.geld, A.kinder].forEach(i => S(w(i), 'pop'));
scenes.push({ start: w(A.bedeutet), subY: 1290, draw(ctx, lt, t) {
  B.sunset(ctx);
  person(ctx, W / 2, 1230, { ...LEHRER, s: 1.2, t, expr: t > w(A.kinder) ? 'shock' : 'smile', prop: chalk });
  iconCard(ctx, 200, 330, 120, t - w(A.frueh), { icon: '⏰', label: 'früh aufstehen', labelBg: '#8a5ab0' });
  iconCard(ctx, 540, 330, 120, t - w(A.geld), { icon: '💸', label: 'wenig Geld', labelBg: '#8a5ab0' });
  iconCard(ctx, 880, 330, 120, t - w(A.kinder), { icon: '👧', label: '30 Kinder', labelBg: '#8a5ab0' });
} });

// ---------- 2: 07:00 KLASSE BETRETEN ----------
S(w(A.gold), 'pop'); S(w(A.direktor), 'pop'); S(w(A.gekauft), 'coins');
scenes.push({ start: w(A.sieben), draw(ctx, lt, t) {
  B.classroom(ctx); clockBadge(ctx, '07:00', lt);
  text(ctx, 'Guten Morgen!', 540, 520, { size: 70, color: '#fff' });
  person(ctx, 260, F + 20, { ...LEHRER, s: 1.05, t, expr: 'smile', talk: t > w(A.gekauft) - 1 && t < w(A.gekauft) + 0.4 });
  if (t > w(A.gold)) person(ctx, 120, F + 20, { ...BUTLER, s: 0.9, t, expr: 'neutral' });
  kids(ctx, t, t > w(A.gekauft) ? 'shock' : 'smile');
  bubble(ctx, 'Sind Sie der Direktor? 🤔', 770, 860, t - w(A.fragen), { size: 40, max: 380, dur: w(A.gekauft) - w(A.fragen) - 0.6 });
  bubble(ctx, 'Nein. Ich habe die Schule gekauft. 🏫', 300, 620, t - w(A.gekauft) + 1.2, { size: 42, max: 420, color: '#fff7d6' });
} });

// ---------- 3: 09:00 MATHE ----------
S(w(A.prozent), 'pop'); S(w(A.taschen), 'pop'); S(w(A.gibt), 'hit');
scenes.push({ start: w(A.neun), draw(ctx, lt, t) {
  B.classroom(ctx); clockBadge(ctx, '09:00', lt);
  text(ctx, 'MATHE', 540, 410, { size: 54, color: '#ffffffcc' });
  if (t > w(A.prozent)) { text(ctx, 'Depot: 47.683.594 €', 540, 510, { size: 52, color: '#fff' }); text(ctx, '+ 7 % = ?', 540, 600, { size: 60, color: C.gold }); }
  if (t > w(A.rechnet)) { text(ctx, '÷ 5 € Taschengeld …', 540, 690, { size: 44, color: '#ffd0d0' }); }
  person(ctx, 260, F + 20, { ...LEHRER, s: 1.05, t, expr: t > w(A.gibt) ? 'sad' : 'smile', prop: chalk });
  kids(ctx, t, i => (i === 1 && t > w(A.taschen) - 1) ? 'neutral' : 'smile');
  bubble(ctx, 'Wie viel ist das in Taschengeld?', 700, 860, t - w(A.taschen) + 1.0, { size: 38, max: 380, dur: w(A.gibt) - w(A.taschen) + 1.0 });
  if (t > w(A.gibt)) stamp(ctx, 'ERROR', 540, 600, t - w(A.gibt), { size: 80 });
} });

// ---------- 4: 12:00 PAUSE ----------
S(w(A.tauscht), 'whoosh'); S(w(A.rolex), 'pop'); S(w(A.holt), 'pop'); S(w(A.zinsen), 'coins');
scenes.push({ start: w(A.zwoelf), draw(ctx, lt, t) {
  B.park(ctx); clockBadge(ctx, '12:00', lt);
  pill(ctx, '🔔 PAUSE', W / 2, 400, lt - 0.1, { bg: '#e8742a', size: 48 });
  const swapped = t > w(A.rolex);
  person(ctx, 300, F + 20, { ...LEHRER, s: 1.05, t, expr: swapped ? 'happy' : 'smile', prop: swapped ? (ctx => emoji(ctx, '🥪', 100, -140, 64)) : (ctx => emoji(ctx, '⌚', 100, -140, 56)) });
  const backed = t > w(A.holt);
  person(ctx, 640, F + 40, { ...KIDS[2], s: 0.7, t, expr: backed ? 'sad' : 'happy', prop: backed ? null : (swapped ? (ctx => emoji(ctx, '⌚', 100, -140, 70)) : (ctx => emoji(ctx, '🥪', 100, -140, 70))) });
  if (backed) person(ctx, 880, F + 20, { ...BUTLER, s: 1.0, t, flip: true, expr: 'smile', prop: ctx => emoji(ctx, '⌚', 100, -140, 56) });
  if (t > w(A.zinsen)) pill(ctx, '+ Zinsen 🍎🍫', 880, 700, t - w(A.zinsen), { bg: '#2f9a4a', size: 42 });
} });

// ---------- 5: 16:00 OMA – FAKT ----------
S(w(A.oma), 'ding'); S(w(A.preussen), 'whoosh'); S(w(A.koenig), 'pop'); S(w(A.pflicht), 'hit'); S(w(A.haus), 'pop');
scenes.push({ start: w(A.sechzehn), draw(ctx, lt, t) {
  B.livingRoom(ctx); clockBadge(ctx, '16:00', lt);
  B.screen(ctx, W / 2, 610, 920, 600, () => {
    const cx = W / 2, cy = 610;
    if (t < w(A.preussen)) {
      ctx.fillStyle = '#f6e6d6'; ctx.fillRect(cx - 460, cy - 300, 920, 600);
      box(ctx, cx - 444, cy - 284, 888, 60, 0, '#fff', 0); text(ctx, 'Oma · Videoanruf', cx - 220, cy - 254, { size: 32, color: OL });
      box(ctx, cx + 300, cy - 274, 100, 40, 10, C.red, 0); text(ctx, 'LIVE', cx + 350, cy - 253, { size: 28, color: '#fff' });
      person(ctx, cx, cy + 430, { hair: 'grandma', glasses: true, shirt: '#b07ad0', t, s: 1.05, wave: true });
    } else if (t < w(A.koenig)) {
      box(ctx, cx - 350, cy - 100, 300, 100, 0, '#222', 0); box(ctx, cx - 350, cy, 300, 100, 0, '#fff', 0); box(ctx, cx - 350, cy - 100, 300, 200, 10, null);
      text(ctx, 'Preußen', cx - 200, cy + 150, { size: 40, color: '#fff' });
      scaled(ctx, cx + 210, cy, bounce(t - w(A.preussen) - 0.4, 0, 0.3), () => text(ctx, '1717', cx + 210, cy, { size: 140, color: C.gold }));
    } else if (t < w(A.abjetzt)) {
      circ(ctx, cx - 250, cy - 20, 120, '#fff'); person(ctx, cx - 250, cy + 210, { hair: 'grandma', shirt: '#2a3a8a', s: 0.5, t, mustache: true });
      emoji(ctx, '👑', cx - 250, cy - 150, 70);
      box(ctx, cx - 400, cy + 120, 300, 50, 10, C.gold, 0); text(ctx, 'Friedrich Wilhelm I.', cx - 250, cy + 146, { size: 26, color: OL });
      if (t > w(A.pflicht)) scaled(ctx, cx + 170, cy, bounce(t - w(A.pflicht), 0, 0.3), () => { text(ctx, 'SCHUL-', cx + 170, cy - 40, { size: 84, color: C.gold }); text(ctx, 'PFLICHT', cx + 170, cy + 50, { size: 84, color: C.gold }); });
    } else {
      emoji(ctx, '🏫', cx - 200, cy, 200); emoji(ctx, '🎒', cx + 200, cy, 200);
      text(ctx, 'Kinder müssen zur Schule', cx, cy - 220, { size: 44, color: '#fff' });
    }
  });
  person(ctx, 220, F + 30, { ...LEHRER, s: 1.05, t, look: 0.6, expr: t > w(A.staunt) ? 'wow' : 'smile' });
  bubble(ctx, 'Also ist der König schuld an den Hausaufgaben! 📝', 320, 860, t - w(A.haus) + 1.2, { size: 38, max: 440, color: '#fff7d6' });
} });

// ---------- 6–8: 21:00 KORREKTUR, FRAGE, NÄCHSTE ROLLE ----------
S(w(A.korrigiert), 'pop'); S(w(A.schlaeft), 'whoosh'); S(w(A.rest), 'pop'); S(w(A.eins), 'ding'); S(w(A.wuerdest), 'ding'); S(w(A.schreib), 'pop');
const END = w(A.naechstes), END_STOP = w(A.prepper) + 0.1 - END, END_SPINS = 13;
tickSfx(END, iPrepper, END_STOP, END_SPINS); S(END + END_STOP, 'ding');
const redPen = ctx => line(ctx, 90, -140, 130, -200, C.red, 10);
function nightScene(ctx, lt, t, clock = true) {
  B.livingRoom(ctx, true); if (clock) clockBadge(ctx, '21:00', lt);
  const asleep = t > w(A.schlaeft);
  const graded = t > w(A.rest) ? Math.min(30, 10 + Math.floor((t - w(A.rest)) * 12)) : Math.min(10, Math.floor((t - w(A.korrigiert)) * 4));
  person(ctx, 320, F + 20, { ...LEHRER, s: 1.05, t, expr: asleep ? 'sleep' : 'neutral', tilt: asleep ? 0.3 : 0, prop: asleep ? null : redPen });
  if (asleep) text(ctx, 'Z', 420, 720 - (lt * 40) % 60, { size: 76, color: '#fff', stroke: 8 });
  box(ctx, 160, F - 220, 760, 40, 10, '#7a4a2a'); for (let i = 0; i < 6; i++) box(ctx, 420 + i * 12, F - 240 - i * 8, 140, 20, 3, '#fff', 3);
  pill(ctx, `Tests: ${Math.max(0, graded)} / 30`, 540, 520, lt - 0.3, { bg: OL, size: 44 });
  if (t > w(A.rest)) person(ctx, 800, F + 20, { ...BUTLER, s: 1.05, t, flip: true, expr: 'happy', prop: redPen });
  if (t > w(A.eins)) for (let i = 0; i < 5; i++) text(ctx, '1', 620 + i * 70, 640 - Math.sin(t * 5 + i) * 10, { size: 70, color: '#2f9a4a', stroke: 8, strokeColor: '#fff' });
}
scenes.push({ start: w(A.einund), draw: nightScene });
scenes.push({ start: w(A.wuerdest), noSlide: true, noWhoosh: true, draw(ctx, lt, t) {
  nightScene(ctx, t - w(A.einund), t);
  questionCard(ctx, 'Würdest du lieber Lehrer sein oder Schüler?', lt, 400);
  commentSign(ctx, 860, 1120, t - w(A.schreib));
} });
scenes.push({ start: END, noSlide: true, draw(ctx, lt, t) {
  nightScene(ctx, t - w(A.einund), t, false);
  ctx.fillStyle = 'rgba(20,14,40,0.55)'; ctx.fillRect(0, 0, W, 620);
  const pos = roulettePos(lt, iPrepper, { tStop: END_STOP, spins: END_SPINS }); const role = roleAt(pos);
  header(ctx, 'Nächstes Mal ist Richard' + art(role.name), role.name + '.', 170);
  rouletteBar(ctx, pos, 480);
  commentSign(ctx, 860, 1120, 1);
} });

run({ scenes, chunks, duration, sfx, subY: 1300, hideSubs: [[0, w(A.bedeutet) - 0.05]] });
