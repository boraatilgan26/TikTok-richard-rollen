// Folge 10 – „Heute ist Richard ein Prepper.“
import { W, H, OL, C, clamp, lerp, easeOut, easeInOut, bounce, box, circ, line, rr, poly, text, emoji, alpha, scaled,
  person, RICHARD, BUTLER, clockBadge, bubble, iconCard, stamp, pill, questionCard, commentSign,
  ROLES, rouletteBar, roulettePos } from '../../engine/chibi.js';
import * as B from '../../engine/bg.js';
import { setup, run } from '../../engine/timeline.js';

const F = B.FLOOR;
const { words, w, chunks, duration } = await setup('videos/r10', {
  tail: 1.4,
  capMap: {
    'Sieben Uhr.': '7 Uhr.', 'Zehn Uhr.': '10 Uhr.', 'Zwölf Uhr.': '12 Uhr.', 'Sechzehn Uhr.': '16 Uhr.', 'Einundzwanzig Uhr.': '21 Uhr.',
    'Zweitausend Dosen': '2.000 Dosen', 'eine Dose': '1 Dose', 'drei Minuten': '3 Minuten', 'neunzehnhundertsechzig': '1960',
    'siebzehn Kilometer': '17 Kilometer', 'dreitausend Menschen': '3.000 Menschen',
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
A.bedeutet = wi('Bedeutet'); A.vorraete = wi('Vorräte', A.bedeutet); A.bunker1 = wi('Bunker', A.vorraete); A.bereit = wi('bereit', A.bunker1);
A.sieben = wi('Sieben', A.bereit); A.kauft = wi('kauft', A.sieben); A.dosen = wi('Dosen', A.kauft); A.kaviar = wi('Kaviar', A.dosen); A.ernst = wi('Ernstfall', A.kaviar);
A.zehn = wi('Zehn', A.ernst); A.baut = wi('baut', A.zehn); A.whirl = wi('Whirlpool', A.baut); A.wein = wi('Weinkeller', A.whirl); A.kino = wi('Kino', A.wein); A.fragt = wi('fragt', A.kino); A.hund = wi('Hundehütte', A.fragt);
A.zwoelf = wi('Zwölf', A.hund); A.alarm = wi('Probealarm', A.zwoelf); A.rennt = wi('rennt', A.alarm); A.minuten = wi('Minuten', A.rennt); A.drin = wi('drin', A.minuten); A.kaffee = wi('Kaffee', A.drin);
A.sechzehn = wi('Sechzehn', A.kaffee); A.oma = wi('Oma', A.sechzehn); A.ahrtal = wi('Ahrtal', A.oma); A.bau = wi('Bau', A.ahrtal); A.km = wi('Kilometer', A.bau); A.menschen = wi('Menschen', A.km);
A.nie = wi('nie', A.menschen); A.museum = wi('Museum', A.nie); A.staunt = wi('staunt', A.museum); A.whirl2 = wi('Whirlpool', A.staunt);
A.einund = wi('Einundzwanzig', A.whirl2); A.hunger = wi('Hunger', A.einund); A.greift = wi('greift', A.hunger); A.dosen2 = wi('Dosen', A.greift); A.oeffner = wi('Dosenöffner', A.dosen2 + 1);
A.wuerdest = wi('Würdest', A.oeffner); A.schreib = wi('Schreib', A.wuerdest); A.naechstes = wi('Nächstes', A.schreib); A.kommu = wi('Kommunist', A.naechstes);

const iPrepper = ROLES.findIndex(r => r.name === 'Prepper');
const iKommu = ROLES.findIndex(r => r.name === 'Kommunist');
const PREP = { ...RICHARD, shirt: '#6a7a3a', pants: '#5a6a3a', tie: true, badge: '🥫', shoes: '#3a3020' };
const canProp = ctx => { box(ctx, 72, -200, 50, 76, 8, '#c8ccd4', 4); box(ctx, 72, -184, 50, 34, 0, '#e8504a', 0); };

const scenes = [];
// ---------- 0: HOOK ----------
const iWord = wi('Prepper');
const HOOK_STOP = w(iWord) + 0.1, HOOK_SPINS = 15;
tickSfx(0, iPrepper, HOOK_STOP, HOOK_SPINS); S(HOOK_STOP, 'bass');
scenes.push({ start: 0, draw(ctx, lt) {
  const pos = roulettePos(lt, iPrepper, { tStop: HOOK_STOP, spins: HOOK_SPINS }); const role = roleAt(pos);
  B.villa(ctx, role.bg[0], role.bg[1]);
  header(ctx, 'Heute ist Richard' + art(role.name), role.name + '.');
  rouletteBar(ctx, pos, 470);
  scaled(ctx, W / 2, 650, bounce(lt, 0.15, 0.3), () => {
    box(ctx, W / 2 - 290, 590, 580, 124, 62, 'rgba(30,20,40,0.85)', 0);
    text(ctx, 'VERMÖGEN', W / 2, 622, { size: 30, color: '#ffffffaa', spacing: 5 });
    text(ctx, '47.683.594 €', W / 2, 672, { size: 62, color: C.gold });
  });
  const done = lt > HOOK_STOP;
  const look = role.name === 'Prepper' ? { ...PREP, prop: canProp } : lookFor(role.name);
  person(ctx, W / 2, 1640, { ...look, s: 1.25, t: lt, expr: done ? 'neutral' : 'happy' });
  if (done) stamp(ctx, '⚠️ BEREIT FÜR ALLES', W / 2, 860, lt - HOOK_STOP - 0.2, { size: 50, rot: -0.08, color: '#6a7a3a' });
} });

// ---------- 1: BEDEUTET ----------
[A.vorraete, A.bunker1, A.bereit].forEach(i => S(w(i), 'pop'));
scenes.push({ start: w(A.bedeutet), subY: 1290, draw(ctx, lt, t) {
  B.sunset(ctx);
  person(ctx, W / 2, 1230, { ...PREP, s: 1.2, t, expr: 'neutral', prop: canProp });
  iconCard(ctx, 200, 330, 120, t - w(A.vorraete), { icon: '🥫', label: 'Vorräte', labelBg: '#6a7a3a' });
  iconCard(ctx, 540, 330, 120, t - w(A.bunker1), { icon: '🚪', label: 'Bunker', labelBg: '#6a7a3a' });
  iconCard(ctx, 880, 330, 120, t - w(A.bereit), { icon: '🔦', label: 'immer bereit', labelBg: '#6a7a3a' });
} });

// ---------- 2: 07:00 NOTVORRÄTE ----------
S(w(A.dosen), 'coins'); S(w(A.kaviar), 'pop'); S(w(A.ernst), 'ding');
scenes.push({ start: w(A.sieben), draw(ctx, lt, t) {
  B.garage(ctx); clockBadge(ctx, '07:00', lt);
  const n = t > w(A.dosen) ? Math.min(30, Math.floor((t - w(A.dosen)) * 25)) : 0;
  B.cans(ctx, 520, F + 10, n, 1);
  if (t > w(A.dosen)) pill(ctx, `Ravioli: ${Math.min(2000, Math.floor((t - w(A.dosen)) * 900))} / 2.000`, 700, 620, t - w(A.dosen), { bg: C.red, size: 40 });
  if (t > w(A.kaviar)) { scaled(ctx, 380, 860, bounce(t - w(A.kaviar), 0, 0.3), () => { box(ctx, 330, 820, 100, 70, 10, C.gold); text(ctx, 'KAVIAR', 380, 855, { size: 20, color: OL }); }); }
  person(ctx, 230, F + 20, { ...PREP, s: 1.1, t, expr: t > w(A.ernst) ? 'happy' : 'neutral' });
  if (t > w(A.ernst)) pill(ctx, 'für den Ernstfall 🚨', 380, 760, t - w(A.ernst), { bg: OL, size: 36 });
} });

// ---------- 3: 10:00 LUXUSBUNKER ----------
S(w(A.baut), 'knock'); S(w(A.whirl), 'pop'); S(w(A.wein), 'pop'); S(w(A.kino), 'pop'); S(w(A.hund), 'hit');
scenes.push({ start: w(A.zehn), draw(ctx, lt, t) {
  B.bunker(ctx); clockBadge(ctx, '10:00', lt);
  pill(ctx, '🏗️ BUNKER IM GARTEN', W / 2, 380, lt - 0.1, { bg: '#6a7a3a', size: 44 });
  if (t > w(A.whirl)) iconCard(ctx, 200, 560, 90, t - w(A.whirl), { icon: '🛁', label: 'Whirlpool', labelBg: '#3a8ad8' });
  if (t > w(A.wein)) iconCard(ctx, 440, 560, 90, t - w(A.wein), { icon: '🍷', label: 'Weinkeller', labelBg: '#8a2a3a' });
  if (t > w(A.kino)) iconCard(ctx, 680, 560, 90, t - w(A.kino), { icon: '🎬', label: 'Kino', labelBg: '#222' });
  person(ctx, 280, F + 20, { ...PREP, s: 1.1, t, expr: 'happy' });
  person(ctx, 780, F + 20, { ...BUTLER, s: 1.05, t, flip: true, expr: t > w(A.hund) ? 'sad' : 'neutral', talk: t > w(A.fragt) && t < w(A.hund) - 0.5 });
  bubble(ctx, 'Und wo schlafe ich?', 780, 860, t - w(A.fragt) - 0.2, { size: 42, max: 380, dur: w(A.hund) - w(A.fragt) + 0.2 });
  if (t > w(A.hund)) { scaled(ctx, 560, 1000, bounce(t - w(A.hund), 0, 0.3), () => emoji(ctx, '🐶🏠', 560, 1000, 110)); }
} });

// ---------- 4: 12:00 PROBEALARM ----------
S(w(A.alarm), 'rise'); S(w(A.rennt), 'whoosh'); S(w(A.drin), 'hit'); S(w(A.kaffee), 'ding');
scenes.push({ start: w(A.zwoelf), draw(ctx, lt, t) {
  B.bunker(ctx); clockBadge(ctx, '12:00', lt);
  if (Math.floor(t * 4) % 2 && t < w(A.drin)) { ctx.fillStyle = 'rgba(232,40,40,0.25)'; ctx.fillRect(0, 0, W, H); }
  pill(ctx, '🚨 PROBEALARM', W / 2, 380, lt - 0.1, { bg: C.red, size: 50 });
  const inside = t > w(A.minuten);
  const x = inside ? 360 : lerp(-200, 360, clamp((t - w(A.rennt)) / 1.2));
  person(ctx, x, F + 20, { ...PREP, s: 1.1, t, expr: t > w(A.drin) ? 'shock' : 'neutral', hop: !inside && t > w(A.rennt) });
  if (t > w(A.minuten)) pill(ctx, '⏱ 3:00', 360, 620, t - w(A.minuten), { bg: OL, size: 46 });
  if (t > w(A.drin) - 0.2) person(ctx, 760, F + 20, { ...BUTLER, s: 1.05, t, flip: true, expr: 'happy', prop: ctx => emoji(ctx, '☕', 100, -140, 64) });
  if (t > w(A.kaffee)) bubble(ctx, 'Kaffee, Sir? ☕', 760, 640, t - w(A.kaffee), { size: 44 });
} });

// ---------- 5: 16:00 OMA – FAKT ----------
S(w(A.oma), 'ding'); S(w(A.ahrtal), 'whoosh'); S(w(A.bau), 'pop'); S(w(A.km), 'pop'); S(w(A.menschen), 'pop'); S(w(A.museum), 'magic'); S(w(A.whirl2), 'pop');
scenes.push({ start: w(A.sechzehn), draw(ctx, lt, t) {
  B.bunker(ctx); clockBadge(ctx, '16:00', lt);
  B.screen(ctx, W / 2, 610, 920, 600, () => {
    const cx = W / 2, cy = 610;
    if (t < w(A.ahrtal)) {
      ctx.fillStyle = '#f6e6d6'; ctx.fillRect(cx - 460, cy - 300, 920, 600);
      box(ctx, cx - 444, cy - 284, 888, 60, 0, '#fff', 0); text(ctx, 'Oma · Videoanruf', cx - 220, cy - 254, { size: 32, color: OL });
      box(ctx, cx + 300, cy - 274, 100, 40, 10, C.red, 0); text(ctx, 'LIVE', cx + 350, cy - 253, { size: 28, color: '#fff' });
      person(ctx, cx, cy + 430, { hair: 'grandma', glasses: true, shirt: '#b07ad0', t, s: 1.05, wave: true });
    } else if (t < w(A.bau)) {
      box(ctx, cx - 350, cy - 100, 300, 67, 0, '#111', 0); box(ctx, cx - 350, cy - 33, 300, 67, 0, '#dd0000', 0); box(ctx, cx - 350, cy + 34, 300, 66, 0, '#ffce00', 0); box(ctx, cx - 350, cy - 100, 300, 200, 6, null);
      text(ctx, 'Ahrtal', cx - 200, cy + 150, { size: 40, color: '#fff' });
      scaled(ctx, cx + 210, cy, bounce(t - w(A.ahrtal) - 0.4, 0, 0.3), () => text(ctx, '1960', cx + 210, cy, { size: 140, color: C.gold }));
    } else if (t < w(A.nie)) {
      text(ctx, 'GEHEIMER REGIERUNGSBUNKER', cx, cy - 220, { size: 38, color: '#fff' });
      // Tunnel-Linie
      const k = clamp((t - w(A.bau)) / 1.5);
      box(ctx, cx - 380, cy - 60, 760 * k, 60, 30, '#7a8088', 0);
      if (t > w(A.km)) text(ctx, '> 17 km', cx, cy + 50, { size: 80, color: C.gold });
      if (t > w(A.menschen)) text(ctx, '👥 3.000 Menschen', cx, cy + 170, { size: 54, color: '#fff' });
    } else {
      text(ctx, 'nie benutzt', cx, cy - 120, { size: 70, color: '#ffffffcc' });
      if (t > w(A.museum)) scaled(ctx, cx, cy + 40, bounce(t - w(A.museum), 0, 0.3), () => text(ctx, '🏛️ heute Museum', cx, cy + 40, { size: 80, color: C.gold }));
    }
  });
  person(ctx, 220, F + 30, { ...PREP, s: 1.05, t, look: 0.6, expr: t > w(A.staunt) ? 'wow' : 'neutral' });
  bubble(ctx, 'Meiner hat wenigstens einen Whirlpool. 🛁', 320, 860, t - w(A.whirl2) + 1.0, { size: 40, max: 420, color: '#fff7d6' });
} });

// ---------- 6–8: 21:00 KEIN DOSENÖFFNER, FRAGE, NÄCHSTE ROLLE ----------
S(w(A.hunger), 'pop'); S(w(A.greift), 'pop'); S(w(A.oeffner), 'hit'); S(w(A.wuerdest), 'ding'); S(w(A.schreib), 'pop');
const END = w(A.naechstes), END_STOP = w(A.kommu) + 0.1 - END, END_SPINS = 13;
tickSfx(END, iKommu, END_STOP, END_SPINS); S(END + END_STOP, 'ding');
function nightScene(ctx, lt, t, clock = true) {
  B.bunker(ctx, true); if (clock) clockBadge(ctx, '21:00', lt);
  B.cans(ctx, 560, F + 10, 30, 0.9);
  const grab = t > w(A.greift);
  person(ctx, 280, F + 20, { ...PREP, s: 1.1, t, expr: t > w(A.oeffner) ? 'sad' : t > w(A.hunger) ? 'neutral' : 'sleep', prop: grab ? canProp : null });
  if (t > w(A.hunger) && !grab) emoji(ctx, '🤤', 380, 700, 70);
  if (t > w(A.oeffner)) { stamp(ctx, 'KEIN DOSENÖFFNER', W / 2, 600, t - w(A.oeffner), { size: 54 }); }
}
scenes.push({ start: w(A.einund), draw: nightScene });
scenes.push({ start: w(A.wuerdest), noSlide: true, noWhoosh: true, draw(ctx, lt, t) {
  nightScene(ctx, t - w(A.einund), t);
  questionCard(ctx, 'Würdest du dir einen Bunker bauen?', lt, 400);
  commentSign(ctx, 860, 1120, t - w(A.schreib));
} });
scenes.push({ start: END, noSlide: true, draw(ctx, lt, t) {
  nightScene(ctx, t - w(A.einund), t, false);
  ctx.fillStyle = 'rgba(20,14,40,0.55)'; ctx.fillRect(0, 0, W, 620);
  const pos = roulettePos(lt, iKommu, { tStop: END_STOP, spins: END_SPINS }); const role = roleAt(pos);
  header(ctx, 'Nächstes Mal ist Richard' + art(role.name), role.name + '.', 170);
  rouletteBar(ctx, pos, 480);
  commentSign(ctx, 860, 1120, 1);
} });

run({ scenes, chunks, duration, sfx, subY: 1300, hideSubs: [[0, w(A.bedeutet) - 0.05]] });
