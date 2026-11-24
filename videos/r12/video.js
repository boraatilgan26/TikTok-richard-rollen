// Folge 12 – „Heute ist Richard ein Minimalist.“
import { W, H, OL, C, clamp, lerp, easeOut, easeInOut, bounce, box, circ, line, rr, poly, text, emoji, alpha, scaled,
  person, RICHARD, BUTLER, clockBadge, bubble, iconCard, stamp, pill, questionCard, commentSign,
  ROLES, rouletteBar, roulettePos } from '../../engine/chibi.js';
import * as B from '../../engine/bg.js';
import { setup, run } from '../../engine/timeline.js';

const F = B.FLOOR;
const { words, w, chunks, duration } = await setup('videos/r12', {
  tail: 1.4,
  capMap: {
    'Sieben Uhr.': '7 Uhr.', 'Zehn Uhr.': '10 Uhr.', 'Zwölf Uhr.': '12 Uhr.', 'Sechzehn Uhr.': '16 Uhr.', 'Einundzwanzig Uhr.': '21 Uhr.',
    'Dreiundvierzig Sofas': '43 Sofas', 'Siebzehn Autos': '17 Autos', 'einen Stuhl': '1 Stuhl', 'Vierhundert Anzüge': '400 Anzüge',
    'Dreihundert goldene': '300 goldene', 'zweitausenddreihundert': '2.300', 'zehn Dinge': '10 Dinge',
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
  Rentner: { shirt: '#a8b8c8', badge: '👴', glasses: true }, Bodybuilder: { shirt: '#e8844a', badge: '💪' }, Detektiv: { shirt: '#8a7a5a', badge: '🕵️' },
  Pirat: { shirt: '#3a7ab0', badge: '🏴‍☠️' }, Koch: { shirt: '#ffffff', badge: '👨‍🍳', hat: 'chef' }, Bauer: { shirt: '#8ac46a', badge: '🚜' },
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
A.bedeutet = wi('Bedeutet'); A.luxus = wi('Luxus', A.bedeutet); A.krempel = wi('Krempel', A.luxus); A.noetig = wi('Nötigste', A.krempel);
A.sieben = wi('Sieben', A.noetig); A.raeumt = wi('räumt', A.sieben); A.sofas = wi('Sofas', A.raeumt); A.autos = wi('Autos', A.sofas); A.stuhl = wi('Stuhl', A.autos);
A.fragt = wi('fragt', A.stuhl); A.wechseln = wi('wechseln', A.fragt);
A.zehn = wi('Zehn', A.wechseln); A.anzuege = wi('Anzüge', A.zehn); A.behaelt = wi('behält', A.anzuege); A.krawatten = wi('Krawatten', A.behaelt); A.alle = wi('alle', A.krawatten);
A.zwoelf = wi('Zwölf', A.alle); A.teller = wi('Teller', A.zwoelf); A.loeffel = wi('Löffel', A.teller); A.erbse = wi('Erbse', A.loeffel);
A.sechzehn = wi('Sechzehn', A.erbse); A.oma = wi('Oma', A.sechzehn); A.griechen = wi('Griechenland', A.oma); A.diogenes = wi('Diogenes', A.griechen); A.fass = wi('Fass', A.diogenes);
A.becher = wi('Becher', A.fass); A.kind = wi('Kind', A.becher); A.wirft = wi('wirft', A.kind); A.staunt = wi('staunt', A.wirft); A.versteckt = wi('versteckt', A.staunt);
A.einund = wi('Einundzwanzig', A.versteckt); A.leer = wi('leer', A.einund); A.ruft = wi('ruft', A.leer); A.echo = wi('Echo', A.ruft);
A.wuerdest = wi('Würdest', A.echo); A.schreib = wi('Schreib', A.wuerdest); A.naechstes = wi('Nächstes', A.schreib); A.rentner = wi('Rentner', A.naechstes);

const iMini = ROLES.findIndex(r => r.name === 'Minimalist');
const iRentner = ROLES.findIndex(r => r.name === 'Rentner');
const MINI = { ...RICHARD, shirt: '#f2f2f2', pants: '#d8d8dc', tie: true, badge: '⚪' };
function emptyRoom(ctx) { ctx.fillStyle = '#f4f4f2'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#e4e4e0'; ctx.fillRect(0, B.FLOOR, W, H); line(ctx, 0, B.FLOOR, W, B.FLOOR, '#cfcfca', 6); for (const x of [200, 880]) box(ctx, x - 90, 420, 180, 300, 8, '#dfeef6', 5); }
function chair(ctx, x, y = F) { box(ctx, x - 70, y - 140, 140, 24, 6, '#c8a070'); box(ctx, x - 70, y - 300, 20, 180, 4, '#c8a070', 4); box(ctx, x - 62, y - 116, 16, 116, 4, '#8a6a4a', 3); box(ctx, x + 46, y - 116, 16, 116, 4, '#8a6a4a', 3); }

const scenes = [];
// ---------- 0: HOOK ----------
const iWord = wi('Minimalist');
const HOOK_STOP = w(iWord) + 0.1, HOOK_SPINS = 15;
tickSfx(0, iMini, HOOK_STOP, HOOK_SPINS); S(HOOK_STOP, 'ding');
scenes.push({ start: 0, draw(ctx, lt) {
  const pos = roulettePos(lt, iMini, { tStop: HOOK_STOP, spins: HOOK_SPINS }); const role = roleAt(pos);
  B.villa(ctx, role.bg[0], role.bg[1]);
  header(ctx, 'Heute ist Richard' + art(role.name), role.name + '.');
  rouletteBar(ctx, pos, 470);
  scaled(ctx, W / 2, 650, bounce(lt, 0.15, 0.3), () => {
    box(ctx, W / 2 - 290, 590, 580, 124, 62, 'rgba(30,20,40,0.85)', 0);
    text(ctx, 'VERMÖGEN', W / 2, 622, { size: 30, color: '#ffffffaa', spacing: 5 });
    text(ctx, '47.683.594 €', W / 2, 672, { size: 62, color: C.gold });
  });
  const done = lt > HOOK_STOP;
  const look = role.name === 'Minimalist' ? MINI : lookFor(role.name);
  person(ctx, W / 2, 1640, { ...look, s: 1.25, t: lt, expr: 'happy' });
  if (done) stamp(ctx, 'WENIGER IST MEHR', W / 2, 860, lt - HOOK_STOP - 0.2, { size: 54, rot: -0.08, color: '#666' });
} });

// ---------- 1: BEDEUTET ----------
[A.luxus, A.krempel, A.noetig].forEach(i => S(w(i), 'pop'));
scenes.push({ start: w(A.bedeutet), subY: 1290, draw(ctx, lt, t) {
  B.sunset(ctx);
  person(ctx, W / 2, 1230, { ...MINI, s: 1.2, t, expr: 'smile' });
  iconCard(ctx, 200, 330, 120, t - w(A.luxus), { icon: '💎', label: 'kein Luxus', cross: true });
  iconCard(ctx, 540, 330, 120, t - w(A.krempel), { icon: '📦', label: 'kein Krempel', cross: true });
  iconCard(ctx, 880, 330, 120, t - w(A.noetig), { icon: '🪑', label: 'nur das Nötigste', labelBg: '#888' });
} });

// ---------- 2: 07:00 AUSRÄUMEN ----------
S(w(A.sofas), 'whoosh'); S(w(A.autos), 'whoosh'); S(w(A.stuhl), 'ding'); S(w(A.fragt), 'pop'); S(w(A.wechseln), 'pop');
scenes.push({ start: w(A.sieben), draw(ctx, lt, t) {
  const empty = t > w(A.stuhl);
  if (!empty) { B.diningRoom(ctx); B.sofa(ctx, 640, F + 30, '#8a5ab0'); } else emptyRoom(ctx);
  clockBadge(ctx, '07:00', lt);
  if (t > w(A.sofas) && !empty) { const k = t - w(A.sofas); for (let i = 0; i < 4; i++) emoji(ctx, '🛋️', 700 + (k * 500 + i * 160) % 600, 520 + i * 40, 80); pill(ctx, '43 Sofas → raus', W / 2, 400, k, { bg: OL, size: 44 }); }
  if (t > w(A.autos) && !empty) { const k = t - w(A.autos); for (let i = 0; i < 3; i++) emoji(ctx, '🚗', 700 + (k * 600 + i * 200) % 600, 720 + i * 30, 80); }
  if (empty) { chair(ctx, 560); pill(ctx, 'behält: 1 Stuhl', W / 2, 400, t - w(A.stuhl), { bg: '#888', size: 44 }); }
  person(ctx, 280, F + 20, { ...MINI, s: 1.1, t, expr: 'happy', talk: t > w(A.wechseln) - 0.8 && t < w(A.wechseln) + 0.5 });
  if (empty) person(ctx, 840, F + 20, { ...BUTLER, s: 1.05, t, flip: true, expr: t > w(A.wechseln) ? 'sad' : 'neutral' });
  bubble(ctx, 'Und wo sitze ich?', 840, 640, t - w(A.fragt) - 0.2, { size: 44, dur: w(A.wechseln) - w(A.fragt) + 0.2 });
  bubble(ctx, 'Wir wechseln uns ab. 🔄', 320, 640, t - w(A.wechseln) + 0.7, { size: 44, color: '#fff7d6' });
} });

// ---------- 3: 10:00 KLEIDERSCHRANK ----------
S(w(A.anzuege), 'pop'); S(w(A.behaelt), 'whoosh'); S(w(A.krawatten), 'pop'); S(w(A.alle), 'coins');
function tieShape(ctx, x, y, s = 1) { poly(ctx, [[x - 8 * s, y], [x + 8 * s, y], [x + 14 * s, y + 60 * s], [x, y + 74 * s], [x - 14 * s, y + 60 * s]], C.gold, 3); }
scenes.push({ start: w(A.zehn), draw(ctx, lt, t) {
  emptyRoom(ctx); clockBadge(ctx, '10:00', lt);
  box(ctx, 380, 340, 640, 860, 16, '#c8a070'); box(ctx, 410, 370, 580, 800, 10, '#f8f2e8', 5); line(ctx, 410, 440, 990, 440, '#8a6a4a', 8);
  const kept = t > w(A.behaelt);
  if (!kept) for (let i = 0; i < 11; i++) box(ctx, 430 + i * 50, 450, 40, 260, 10, '#3b3f58', 3);
  else box(ctx, 680, 450, 40, 260, 10, '#3b3f58', 3);
  if (t > w(A.anzuege)) pill(ctx, kept ? 'Anzüge: 1 / 400' : 'Anzüge: 400', 700, 300, t - w(A.anzuege), { bg: OL, size: 40 });
  if (t > w(A.krawatten)) { for (let i = 0; i < 18; i++) tieShape(ctx, 450 + (i % 9) * 60, 780 + Math.floor(i / 9) * 110, 1); }
  if (t > w(A.alle)) stamp(ctx, '300 KRAWATTEN: BLEIBEN', 700, 1080, t - w(A.alle), { size: 40, color: C.goldDark });
  person(ctx, 200, F + 20, { ...MINI, s: 1.05, t, expr: t > w(A.alle) ? 'happy' : 'neutral' });
} });

// ---------- 4: 12:00 EINE ERBSE ----------
S(w(A.teller), 'pop'); S(w(A.loeffel), 'pop'); S(w(A.erbse), 'ding');
scenes.push({ start: w(A.zwoelf), draw(ctx, lt, t) {
  emptyRoom(ctx); clockBadge(ctx, '12:00', lt);
  box(ctx, 160, F - 230, 760, 40, 10, '#fff'); box(ctx, 200, F - 190, 30, 190, 6, '#ccc'); box(ctx, 850, F - 190, 30, 190, 6, '#ccc');
  person(ctx, 540, F - 120, { ...MINI, s: 0.95, t, expr: t > w(A.erbse) ? 'happy' : 'smile' });
  box(ctx, 160, F - 230, 760, 40, 10, '#fff');
  if (t > w(A.teller)) ell(ctx, 540, F - 240, 120, 26, '#fff', 5);
  if (t > w(A.loeffel)) { line(ctx, 690, F - 250, 780, F - 230, '#aaa', 8); ell(ctx, 680, F - 252, 16, 10, '#ccc', 4); }
  if (t > w(A.erbse)) { scaled(ctx, 540, F - 250, bounce(t - w(A.erbse), 0, 0.3), () => circ(ctx, 540, F - 250, 12, '#5fb06a', 3)); pill(ctx, '1 Erbse 🟢', 540, 600, t - w(A.erbse), { bg: '#2f9a4a', size: 46 }); }
} });
function ell(ctx, x, y, rx, ry, fill, lw) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = OL; ctx.stroke(); } }

// ---------- 5: 16:00 OMA – FAKT ----------
S(w(A.oma), 'ding'); S(w(A.griechen), 'whoosh'); S(w(A.diogenes), 'pop'); S(w(A.becher), 'pop'); S(w(A.wirft), 'hit'); S(w(A.versteckt), 'whoosh');
scenes.push({ start: w(A.sechzehn), draw(ctx, lt, t) {
  emptyRoom(ctx); clockBadge(ctx, '16:00', lt);
  B.screen(ctx, W / 2, 610, 920, 600, () => {
    const cx = W / 2, cy = 610;
    if (t < w(A.griechen)) {
      ctx.fillStyle = '#f6e6d6'; ctx.fillRect(cx - 460, cy - 300, 920, 600);
      box(ctx, cx - 444, cy - 284, 888, 60, 0, '#fff', 0); text(ctx, 'Oma · Videoanruf', cx - 220, cy - 254, { size: 32, color: OL });
      box(ctx, cx + 300, cy - 274, 100, 40, 10, C.red, 0); text(ctx, 'LIVE', cx + 350, cy - 253, { size: 28, color: '#fff' });
      person(ctx, cx, cy + 430, { hair: 'grandma', glasses: true, shirt: '#b07ad0', t, s: 1.05, wave: true });
    } else if (t < w(A.diogenes)) {
      box(ctx, cx - 350, cy - 100, 300, 200, 10, '#fff'); for (let i = 0; i < 5; i++) box(ctx, cx - 350, cy - 100 + i * 44, 300, 22, 0, '#1f5fb0', 0); box(ctx, cx - 350, cy - 100, 120, 110, 0, '#1f5fb0', 0); box(ctx, cx - 300, cy - 66, 20, 44, 0, '#fff', 0); box(ctx, cx - 312, cy - 54, 44, 20, 0, '#fff', 0); box(ctx, cx - 350, cy - 100, 300, 200, 10, null);
      text(ctx, 'Griechenland', cx - 200, cy + 150, { size: 38, color: '#fff' });
      scaled(ctx, cx + 200, cy, bounce(t - w(A.griechen) - 0.4, 0, 0.3), () => { text(ctx, 'vor über', cx + 200, cy - 70, { size: 40, color: '#fff' }); text(ctx, '2.300 J.', cx + 200, cy + 20, { size: 110, color: C.gold }); });
    } else if (t < w(A.kind)) {
      // Fass
      ell(ctx, cx - 120, cy + 60, 200, 130, '#a8703a', 6); for (const dx of [-80, 0, 80]) line(ctx, cx - 120 + dx, cy - 40, cx - 120 + dx, cy + 160, '#7a4a2a', 6);
      person(ctx, cx - 60, cy + 150, { hair: 'bald', shirt: '#e8dcc0', s: 0.5, t, stubble: true });
      box(ctx, cx - 240, cy + 180, 240, 50, 10, C.gold, 0); text(ctx, 'Diogenes', cx - 120, cy + 206, { size: 32, color: OL });
      if (t > w(A.becher)) { emoji(ctx, '🏺', cx + 230, cy - 20, 140); text(ctx, 'nur 1 Becher', cx + 230, cy + 120, { size: 44, color: '#fff' }); }
    } else {
      emoji(ctx, '🧒', cx - 220, cy - 20, 160); emoji(ctx, '🤲', cx - 220, cy + 120, 80);
      emoji(ctx, '🏺', cx + 220, cy - 20, 140);
      if (t > w(A.wirft)) { line(ctx, cx + 120, cy + 100, cx + 320, cy - 120, C.red, 16); line(ctx, cx + 120, cy - 120, cx + 320, cy + 100, C.red, 16); text(ctx, 'weggeworfen', cx + 220, cy + 170, { size: 40, color: C.red }); }
    }
  });
  const hide = t > w(A.versteckt);
  person(ctx, 220, F + 30, { ...MINI, s: 1.05, t, look: 0.6, expr: t > w(A.staunt) ? (hide ? 'shock' : 'wow') : 'smile' });
  if (hide) { const k = clamp((t - w(A.versteckt)) / 0.6); for (let i = 0; i < 5; i++) tieShape(ctx, lerp(380, 60, k) + i * 20, 1080 + i * 6, 0.9); }
} });

// ---------- 6–8: 21:00 ECHO, FRAGE, NÄCHSTE ROLLE ----------
S(w(A.leer), 'whoosh'); S(w(A.ruft), 'pop'); S(w(A.echo), 'magic'); S(w(A.wuerdest), 'ding'); S(w(A.schreib), 'pop');
const END = w(A.naechstes), END_STOP = w(A.rentner) + 0.1 - END, END_SPINS = 13;
tickSfx(END, iRentner, END_STOP, END_SPINS); S(END + END_STOP, 'ding');
function nightScene(ctx, lt, t, clock = true) {
  emptyRoom(ctx); ctx.fillStyle = 'rgba(20,20,60,0.6)'; ctx.fillRect(0, 0, W, H);
  if (clock) clockBadge(ctx, '21:00', lt);
  chair(ctx, 300);
  person(ctx, 300, F - 100, { ...MINI, s: 0.9, t, expr: t > w(A.ruft) ? 'smile' : 'neutral', talk: t > w(A.ruft) && t < w(A.echo) });
  person(ctx, 820, F + 20, { ...BUTLER, s: 0.95, t, flip: true, expr: 'smile' });
  if (t > w(A.ruft)) bubble(ctx, 'Gute Nacht, Johann!', 320, 620, t - w(A.ruft), { size: 44, color: '#fff7d6', dur: w(A.echo) - w(A.ruft) + 0.3 });
  if (t > w(A.echo)) for (let i = 0; i < 3; i++) alpha(ctx, clamp(1 - i * 0.3), () => text(ctx, 'Johann …', 560 + i * 120, 560 + i * 90, { size: 56 - i * 8, color: '#fff', stroke: 8 }));
}
scenes.push({ start: w(A.einund), draw: nightScene });
scenes.push({ start: w(A.wuerdest), noSlide: true, noWhoosh: true, draw(ctx, lt, t) {
  nightScene(ctx, t - w(A.einund), t);
  questionCard(ctx, 'Würdest du alles wegwerfen bis auf 10 Dinge?', lt, 400);
  commentSign(ctx, 860, 1120, t - w(A.schreib));
} });
scenes.push({ start: END, noSlide: true, draw(ctx, lt, t) {
  nightScene(ctx, t - w(A.einund), t, false);
  ctx.fillStyle = 'rgba(20,14,40,0.55)'; ctx.fillRect(0, 0, W, 620);
  const pos = roulettePos(lt, iRentner, { tStop: END_STOP, spins: END_SPINS }); const role = roleAt(pos);
  header(ctx, 'Nächstes Mal ist Richard' + art(role.name), role.name + '.', 170);
  rouletteBar(ctx, pos, 480);
  commentSign(ctx, 860, 1120, 1);
} });

run({ scenes, chunks, duration, sfx, subY: 1300, hideSubs: [[0, w(A.bedeutet) - 0.05]] });
