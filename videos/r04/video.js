// Folge 4 – „Heute ist Richard ein Influencer.“
import { W, H, OL, C, clamp, lerp, easeOut, easeInOut, bounce, box, circ, line, poly, text, emoji, alpha, scaled,
  person, RICHARD, BUTLER, clockBadge, bubble, iconCard, stamp, pill, questionCard, commentSign,
  ROLES, rouletteBar, roulettePos } from '../../engine/chibi.js';
import * as B from '../../engine/bg.js';
import { setup, run } from '../../engine/timeline.js';

const F = B.FLOOR;
const { words, w, chunks, duration } = await setup('videos/r04', {
  tail: 1.4,
  capMap: {
    'Sieben Uhr.': '7 Uhr.', 'Zehn Uhr.': '10 Uhr.', 'Zwölf Uhr.': '12 Uhr.', 'Sechzehn Uhr.': '16 Uhr.', 'Einundzwanzig Uhr.': '21 Uhr.',
    'Siebenundvierzig Versuche': '47 Versuche', 'Zwölf Likes': '12 Likes', 'zwölf Likes': '12 Likes', 'siebenundvierzig Millionen Euro': '47 Millionen Euro',
    'zweitausendfünf': '2005', 'Neunzehn Sekunden': '19 Sekunden', 'zwei Millionen': '2 Millionen',
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
A.bedeutet = wi('Bedeutet'); A.filmen = wi('filmen', A.bedeutet); A.posten = wi('posten', A.filmen); A.laecheln = wi('lächeln', A.posten);
A.sieben = wi('Sieben', A.laecheln); A.versuche = wi('Versuche', A.sieben); A.kalt = wi('kalt', A.versuche); A.fragt = wi('fragt', A.kalt); A.sagt1 = wi('sagt', A.fragt); A.story = wi('Story', A.sagt1);
A.zehn = wi('Zehn', A.story); A.packt = wi('packt', A.zehn); A.privatjet = wi('Privatjet', A.packt); A.likes1 = wi('Likes', A.privatjet);
A.zwoelf = wi('Zwölf', A.likes1); A.marke = wi('Marke', A.zwoelf); A.tee = wi('Gratis', A.marke); A.millionen = wi('Millionen', A.tee); A.trotzdem = wi('trotzdem', A.millionen);
A.sechzehn = wi('Sechzehn', A.trotzdem); A.oma = wi('Oma', A.sechzehn); A.kali = wi('Kalifornien', A.oma); A.jawed = wi('Jawed', A.kali); A.sek = wi('Sekunden', A.jawed);
A.titel = wi('Titel', A.sek); A.online = wi('online', A.titel); A.staunt = wi('staunt', A.online); A.intros = wi('Intros', A.staunt);
A.einund = wi('Einundzwanzig', A.intros); A.zahlen = wi('Zahlen', A.einund); A.jetstory = wi('Privatjet', A.zahlen); A.johanns = wi('Johanns', A.jetstory);
A.zweimio = wi('Millionen', A.johanns); A.gefeuert = wi('gefeuert', A.zweimio); A.manager = wi('Manager', A.gefeuert);
A.wuerdest = wi('Würdest', A.manager); A.schreib = wi('Schreib', A.wuerdest); A.naechstes = wi('Nächstes', A.schreib); A.moench = wi('Mönch', A.naechstes);

const iInflu = ROLES.findIndex(r => r.name === 'Influencer');
const iMoench = ROLES.findIndex(r => r.name === 'Mönch');
const phone = ctx => { box(ctx, 66, -210, 54, 96, 10, '#2b2b35', 5); box(ctx, 72, -202, 42, 72, 4, '#7ad0f0', 0); circ(ctx, 93, -196, 4, '#e8504a', 0); };
const INFLU = { ...RICHARD, shirt: '#f08cc0', badge: '🤳', tie: true, prop: phone };
const heart = (ctx, x, y, n, t, bg = '#e8504a') => pill(ctx, '❤️ ' + n, x, y, t, { bg, size: 46 });

const scenes = [];
// ---------- 0: HOOK ----------
const iWord = wi('Influencer');
const HOOK_STOP = w(iWord) + 0.1, HOOK_SPINS = 15;
tickSfx(0, iInflu, HOOK_STOP, HOOK_SPINS); S(HOOK_STOP, 'ding');
scenes.push({ start: 0, draw(ctx, lt) {
  const pos = roulettePos(lt, iInflu, { tStop: HOOK_STOP, spins: HOOK_SPINS }); const role = roleAt(pos);
  B.villa(ctx, role.bg[0], role.bg[1]);
  header(ctx, 'Heute ist Richard' + art(role.name), role.name + '.');
  rouletteBar(ctx, pos, 470);
  scaled(ctx, W / 2, 650, bounce(lt, 0.15, 0.3), () => {
    box(ctx, W / 2 - 290, 590, 580, 124, 62, 'rgba(30,20,40,0.85)', 0);
    text(ctx, 'VERMÖGEN', W / 2, 622, { size: 30, color: '#ffffffaa', spacing: 5 });
    text(ctx, '47.683.594 €', W / 2, 672, { size: 62, color: C.gold });
  });
  const done = lt > HOOK_STOP;
  const look = role.name === 'Influencer' ? INFLU : lookFor(role.name);
  person(ctx, W / 2, 1640, { ...look, s: 1.25, t: lt, expr: 'happy' });
  if (done) stamp(ctx, 'FOLLOWER: 0', W / 2, 860, lt - HOOK_STOP - 0.2, { size: 56, rot: -0.08, color: '#c8408a' });
} });

// ---------- 1: BEDEUTET ----------
[A.filmen, A.posten, A.laecheln].forEach(i => S(w(i), 'pop'));
scenes.push({ start: w(A.bedeutet), subY: 1290, draw(ctx, lt, t) {
  B.sunset(ctx);
  person(ctx, W / 2, 1230, { ...INFLU, s: 1.2, t, expr: t > w(A.laecheln) ? 'happy' : 'smile' });
  iconCard(ctx, 200, 330, 120, t - w(A.filmen), { icon: '🎥', label: 'immer filmen', labelBg: '#c8408a' });
  iconCard(ctx, 540, 330, 120, t - w(A.posten), { icon: '📲', label: 'immer posten', labelBg: '#c8408a' });
  iconCard(ctx, 880, 330, 120, t - w(A.laecheln), { icon: '😁', label: 'immer lächeln', labelBg: '#c8408a' });
} });

// ---------- 2: 07:00 FRÜHSTÜCK FILMEN ----------
S(w(A.versuche), 'pop'); S(w(A.kalt), 'pop'); S(w(A.fragt), 'pop'); S(w(A.story), 'pop');
scenes.push({ start: w(A.sieben), draw(ctx, lt, t) {
  B.diningRoom(ctx); clockBadge(ctx, '07:00', lt); B.longTable(ctx, F);
  emoji(ctx, '🍳', 540, F - 300, 90);
  if (t > w(A.kalt)) { emoji(ctx, '🥶', 620, F - 350, 60); }
  person(ctx, 280, F + 20, { ...INFLU, s: 1.12, t, expr: 'happy', talk: t > w(A.sagt1) && t < w(A.story) + 0.4 });
  if (t > w(A.versuche) - 0.2) { const n = Math.min(47, Math.floor(1 + (t - w(A.versuche) + 0.2) * 40)); pill(ctx, `Versuch ${n}/47`, 280, 760, t - w(A.versuche) + 0.2, { bg: OL, size: 40 }); }
  person(ctx, 800, F + 20, { ...BUTLER, s: 1.12, t, flip: true, expr: t > w(A.story) ? 'sad' : 'neutral', talk: t > w(A.fragt) && t < w(A.sagt1) });
  bubble(ctx, 'Darf ich es jetzt essen?', 800, 620, t - w(A.fragt) - 0.2, { size: 44, max: 420, dur: w(A.sagt1) - w(A.fragt) + 0.4 });
  bubble(ctx, 'Erst nach der Story. 📱', 320, 620, t - w(A.story) + 0.5, { size: 46, color: '#fff7d6' });
} });

// ---------- 3: 10:00 UNBOXING ----------
S(w(A.packt), 'whoosh'); S(w(A.privatjet), 'magic'); S(w(A.likes1), 'pop');
scenes.push({ start: w(A.zehn), draw(ctx, lt, t) {
  B.livingRoom(ctx); clockBadge(ctx, '10:00', lt);
  // Ringlicht
  circ(ctx, 900, 560, 90, null, 18); line(ctx, 900, 650, 900, F, OL, 8);
  pill(ctx, 'UNBOXING 📦', W / 2, 400, lt - 0.2, { bg: '#c8408a', size: 50 });
  const open = t > w(A.privatjet) - 0.2;
  if (!open) { box(ctx, 420, F - 320, 300, 300, 10, '#c8a070'); box(ctx, 400, F - 360, 340, 70, 10, '#b88a5a'); box(ctx, 550, F - 360, 40, 340, 0, C.red, 0); }
  else { box(ctx, 420, F - 220, 300, 200, 10, '#c8a070'); scaled(ctx, 570, F - 380, bounce(t - w(A.privatjet) + 0.2, 0, 0.4), () => emoji(ctx, '✈️', 570, F - 380, 260)); }
  person(ctx, 230, F + 20, { ...INFLU, s: 1.1, t, expr: open ? 'wow' : 'happy' });
  if (t > w(A.likes1)) { heart(ctx, 570, 760, '12', t - w(A.likes1)); stamp(ctx, 'NUR 12?!', 570, 640, t - w(A.likes1) - 0.4, { size: 56 }); }
} });

// ---------- 4: 12:00 KOOPERATION ----------
S(w(A.marke), 'knock'); S(w(A.tee), 'pop'); S(w(A.millionen), 'coins'); S(w(A.trotzdem), 'ding');
scenes.push({ start: w(A.zwoelf), draw(ctx, lt, t) {
  B.villa(ctx, '#8fd0f0', '#d8f0fa'); clockBadge(ctx, '12:00', lt);
  if (t > w(A.marke)) { const k = easeOut((t - w(A.marke)) / 0.6); box(ctx, lerp(1200, 640, k), F + 60, 220, 180, 10, '#c8a070'); text(ctx, 'GRATIS', lerp(1310, 750, k), F + 150, { size: 40, color: OL }); }
  if (t > w(A.tee)) emoji(ctx, '🍵', 750, F - 30, 100);
  person(ctx, 330, F + 260, { ...INFLU, s: 1.15, t, expr: t > w(A.trotzdem) ? 'happy' : 'smile' });
  if (t > w(A.millionen)) {
    scaled(ctx, W / 2, 640, bounce(t - w(A.millionen), 0, 0.3), () => {
      box(ctx, 140, 520, 800, 240, 26, '#fff');
      text(ctx, 'Vermögen: 47.683.594 €', W / 2, 590, { size: 50, color: OL });
      text(ctx, 'Tee: 0 €', W / 2, 690, { size: 64, color: '#2f9a4a' });
    });
  }
  if (t > w(A.trotzdem)) stamp(ctx, 'ANGENOMMEN ✓', W / 2, 880, t - w(A.trotzdem), { size: 54, color: '#2f9a4a' });
} });

// ---------- 5: 16:00 OMA – FAKT ----------
S(w(A.oma), 'ding'); S(w(A.kali), 'whoosh'); S(w(A.jawed), 'pop'); S(w(A.sek), 'pop'); S(w(A.titel), 'pop'); S(w(A.online), 'ding'); S(w(A.intros), 'pop');
scenes.push({ start: w(A.sechzehn), draw(ctx, lt, t) {
  B.livingRoom(ctx); clockBadge(ctx, '16:00', lt);
  B.screen(ctx, W / 2, 610, 920, 600, () => {
    const cx = W / 2, cy = 610;
    if (t < w(A.kali)) {
      ctx.fillStyle = '#f6e6d6'; ctx.fillRect(cx - 460, cy - 300, 920, 600);
      box(ctx, cx - 444, cy - 284, 888, 60, 0, '#fff', 0); text(ctx, 'Oma · Videoanruf', cx - 220, cy - 254, { size: 32, color: OL });
      box(ctx, cx + 300, cy - 274, 100, 40, 10, C.red, 0); text(ctx, 'LIVE', cx + 350, cy - 253, { size: 28, color: '#fff' });
      person(ctx, cx, cy + 430, { hair: 'grandma', glasses: true, shirt: '#b07ad0', t, s: 1.05, wave: true });
    } else if (t < w(A.jawed)) {
      emoji(ctx, '🌴', cx - 200, cy - 20, 200); text(ctx, 'Kalifornien', cx - 200, cy + 140, { size: 40, color: '#fff' });
      scaled(ctx, cx + 210, cy, bounce(t - w(A.kali) - 0.4, 0, 0.3), () => text(ctx, '2005', cx + 210, cy, { size: 140, color: C.gold }));
    } else if (t < w(A.online)) {
      // YouTube-Player
      box(ctx, cx - 380, cy - 230, 760, 400, 16, '#7fae5a', 0);
      emoji(ctx, '🐘', cx + 160, cy - 40, 200); person(ctx, cx - 170, cy + 160, { hair: 'dad', hairColor: '#2b2020', shirt: '#e8e8e8', s: 0.6, t, talk: true });
      circ(ctx, cx, cy - 30, 54, 'rgba(232,40,40,0.9)', 0); ctx.beginPath(); ctx.moveTo(cx - 16, cy - 56); ctx.lineTo(cx + 26, cy - 30); ctx.lineTo(cx - 16, cy - 4); ctx.fillStyle = '#fff'; ctx.fill();
      if (t > w(A.sek)) { box(ctx, cx + 250, cy + 120, 110, 44, 8, 'rgba(0,0,0,0.75)', 0); text(ctx, '0:19', cx + 305, cy + 143, { size: 32, color: '#fff' }); }
      box(ctx, cx - 300, cy + 190, 210, 46, 10, C.gold, 0); text(ctx, 'Jawed Karim', cx - 195, cy + 214, { size: 30, color: OL });
      if (t > w(A.titel)) text(ctx, '„Me at the zoo“', cx + 90, cy + 214, { size: 40, color: '#fff' });
    } else {
      text(ctx, '„Me at the zoo“', cx, cy - 90, { size: 70, color: '#fff' });
      scaled(ctx, cx, cy + 60, bounce(t - w(A.online), 0, 0.3), () => text(ctx, 'bis heute online ✓', cx, cy + 60, { size: 64, color: '#7ad08a' }));
    }
  });
  person(ctx, 220, F + 30, { ...INFLU, s: 1.05, t, look: 0.6, expr: t > w(A.staunt) ? 'wow' : 'smile' });
  bubble(ctx, 'Meine Intros sind länger.', 280, 860, t - w(A.intros) + 0.6, { size: 40, max: 400, color: '#fff7d6' });
} });

// ---------- 6–8: 21:00 ZAHLEN, FRAGE, NÄCHSTE ROLLE ----------
S(w(A.jetstory), 'pop'); S(w(A.zweimio), 'coins'); S(w(A.gefeuert), 'hit'); S(w(A.manager), 'ding'); S(w(A.wuerdest), 'ding'); S(w(A.schreib), 'pop');
const END = w(A.naechstes), END_STOP = w(A.moench) + 0.1 - END, END_SPINS = 13;
tickSfx(END, iMoench, END_STOP, END_SPINS); S(END + END_STOP, 'ding');
const shades = ctx => emoji(ctx, '🕶️', 0, -378, 120);
function nightScene(ctx, lt, t, clock = true) {
  B.livingRoom(ctx, true); if (clock) clockBadge(ctx, '21:00', lt);
  // Statistik-Panel
  if (t > w(A.jetstory) - 0.2) {
    box(ctx, 120, 360, 840, 420, 30, '#fff');
    text(ctx, 'STATISTIK', W / 2, 410, { size: 34, color: '#999', spacing: 4 });
    emoji(ctx, '✈️', 220, 500, 70); text(ctx, 'Privatjet-Story', 290, 500, { size: 38, color: OL, align: 'left' });
    text(ctx, '❤️ 12', 900, 500, { size: 46, color: C.red, align: 'right' });
    if (t > w(A.johanns)) { emoji(ctx, '🍳', 220, 640, 70); text(ctx, 'Johanns Rührei', 290, 640, { size: 38, color: OL, align: 'left' });
      const n = t > w(A.zweimio) ? '2.000.000' : '…'; text(ctx, '❤️ ' + n, 930, 640, { size: 40, color: C.red, align: 'right' }); }
  }
  const star = t > w(A.manager) - 0.4;
  person(ctx, 780, F + 20, { ...BUTLER, s: 1.1, t, flip: true, expr: 'happy', prop: star ? shades : null });
  person(ctx, 300, F + 20, { ...INFLU, s: 1.1, t, expr: t > w(A.zweimio) ? 'shock' : 'smile', talk: t > w(A.gefeuert) - 1.0 && t < w(A.gefeuert) + 0.3 });
  bubble(ctx, 'Johann, Sie sind gefeuert.', 320, 880, t - w(A.gefeuert) + 0.9, { size: 42, max: 400, color: '#fff7d6', dur: w(A.manager) - w(A.gefeuert) + 0.3 });
  bubble(ctx, 'Ich habe jetzt einen Manager. 😎', 760, 880, t - w(A.manager) + 0.9, { size: 42, max: 420, dur: w(A.wuerdest) - w(A.manager) + 1.0 });
}
scenes.push({ start: w(A.einund), draw: nightScene });
scenes.push({ start: w(A.wuerdest), noSlide: true, noWhoosh: true, draw(ctx, lt, t) {
  nightScene(ctx, t - w(A.einund), t);
  questionCard(ctx, 'Würdest du dein ganzes Leben für Likes filmen?', lt, 400);
  commentSign(ctx, 860, 1120, t - w(A.schreib));
} });
scenes.push({ start: END, noSlide: true, draw(ctx, lt, t) {
  nightScene(ctx, t - w(A.einund), t, false);
  ctx.fillStyle = 'rgba(20,14,40,0.55)'; ctx.fillRect(0, 0, W, 800);
  const pos = roulettePos(lt, iMoench, { tStop: END_STOP, spins: END_SPINS }); const role = roleAt(pos);
  header(ctx, 'Nächstes Mal ist Richard' + art(role.name), role.name + '.', 170);
  rouletteBar(ctx, pos, 480);
  commentSign(ctx, 860, 1120, 1);
} });

run({ scenes, chunks, duration, sfx, subY: 1300, hideSubs: [[0, w(A.bedeutet) - 0.05]] });
