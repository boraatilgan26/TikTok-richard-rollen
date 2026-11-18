// Folge 2 – „Heute ist Richard ein Psychopath.“
import { W, H, OL, C, clamp, lerp, easeOut, easeInOut, bounce, box, circ, line, text, emoji, alpha, scaled,
  person, RICHARD, BUTLER, clockBadge, bubble, iconCard, stamp, pill, questionCard, commentSign,
  ROLES, rouletteBar, roulettePos } from '../../engine/chibi.js';
import * as B from '../../engine/bg.js';
import { setup, run } from '../../engine/timeline.js';

const F = B.FLOOR;
const { words, w, chunks, duration } = await setup('videos/r02', {
  tail: 1.4,
  capMap: {
    'Sieben Uhr.': '7 Uhr.', 'Neun Uhr.': '9 Uhr.', 'Zwölf Uhr.': '12 Uhr.', 'Sechzehn Uhr.': '16 Uhr.', 'Einundzwanzig Uhr.': '21 Uhr.',
    'zwanzig Prozent': '20 %', 'zweitausendelf': '2011', 'Platz fünf': 'Platz 5', 'Platz vier': 'Platz 4', 'Platz drei': 'Platz 3',
    'Platz zwei': 'Platz 2', 'Platz eins': 'Platz 1',
  },
});
// Wortindex per Text finden (robust gegen Transkriptions-Abweichungen)
const norm = s => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, '');
function wi(word, after = 0) { const n = norm(word); for (let i = after; i < words.length; i++) if (norm(words[i].w).startsWith(n)) return i; return after; }
const sfx = []; const S = (t, type) => sfx.push({ t, type });

// Anker
const A = {};
A.bedeutet = wi('Bedeutet'); A.angst = wi('Angst', A.bedeutet); A.mitleid = wi('Mitleid', A.angst); A.charmant = wi('charmant', A.mitleid);
A.sieben = wi('Sieben', A.charmant); A.johann1 = wi('Johann', A.sieben); A.fallen = wi('fallen', A.johann1); A.laechelt = wi('lächelt', A.fallen); A.gefeuert = wi('gefeuert', A.laechelt);
A.neun = wi('Neun', A.gefeuert); A.aktie = wi('Aktie', A.neun); A.schwitzen = wi('schwitzen', A.aktie); A.apfel = wi('Apfel', A.schwitzen);
A.zwoelf = wi('Zwölf', A.apfel); A.kellner = wi('Kellner', A.zwoelf); A.fragt = wi('fragt', A.kellner); A.preis = wi('inbegriffen', A.fragt);
A.sechzehn = wi('Sechzehn', A.preis); A.oma = wi('Oma', A.sechzehn); A.gb = wi('Großbritannien', A.oma); A.dutton = wi('Kevin', A.gb); A.berufe = wi('Berufe', A.dutton);
A.p5 = wi('fünf', A.berufe); A.p4 = wi('vier', A.p5); A.p3 = wi('drei', A.p4); A.p2 = wi('zwei', A.p3); A.p1 = wi('eins', A.p2); A.ceo2 = wi('ist', A.p1); A.legt = wi('legt', A.ceo2);
A.einund = wi('Einundzwanzig', A.legt); A.versteckt = wi('versteckt', A.einund); A.popcorn = wi('Popcorn', A.versteckt); A.gaehnt = wi('gähnt', A.popcorn);
A.stellt = wi('stellt', A.gaehnt); A.gehalt = wi('Gehalt', A.stellt); A.waerst = wi('Wärst', A.gehalt); A.schreib = wi('Schreib', A.waerst);
A.naechstes = wi('Nächstes', A.schreib); A.veganer = wi('Veganer', A.naechstes);

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

