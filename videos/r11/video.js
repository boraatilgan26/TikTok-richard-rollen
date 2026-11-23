// Folge 11 – „Heute ist Richard ein Kommunist.“
import { W, H, OL, C, clamp, lerp, easeOut, easeInOut, bounce, box, circ, line, rr, poly, text, emoji, alpha, scaled,
  person, RICHARD, BUTLER, clockBadge, bubble, iconCard, stamp, pill, questionCard, commentSign,
  ROLES, rouletteBar, roulettePos } from '../../engine/chibi.js';
import * as B from '../../engine/bg.js';
import { setup, run } from '../../engine/timeline.js';

const F = B.FLOOR;
const { words, w, chunks, duration } = await setup('videos/r11', {
  tail: 1.4,
  capMap: {
    'Sieben Uhr.': '7 Uhr.', 'Zehn Uhr.': '10 Uhr.', 'Zwölf Uhr.': '12 Uhr.', 'Sechzehn Uhr.': '16 Uhr.', 'Einundzwanzig Uhr.': '21 Uhr.',
    'Alle dreihundert': 'Alle 300', 'vierzig Leuten': '40 Leuten', 'Achtzehnhundertsiebenundsechzig': '1867', 'vier Nachbarn': '4 Nachbarn',
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
A.bedeutet = wi('Bedeutet'); A.alles = wi('Alles', A.bedeutet); A.privat = wi('Privatbesitz', A.alles); A.chefs = wi('Chefs', A.privat);
A.sieben = wi('Sieben', A.chefs); A.teilt = wi('teilt', A.sieben); A.nachbarn = wi('Nachbarn', A.teilt); A.dreihundert = wi('dreihundert', A.nachbarn); A.bad = wi('Badezimmer', A.dreihundert);
A.zehn = wi('Zehn', A.bad); A.verkuendet = wi('verkündet', A.zehn); A.mitarbeiter = wi('Mitarbeitern', A.verkuendet); A.aktie = wi('Aktie', A.mitarbeiter); A.jubeln = wi('jubeln', A.aktie);
A.zwoelf = wi('Zwölf', A.jubeln); A.hummer = wi('Hummer', A.zwoelf); A.vierzig = wi('vierzig', A.hummer); A.beinchen = wi('Beinchen', A.vierzig);
A.sechzehn = wi('Sechzehn', A.beinchen); A.oma = wi('Oma', A.sechzehn); A.jahr = wi('Achtzehnhundert', A.oma); A.kapital = wi('Kapital', A.jahr); A.engels = wi('Friedrich', A.kapital);
A.fabrik = wi('Fabrikantensohn', A.engels); A.staunt = wi('staunt', A.fabrik); A.gesponsert = wi('gesponsert', A.staunt);
A.einund = wi('Einundzwanzig', A.gesponsert); A.bett = wi('Bett', A.einund); A.vier = wi('vier', A.bett); A.sofa = wi('Sofa', A.vier); A.decke = wi('Decke', A.sofa); A.allen = wi('allen', A.decke);
A.wuerdest = wi('Würdest', A.allen); A.schreib = wi('Schreib', A.wuerdest); A.naechstes = wi('Nächstes', A.schreib); A.mini = wi('Minimalist', A.naechstes);

const iKommu = ROLES.findIndex(r => r.name === 'Kommunist');
const iMini = ROLES.findIndex(r => r.name === 'Minimalist');
const KOMMU = { ...RICHARD, shirt: '#c83a34', tie: true, badge: '⭐' };
const flagProp = ctx => { line(ctx, 100, -100, 100, -330, '#6a4a2a', 8); box(ctx, 104, -330, 110, 70, 4, '#c83a34', 4); text(ctx, '★', 140, -296, { size: 36, color: '#ffd84a' }); };
const NEIGH = [{ hair: 'dad', hairColor: '#3a2a20', shirt: '#5fb06a' }, { hair: 'mom', hairColor: '#c88a3a', shirt: '#f0a040' }, { hair: 'dad', hairColor: '#e0c060', shirt: '#4f8fd6' }, { hair: 'mom', hairColor: '#2b2020', shirt: '#b07ad0' }, { hair: 'dad', hairColor: '#8a8a8a', shirt: '#e8742a' }];
function crowd(ctx, t, n, x0, y, s = 0.6, step = 120, expr = 'happy') { for (let i = 0; i < n; i++) person(ctx, x0 + i * step, y + (i % 2) * 30, { ...NEIGH[i % NEIGH.length], s, t, phase: i, expr, hop: expr === 'happy' && i % 2 === 0 }); }

const scenes = [];
// ---------- 0: HOOK ----------
const iWord = wi('Kommunist');
const HOOK_STOP = w(iWord) + 0.1, HOOK_SPINS = 15;
tickSfx(0, iKommu, HOOK_STOP, HOOK_SPINS); S(HOOK_STOP, 'ding'); S(HOOK_STOP + 0.5, 'hit');
scenes.push({ start: 0, draw(ctx, lt) {
  const pos = roulettePos(lt, iKommu, { tStop: HOOK_STOP, spins: HOOK_SPINS }); const role = roleAt(pos);
  B.villa(ctx, role.bg[0], role.bg[1]);
  header(ctx, 'Heute ist Richard' + art(role.name), role.name + '.');
  rouletteBar(ctx, pos, 470);
  const crash = HOOK_STOP + 0.5;
  scaled(ctx, W / 2, 650, bounce(lt, 0.15, 0.3), () => {
    box(ctx, W / 2 - 290, 590, 580, 124, 62, 'rgba(30,20,40,0.85)', 0);
    text(ctx, 'VERMÖGEN', W / 2, 622, { size: 30, color: '#ffffffaa', spacing: 5 });
    text(ctx, lt < crash ? '47.683.594 €' : 'gehört allen', W / 2, 672, { size: lt < crash ? 62 : 56, color: lt < crash ? C.gold : '#ff8a8a' });
  });
  const done = lt > HOOK_STOP;
  const look = role.name === 'Kommunist' ? { ...KOMMU, prop: flagProp } : lookFor(role.name);
  person(ctx, W / 2, 1640, { ...look, s: 1.25, t: lt, expr: 'happy' });
} });

// ---------- 1: BEDEUTET ----------
[A.alles, A.privat, A.chefs].forEach(i => S(w(i), 'pop'));
scenes.push({ start: w(A.bedeutet), subY: 1290, draw(ctx, lt, t) {
  B.sunset(ctx);
  person(ctx, W / 2, 1230, { ...KOMMU, s: 1.2, t, expr: 'happy', prop: flagProp });
  iconCard(ctx, 200, 330, 120, t - w(A.alles), { icon: '🤝', label: 'alles für alle', labelBg: '#c83a34' });
  iconCard(ctx, 540, 330, 120, t - w(A.privat), { icon: '🏰', label: 'kein Besitz', cross: true });
  iconCard(ctx, 880, 330, 120, t - w(A.chefs), { icon: '👔', label: 'keine Chefs', cross: true });
} });

// ---------- 2: 07:00 VILLA TEILEN ----------
S(w(A.nachbarn), 'whoosh'); S(w(A.dreihundert), 'pop'); S(w(A.bad), 'knock');
scenes.push({ start: w(A.sieben), draw(ctx, lt, t) {
  B.villa(ctx, '#8fd0f0', '#d8f0fa'); clockBadge(ctx, '07:00', lt);
  const n = t > w(A.nachbarn) ? Math.min(7, 1 + Math.floor((t - w(A.nachbarn)) * 5)) : 0;
  crowd(ctx, t, n, 360, 1400, 0.55, 105);
  person(ctx, 180, 1560, { ...KOMMU, s: 1.0, t, expr: 'happy', wave: t > w(A.teilt) && t < w(A.dreihundert) });
  if (t > w(A.dreihundert)) pill(ctx, 'Bewohner: 300 🏠', W / 2, 400, t - w(A.dreihundert), { bg: '#c83a34', size: 48 });
  if (t > w(A.bad)) { person(ctx, 900, 1700, { ...BUTLER, s: 0.95, t, flip: true, expr: 'shock', hop: true, prop: ctx => emoji(ctx, '🧻', 100, -140, 64) }); pill(ctx, '🚽 Warteschlange: 87', 860, 1080, t - w(A.bad), { bg: OL, size: 38 }); }
} });

// ---------- 3: 10:00 VORSTAND ----------
S(w(A.verkuendet), 'pop'); S(w(A.aktie), 'hit'); S(w(A.jubeln), 'magic');
scenes.push({ start: w(A.zehn), draw(ctx, lt, t) {
  B.boardroom(ctx); clockBadge(ctx, '10:00', lt);
  if (t > w(A.aktie)) { scaled(ctx, 300, 560, bounce(t - w(A.aktie), 0, 0.3), () => B.stockChart(ctx, 300, 560, 440, 300, (t - w(A.aktie)) / 0.8)); }
  const cheer = t > w(A.jubeln);
  crowd(ctx, t, 4, 620, F - 40, 0.62, 120, cheer ? 'happy' : 'neutral');
  B.boardTable(ctx, F);
  person(ctx, 260, F + 20, { ...KOMMU, s: 1.05, t, expr: 'happy', talk: t > w(A.verkuendet) && t < w(A.mitarbeiter) + 0.3 });
  bubble(ctx, 'Die Firma gehört jetzt euch! 🎉', 300, 600, t - w(A.verkuendet), { size: 42, max: 420, color: '#fff7d6', dur: w(A.aktie) - w(A.verkuendet) + 0.3 });
  if (cheer) for (let i = 0; i < 6; i++) emoji(ctx, '🎉', 620 + i * 80, 820 - Math.abs(Math.sin(t * 6 + i)) * 60, 50);
} });

// ---------- 4: 12:00 HUMMER TEILEN ----------
S(w(A.hummer), 'pop'); S(w(A.vierzig), 'whoosh'); S(w(A.beinchen), 'ding');
scenes.push({ start: w(A.zwoelf), draw(ctx, lt, t) {
  B.restaurant(ctx); clockBadge(ctx, '12:00', lt);
  box(ctx, 60, F - 230, 960, 40, 10, '#fff'); poly(ctx, [[60, F - 190], [1020, F - 190], [990, F - 60], [90, F - 60]], '#fff');
  if (t > w(A.hummer) && t < w(A.beinchen)) scaled(ctx, 540, F - 300, bounce(t - w(A.hummer), 0, 0.3), () => emoji(ctx, '🦞', 540, F - 300, 160));
  person(ctx, 540, F - 180, { ...KOMMU, s: 0.8, t, expr: t > w(A.beinchen) ? 'sad' : 'happy' });
  if (t > w(A.vierzig)) { crowd(ctx, t, 3, 120, F - 260, 0.5, 120, 'smile'); crowd(ctx, t, 3, 720, F - 260, 0.5, 120, 'smile'); pill(ctx, '👥 40 Leute', W / 2, 400, t - w(A.vierzig), { bg: OL, size: 46 }); }
  if (t > w(A.beinchen)) { scaled(ctx, 540, 700, bounce(t - w(A.beinchen), 0, 0.3), () => { box(ctx, 340, 620, 400, 160, 24, '#fff'); text(ctx, '1 🦞 ÷ 40', 540, 680, { size: 54, color: OL }); text(ctx, '= 1 Beinchen', 540, 745, { size: 40, color: C.red }); }); }
} });

// ---------- 5: 16:00 OMA – FAKT ----------
S(w(A.oma), 'ding'); S(w(A.jahr), 'whoosh'); S(w(A.kapital), 'pop'); S(w(A.engels), 'pop'); S(w(A.fabrik), 'coins'); S(w(A.gesponsert), 'pop');
scenes.push({ start: w(A.sechzehn), draw(ctx, lt, t) {
  B.livingRoom(ctx); clockBadge(ctx, '16:00', lt);
  B.screen(ctx, W / 2, 610, 920, 600, () => {
    const cx = W / 2, cy = 610;
    if (t < w(A.jahr)) {
      ctx.fillStyle = '#f6e6d6'; ctx.fillRect(cx - 460, cy - 300, 920, 600);
      box(ctx, cx - 444, cy - 284, 888, 60, 0, '#fff', 0); text(ctx, 'Oma · Videoanruf', cx - 220, cy - 254, { size: 32, color: OL });
      box(ctx, cx + 300, cy - 274, 100, 40, 10, C.red, 0); text(ctx, 'LIVE', cx + 350, cy - 253, { size: 28, color: '#fff' });
      person(ctx, cx, cy + 430, { hair: 'grandma', glasses: true, shirt: '#b07ad0', t, s: 1.05, wave: true });
    } else if (t < w(A.engels)) {
      // Buch
      box(ctx, cx - 340, cy - 150, 240, 300, 10, '#8a2a2a'); text(ctx, 'DAS', cx - 220, cy - 60, { size: 40, color: C.gold }); text(ctx, 'KAPITAL', cx - 220, cy, { size: 40, color: C.gold }); text(ctx, 'Karl Marx', cx - 220, cy + 70, { size: 26, color: '#fff' });
      scaled(ctx, cx + 200, cy, bounce(t - w(A.jahr) - 0.3, 0, 0.3), () => text(ctx, '1867', cx + 200, cy, { size: 140, color: C.gold }));
    } else {
      circ(ctx, cx - 250, cy - 20, 120, '#fff'); person(ctx, cx - 250, cy + 210, { hair: 'dad', hairColor: '#6a4026', mustache: true, shirt: '#3a3a44', s: 0.5, t });
      box(ctx, cx - 390, cy + 120, 280, 50, 10, C.gold, 0); text(ctx, 'Friedrich Engels', cx - 250, cy + 146, { size: 28, color: OL });
      text(ctx, 'finanziert Marx', cx + 170, cy - 60, { size: 50, color: '#fff' });
      if (t > w(A.fabrik)) { emoji(ctx, '🏭💰', cx + 170, cy + 40, 90); text(ctx, 'Fabrikantensohn', cx + 170, cy + 140, { size: 44, color: C.gold }); }
    }
  });
  person(ctx, 220, F + 30, { ...KOMMU, s: 1.05, t, look: 0.6, expr: t > w(A.staunt) ? 'wow' : 'smile' });
  if (t > w(A.gesponsert)) stamp(ctx, 'GESPONSERT', 260, 840, t - w(A.gesponsert), { size: 50, color: C.gold });
} });

// ---------- 6–8: 21:00 BETT VOLL, FRAGE, NÄCHSTE ROLLE ----------
S(w(A.bett), 'pop'); S(w(A.vier), 'pop'); S(w(A.sofa), 'whoosh'); S(w(A.decke), 'pop'); S(w(A.allen), 'ding'); S(w(A.wuerdest), 'ding'); S(w(A.schreib), 'pop');
const END = w(A.naechstes), END_STOP = w(A.mini) + 0.1 - END, END_SPINS = 13;
tickSfx(END, iMini, END_STOP, END_SPINS); S(END + END_STOP, 'ding');
function nightScene(ctx, lt, t, clock = true) {
  B.livingRoom(ctx, true); if (clock) clockBadge(ctx, '21:00', lt);
  const onSofa = t > w(A.sofa);
  if (!onSofa) {
    // Bett mit 4 Nachbarn
    box(ctx, 120, F - 260, 840, 170, 30, '#6a5a9a'); box(ctx, 120, F - 100, 30, 100, 6, '#3a2a4a'); box(ctx, 930, F - 100, 30, 100, 6, '#3a2a4a');
    if (t > w(A.vier)) for (let i = 0; i < 4; i++) person(ctx, 260 + i * 180, F - 150, { ...NEIGH[i], s: 0.55, t, expr: 'sleep', phase: i });
    box(ctx, 140, F - 300, 800, 110, 30, '#8a7ac0');
    person(ctx, 100, F + 20, { ...KOMMU, s: 0.95, t, expr: t > w(A.vier) ? 'shock' : 'neutral' });
  } else {
    B.sofa(ctx, 420, F + 30, '#c83a34');
    person(ctx, 420, F - 60, { ...KOMMU, s: 0.95, t, expr: 'sleep', tilt: 0.25 });
    if (t > w(A.decke)) { B.blanket(ctx, 420, F - 170, 360, 140); person(ctx, 860, F + 20, { ...BUTLER, s: 1.0, t, flip: true, expr: 'smile' }); }
    if (t > w(A.allen)) pill(ctx, 'Eigentum: alle ⭐', 420, 780, t - w(A.allen), { bg: '#c83a34', size: 42 });
  }
}
scenes.push({ start: w(A.einund), draw: nightScene });
scenes.push({ start: w(A.wuerdest), noSlide: true, noWhoosh: true, draw(ctx, lt, t) {
  nightScene(ctx, t - w(A.einund), t);
  questionCard(ctx, 'Würdest du dein Zuhause mit allen teilen?', lt, 400);
  commentSign(ctx, 860, 1120, t - w(A.schreib));
} });
scenes.push({ start: END, noSlide: true, draw(ctx, lt, t) {
  nightScene(ctx, t - w(A.einund), t, false);
  ctx.fillStyle = 'rgba(20,14,40,0.55)'; ctx.fillRect(0, 0, W, 620);
  const pos = roulettePos(lt, iMini, { tStop: END_STOP, spins: END_SPINS }); const role = roleAt(pos);
  header(ctx, 'Nächstes Mal ist Richard' + art(role.name), role.name + '.', 170);
  rouletteBar(ctx, pos, 480);
  commentSign(ctx, 860, 1120, 1);
} });

run({ scenes, chunks, duration, sfx, subY: 1300, hideSubs: [[0, w(A.bedeutet) - 0.05]] });
