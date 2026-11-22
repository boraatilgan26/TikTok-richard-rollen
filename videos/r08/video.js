// Folge 8 – „Heute ist Richard ein Astronaut.“
import { W, H, OL, C, clamp, lerp, easeOut, easeInOut, bounce, box, circ, line, rr, poly, text, emoji, alpha, scaled,
  person, RICHARD, BUTLER, clockBadge, bubble, iconCard, stamp, pill, questionCard, commentSign,
  ROLES, rouletteBar, roulettePos } from '../../engine/chibi.js';
import * as B from '../../engine/bg.js';
import { setup, run } from '../../engine/timeline.js';

const F = B.FLOOR;
const { words, w, chunks, duration } = await setup('videos/r08', {
  tail: 1.4,
  capMap: {
    'Sieben Uhr.': '7 Uhr.', 'Zehn Uhr.': '10 Uhr.', 'Zwölf Uhr.': '12 Uhr.', 'Sechzehn Uhr.': '16 Uhr.', 'Einundzwanzig Uhr.': '21 Uhr.',
    'Vier von zweihundert': '4 von 200', 'neunzehnhunderteinundsechzig': '1961', 'hundertacht Minuten': '108 Minuten', 'eine Million Euro': '1 Million Euro',
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
A.bedeutet = wi('Bedeutet'); A.luft = wi('Luft', A.bedeutet); A.schwer = wi('Schwerkraft', A.luft); A.butler = wi('Butler', A.schwer);
A.sieben = wi('Sieben', A.butler); A.kaviar = wi('Kaviar', A.sieben); A.faengt = wi('fängt', A.kaviar); A.vier = wi('Vier', A.faengt);
A.zehn = wi('Zehn', A.vier); A.sucht = wi('sucht', A.zehn); A.findet = wi('findet', A.sucht); A.klein1 = wi('klein', A.findet); A.ersten = wi('Zum', A.klein1 + 1);
A.zwoelf = wi('Zwölf', A.ersten); A.tube = wi('Tube', A.zwoelf); A.geschmack = wi('Geschmack', A.tube); A.konsistenz = wi('Konsistenz', A.geschmack);
A.sechzehn = wi('Sechzehn', A.konsistenz); A.oma = wi('Oma', A.sechzehn); A.ruckelt = wi('ruckelt', A.oma); A.sowjet = wi('Sowjetunion', A.ruckelt); A.juri = wi('Juri', A.sowjet);
A.flug = wi('Flug', A.juri); A.minuten = wi('Minuten', A.flug); A.staunt = wi('staunt', A.minuten); A.fruehstueck = wi('Frühstück', A.staunt);
A.einund = wi('Einundzwanzig', A.fruehstueck); A.schwebt = wi('schwebt', A.einund); A.klopft = wi('klopft', A.schwebt); A.johann = wi('Johann', A.klopft); A.milch = wi('Milch', A.johann);
A.wuerdest = wi('Würdest', A.milch); A.schreib = wi('Schreib', A.wuerdest); A.naechstes = wi('Nächstes', A.schreib); A.lehrer = wi('Lehrer', A.naechstes);

const iAstro = ROLES.findIndex(r => r.name === 'Astronaut');
const iLehrer = ROLES.findIndex(r => r.name === 'Lehrer');
const ASTRO = { ...RICHARD, shirt: '#eef0f4', pants: '#eef0f4', tie: true, badge: '🚀', shoes: '#9aa4b4' };
const helmet = ctx => { ctx.save(); ctx.globalAlpha = 0.35; circ(ctx, 0, -360, 150, '#bfe8ff', 0); ctx.restore(); circ(ctx, 0, -360, 150, null, 8); };
const ASTRO_H = { ...ASTRO, prop: helmet };
const BUTLER_SPACE = { ...BUTLER, shirt: '#eef0f4', pants: '#eef0f4', prop: helmet };
const float = (t, ph = 0) => Math.sin(t * 2 + ph) * 18;

const scenes = [];
// ---------- 0: HOOK ----------
const iWord = wi('Astronaut');
const HOOK_STOP = w(iWord) + 0.1, HOOK_SPINS = 15;
tickSfx(0, iAstro, HOOK_STOP, HOOK_SPINS); S(HOOK_STOP, 'rise');
scenes.push({ start: 0, draw(ctx, lt) {
  const pos = roulettePos(lt, iAstro, { tStop: HOOK_STOP, spins: HOOK_SPINS }); const role = roleAt(pos);
  B.villa(ctx, role.bg[0], role.bg[1]);
  header(ctx, 'Heute ist Richard' + art(role.name), role.name + '.');
  rouletteBar(ctx, pos, 470);
  scaled(ctx, W / 2, 650, bounce(lt, 0.15, 0.3), () => {
    box(ctx, W / 2 - 290, 590, 580, 124, 62, 'rgba(30,20,40,0.85)', 0);
    text(ctx, 'VERMÖGEN', W / 2, 622, { size: 30, color: '#ffffffaa', spacing: 5 });
    text(ctx, '47.683.594 €', W / 2, 672, { size: 62, color: C.gold });
  });
  const done = lt > HOOK_STOP;
  const look = role.name === 'Astronaut' ? ASTRO_H : lookFor(role.name);
  const lift = done ? (lt - HOOK_STOP) * 60 : 0;
  person(ctx, W / 2, 1640 - lift, { ...look, s: 1.25, t: lt, expr: 'happy' });
  if (done) stamp(ctx, '3 … 2 … 1 … 🚀', W / 2, 860, lt - HOOK_STOP - 0.1, { size: 54, rot: -0.08, color: '#2a3a8a' });
} });

// ---------- 1: BEDEUTET ----------
[A.luft, A.schwer, A.butler].forEach(i => S(w(i), 'pop'));
scenes.push({ start: w(A.bedeutet), subY: 1290, draw(ctx, lt, t) {
  B.sunset(ctx);
  person(ctx, W / 2, 1230, { ...ASTRO_H, s: 1.2, t, expr: t > w(A.butler) ? 'shock' : 'smile' });
  iconCard(ctx, 200, 330, 120, t - w(A.luft), { icon: '💨', label: 'keine Luft', cross: true });
  iconCard(ctx, 540, 330, 120, t - w(A.schwer), { icon: '🍎', label: 'keine Schwerkraft', cross: true });
  iconCard(ctx, 880, 330, 120, t - w(A.butler), { icon: '🤵', label: 'kein Butler', cross: true });
} });

// ---------- 2: 07:00 KAVIAR ----------
S(w(A.kaviar), 'whoosh'); S(w(A.faengt), 'pop'); S(w(A.vier), 'ding');
scenes.push({ start: w(A.sieben), draw(ctx, lt, t) {
  B.spaceStation(ctx, t); clockBadge(ctx, '07:00', lt);
  pill(ctx, '🛰️ RAUMSTATION', W / 2, 360, lt - 0.1, { bg: '#2a3a8a', size: 46 });
  if (t > w(A.kaviar)) for (let i = 0; i < 16; i++) { const k = t - w(A.kaviar); const x = 540 + Math.cos(i * 1.7) * (80 + k * 60) , y = 820 + Math.sin(i * 2.3) * (60 + k * 40); circ(ctx, x, y, 10, '#222', 0); }
  person(ctx, 400, F - 60 + float(t), { ...ASTRO, s: 1.12, t, expr: t > w(A.faengt) ? 'wow' : 'smile', tilt: Math.sin(t) * 0.12 });
  if (t > w(A.vier)) { scaled(ctx, 820, 1100, bounce(t - w(A.vier), 0, 0.3), () => { box(ctx, 660, 1020, 320, 160, 24, '#fff'); text(ctx, '4 / 200', 820, 1080, { size: 64, color: OL }); text(ctx, 'Kaviar-Eier', 820, 1140, { size: 34, color: '#888' }); }); }
} });

// ---------- 3: 10:00 WELTRAUMSPAZIERGANG ----------
S(w(A.sucht), 'pop'); S(w(A.findet), 'pop'); S(w(A.klein1), 'bass');
scenes.push({ start: w(A.zehn), draw(ctx, lt, t) {
  B.space(ctx, t); clockBadge(ctx, '10:00', lt);
  person(ctx, 540, 1100 + float(t, 1), { ...ASTRO_H, s: 1.0, t, expr: t > w(A.klein1) ? 'sad' : 'smile', tilt: Math.sin(t * 0.8) * 0.2, look: 0.3 });
  line(ctx, 600, 900 + float(t, 1), 1080, 600, '#ddd', 6);
  if (t > w(A.sucht)) emoji(ctx, '🔭', 690, 870 + float(t, 1), 70);
  if (t > w(A.findet)) { pill(ctx, 'Villa? 🔍 …', 540, 520, t - w(A.findet), { bg: OL, size: 46 }); circ(ctx, 520, 1700, 6, C.gold, 0); }
  if (t > w(A.ersten)) stamp(ctx, 'ZU KLEIN', 540, 680, t - w(A.ersten) + 0.4, { size: 66 });
} });

// ---------- 4: 12:00 TUBE ----------
S(w(A.tube), 'pop'); S(w(A.geschmack), 'pop'); S(w(A.konsistenz), 'hit');
const tubeProp = ctx => { box(ctx, 70, -200, 50, 110, 10, '#f5c84b', 5); box(ctx, 82, -220, 26, 24, 4, '#e8504a', 4); };
scenes.push({ start: w(A.zwoelf), draw(ctx, lt, t) {
  B.spaceStation(ctx, t); clockBadge(ctx, '12:00', lt);
  person(ctx, 360, F - 40 + float(t), { ...ASTRO, s: 1.12, t, expr: t > w(A.konsistenz) ? 'sad' : 'smile', prop: tubeProp });
  if (t > w(A.geschmack)) pill(ctx, 'Geschmack: Lasagne 🍝', 760, 1000, t - w(A.geschmack), { bg: '#2f9a4a', size: 40 });
  if (t > w(A.konsistenz)) pill(ctx, 'Konsistenz: Zahnpasta 🪥', 760, 1110, t - w(A.konsistenz), { bg: C.red, size: 40 });
} });

// ---------- 5: 16:00 OMA – FAKT ----------
S(w(A.oma), 'ding'); S(w(A.sowjet), 'whoosh'); S(w(A.juri), 'pop'); S(w(A.minuten), 'magic'); S(w(A.fruehstueck), 'pop');
scenes.push({ start: w(A.sechzehn), draw(ctx, lt, t) {
  B.spaceStation(ctx, t); clockBadge(ctx, '16:00', lt);
  B.screen(ctx, W / 2, 610, 920, 600, () => {
    const cx = W / 2, cy = 610;
    if (t < w(A.sowjet)) {
      ctx.fillStyle = '#f6e6d6'; ctx.fillRect(cx - 460, cy - 300, 920, 600);
      box(ctx, cx - 444, cy - 284, 888, 60, 0, '#fff', 0); text(ctx, 'Oma · Videoanruf', cx - 220, cy - 254, { size: 32, color: OL });
      box(ctx, cx + 300, cy - 274, 100, 40, 10, C.red, 0); text(ctx, 'LIVE', cx + 350, cy - 253, { size: 28, color: '#fff' });
      const jit = t > w(A.ruckelt) ? (Math.floor(t * 8) % 2) * 14 : 0;
      person(ctx, cx + jit, cy + 430, { hair: 'grandma', glasses: true, shirt: '#b07ad0', t: Math.floor(t * 4) / 4, s: 1.05, wave: true });
      if (t > w(A.ruckelt)) text(ctx, '📶 schwach …', cx + 280, cy + 230, { size: 32, color: C.red });
    } else if (t < w(A.juri)) {
      box(ctx, cx - 350, cy - 100, 300, 200, 10, '#c8202a'); text(ctx, '☭', cx - 300, cy - 50, { size: 56, color: '#ffd84a' });
      text(ctx, 'Sowjetunion', cx - 200, cy + 150, { size: 38, color: '#fff' });
      scaled(ctx, cx + 210, cy, bounce(t - w(A.sowjet) - 0.4, 0, 0.3), () => text(ctx, '1961', cx + 210, cy, { size: 140, color: C.gold }));
    } else if (t < w(A.flug)) {
      circ(ctx, cx - 250, cy - 20, 120, '#fff'); person(ctx, cx - 250, cy + 210, { hair: 'dad', hairColor: '#4a3020', shirt: '#e8742a', s: 0.5, t, expr: 'happy' });
      box(ctx, cx - 370, cy + 120, 240, 50, 10, C.gold, 0); text(ctx, 'Juri Gagarin', cx - 250, cy + 146, { size: 30, color: OL });
      text(ctx, 'erster Mensch', cx + 170, cy - 40, { size: 54, color: '#fff' }); text(ctx, 'im All 🚀', cx + 170, cy + 40, { size: 60, color: C.gold });
    } else {
      text(ctx, 'GANZER FLUG', cx, cy - 150, { size: 40, color: '#ffffffcc', spacing: 4 });
      const n = Math.round(clamp((t - w(A.flug)) / 1.2) * 108);
      scaled(ctx, cx, cy, t > w(A.minuten) ? bounce(t - w(A.minuten), 0, 0.3) : 1, () => text(ctx, n + ' Min.', cx, cy, { size: 150, color: C.gold }));
    }
  });
  person(ctx, 220, F + 30 + float(t), { ...ASTRO, s: 1.05, t, look: 0.6, expr: t > w(A.staunt) ? 'wow' : 'smile' });
  bubble(ctx, 'So lange dauert mein Frühstück. 🍳', 320, 860, t - w(A.fruehstueck) + 0.9, { size: 40, max: 420, color: '#fff7d6' });
} });

// ---------- 6–8: 21:00 FENSTER, FRAGE, NÄCHSTE ROLLE ----------
S(w(A.schwebt), 'whoosh'); S(w(A.klopft), 'knock'); S(w(A.johann), 'hit'); S(w(A.milch), 'ding'); S(w(A.wuerdest), 'ding'); S(w(A.schreib), 'pop');
const END = w(A.naechstes), END_STOP = w(A.lehrer) + 0.1 - END, END_SPINS = 13;
tickSfx(END, iLehrer, END_STOP, END_SPINS); S(END + END_STOP, 'ding');
function nightScene(ctx, lt, t, clock = true) {
  B.spaceStation(ctx, t); ctx.fillStyle = 'rgba(10,10,40,0.45)'; ctx.fillRect(0, 0, W, H);
  if (clock) clockBadge(ctx, '21:00', lt);
  // großes Fenster rechts
  circ(ctx, 760, 820, 230, '#9aa4b4'); circ(ctx, 760, 820, 200, '#0b1030');
  for (let i = 0; i < 20; i++) circ(ctx, 600 + (i * 71) % 320, 650 + (i * 43) % 340, 3, '#fff', 0);
  if (t > w(A.johann) - 0.3) {
    ctx.save(); ctx.beginPath(); ctx.arc(760, 820, 200, 0, Math.PI * 2); ctx.clip();
    person(ctx, 760, 1200 + float(t, 2), { ...BUTLER_SPACE, s: 0.9, t, expr: 'happy', prop: ctx => { helmet(ctx); emoji(ctx, '🥛', 100, -150, 64); } });
    ctx.restore();
  }
  if (t > w(A.klopft) && t < w(A.johann) + 0.5) text(ctx, 'KLOPF KLOPF', 760, 560, { size: 46, color: '#fff', stroke: 8 });
  const x = lerp(200, 330, clamp((t - w(A.schwebt)) / 2));
  person(ctx, x, F - 80 + float(t), { ...ASTRO, s: 1.05, t, expr: t > w(A.johann) ? 'shock' : t > w(A.milch) ? 'happy' : 'sleep', tilt: -0.3 + Math.sin(t) * 0.1 });
}
scenes.push({ start: w(A.einund), draw: nightScene });
scenes.push({ start: w(A.wuerdest), noSlide: true, noWhoosh: true, draw(ctx, lt, t) {
  nightScene(ctx, t - w(A.einund), t);
  questionCard(ctx, 'Würdest du für 1 Million € ins All fliegen?', lt, 400);
  commentSign(ctx, 860, 1120, t - w(A.schreib));
} });
scenes.push({ start: END, noSlide: true, draw(ctx, lt, t) {
  nightScene(ctx, t - w(A.einund), t, false);
  ctx.fillStyle = 'rgba(20,14,40,0.45)'; ctx.fillRect(0, 0, W, 620);
  const pos = roulettePos(lt, iLehrer, { tStop: END_STOP, spins: END_SPINS }); const role = roleAt(pos);
  header(ctx, 'Nächstes Mal ist Richard' + art(role.name), role.name + '.', 170);
  rouletteBar(ctx, pos, 480);
  commentSign(ctx, 860, 1120, 1);
} });

run({ scenes, chunks, duration, sfx, subY: 1300, hideSubs: [[0, w(A.bedeutet) - 0.05]] });