const scenes = [];
// ---------- 0: HOOK ----------
const iWordPsy = wi('Psychopath');
const HOOK_STOP = w(iWordPsy) + 0.1, HOOK_SPINS = 15;
tickSfx(0, iPsycho, HOOK_STOP, HOOK_SPINS); S(HOOK_STOP, 'ding');
scenes.push({ start: 0, draw(ctx, lt) {
  const pos = roulettePos(lt, iPsycho, { tStop: HOOK_STOP, spins: HOOK_SPINS }); const role = roleAt(pos);
  B.villa(ctx, role.bg[0], role.bg[1]);
  header(ctx, 'Heute ist Richard' + art(role.name), role.name + '.');
  rouletteBar(ctx, pos, 470);
  const k = bounce(lt, 0.15, 0.3);
  scaled(ctx, W / 2, 650, k, () => {
    box(ctx, W / 2 - 290, 590, 580, 124, 62, 'rgba(30,20,40,0.85)', 0);
    text(ctx, 'VERMÖGEN', W / 2, 622, { size: 30, color: '#ffffffaa', spacing: 5 });
    text(ctx, '47.683.594 €', W / 2, 672, { size: 62, color: C.gold });
  });
  const done = lt > HOOK_STOP;
  const sq = done ? 1 + Math.sin(clamp((lt - HOOK_STOP) / 0.25) * Math.PI) * 0.06 : 1;
  scaled(ctx, W / 2, 1640, sq, () => person(ctx, W / 2, 1640, { ...lookFor(role.name), s: 1.25, t: lt, expr: done ? 'smile' : 'happy', look: done ? 0.5 : 0 }));
  if (done) stamp(ctx, 'KEINE GEFÜHLE', W / 2, 860, lt - HOOK_STOP - 0.2, { size: 56, rot: -0.08 });
} });

// ---------- 1: BEDEUTET ----------
[A.angst, A.mitleid, A.charmant].forEach(i => S(w(i), 'pop'));
scenes.push({ start: w(A.bedeutet), subY: 1290, draw(ctx, lt, t) {
  B.sunset(ctx);
  person(ctx, W / 2, 1230, { ...PSYCHO, s: 1.2, t, expr: t > w(A.charmant) ? 'happy' : 'neutral' });
  iconCard(ctx, 200, 330, 120, t - w(A.angst), { icon: '😱', label: 'keine Angst', cross: true });
  iconCard(ctx, 540, 330, 120, t - w(A.mitleid), { icon: '🥺', label: 'kein Mitleid', cross: true });
  iconCard(ctx, 880, 330, 120, t - w(A.charmant), { icon: '😎', label: 'immer charmant', labelBg: '#c99a1e' });
} });

// ---------- 2: 07:00 FRÜHSTÜCK ----------
S(w(A.fallen), 'hit'); S(w(A.laechelt), 'pop'); S(w(A.gefeuert), 'bass');
scenes.push({ start: w(A.sieben), draw(ctx, lt, t) {
  B.diningRoom(ctx); clockBadge(ctx, '07:00', lt);
  B.longTable(ctx, F);
  const dropped = t > w(A.fallen);
  person(ctx, 300, F + 20, { ...PSYCHO, s: 1.12, t, expr: t > w(A.laechelt) ? 'happy' : 'smile', talk: t > w(A.laechelt) && t < w(A.gefeuert) + 0.4 });
  person(ctx, 780, F + 20, { ...BUTLER, s: 1.12, t, flip: true, expr: t > w(A.gefeuert) ? 'sad' : dropped ? 'shock' : 'smile',
    prop: dropped ? null : (ctx => { box(ctx, 50, -150, 120, 16, 6, '#c0c0c8', 5); ell2(ctx); }) });
  if (dropped) { B.brokenPlates(ctx, 760, F + 40); stamp(ctx, 'KLIRR!', 760, 760, t - w(A.fallen), { size: 60 }); }
  bubble(ctx, 'Kein Problem, Johann. 🙂', 320, 600, t - w(A.laechelt), { size: 46, color: '#fff7d6', dur: w(A.gefeuert) - w(A.laechelt) - 0.1 });
  bubble(ctx, 'Sie sind gefeuert.', 320, 600, t - w(A.gefeuert) + 0.6, { size: 52, color: '#fff7d6' });
} });
function ell2(ctx) { circ(ctx, 110, -164, 28, '#fff', 5); }

// ---------- 3: 09:00 VORSTAND ----------
S(w(A.aktie), 'hit'); S(w(A.schwitzen), 'pop'); S(w(A.apfel), 'pop');
const appleProp = ctx => emoji(ctx, '🍎', 96, -140, 70);
scenes.push({ start: w(A.neun), draw(ctx, lt, t) {
  B.boardroom(ctx); clockBadge(ctx, '09:00', lt);
  if (t > w(A.aktie)) {
    scaled(ctx, W / 2, 560, bounce(t - w(A.aktie), 0, 0.3), () => B.stockChart(ctx, W / 2, 560, 760, 380, (t - w(A.aktie)) / 0.9));
    stamp(ctx, '−20 %', 800, 450, t - w(A.aktie) - 0.6, { size: 70 });
  }
  const sweat = t > w(A.schwitzen);
  for (const [x, hc] of [[160, '#3a2a20'], [920, '#6b4026']]) {
    person(ctx, x, F - 40, { hair: 'dad', hairColor: hc, shirt: '#5a6a8a', pants: '#333', tie: false, s: 0.85, t, expr: sweat ? 'shock' : 'neutral', phase: x, flip: x > 500 });
    if (sweat) { emoji(ctx, '💦', x + 80, F - 470 + Math.sin(t * 8 + x) * 8, 56); }
  }
  B.boardTable(ctx, F);
  person(ctx, W / 2, F + 20, { ...PSYCHO, s: 1.12, t, expr: t > w(A.apfel) ? 'happy' : 'smile', prop: t > w(A.apfel) - 0.3 ? appleProp : null });
} });

