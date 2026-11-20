// Folge 5 – „Heute ist Richard ein Mönch.“
import { W, H, OL, C, clamp, lerp, easeOut, easeInOut, bounce, box, circ, line, rr, poly, text, emoji, alpha, scaled,
  person, RICHARD, BUTLER, clockBadge, bubble, iconCard, stamp, pill, questionCard, commentSign,
  ROLES, rouletteBar, roulettePos } from '../../engine/chibi.js';
import * as B from '../../engine/bg.js';
import { setup, run } from '../../engine/timeline.js';

const F = B.FLOOR;
const { words, w, chunks, duration } = await setup('videos/r05', {
  tail: 1.4,
  capMap: {
    'Fünf Uhr.': '5 Uhr.', 'Neun Uhr.': '9 Uhr.', 'Zwölf Uhr.': '12 Uhr.', 'Sechzehn Uhr.': '16 Uhr.', 'Einundzwanzig Uhr.': '21 Uhr.',
    'vor neun': 'vor 9', 'dreißig Prozent': '30 %', 'tausendfünfzig': '1050', 'zwanzig Jahren': '20 Jahren', 'eine Woche': '1 Woche',
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
A.bedeutet = wi('Bedeutet'); A.handy = wi('Handy', A.bedeutet); A.geld = wi('Geld', A.handy); A.wort = wi('Wort', A.geld);
A.fuenf = wi('Fünf', A.wort); A.nie = wi('nie', A.fuenf); A.weckt = wi('weckt', A.nie); A.gong = wi('Gong', A.weckt);
A.neun = wi('Neun', A.gong); A.makler = wi('Börsenmakler', A.neun); A.nickt = wi('nickt', A.makler); A.kaufen = wi('Kaufen', A.nickt); A.aktie = wi('Aktie', A.kaufen);
A.zwoelf = wi('Zwölf', A.aktie); A.wasser = wi('Wasser', A.zwoelf); A.zeichen = wi('Zeichensprache', A.wasser); A.kaviar = wi('Kaviar', A.zeichen); A.abt = wi('Abt', A.kaviar);
A.sechzehn = wi('Sechzehn', A.abt); A.oma = wi('Oma', A.sechzehn); A.bayern = wi('Bayern', A.oma); A.weltenburg = wi('Weltenburg', A.bayern); A.bisheute = wi('Bis', A.weltenburg);
A.aelteste = wi('älteste', A.bisheute); A.staunt = wi('staunt', A.aelteste); A.bleibe = wi('bleibe', A.staunt);
A.einund = wi('Einundzwanzig', A.bleibe); A.nichts = wi('nichts', A.einund); A.klingelt = wi('klingelt', A.nichts); A.bricht = wi('bricht', A.klingelt); A.johannruf = wi('Johann', A.bricht);
A.wuerdest = wi('Würdest', A.johannruf); A.schreib = wi('Schreib', A.wuerdest); A.naechstes = wi('Nächstes', A.schreib); A.gangster = wi('Gangster', A.naechstes);

const iMoench = ROLES.findIndex(r => r.name === 'Mönch');
const iGangster = ROLES.findIndex(r => r.name === 'Gangster');
const MONK = { ...RICHARD, shirt: '#8a5a32', pants: '#8a5a32', tie: true, shoes: '#6a4a2a', collar: false };
const ABT = { hair: 'bald', shirt: '#6a4226', pants: '#6a4226', shoes: '#4a3a2a', glasses: true, mustache: false, collar: false };
const phoneEar = ctx => { box(ctx, 60, -470, 40, 76, 8, '#2b2b35', 4); };

const scenes = [];
// ---------- 0: HOOK ----------
const iWord = wi('Mönch');
const HOOK_STOP = w(iWord) + 0.1, HOOK_SPINS = 15;
tickSfx(0, iMoench, HOOK_STOP, HOOK_SPINS); S(HOOK_STOP, 'ding');
scenes.push({ start: 0, draw(ctx, lt) {
  const pos = roulettePos(lt, iMoench, { tStop: HOOK_STOP, spins: HOOK_SPINS }); const role = roleAt(pos);
  B.villa(ctx, role.bg[0], role.bg[1]);
  header(ctx, 'Heute ist Richard' + art(role.name), role.name + '.');
  rouletteBar(ctx, pos, 470);
  const done = lt > HOOK_STOP, crash = HOOK_STOP + 0.45;
  scaled(ctx, W / 2, 650, bounce(lt, 0.15, 0.3), () => {
    box(ctx, W / 2 - 290, 590, 580, 124, 62, 'rgba(30,20,40,0.85)', 0);
    text(ctx, 'VERMÖGEN', W / 2, 622, { size: 30, color: '#ffffffaa', spacing: 5 });
    if (lt < crash) text(ctx, '47.683.594 €', W / 2, 672, { size: 62, color: C.gold }); else text(ctx, 'gespendet 🙏', W / 2, 672, { size: 56, color: '#7ad08a' });
  });
  if (done) S; // placeholder
  const look = role.name === 'Mönch' ? MONK : lookFor(role.name);
  person(ctx, W / 2, 1640, { ...look, s: 1.25, t: lt, expr: done ? 'sleep' : 'happy' });
} });
S(HOOK_STOP + 0.45, 'coins');

// ---------- 1: BEDEUTET ----------
[A.handy, A.geld, A.wort].forEach(i => S(w(i), 'pop'));
scenes.push({ start: w(A.bedeutet), subY: 1290, draw(ctx, lt, t) {
  B.sunset(ctx);
  person(ctx, W / 2, 1230, { ...MONK, s: 1.2, t, expr: t > w(A.wort) ? 'neutral' : 'smile' });
  iconCard(ctx, 200, 330, 120, t - w(A.handy), { icon: '📱', label: 'kein Handy', cross: true });
  iconCard(ctx, 540, 330, 120, t - w(A.geld), { icon: '💶', label: 'kein Geld', cross: true });
  iconCard(ctx, 880, 330, 120, t - w(A.wort), { icon: '🗣️', label: 'kein Wort', cross: true });
} });

// ---------- 2: 05:00 GONG ----------
S(w(A.nie), 'pop'); S(w(A.gong), 'bass');
scenes.push({ start: w(A.fuenf), draw(ctx, lt, t) {
  B.monastery(ctx, true); clockBadge(ctx, '05:00', lt);
  for (const x of [120, 960]) B.candle(ctx, x, 1000, t);
  const hit = t - w(A.gong);
  B.gong(ctx, 800, F + 10, hit > 0 ? hit : 0);
  const awake = hit > 0;
  person(ctx, 330, F + 20, { ...MONK, s: 1.12, t, expr: awake ? 'shock' : 'sleep', tilt: awake ? 0 : 0.2, hop: awake && hit < 0.6 });
  if (!awake) { text(ctx, 'z', 450, 760 - (lt * 40) % 60, { size: 60, color: '#fff', stroke: 8 }); text(ctx, 'Z', 500, 700 - (lt * 40) % 60, { size: 76, color: '#fff', stroke: 8 }); }
  if (t > w(A.nie)) pill(ctx, 'Rekord: 9 Uhr 😴', 330, 640, t - w(A.nie), { bg: OL, size: 40 });
  if (t > w(A.weckt) - 0.3) person(ctx, 590, F + 20, { ...BUTLER, s: 0.95, t, expr: 'happy', prop: ctx => { line(ctx, 60, -150, 200, -300, '#6a3a1a', 12); circ(ctx, 205, -305, 22, '#c8a070'); } });
  if (awake) stamp(ctx, 'GONNNG!', 760, 520, hit, { size: 70 });
} });

// ---------- 3: 09:00 SCHWEIGEN + MAKLER ----------
S(w(A.makler), 'knock'); S(w(A.nickt), 'pop'); S(w(A.kaufen), 'pop'); S(w(A.aktie), 'coins');
scenes.push({ start: w(A.neun), draw(ctx, lt, t) {
  B.monastery(ctx); clockBadge(ctx, '09:00', lt);
  pill(ctx, '🤫 SCHWEIGEGELÜBDE', W / 2, 380, lt - 0.2, { bg: '#6a4226', size: 46 });
  const call = t > w(A.makler);
  const nod = t > w(A.nickt) && t < w(A.kaufen) + 0.3 ? Math.sin(t * 14) * 0.12 : 0;
  person(ctx, 330, F + 20, { ...MONK, s: 1.12, t, expr: t > w(A.aktie) ? 'happy' : 'neutral', tilt: nod, prop: call ? phoneEar : null });
  if (call) bubble(ctx, '📞 Börsenmakler', 340, 620, t - w(A.makler), { size: 40, dur: w(A.kaufen) - w(A.makler) });
  if (t > w(A.kaufen)) bubble(ctx, 'Makler: „Kaufen!“', 760, 620, t - w(A.kaufen), { size: 44 });
  if (t > w(A.aktie)) { scaled(ctx, 760, 880, bounce(t - w(A.aktie), 0, 0.3), () => { box(ctx, 600, 800, 320, 160, 20, '#1d2236'); text(ctx, '+30 %', 760, 880, { size: 80, color: '#5fd07a' }); }); }
} });

// ---------- 4: 12:00 WASSER & BROT ----------
S(w(A.wasser), 'pop'); S(w(A.zeichen), 'pop'); S(w(A.kaviar), 'pop'); S(w(A.abt), 'hit');
scenes.push({ start: w(A.zwoelf), draw(ctx, lt, t) {
  B.monastery(ctx); clockBadge(ctx, '12:00', lt);
  person(ctx, 800, F - 40, { ...ABT, s: 1.0, t, flip: true, expr: t > w(A.abt) ? 'angry' : 'neutral', tilt: t > w(A.abt) ? Math.sin(t * 12) * 0.15 : 0 });
  person(ctx, 280, F - 40, { ...MONK, s: 1.05, t, expr: t > w(A.abt) ? 'sad' : 'smile', wave: t > w(A.zeichen) && t < w(A.abt), phase: 2 });
  box(ctx, 60, F - 230, 960, 40, 10, '#8a5a32'); box(ctx, 100, F - 190, 40, 190, 6, '#6a4226'); box(ctx, 940, F - 190, 40, 190, 6, '#6a4226');
  if (t > w(A.wasser)) { emoji(ctx, '🥛', 420, F - 290, 70); emoji(ctx, '🍞', 560, F - 280, 80); }
  if (t > w(A.zeichen)) bubble(ctx, '🤌 … 🐟🥚?', 300, 640, t - w(A.zeichen), { size: 50, dur: w(A.abt) - w(A.zeichen) + 1.2 });
  if (t > w(A.kaviar)) pill(ctx, '= Kaviar?', 300, 470, t - w(A.kaviar), { bg: OL, size: 40 });
  if (t > w(A.abt)) stamp(ctx, 'NEIN', 800, 600, t - w(A.abt), { size: 70 });
} });

// ---------- 5: 16:00 OMA – FAKT ----------
S(w(A.oma), 'ding'); S(w(A.bayern), 'whoosh'); S(w(A.weltenburg), 'pop'); S(w(A.aelteste), 'magic'); S(w(A.bleibe), 'pop');
scenes.push({ start: w(A.sechzehn), draw(ctx, lt, t) {
  B.monastery(ctx); clockBadge(ctx, '16:00', lt);
  B.screen(ctx, W / 2, 610, 920, 600, () => {
    const cx = W / 2, cy = 610;
    if (t < w(A.bayern)) {
      ctx.fillStyle = '#f6e6d6'; ctx.fillRect(cx - 460, cy - 300, 920, 600);
      box(ctx, cx - 444, cy - 284, 888, 60, 0, '#fff', 0); text(ctx, 'Oma · Videoanruf', cx - 220, cy - 254, { size: 32, color: OL });
      box(ctx, cx + 300, cy - 274, 100, 40, 10, C.red, 0); text(ctx, 'LIVE', cx + 350, cy - 253, { size: 28, color: '#fff' });
      person(ctx, cx, cy + 430, { hair: 'grandma', glasses: true, shirt: '#b07ad0', t, s: 1.05, wave: true });
    } else if (t < w(A.weltenburg)) {
      // Bayern-Raute
      ctx.save(); rr(ctx, cx - 350, cy - 110, 300, 200, 10); ctx.clip(); ctx.fillStyle = '#fff'; ctx.fillRect(cx - 350, cy - 110, 300, 200);
      for (let i = -6; i < 10; i++) for (let j = -4; j < 8; j++) if ((i + j) % 2 === 0) { ctx.beginPath(); const x = cx - 350 + i * 50 + j * 25, y = cy - 110 + j * 40; ctx.moveTo(x, y); ctx.lineTo(x + 25, y + 20); ctx.lineTo(x, y + 40); ctx.lineTo(x - 25, y + 20); ctx.closePath(); ctx.fillStyle = '#3a8ad8'; ctx.fill(); }
      ctx.restore(); box(ctx, cx - 350, cy - 110, 300, 200, 10, null);
      text(ctx, 'Bayern', cx - 200, cy + 140, { size: 40, color: '#fff' });
      scaled(ctx, cx + 210, cy, bounce(t - w(A.bayern) - 0.4, 0, 0.3), () => text(ctx, '1050', cx + 210, cy, { size: 140, color: C.gold }));
    } else if (t < w(A.aelteste)) {
      emoji(ctx, '⛪', cx - 220, cy - 30, 200); emoji(ctx, '🍺', cx + 220, cy - 30, 200);
      box(ctx, cx - 260, cy + 140, 520, 60, 14, C.gold, 0); text(ctx, 'Kloster Weltenburg', cx, cy + 171, { size: 40, color: OL });
      if (t > w(A.bisheute)) text(ctx, 'bis heute ✓', cx, cy - 220, { size: 48, color: '#7ad08a' });
    } else {
      text(ctx, 'gilt als', cx, cy - 150, { size: 50, color: '#ffffffcc' });
      scaled(ctx, cx, cy, bounce(t - w(A.aelteste), 0, 0.3), () => { text(ctx, 'ÄLTESTE KLOSTER-', cx, cy - 30, { size: 74, color: C.gold }); text(ctx, 'BRAUEREI DER WELT', cx, cy + 60, { size: 74, color: C.gold }); });
      emoji(ctx, '🍺', cx, cy + 190, 90);
    }
  });
  person(ctx, 220, F + 30, { ...MONK, s: 1.05, t, look: 0.6, expr: t > w(A.staunt) ? 'wow' : 'smile' });
  bubble(ctx, 'Mönche brauen Bier? Ich bleibe. 🍺', 300, 860, t - w(A.bleibe) + 1.0, { size: 40, max: 420, color: '#fff7d6' });
} });

// ---------- 6–8: 21:00 MEDITATION, FRAGE, NÄCHSTE ROLLE ----------
S(w(A.nichts), 'magic'); S(w(A.klingelt), 'ding'); S(w(A.johannruf), 'hit'); S(w(A.wuerdest), 'ding'); S(w(A.schreib), 'pop');
const END = w(A.naechstes), END_STOP = w(A.gangster) + 0.1 - END, END_SPINS = 13;
tickSfx(END, iGangster, END_STOP, END_SPINS); S(END + END_STOP, 'bass');
const ringPhone = (t) => ctx => { const sh = Math.sin(t * 50) * 4; box(ctx, 66 + sh, -210, 54, 96, 10, '#2b2b35', 5); box(ctx, 72 + sh, -202, 42, 72, 4, '#7ad0f0', 0); };
function nightScene(ctx, lt, t, clock = true) {
  B.monastery(ctx, true); if (clock) clockBadge(ctx, '21:00', lt);
  for (const x of [140, 940]) B.candle(ctx, x, 1060, t);
  const ring = t > w(A.klingelt);
  const zen = t > w(A.nichts) && !ring;
  if (zen) { ctx.save(); const g = ctx.createRadialGradient(W / 2, F - 260, 20, W / 2, F - 260, 420); g.addColorStop(0, 'rgba(255,240,180,0.5)'); g.addColorStop(1, 'rgba(255,240,180,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  person(ctx, W / 2, F + 20, { ...MONK, s: 1.12, t, expr: t > w(A.bricht) ? 'angry' : 'sleep', talk: t > w(A.johannruf) - 0.1 && t < w(A.johannruf) + 0.5, hop: zen ? false : false });
  if (zen) for (let i = 0; i < 3; i++) emoji(ctx, '✨', W / 2 - 160 + i * 160, 760 - Math.sin(t * 4 + i) * 14, 50);
  if (ring) { person(ctx, 900, F + 20, { ...BUTLER, s: 1.0, t, flip: true, expr: t > w(A.johannruf) ? 'shock' : 'smile', prop: ringPhone(t) }); text(ctx, '📳 RING RING', 880, 760, { size: 40, color: '#fff', stroke: 8 }); }
  if (t > w(A.johannruf)) bubble(ctx, 'JOHANN!!', W / 2, 620, t - w(A.johannruf), { size: 64, color: '#fff7d6', dur: w(A.wuerdest) - w(A.johannruf) + 0.3 });
}
scenes.push({ start: w(A.einund), draw: nightScene });
scenes.push({ start: w(A.wuerdest), noSlide: true, noWhoosh: true, draw(ctx, lt, t) {
  nightScene(ctx, t - w(A.einund), t);
  questionCard(ctx, 'Würdest du 1 Woche ohne Handy im Kloster leben?', lt, 400);
  commentSign(ctx, 860, 1120, t - w(A.schreib));
} });
scenes.push({ start: END, noSlide: true, draw(ctx, lt, t) {
  nightScene(ctx, t - w(A.einund), t, false);
  ctx.fillStyle = 'rgba(20,14,40,0.45)'; ctx.fillRect(0, 0, W, 620);
  const pos = roulettePos(lt, iGangster, { tStop: END_STOP, spins: END_SPINS }); const role = roleAt(pos);
  header(ctx, 'Nächstes Mal ist Richard' + art(role.name), role.name + '.', 170);
  rouletteBar(ctx, pos, 480);
  commentSign(ctx, 860, 1120, 1);
} });

run({ scenes, chunks, duration, sfx, subY: 1300, hideSubs: [[0, w(A.bedeutet) - 0.05]] });
