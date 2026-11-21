// Folge 6 – „Heute ist Richard ein Gangster.“
import { W, H, OL, C, clamp, lerp, easeOut, easeInOut, bounce, box, circ, line, rr, poly, text, emoji, alpha, scaled,
  person, RICHARD, BUTLER, clockBadge, bubble, iconCard, stamp, pill, questionCard, commentSign,
  ROLES, rouletteBar, roulettePos } from '../../engine/chibi.js';
import * as B from '../../engine/bg.js';
import { setup, run } from '../../engine/timeline.js';

const F = B.FLOOR;
const { words, w, chunks, duration } = await setup('videos/r06', {
  tail: 1.4,
  capMap: {
    'Sieben Uhr.': '7 Uhr.', 'Zehn Uhr.': '10 Uhr.', 'Zwölf Uhr.': '12 Uhr.', 'Sechzehn Uhr.': '16 Uhr.', 'Einundzwanzig Uhr.': '21 Uhr.',
    'zwei Millionen': '2 Millionen', 'zwölf Kilometer pro Stunde': '12 km/h', 'neunzehnhunderteinunddreißig': '1931', 'Elf Jahre': '11 Jahre',
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
A.bedeutet = wi('Bedeutet'); A.brille = wi('Sonnenbrille', A.bedeutet); A.kette = wi('Goldkette', A.brille); A.niemals = wi('Niemals', A.kette);
A.sieben = wi('Sieben', A.niemals); A.muesli = wi('Müsli', A.sieben); A.sagt1 = wi('sagt', A.muesli); A.dunkel = wi('dunkel', A.sagt1);
A.zehn = wi('Zehn', A.dunkel); A.baecker = wi('Bäcker', A.zehn); A.schoen = wi('Schöner', A.baecker); A.schade = wi('schade', A.schoen); A.kauft = wi('kauft', A.schade); A.weint = wi('weint', A.kauft);
A.zwoelf = wi('Zwölf', A.weint); A.golf = wi('Golfwagen', A.zwoelf); A.hoechst = wi('Höchstgeschwindigkeit', A.golf);
A.sechzehn = wi('Sechzehn', A.hoechst); A.oma = wi('Oma', A.sechzehn); A.chicago = wi('Chicago', A.oma); A.capone = wi('Al', A.chicago); A.nicht = wi('Nicht', A.capone);
A.steuer = wi('Steuerhinterziehung', A.nicht); A.elf = wi('Elf', A.steuer); A.blass = wi('blass', A.elf); A.berater = wi('Steuerberater', A.blass);
A.einund = wi('Einundzwanzig', A.berater); A.starrt = wi('starrt', A.einund); A.zurueck = wi('zurück', A.starrt); A.blinzelt = wi('blinzelt', A.zurueck); A.schenkt = wi('schenkt', A.blinzelt);
A.wer = wi('Wer', A.schenkt); A.schreib = wi('Schreib', A.wer); A.naechstes = wi('Nächstes', A.schreib); A.haus = wi('Hausmeister', A.naechstes);

const iGangster = ROLES.findIndex(r => r.name === 'Gangster');
const iHaus = ROLES.findIndex(r => r.name === 'Hausmeister');
const shades = ctx => emoji(ctx, '🕶️', 0, -372, 130);
const chain = ctx => { ctx.beginPath(); ctx.arc(0, -250, 62, 0.15 * Math.PI, 0.85 * Math.PI); ctx.lineWidth = 12; ctx.strokeStyle = C.gold; ctx.stroke(); circ(ctx, 0, -186, 16, C.gold, 4); };
const GANG = { ...RICHARD, shirt: '#22222a', pants: '#22222a', tie: true, prop: ctx => { chain(ctx); shades(ctx); } };
const GANG_NOCHAIN = { ...GANG, prop: shades };

const scenes = [];
// ---------- 0: HOOK ----------
const iWord = wi('Gangster');
const HOOK_STOP = w(iWord) + 0.1, HOOK_SPINS = 15;
tickSfx(0, iGangster, HOOK_STOP, HOOK_SPINS); S(HOOK_STOP, 'bass');
scenes.push({ start: 0, draw(ctx, lt) {
  const pos = roulettePos(lt, iGangster, { tStop: HOOK_STOP, spins: HOOK_SPINS }); const role = roleAt(pos);
  B.villa(ctx, role.bg[0], role.bg[1]);
  header(ctx, 'Heute ist Richard' + art(role.name), role.name + '.');
  rouletteBar(ctx, pos, 470);
  scaled(ctx, W / 2, 650, bounce(lt, 0.15, 0.3), () => {
    box(ctx, W / 2 - 290, 590, 580, 124, 62, 'rgba(30,20,40,0.85)', 0);
    text(ctx, 'VERMÖGEN', W / 2, 622, { size: 30, color: '#ffffffaa', spacing: 5 });
    text(ctx, '47.683.594 €', W / 2, 672, { size: 62, color: C.gold });
  });
  const done = lt > HOOK_STOP;
  const look = role.name === 'Gangster' ? GANG : lookFor(role.name);
  person(ctx, W / 2, 1640, { ...look, s: 1.25, t: lt, expr: done ? 'neutral' : 'happy' });
  if (done) stamp(ctx, 'BOSS 😎', W / 2, 860, lt - HOOK_STOP - 0.2, { size: 60, rot: -0.08, color: '#222' });
} });

// ---------- 1: BEDEUTET ----------
[A.brille, A.kette, A.niemals].forEach(i => S(w(i), 'pop'));
scenes.push({ start: w(A.bedeutet), subY: 1290, draw(ctx, lt, t) {
  B.sunset(ctx);
  person(ctx, W / 2, 1230, { ...GANG, s: 1.2, t, expr: 'neutral' });
  iconCard(ctx, 200, 330, 120, t - w(A.brille), { icon: '🕶️', label: 'Sonnenbrille', labelBg: '#222' });
  iconCard(ctx, 540, 330, 120, t - w(A.kette), { icon: '📿', label: 'Goldkette', labelBg: '#c99a1e' });
  iconCard(ctx, 880, 330, 120, t - w(A.niemals), { icon: '😁', label: 'nie lächeln', cross: true });
} });

// ---------- 2: 07:00 FRÜHSTÜCK IM DUNKELN ----------
S(w(A.muesli), 'pop'); S(w(A.dunkel), 'knock');
scenes.push({ start: w(A.sieben), draw(ctx, lt, t) {
  B.diningRoom(ctx); clockBadge(ctx, '07:00', lt); B.longTable(ctx, F);
  // Dunkel durch die Brille
  const grope = t > w(A.muesli);
  emoji(ctx, '🥣', 760, F - 300, 80);
  person(ctx, 330, F + 20, { ...GANG_NOCHAIN, s: 1.12, t, expr: 'neutral', wave: grope && t < w(A.dunkel), look: grope ? -0.8 : 0 });
  if (grope) text(ctx, '?', 420, 640 - Math.sin(t * 6) * 10, { size: 90, color: '#fff', stroke: 10 });
  person(ctx, 900, F + 20, { ...BUTLER, s: 1.05, t, flip: true, expr: 'neutral', talk: t > w(A.sagt1) && t < w(A.dunkel) + 0.4 });
  bubble(ctx, 'Sir, es ist noch dunkel. 🌙', 860, 620, t - w(A.sagt1) - 0.2, { size: 42, max: 380 });
  ctx.fillStyle = 'rgba(10,10,30,0.35)'; ctx.fillRect(0, 0, W, H);
} });

// ---------- 3: 10:00 BÄCKER ----------
S(w(A.baecker), 'pop'); S(w(A.schade), 'bass'); S(w(A.kauft), 'coins'); S(w(A.weint), 'ding');
scenes.push({ start: w(A.zehn), draw(ctx, lt, t) {
  B.streetDay(ctx); clockBadge(ctx, '10:00', lt);
  box(ctx, 480, F - 700, 560, 700, 6, '#c87a4a'); box(ctx, 510, F - 670, 500, 90, 10, '#f5c84b'); text(ctx, 'Bäckerei', 760, F - 624, { size: 58, color: OL });
  box(ctx, 520, F - 400, 480, 240, 10, '#ffe7a8'); emoji(ctx, '🥐', 620, F - 280, 80); emoji(ctx, '🥖', 760, F - 280, 80); emoji(ctx, '🥨', 900, F - 280, 74);
  const sold = t > w(A.kauft);
  person(ctx, 800, F + 20, { hair: 'dad', hairColor: '#e8e0d0', hat: 'chef', shirt: '#fff', pants: '#888', mustache: true, mustacheColor: '#e8e0d0', s: 1.0, t, flip: true, expr: t > w(A.weint) ? 'happy' : t > w(A.schade) ? 'shock' : 'smile' });
  if (t > w(A.weint)) for (const sx of [-1, 1]) { const y = 960 + ((t * 300) % 140); circ(ctx, 800 - sx * 40, y, 11, '#7ac8f0', 0); }
  person(ctx, 280, F + 20, { ...GANG, s: 1.12, t, expr: sold ? 'happy' : 'neutral', talk: t > w(A.schoen) && t < w(A.kauft) });
  bubble(ctx, 'Schöner Laden. Wäre schade, wenn ihm etwas passiert …', 320, 600, t - w(A.schoen), { size: 40, max: 460, color: '#fff7d6', dur: w(A.kauft) - w(A.schoen) });
  if (sold) { stamp(ctx, 'GEKAUFT: 2 MIO. €', W / 2, 520, t - w(A.kauft), { size: 54, color: '#2f9a4a' }); }
} });

// ---------- 4: 12:00 GOLFWAGEN ----------
S(w(A.golf), 'whoosh'); S(w(A.hoechst), 'pop');
function golfCart(ctx, x, y) {
  ctx.save(); ctx.translate(x, y);
  box(ctx, -170, -150, 340, 90, 20, '#fff'); box(ctx, -150, -330, 20, 190, 4, '#888'); box(ctx, 130, -330, 20, 190, 4, '#888'); box(ctx, -170, -350, 340, 30, 10, '#2f9a4a');
  circ(ctx, -110, -50, 44, '#2b2b2b'); circ(ctx, 110, -50, 44, '#2b2b2b'); circ(ctx, -110, -50, 16, '#c0c0c8'); circ(ctx, 110, -50, 16, '#c0c0c8');
  ctx.restore();
}
scenes.push({ start: w(A.zwoelf), draw(ctx, lt, t) {
  B.villa(ctx, '#8fd0f0', '#d8f0fa'); clockBadge(ctx, '12:00', lt);
  pill(ctx, '🚨 VERFOLGUNGSJAGD', W / 2, 400, lt - 0.1, { bg: C.red, size: 48 });
  const x = lerp(-250, 620, easeOut((t - w(A.golf) + 0.6) / 2.2));
  // Speedlines
  for (let i = 0; i < 4; i++) line(ctx, x - 230 - i * 30, F + 60 + i * 40, x - 400 - i * 30, F + 60 + i * 40, '#ffffff', 8);
  person(ctx, x, F + 120, { ...GANG, s: 0.95, t, expr: 'neutral' });
  golfCart(ctx, x, F + 260);
  // Schnecke überholt
  if (t > w(A.hoechst)) { emoji(ctx, '🐌', x + 230 + (t - w(A.hoechst)) * 70, F + 220, 80); }
  if (t > w(A.hoechst)) { scaled(ctx, 820, 760, bounce(t - w(A.hoechst), 0, 0.3), () => { circ(ctx, 820, 760, 120, '#fff', 8); text(ctx, '12', 820, 740, { size: 90, color: OL }); text(ctx, 'km/h', 820, 810, { size: 34, color: OL }); }); }
} });

// ---------- 5: 16:00 OMA – FAKT ----------
S(w(A.oma), 'ding'); S(w(A.chicago), 'whoosh'); S(w(A.capone), 'pop'); S(w(A.steuer), 'hit'); S(w(A.elf), 'bass'); S(w(A.berater), 'knock');
scenes.push({ start: w(A.sechzehn), draw(ctx, lt, t) {
  B.livingRoom(ctx); clockBadge(ctx, '16:00', lt);
  B.screen(ctx, W / 2, 610, 920, 600, () => {
    const cx = W / 2, cy = 610;
    if (t < w(A.chicago)) {
      ctx.fillStyle = '#f6e6d6'; ctx.fillRect(cx - 460, cy - 300, 920, 600);
      box(ctx, cx - 444, cy - 284, 888, 60, 0, '#fff', 0); text(ctx, 'Oma · Videoanruf', cx - 220, cy - 254, { size: 32, color: OL });
      box(ctx, cx + 300, cy - 274, 100, 40, 10, C.red, 0); text(ctx, 'LIVE', cx + 350, cy - 253, { size: 28, color: '#fff' });
      person(ctx, cx, cy + 430, { hair: 'grandma', glasses: true, shirt: '#b07ad0', t, s: 1.05, wave: true });
    } else if (t < w(A.capone)) {
      emoji(ctx, '🏙️', cx - 200, cy - 20, 200); text(ctx, 'Chicago', cx - 200, cy + 140, { size: 40, color: '#fff' });
      scaled(ctx, cx + 210, cy, bounce(t - w(A.chicago) - 0.4, 0, 0.3), () => text(ctx, '1931', cx + 210, cy, { size: 140, color: C.gold }));
    } else if (t < w(A.steuer)) {
      circ(ctx, cx - 250, cy - 20, 120, '#fff');
      person(ctx, cx - 250, cy + 210, { hair: 'dad', hairColor: '#2b2020', hat: 'top', shirt: '#3a3a44', s: 0.5, t });
      box(ctx, cx - 360, cy + 120, 220, 50, 10, C.gold, 0); text(ctx, 'Al Capone', cx - 250, cy + 146, { size: 32, color: OL });
      text(ctx, 'verurteilt –', cx + 170, cy - 60, { size: 56, color: '#fff' });
      if (t > w(A.nicht)) { text(ctx, 'Verbrechen', cx + 170, cy + 40, { size: 56, color: '#ffffffaa' }); line(ctx, cx + 20, cy + 40, cx + 320, cy + 40, C.red, 10); }
    } else {
      scaled(ctx, cx, cy - 60, bounce(t - w(A.steuer), 0, 0.3), () => { text(ctx, 'STEUER-', cx, cy - 110, { size: 96, color: C.red }); text(ctx, 'HINTERZIEHUNG', cx, cy - 10, { size: 96, color: C.red }); });
      if (t > w(A.elf)) stamp(ctx, '11 JAHRE HAFT', cx, cy + 150, t - w(A.elf), { size: 60 });
    }
  });
  const pale = t > w(A.blass);
  person(ctx, 220, F + 30, { ...GANG_NOCHAIN, s: 1.05, t, look: 0.6, expr: pale ? 'shock' : 'neutral' });
  if (pale) { ctx.save(); ctx.globalAlpha = 0.35; circ(ctx, 220, F + 30 - 1.05 * 360, 110, '#cfe8ff', 0); ctx.restore(); }
  if (t > w(A.berater)) bubble(ctx, '📞 Steuerberater?!', 300, 860, t - w(A.berater), { size: 42, color: '#fff7d6' });
} });

// ---------- 6–8: 21:00 STARRDUELL, FRAGE, NÄCHSTE ROLLE ----------
S(w(A.starrt), 'rise'); S(w(A.zurueck), 'rise'); S(w(A.blinzelt), 'hit'); S(w(A.schenkt), 'magic'); S(w(A.wer), 'ding'); S(w(A.schreib), 'pop');
const END = w(A.naechstes), END_STOP = w(A.haus) + 0.1 - END, END_SPINS = 13;
tickSfx(END, iHaus, END_STOP, END_SPINS); S(END + END_STOP, 'ding');
function nightScene(ctx, lt, t, clock = true) {
  B.livingRoom(ctx, true); if (clock) clockBadge(ctx, '21:00', lt);
  const staring = t > w(A.starrt) && t < w(A.blinzelt);
  const gave = t > w(A.schenkt);
  // Augen-Close-up-Balken
  if (staring) { box(ctx, 60, 380, 960, 280, 30, '#111'); for (const [x, c] of [[300, '#6a4026'], [780, '#8a8a8a']]) { ell(ctx, x - 70, 520, 60, 40, '#fff', 6); ell(ctx, x + 70, 520, 60, 40, '#fff', 6); circ(ctx, x - 70, 520, 20, OL, 0); circ(ctx, x + 70, 520, 20, OL, 0); } text(ctx, 'VS', W / 2, 520, { size: 70, color: C.gold }); }
  if (t > w(A.blinzelt) && !gave) stamp(ctx, '*blinzel*', 330, 560, t - w(A.blinzelt), { size: 60 });
  person(ctx, 330, F + 20, { ...(gave ? GANG_NOCHAIN : GANG), s: 1.12, t, expr: t > w(A.blinzelt) ? 'sad' : 'neutral' });
  person(ctx, 760, F + 20, { ...BUTLER, s: 1.12, t, flip: true, expr: gave ? 'happy' : 'neutral', prop: gave ? chain : null });
  if (gave) for (let i = 0; i < 3; i++) emoji(ctx, '✨', 660 + i * 100, 700 - Math.sin(t * 5 + i) * 12, 50);
}
function ell(ctx, x, y, rx, ry, fill, lw) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = OL; ctx.stroke(); } }
scenes.push({ start: w(A.einund), draw: nightScene });
scenes.push({ start: w(A.wer), noSlide: true, noWhoosh: true, draw(ctx, lt, t) {
  nightScene(ctx, t - w(A.einund), t);
  questionCard(ctx, 'Wer gewinnt das Starrduell: Richard oder Johann?', lt, 400);
  commentSign(ctx, 860, 1120, t - w(A.schreib));
} });
scenes.push({ start: END, noSlide: true, draw(ctx, lt, t) {
  nightScene(ctx, t - w(A.einund), t, false);
  ctx.fillStyle = 'rgba(20,14,40,0.45)'; ctx.fillRect(0, 0, W, 620);
  const pos = roulettePos(lt, iHaus, { tStop: END_STOP, spins: END_SPINS }); const role = roleAt(pos);
  header(ctx, 'Nächstes Mal ist Richard' + art(role.name), role.name + '.', 170);
  rouletteBar(ctx, pos, 480);
  commentSign(ctx, 860, 1120, 1);
} });

run({ scenes, chunks, duration, sfx, subY: 1300, hideSubs: [[0, w(A.bedeutet) - 0.05]] });