// ---------- 4: 12:00 RESTAURANT ----------
S(w(A.kellner), 'pop'); S(w(A.fragt), 'pop');
scenes.push({ start: w(A.zwoelf), draw(ctx, lt, t) {
  B.restaurant(ctx); clockBadge(ctx, '12:00', lt);
  person(ctx, 800, F + 20, { hair: 'dad', hairColor: '#2b2020', shirt: '#fff', pants: '#222', mustache: true, s: 1.05, t, flip: true, expr: t > w(A.kellner) ? 'sad' : 'smile' });
  if (t > w(A.kellner)) for (const sx of [-1, 1]) { const y = 960 + ((t * 300) % 140); circ(ctx, 800 - sx * 42, y, 11, '#7ac8f0', 0); }
  person(ctx, 300, F + 20, { ...PSYCHO, s: 1.12, t, talk: t > w(A.fragt) && t < w(A.preis) + 0.4 });
  B.dinnerTable(ctx, 330, F + 20);
  bubble(ctx, 'Ist das im Preis inbegriffen?', 330, 600, t - w(A.fragt) - 0.2, { size: 48, max: 460, color: '#fff7d6' });
} });

// ---------- 5: 16:00 OMA – FAKT ----------
S(w(A.oma), 'ding'); S(w(A.gb), 'whoosh'); S(w(A.dutton), 'pop'); [A.p5, A.p4, A.p3, A.p2].forEach(i => S(w(i), 'pop')); S(w(A.p1), 'bass'); S(w(A.legt), 'knock');
const LIST = [['Chirurg', A.p5], ['Verkäufer', A.p4], ['TV-Moderator', A.p3], ['Anwalt', A.p2], ['CEO', A.p1]];
scenes.push({ start: w(A.sechzehn), draw(ctx, lt, t) {
  B.livingRoom(ctx); clockBadge(ctx, '16:00', lt);
  const hung = t > w(A.legt) + 0.3;
  B.screen(ctx, W / 2, 610, 920, 600, () => {
    const cx = W / 2, cy = 610;
    if (hung) { text(ctx, 'Anruf beendet', cx, cy, { size: 60, color: '#ffffff88' }); return; }
    if (t < w(A.gb)) {
      ctx.fillStyle = '#f6e6d6'; ctx.fillRect(cx - 460, cy - 300, 920, 600);
      box(ctx, cx - 444, cy - 284, 888, 60, 0, '#fff', 0); text(ctx, 'Oma · Videoanruf', cx - 220, cy - 254, { size: 32, color: OL });
      box(ctx, cx + 300, cy - 274, 100, 40, 10, C.red, 0); text(ctx, 'LIVE', cx + 350, cy - 253, { size: 28, color: '#fff' });
      person(ctx, cx, cy + 430, { hair: 'grandma', glasses: true, shirt: '#b07ad0', t, s: 1.05, wave: true });
    } else if (t < w(A.dutton)) {
      B.ukFlag(ctx, cx - 200, cy, 300);
      scaled(ctx, cx + 220, cy, bounce(t - w(A.gb) - 0.4, 0, 0.3), () => text(ctx, '2011', cx + 220, cy, { size: 140, color: C.gold }));
    } else if (t < w(A.p5) - 0.2) {
      circ(ctx, cx - 250, cy - 20, 110, '#fff'); person(ctx, cx - 250, cy + 200, { hair: 'dad', hairColor: '#6a6a6a', glasses: true, shirt: '#4a6a9a', s: 0.5, t });
      box(ctx, cx - 360, cy + 110, 220, 50, 10, C.gold, 0); text(ctx, 'Kevin Dutton', cx - 250, cy + 136, { size: 30, color: OL });
      text(ctx, 'Welche Berufe', cx + 160, cy - 60, { size: 54, color: '#fff' }); text(ctx, 'haben die meisten', cx + 160, cy + 10, { size: 54, color: '#fff' }); text(ctx, 'Psychopathen?', cx + 160, cy + 80, { size: 54, color: C.gold });
    } else {
      text(ctx, 'MEISTE PSYCHOPATHEN', cx, cy - 245, { size: 32, color: '#ffffffcc', spacing: 3 });
      LIST.forEach(([name, i], k) => {
        const rank = 5 - k, y = cy + 210 - k * 95;
        if (t < w(i) - 0.05) return;
        const isTop = rank === 1;
        scaled(ctx, cx, y, bounce(t - w(i), 0, 0.25), () => {
          box(ctx, cx - 330, y - 38, 660, 76, 20, isTop ? C.gold : '#ffffff22', 0);
          text(ctx, rank + '.', cx - 270, y + 2, { size: 48, color: isTop ? OL : C.gold });
          text(ctx, name, cx + 20, y + 2, { size: 52, color: isTop ? OL : '#fff' });
        });
      });
    }
  });
  const isCEO = t > w(A.ceo2);
  person(ctx, 220, F + 30, { ...PSYCHO, s: 1.05, t, look: 0.6, expr: isCEO ? 'happy' : 'smile' });
  if (isCEO) pill(ctx, 'CEO 👔', 220, 760, t - w(A.ceo2), { bg: C.gold, color: OL, size: 46 });
} });

