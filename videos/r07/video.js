// Folge 7 – „Heute ist Richard ein Hausmeister.“
import { W, H, OL, C, clamp, lerp, easeOut, easeInOut, bounce, box, circ, line, rr, poly, text, emoji, alpha, scaled,
  person, RICHARD, BUTLER, clockBadge, bubble, iconCard, stamp, pill, questionCard, commentSign,
  ROLES, rouletteBar, roulettePos } from '../../engine/chibi.js';
import * as B from '../../engine/bg.js';
import { setup, run } from '../../engine/timeline.js';

const F = B.FLOOR;
const { words, w, chunks, duration } = await setup('videos/r07', {
  tail: 1.4,
  capMap: {
    'Sieben Uhr.': '7 Uhr.', 'Zehn Uhr.': '10 Uhr.', 'Zwölf Uhr.': '12 Uhr.', 'Sechzehn Uhr.': '16 Uhr.', 'Einundzwanzig Uhr.': '21 Uhr.',
    'Zweitausend Quadratmeter': '2.000 m²', 'drei Stunden': '3 Stunden', 'ein Zimmer': '1 Zimmer', 'neunzehnhunderteins': '1901',
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
A.bedeutet = wi('Bedeutet'); A.werkzeug = wi('Werkzeug', A.bedeutet); A.blau = wi('Blaumann', A.werkzeug); A.erreich = wi('erreichbar', A.blau);
A.sieben = wi('Sieben', A.erreich); A.heizung = wi('Heizung', A.sieben); A.repariert = wi('repariert', A.heizung); A.licht = wi('Licht', A.repariert); A.taschen = wi('Taschenlampe', A.licht);
A.zehn = wi('Zehn', A.taschen); A.wischt = wi('wischt', A.zehn); A.qm = wi('Quadratmeter', A.wischt); A.nach = wi('Nach', A.qm); A.geschafft = wi('geschafft', A.nach);
A.zwoelf = wi('Zwölf', A.geschafft); A.nachbar = wi('Nachbar', A.zwoelf); A.tropft = wi('tropft', A.nachbar); A.kauft = wi('kauft', A.tropft); A.haus = wi('Haus', A.kauft);
A.sechzehn = wi('Sechzehn', A.haus); A.oma = wi('Oma', A.sechzehn); A.london = wi('London', A.oma); A.booth = wi('Hubert', A.london); A.gross = wi('groß', A.booth); A.pferde = wi('Pferde', A.gross);
A.staunt = wi('staunt', A.pferde); A.mopp = wi('Wischmopp', A.staunt);
A.einund = wi('Einundzwanzig', A.mopp); A.bett = wi('Bett', A.einund); A.klopft = wi('klopft', A.bett); A.klo = wi('Klo', A.klopft + 1); A.puempel = wi('Pümpel', A.klo); A.gehalt = wi('Gehaltserhöhung', A.puempel);
A.wie = wi('Wie', A.gehalt); A.schreib = wi('Schreib', A.wie); A.naechstes = wi('Nächstes', A.schreib); A.astro = wi('Astronaut', A.naechstes);

const iHaus = ROLES.findIndex(r => r.name === 'Hausmeister');
const iAstro = ROLES.findIndex(r => r.name === 'Astronaut');
const wrench = ctx => emoji(ctx, '🔧', 100, -130, 70);
const mop = ctx => { line(ctx, 90, -120, 60, 10, '#8a5a32', 12); ell(ctx, 55, 20, 50, 18, '#e8e8f0', 5); };
const HAUSM = { ...RICHARD, shirt: '#3a6ab0', pants: '#3a6ab0', tie: true, badge: '🧹' };
function ell(ctx, x, y, rx, ry, fill, lw) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = OL; ctx.stroke(); } }

const scenes = [];
// ---------- 0: HOOK ----------
const iWord = wi('Hausmeister');
const HOOK_STOP = w(iWord) + 0.1, HOOK_SPINS = 15;
tickSfx(0, iHaus, HOOK_STOP, HOOK_SPINS); S(HOOK_STOP, 'ding');
scenes.push({ start: 0, draw(ctx, lt) {
  const pos = roulettePos(lt, iHaus, { tStop: HOOK_STOP, spins: HOOK_SPINS }); const role = roleAt(pos);
  B.villa(ctx, role.bg[0], role.bg[1]);
  header(ctx, 'Heute ist Richard' + art(role.name), role.name + '.');
  rouletteBar(ctx, pos, 470);
  scaled(ctx, W / 2, 650, bounce(lt, 0.15, 0.3), () => {
    box(ctx, W / 2 - 290, 590, 580, 124, 62, 'rgba(30,20,40,0.85)', 0);
    text(ctx, 'VERMÖGEN', W / 2, 622, { size: 30, color: '#ffffffaa', spacing: 5 });
    text(ctx, '47.683.594 €', W / 2, 672, { size: 62, color: C.gold });
  });
  const done = lt > HOOK_STOP;
  const look = role.name === 'Hausmeister' ? { ...HAUSM, prop: wrench } : lookFor(role.name);
  person(ctx, W / 2, 1640, { ...look, s: 1.25, t: lt, expr: done ? 'smile' : 'happy' });
  if (done) stamp(ctx, 'STUNDENLOHN: 14 €', W / 2, 860, lt - HOOK_STOP - 0.2, { size: 52, rot: -0.08, color: '#3a6ab0' });
} });

// ---------- 1: BEDEUTET ----------
[A.werkzeug, A.blau, A.erreich].forEach(i => S(w(i), 'pop'));
scenes.push({ start: w(A.bedeutet), subY: 1290, draw(ctx, lt, t) {
  B.sunset(ctx);
  person(ctx, W / 2, 1230, { ...HAUSM, s: 1.2, t, expr: 'smile', prop: wrench });
  iconCard(ctx, 200, 330, 120, t - w(A.werkzeug), { icon: '🧰', label: 'Werkzeug', labelBg: '#3a6ab0' });
  iconCard(ctx, 540, 330, 120, t - w(A.blau), { icon: '👖', label: 'Blaumann', labelBg: '#3a6ab0' });
  iconCard(ctx, 880, 330, 120, t - w(A.erreich), { icon: '📞', label: '24/7 erreichbar', labelBg: '#3a6ab0' });
} });

// ---------- 2: 07:00 HEIZUNG ----------
S(w(A.heizung), 'pop'); S(w(A.repariert), 'knock'); S(w(A.licht), 'hit'); S(w(A.taschen), 'ding');
scenes.push({ start: w(A.sieben), draw(ctx, lt, t) {
  const dark = t > w(A.licht);
  B.room(ctx, '#e9dcc6', '#8a5a3a'); clockBadge(ctx, '07:00', lt);
  // Heizkörper
  box(ctx, 560, F - 330, 380, 230, 16, '#f2f2f6'); for (let i = 0; i < 6; i++) line(ctx, 600 + i * 60, F - 310, 600 + i * 60, F - 120, '#c8c8d0', 10);
  if (t > w(A.heizung) && t < w(A.repariert)) emoji(ctx, '🥶', 750, F - 420, 80);
  if (t > w(A.repariert) && !dark) for (let i = 0; i < 4; i++) emoji(ctx, '💥', 620 + i * 80, F - 380 + Math.sin(t * 20 + i) * 10, 50);
  person(ctx, 330, F + 20, { ...HAUSM, s: 1.12, t, expr: dark ? 'shock' : 'smile', prop: wrench });
  if (dark) { ctx.fillStyle = 'rgba(5,5,20,0.82)'; ctx.fillRect(0, 0, W, H); }
  if (t > w(A.taschen)) {
    person(ctx, 830, F + 20, { ...BUTLER, s: 1.05, t, flip: true, expr: 'neutral', prop: ctx => emoji(ctx, '🔦', 110, -140, 70) });
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(330, F - 300, 20, 330, F - 300, 260); g.addColorStop(0, 'rgba(255,240,170,0.55)'); g.addColorStop(1, 'rgba(255,240,170,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
  }
  if (dark) clockBadge(ctx, '07:00', 1);
} });

// ---------- 3: 10:00 MARMOR WISCHEN ----------
S(w(A.qm), 'pop'); S(w(A.nach), 'whoosh'); S(w(A.geschafft), 'ding');
scenes.push({ start: w(A.zehn), draw(ctx, lt, t) {
  ctx.fillStyle = '#efe6d8'; ctx.fillRect(0, 0, W, F);
  for (const x of [140, 940]) { box(ctx, x - 50, 300, 100, F - 300, 6, '#fffaf0'); }
  line(ctx, 540, 0, 540, 200, OL, 6); box(ctx, 420, 200, 240, 30, 15, C.gold);
  // Marmorboden
  ctx.fillStyle = '#f4f4f6'; ctx.fillRect(0, F, W, H - F);
  ctx.strokeStyle = '#d0d0d8'; ctx.lineWidth = 4; for (let x = -400; x < W + 400; x += 160) { ctx.beginPath(); ctx.moveTo(x, F); ctx.lineTo(x + (x - 540) * 0.8, H); ctx.stroke(); }
  for (let y = F + 80; y < H; y += 120) line(ctx, 0, y, W, y, '#d0d0d8', 4);
  clockBadge(ctx, '10:00', lt);
  const k = clamp((t - w(A.wischt)) / (w(A.geschafft) - w(A.wischt)));
  ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = '#bfe8ff'; ctx.fillRect(0, F + 20, 160 * k + 40, 260); ctx.restore();
  person(ctx, 200 + 120 * k, F + 120, { ...HAUSM, s: 1.05, t, expr: t > w(A.nach) ? 'sad' : 'smile', prop: mop, hop: false });
  if (t > w(A.qm)) pill(ctx, '2.000 m² MARMOR', W / 2, 420, t - w(A.qm), { bg: OL, size: 50 });
  if (t > w(A.nach)) { scaled(ctx, 780, 700, bounce(t - w(A.nach), 0, 0.3), () => { box(ctx, 580, 600, 400, 200, 24, '#fff'); text(ctx, '⏱ +3 h', 780, 660, { size: 54, color: OL }); text(ctx, '1 / 60 Zimmer', 780, 740, { size: 46, color: C.red }); }); }
} });

// ---------- 4: 12:00 LEITER + NACHBAR ----------
S(w(A.nachbar), 'knock'); S(w(A.tropft), 'pop'); S(w(A.kauft), 'coins'); S(w(A.haus), 'magic');
scenes.push({ start: w(A.zwoelf), draw(ctx, lt, t) {
  B.streetDay(ctx); clockBadge(ctx, '12:00', lt);
  // Leiter
  line(ctx, 200, F + 20, 280, F - 520, '#c8a070', 16); line(ctx, 380, F + 20, 300, F - 520, '#c8a070', 16);
  for (let i = 1; i < 8; i++) { const y = F + 20 - i * 68; line(ctx, 200 + i * 11, y, 380 - i * 11, y, '#c8a070', 10); }
  person(ctx, 290, F - 300, { ...HAUSM, s: 0.9, t, expr: t > w(A.kauft) ? 'happy' : 'smile', prop: ctx => emoji(ctx, '🥪', 100, -130, 64) });
  person(ctx, 820, F + 20, { hair: 'dad', hairColor: '#a06030', shirt: '#e8a040', pants: '#556', s: 1.0, t, flip: true, expr: t > w(A.haus) ? 'wow' : 'sad', talk: t > w(A.nachbar) && t < w(A.tropft) + 0.3 });
  bubble(ctx, 'Mein Wasserhahn tropft! 💧', 820, 640, t - w(A.nachbar) - 0.3, { size: 42, max: 380, dur: w(A.kauft) - w(A.nachbar) + 0.3 });
  if (t > w(A.kauft)) emoji(ctx, '🚰', 680, F - 120, 90);
  if (t > w(A.haus)) { scaled(ctx, 820, 520, bounce(t - w(A.haus), 0, 0.4), () => emoji(ctx, '🏡', 820, 520, 200)); stamp(ctx, 'GESCHENKT', 820, 700, t - w(A.haus) - 0.3, { size: 54, color: '#2f9a4a' }); }
} });

// ---------- 5: 16:00 OMA – FAKT ----------
S(w(A.oma), 'ding'); S(w(A.london), 'whoosh'); S(w(A.booth), 'pop'); S(w(A.pferde), 'magic'); S(w(A.mopp), 'pop');
scenes.push({ start: w(A.sechzehn), draw(ctx, lt, t) {
  B.livingRoom(ctx); clockBadge(ctx, '16:00', lt);
  B.screen(ctx, W / 2, 610, 920, 600, () => {
    const cx = W / 2, cy = 610;
    if (t < w(A.london)) {
      ctx.fillStyle = '#f6e6d6'; ctx.fillRect(cx - 460, cy - 300, 920, 600);
      box(ctx, cx - 444, cy - 284, 888, 60, 0, '#fff', 0); text(ctx, 'Oma · Videoanruf', cx - 220, cy - 254, { size: 32, color: OL });
      box(ctx, cx + 300, cy - 274, 100, 40, 10, C.red, 0); text(ctx, 'LIVE', cx + 350, cy - 253, { size: 28, color: '#fff' });
      person(ctx, cx, cy + 430, { hair: 'grandma', glasses: true, shirt: '#b07ad0', t, s: 1.05, wave: true });
    } else if (t < w(A.booth)) {
      B.ukFlag(ctx, cx - 200, cy, 300);
      scaled(ctx, cx + 220, cy, bounce(t - w(A.london) - 0.4, 0, 0.3), () => text(ctx, '1901', cx + 220, cy, { size: 140, color: C.gold }));
    } else if (t < w(A.gross)) {
      circ(ctx, cx - 250, cy - 20, 120, '#fff'); person(ctx, cx - 250, cy + 210, { hair: 'dad', hairColor: '#4a3020', mustache: true, shirt: '#4a4a5a', s: 0.5, t });
      box(ctx, cx - 370, cy + 120, 240, 50, 10, C.gold, 0); text(ctx, 'Hubert Booth', cx - 250, cy + 146, { size: 30, color: OL });
      text(ctx, 'erster', cx + 170, cy - 80, { size: 50, color: '#fff' }); text(ctx, 'motorisierter', cx + 170, cy - 10, { size: 50, color: '#fff' }); text(ctx, 'Staubsauger', cx + 170, cy + 70, { size: 60, color: C.gold });
    } else {
      // Pferdekutsche mit riesigem Staubsauger
      const x = cx - 380 + clamp((t - w(A.gross)) / 4) * 300;
      box(ctx, x + 120, cy - 140, 300, 200, 20, '#c83a34'); text(ctx, 'VACUUM', x + 270, cy - 40, { size: 40, color: '#fff' });
      circ(ctx, x + 170, cy + 80, 40, '#2b2b2b'); circ(ctx, x + 370, cy + 80, 40, '#2b2b2b');
      if (t > w(A.pferde)) { emoji(ctx, '🐎', x, cy - 10, 170); }
      line(ctx, x + 420, cy - 60, x + 560, cy + 40, '#888', 14);
      text(ctx, 'SO GROSS, DASS PFERDE IHN ZIEHEN', cx, cy - 230, { size: 36, color: '#fff' });
    }
  });
  person(ctx, 220, F + 30, { ...HAUSM, s: 1.05, t, look: 0.6, expr: t > w(A.staunt) ? 'wow' : 'smile', prop: mop });
  bubble(ctx, 'Und ich beschwere mich über meinen Wischmopp.', 320, 860, t - w(A.mopp) + 1.2, { size: 38, max: 440, color: '#fff7d6' });
} });

// ---------- 6–8: 21:00 KLO, FRAGE, NÄCHSTE ROLLE ----------
S(w(A.bett), 'pop'); S(w(A.klopft), 'knock'); S(w(A.puempel), 'pop'); S(w(A.gehalt), 'coins'); S(w(A.wie), 'ding'); S(w(A.schreib), 'pop');
const END = w(A.naechstes), END_STOP = w(A.astro) + 0.1 - END, END_SPINS = 13;
tickSfx(END, iAstro, END_STOP, END_SPINS); S(END + END_STOP, 'ding');
const plunger = ctx => { line(ctx, 100, -100, 100, -260, '#c8a070', 12); ctx.beginPath(); ctx.arc(100, -90, 40, Math.PI, 0); ctx.closePath(); ctx.fillStyle = C.red; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = OL; ctx.stroke(); };
function nightScene(ctx, lt, t, clock = true) {
  B.livingRoom(ctx, true); if (clock) clockBadge(ctx, '21:00', lt);
  // Bett
  box(ctx, 60, F - 250, 620, 160, 30, '#6a5a9a'); box(ctx, 80, F - 300, 160, 90, 30, '#fff'); box(ctx, 60, F - 100, 30, 100, 6, '#3a2a4a'); box(ctx, 650, F - 100, 30, 100, 6, '#3a2a4a');
  const inBed = t > w(A.bett);
  const gave = t > w(A.puempel);
  if (inBed) {
    // Richard liegend: Kopf auf Kissen, Decke
    person(ctx, 380, F - 140, { ...HAUSM, s: 0.8, t, expr: t > w(A.klopft) ? 'shock' : 'sleep' });
    box(ctx, 230, F - 290, 440, 120, 30, '#8a7ac0');
  } else person(ctx, 330, F + 20, { ...HAUSM, s: 1.1, t, expr: 'sad', tilt: 0.15 });
  if (t > w(A.klopft)) person(ctx, 880, F + 20, { ...BUTLER, s: 1.05, t, flip: true, expr: gave ? 'happy' : 'neutral', prop: gave ? plunger : null, talk: t > w(A.klopft) && t < w(A.klo) + 0.6 });
  bubble(ctx, 'Sir, das Klo ist verstopft. 🚽', 860, 620, t - w(A.klopft) - 0.2, { size: 40, max: 380, dur: w(A.puempel) - w(A.klopft) + 0.5 });
  if (t > w(A.gehalt)) pill(ctx, 'Gehalt ↑ 💶', 880, 680, t - w(A.gehalt), { bg: '#2f9a4a', size: 44 });
  if (inBed && t < w(A.klopft)) { text(ctx, 'Z', 520, 720 - (lt * 40) % 60, { size: 76, color: '#fff', stroke: 8 }); }
}
scenes.push({ start: w(A.einund), draw: nightScene });
scenes.push({ start: w(A.wie), noSlide: true, noWhoosh: true, draw(ctx, lt, t) {
  nightScene(ctx, t - w(A.einund), t);
  questionCard(ctx, 'Wie lange würdest du als Hausmeister durchhalten?', lt, 400);
  commentSign(ctx, 860, 1120, t - w(A.schreib));
} });
scenes.push({ start: END, noSlide: true, draw(ctx, lt, t) {
  nightScene(ctx, t - w(A.einund), t, false);
  ctx.fillStyle = 'rgba(20,14,40,0.45)'; ctx.fillRect(0, 0, W, 620);
  const pos = roulettePos(lt, iAstro, { tStop: END_STOP, spins: END_SPINS }); const role = roleAt(pos);
  header(ctx, 'Nächstes Mal ist Richard' + art(role.name), role.name + '.', 170);
  rouletteBar(ctx, pos, 480);
  commentSign(ctx, 860, 1120, 1);
} });

run({ scenes, chunks, duration, sfx, subY: 1300, hideSubs: [[0, w(A.bedeutet) - 0.05]] });
