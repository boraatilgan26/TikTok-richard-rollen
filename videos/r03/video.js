// Folge 3 – „Heute ist Richard ein Veganer.“
import { W, H, OL, C, clamp, lerp, easeOut, easeInOut, bounce, box, circ, line, poly, text, emoji, alpha, scaled,
  person, RICHARD, BUTLER, clockBadge, bubble, iconCard, stamp, pill, questionCard, commentSign,
  ROLES, rouletteBar, roulettePos } from '../../engine/chibi.js';
import * as B from '../../engine/bg.js';
import { setup, run } from '../../engine/timeline.js';

const F = B.FLOOR;
const { words, w, chunks, duration } = await setup('videos/r03', {
  tail: 1.4,
  capMap: {
    'Sieben Uhr.': '7 Uhr.', 'Zehn Uhr.': '10 Uhr.', 'Zwölf Uhr.': '12 Uhr.', 'Sechzehn Uhr.': '16 Uhr.', 'Einundzwanzig Uhr.': '21 Uhr.',
    'neunzehnhundertvierundvierzig': '1944', 'ersten drei': 'ersten 3', 'letzten zwei': 'letzten 2', 'einen Monat': '1 Monat', 'zehntausend Euro': '10.000 €',
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
A.bedeutet = wi('Bedeutet'); A.fleisch = wi('Fleisch', A.bedeutet); A.kaese = wi('Käse', A.fleisch); A.leder = wi('Leder', A.kaese);
A.sieben = wi('Sieben', A.leder); A.bringt = wi('bringt', A.sieben); A.sagt1 = wi('sagt', A.bringt); A.mutter = wi('Mutter', A.sagt1); A.weint = wi('weint', A.mutter);
A.zehn = wi('Zehn', A.weint); A.ferrari = wi('Ferrari', A.zehn); A.verkauft = wi('verkauft', A.ferrari); A.fahrrad = wi('Fahrrad', A.verkauft);
A.zwoelf = wi('Zwölf', A.fahrrad); A.steak = wi('bestellen', A.zwoelf); A.salat = wi('Salat', A.steak); A.kellner = wi('Kellner', A.salat); A.krank = wi('krank', A.kellner);
A.sechzehn = wi('Sechzehn', A.krank); A.oma = wi('Oma', A.sechzehn); A.england = wi('England', A.oma); A.watson = wi('Donald', A.england); A.nimmt = wi('nimmt', A.watson);
A.vegetarian = wi('vegetarian', A.nimmt); A.staunt = wi('staunt', A.vegetarian); A.nachhaltig = wi('nachhaltig', A.staunt);
A.einund = wi('Einundzwanzig', A.nachhaltig); A.oeffnet = wi('öffnet', A.einund); A.johann3 = wi('Johann', A.oeffnet); A.gurke = wi('Gurke', A.johann3); A.befoerdert = wi('befördert', A.gurke);
A.wuerdest = wi('Würdest', A.befoerdert); A.schreib = wi('Schreib', A.wuerdest); A.naechstes = wi('Nächstes', A.schreib); A.influ = wi('Influencer', A.naechstes);

const iInflu = ROLES.findIndex(r => r.name === 'Influencer');
const VEGAN = { ...RICHARD, shirt: '#5fb06a', badge: '🥦', tie: true };

const scenes = [];
// ---------- 0: HOOK ----------
const iWord = wi('Veganer');
const HOOK_STOP = w(iWord) + 0.1, HOOK_SPINS = 15;
tickSfx(0, iVegan, HOOK_STOP, HOOK_SPINS); S(HOOK_STOP, 'ding');
scenes.push({ start: 0, draw(ctx, lt) {
  const pos = roulettePos(lt, iVegan, { tStop: HOOK_STOP, spins: HOOK_SPINS }); const role = roleAt(pos);
  B.villa(ctx, role.bg[0], role.bg[1]);
  header(ctx, 'Heute ist Richard' + art(role.name), role.name + '.');
  rouletteBar(ctx, pos, 470);
  scaled(ctx, W / 2, 650, bounce(lt, 0.15, 0.3), () => {
    box(ctx, W / 2 - 290, 590, 580, 124, 62, 'rgba(30,20,40,0.85)', 0);
    text(ctx, 'VERMÖGEN', W / 2, 622, { size: 30, color: '#ffffffaa', spacing: 5 });
    text(ctx, '47.683.594 €', W / 2, 672, { size: 62, color: C.gold });
  });
  const done = lt > HOOK_STOP;
  const look = role.name === 'Veganer' ? VEGAN : lookFor(role.name);
  person(ctx, W / 2, 1640, { ...look, s: 1.25, t: lt, expr: 'happy' });
  if (done) emoji(ctx, '🥕', W / 2 + 150, 1500, 100);
  if (done) stamp(ctx, '100 % PFLANZLICH', W / 2, 860, lt - HOOK_STOP - 0.2, { size: 52, rot: -0.08, color: '#2f9a4a' });
} });

// ---------- 1: BEDEUTET ----------
[A.fleisch, A.kaese, A.leder].forEach(i => S(w(i), 'pop'));
scenes.push({ start: w(A.bedeutet), subY: 1290, draw(ctx, lt, t) {
  B.sunset(ctx);
  person(ctx, W / 2, 1230, { ...VEGAN, s: 1.2, t, expr: t > w(A.leder) ? 'sad' : 'smile' });
  iconCard(ctx, 200, 330, 120, t - w(A.fleisch), { icon: '🥩', label: 'kein Fleisch', cross: true });
  iconCard(ctx, 540, 330, 120, t - w(A.kaese), { icon: '🧀', label: 'kein Käse', cross: true });
  iconCard(ctx, 880, 330, 120, t - w(A.leder), { icon: '👞', label: 'kein Leder', cross: true });
} });

// ---------- 2: 07:00 FRÜHSTÜCK ----------
S(w(A.bringt), 'pop'); S(w(A.mutter), 'pop'); S(w(A.weint), 'hit');
const baconTray = ctx => { box(ctx, 40, -150, 140, 16, 6, '#c0c0c8', 5); emoji(ctx, '🍳', 80, -190, 60); emoji(ctx, '🥓', 140, -190, 60); };
scenes.push({ start: w(A.sieben), draw(ctx, lt, t) {
  B.diningRoom(ctx); clockBadge(ctx, '07:00', lt); B.longTable(ctx, F);
  person(ctx, 300, F + 20, { ...VEGAN, s: 1.12, t, expr: t > w(A.bringt) + 0.3 ? 'shock' : 'smile', talk: t > w(A.sagt1) && t < w(A.mutter) + 0.4 });
  const bx = lerp(1300, 780, easeOut((t - w(A.bringt) + 0.4) / 0.8));
  person(ctx, bx, F + 20, { ...BUTLER, s: 1.12, t, flip: true, expr: t > w(A.weint) ? 'sad' : 'smile', prop: baconTray });
  if (t > w(A.weint)) for (const sx of [-1, 1]) { const y = 960 + ((t * 300) % 140); circ(ctx, bx - sx * 42, y, 11, '#7ac8f0', 0); }
  bubble(ctx, 'Johann, das hatte mal eine Mutter. 🐷', 330, 600, t - w(A.sagt1) - 0.3, { size: 44, max: 480, color: '#fff7d6' });
} });

// ---------- 3: 10:00 GARAGE ----------
S(w(A.ferrari), 'pop'); S(w(A.verkauft), 'coins'); S(w(A.fahrrad), 'ding');
scenes.push({ start: w(A.zehn), draw(ctx, lt, t) {
  B.garage(ctx); clockBadge(ctx, '10:00', lt);
  const sold = t > w(A.verkauft) + 0.3;
  if (!sold) { B.sportsCar(ctx, 640, F + 20); if (t > w(A.ferrari)) pill(ctx, 'LEDERSITZE 🐄', 640, 900, t - w(A.ferrari), { bg: C.red, size: 40 }); }
  else if (t < w(A.fahrrad)) { alpha(ctx, 1 - (t - w(A.verkauft) - 0.3) / 0.3, () => B.sportsCar(ctx, 640 + (t - w(A.verkauft)) * 900, F + 20)); stamp(ctx, 'VERKAUFT', 640, 900, t - w(A.verkauft) - 0.3, { size: 64 }); }
  else { B.bambooBike(ctx, 680, F + 20); pill(ctx, 'Fahrrad aus Bambus 🎋', 680, 900, t - w(A.fahrrad), { bg: '#2f9a4a', size: 40 }); }
  person(ctx, 230, F + 20, { ...VEGAN, s: 1.12, t, expr: sold ? 'happy' : 'neutral' });
} });

// ---------- 4: 12:00 STEAKHAUS ----------
S(w(A.steak), 'pop'); S(w(A.salat), 'pop'); S(w(A.krank), 'hit');
scenes.push({ start: w(A.zwoelf), draw(ctx, lt, t) {
  B.restaurant(ctx); clockBadge(ctx, '12:00', lt);
  box(ctx, 260, 340, 560, 100, 14, '#3a1a1a'); text(ctx, 'STEAKHAUS', W / 2, 392, { size: 60, color: C.gold, spacing: 6 });
  for (const [x, hc] of [[160, '#3a2a20'], [920, '#6b4026']]) person(ctx, x, F - 60, { hair: 'dad', hairColor: hc, shirt: '#5a6a8a', pants: '#333', s: 0.85, t, phase: x, flip: x > 500, expr: t > w(A.salat) ? 'shock' : 'happy' });
  person(ctx, W / 2, F - 40, { ...VEGAN, s: 1.0, t, expr: t > w(A.krank) ? 'sad' : 'smile' });
  box(ctx, 60, F - 230, 960, 40, 10, '#fff'); poly(ctx, [[60, F - 190], [1020, F - 190], [990, F - 60], [90, F - 60]], '#fff');
  if (t > w(A.steak)) { emoji(ctx, '🥩', 180, F - 260, 90); emoji(ctx, '🥩', 900, F - 260, 90); }
  if (t > w(A.salat)) { emoji(ctx, '🥗', W / 2, F - 262, 90); pill(ctx, 'ohne Dressing', W / 2, F - 380, t - w(A.salat) - 0.6, { bg: OL, size: 34 }); }
  bubble(ctx, 'Sind Sie krank? 🤒', 860, 640, t - w(A.kellner) - 0.3, { size: 46 });
} });

// ---------- 5: 16:00 OMA – FAKT ----------
S(w(A.oma), 'ding'); S(w(A.england), 'whoosh'); S(w(A.watson), 'pop'); S(w(A.nimmt), 'pop'); S(w(A.vegetarian), 'magic'); S(w(A.staunt), 'pop');
function ukFlagSmall(ctx, x, y) { B.ukFlag(ctx, x, y, 300); }
scenes.push({ start: w(A.sechzehn), draw(ctx, lt, t) {
  B.livingRoom(ctx); clockBadge(ctx, '16:00', lt);
  B.screen(ctx, W / 2, 610, 920, 600, () => {
    const cx = W / 2, cy = 610;
    if (t < w(A.england)) {
      ctx.fillStyle = '#f6e6d6'; ctx.fillRect(cx - 460, cy - 300, 920, 600);
      box(ctx, cx - 444, cy - 284, 888, 60, 0, '#fff', 0); text(ctx, 'Oma · Videoanruf', cx - 220, cy - 254, { size: 32, color: OL });
      box(ctx, cx + 300, cy - 274, 100, 40, 10, C.red, 0); text(ctx, 'LIVE', cx + 350, cy - 253, { size: 28, color: '#fff' });
      person(ctx, cx, cy + 430, { hair: 'grandma', glasses: true, shirt: '#b07ad0', t, s: 1.05, wave: true });
    } else if (t < w(A.watson)) {
      ukFlagSmall(ctx, cx - 200, cy);
      scaled(ctx, cx + 220, cy, bounce(t - w(A.england) - 0.4, 0, 0.3), () => text(ctx, '1944', cx + 220, cy, { size: 140, color: C.gold }));
    } else if (t < w(A.nimmt)) {
      circ(ctx, cx - 250, cy - 20, 110, '#fff'); person(ctx, cx - 250, cy + 200, { hair: 'dad', hairColor: '#8a8a8a', shirt: '#6a5a4a', s: 0.5, t });
      box(ctx, cx - 370, cy + 110, 240, 50, 10, C.gold, 0); text(ctx, 'Donald Watson', cx - 250, cy + 136, { size: 30, color: OL });
      text(ctx, 'erfindet', cx + 170, cy - 50, { size: 54, color: '#fff' }); text(ctx, '„vegan“', cx + 170, cy + 40, { size: 96, color: '#7ad08a' });
    } else {
      const k = clamp((t - w(A.vegetarian) - 0.2) / 0.8);
      const word = 'VEGETARIAN'; ctx.font = `900 96px Nunito`; const total = ctx.measureText(word).width;
      let x = cx - total / 2;
      for (let i = 0; i < word.length; i++) {
        const ch = word[i]; const wch = ctx.measureText(ch).width; const keep = i < 3 || i >= word.length - 2;
        alpha(ctx, keep ? 1 : 1 - k * 0.8, () => text(ctx, ch, x + wch / 2, cy - 70 + (keep ? 0 : k * 40), { size: 96, color: keep ? '#7ad08a' : '#ffffff' }));
        x += wch;
      }
      if (k >= 1) scaled(ctx, cx, cy + 120, bounce(t - w(A.vegetarian) - 1.0, 0, 0.3), () => text(ctx, 'VEG + AN = VEGAN', cx, cy + 120, { size: 72, color: C.gold }));
    }
  });
  person(ctx, 220, F + 30, { ...VEGAN, s: 1.05, t, look: 0.6, expr: t > w(A.staunt) ? 'wow' : 'smile' });
  if (t > w(A.nachhaltig)) pill(ctx, 'nachhaltig ♻️', 240, 760, t - w(A.nachhaltig), { bg: '#2f9a4a', size: 42 });
} });

// ---------- 6–8: 21:00 KÜHLSCHRANK, FRAGE, NÄCHSTE ROLLE ----------
S(w(A.oeffnet), 'whoosh'); S(w(A.johann3), 'hit'); S(w(A.gurke), 'pop'); S(w(A.befoerdert), 'ding'); S(w(A.wuerdest), 'ding'); S(w(A.schreib), 'pop');
const END = w(A.naechstes), END_STOP = w(A.influ) + 0.1 - END, END_SPINS = 13;
tickSfx(END, iInflu, END_STOP, END_SPINS); S(END + END_STOP, 'ding');
const cucumber = ctx => emoji(ctx, '🥒', 100, -150, 80);
function nightScene(ctx, lt, t, clock = true) {
  B.kitchenNight(ctx); if (clock) clockBadge(ctx, '21:00', lt);
  const open = t > w(A.oeffnet) ? clamp((t - w(A.oeffnet)) / 0.3) : 0;
  B.fridge(ctx, 760, F, open);
  if (t > w(A.johann3)) person(ctx, 760, F + 20, { ...BUTLER, s: 1.0, t, flip: true, expr: t > w(A.befoerdert) ? 'happy' : 'smile', prop: cucumber });
  const sneak = t < w(A.oeffnet);
  person(ctx, sneak ? lerp(200, 420, clamp((t - w(A.einund)) / 2)) : 420, F + 20, { ...VEGAN, s: 1.1, t, expr: t > w(A.johann3) && t < w(A.befoerdert) ? 'shock' : t > w(A.befoerdert) ? 'happy' : 'neutral', talk: t > w(A.befoerdert) - 1.2 && t < w(A.befoerdert) + 0.3 });
  if (t < w(A.oeffnet)) emoji(ctx, '😋', 420, 700, 70);
  bubble(ctx, 'Danke, Johann. Sie sind befördert.', 440, 620, t - w(A.befoerdert) + 1.0, { size: 44, max: 460, color: '#fff7d6', dur: w(A.wuerdest) - w(A.befoerdert) + 0.8 });
}
scenes.push({ start: w(A.einund), draw: nightScene });
scenes.push({ start: w(A.wuerdest), noSlide: true, noWhoosh: true, draw(ctx, lt, t) {
  nightScene(ctx, t - w(A.einund), t);
  questionCard(ctx, 'Würdest du 1 Monat vegan leben – für 10.000 €?', lt, 400);
  commentSign(ctx, 860, 1120, t - w(A.schreib));
} });
scenes.push({ start: END, noSlide: true, draw(ctx, lt, t) {
  nightScene(ctx, t - w(A.einund), t, false);
  ctx.fillStyle = 'rgba(20,14,40,0.45)'; ctx.fillRect(0, 0, W, 620);
  const pos = roulettePos(lt, iInflu, { tStop: END_STOP, spins: END_SPINS }); const role = roleAt(pos);
  header(ctx, 'Nächstes Mal ist Richard' + art(role.name), role.name + '.', 170);
  rouletteBar(ctx, pos, 480);
  commentSign(ctx, 860, 1120, 1);
} });

run({ scenes, chunks, duration, sfx, subY: 1300, hideSubs: [[0, w(A.bedeutet) - 0.05]] });