// ---------- 6–8: 21:00 HORRORFILM, FRAGE, NÄCHSTE ROLLE ----------
S(w(A.versteckt), 'pop'); S(w(A.popcorn), 'pop'); S(w(A.stellt), 'coins'); S(w(A.waerst), 'ding'); S(w(A.schreib), 'pop');
const END = w(A.naechstes), END_STOP = w(A.veganer) + 0.1 - END, END_SPINS = 13;
tickSfx(END, iVegan, END_STOP, END_SPINS); S(END + END_STOP, 'ding');
const popcorn = ctx => emoji(ctx, '🍿', 96, -140, 74);
function nightScene(ctx, lt, t, clock = true) {
  B.livingRoom(ctx, true); if (clock) clockBadge(ctx, '21:00', lt);
  // TV mit Geist
  B.screen(ctx, W / 2, 620, 760, 440, () => { ctx.fillStyle = '#10101a'; ctx.fillRect(0, 0, W, H); emoji(ctx, '👻', W / 2, 620 + Math.sin(t * 3) * 14, 200); });
  const hide = t > w(A.versteckt);
  const rehired = t > w(A.stellt);
  // Johann hinter dem Sofa (nur Kopf sichtbar, zittert)
  const shake = hide && !rehired ? Math.sin(t * 40) * 4 : 0;
  person(ctx, 720 + shake, F + 20 + (hide && !rehired ? 150 : 0), { ...BUTLER, s: 1.05, t, flip: true, expr: rehired ? 'happy' : hide ? 'shock' : 'neutral' });
  B.sofa(ctx, W / 2 - 40, F + 30, '#8a5ab0');
  person(ctx, 330, F - 60, { ...PSYCHO, s: 1.0, t, expr: t > w(A.gaehnt) && t < w(A.stellt) ? 'sleep' : 'smile', prop: t > w(A.popcorn) - 0.2 ? popcorn : null });
  if (t > w(A.gaehnt) && t < w(A.stellt)) text(ctx, 'gähn…', 330, 860, { size: 50, color: '#fff', stroke: 8 });
  if (rehired) { pill(ctx, 'Gehalt × 2', 760, 820, t - w(A.stellt) - 0.3, { bg: '#2f9a4a', size: 46 }); }
}
scenes.push({ start: w(A.einund), draw: nightScene });
scenes.push({ start: w(A.waerst), noSlide: true, noWhoosh: true, draw(ctx, lt, t) {
  nightScene(ctx, t - w(A.einund), t);
  questionCard(ctx, 'Wärst du lieber furchtlos oder mitfühlend?', lt, 400);
  commentSign(ctx, 860, 1120, t - w(A.schreib));
} });
scenes.push({ start: END, noSlide: true, draw(ctx, lt, t) {
  nightScene(ctx, t - w(A.einund), t, false);
  ctx.fillStyle = 'rgba(20,14,40,0.45)'; ctx.fillRect(0, 0, W, 620);
  const pos = roulettePos(lt, iVegan, { tStop: END_STOP, spins: END_SPINS }); const role = roleAt(pos);
  header(ctx, 'Nächstes Mal ist Richard' + art(role.name), role.name + '.', 170);
  rouletteBar(ctx, pos, 480);
  commentSign(ctx, 860, 1120, 1);
} });

run({ scenes, chunks, duration, sfx, subY: 1300, hideSubs: [[0, w(A.bedeutet) - 0.05]] });
