// Timeline: Wörter laden, Szenen abspielen, Untertitel + SFX
import { W, H, subtitle } from './chibi.js';

export async function setup(videoDir, { capMap = {}, breakBefore = [], tail = 1.6 } = {}) {
  const words = await (await fetch('/' + videoDir + '/words.json')).json();
  const w = i => words[Math.min(i, words.length - 1)].s;
  const we = i => words[Math.min(i, words.length - 1)].e;
  // Untertitel-Chunks: Satzende (. ? ! :) oder Gedankenstrich beendet einen Chunk
  const chunks = []; let cur = null;
  words.forEach((x, i) => {
    if (x.w === '–') return;
    if (!cur || breakBefore.includes(i)) { if (cur) chunks.push(cur); cur = { s: x.s, words: [] }; }
    cur.words.push(x.w); cur.e = x.e;
    if (/[.?!:]$/.test(x.w)) { chunks.push(cur); cur = null; }
  });
  if (cur) chunks.push(cur);
  for (const c of chunks) {
    let s = c.words.join(' ');
    for (const [a, b] of Object.entries(capMap)) s = s.split(a).join(b);
    c.text = s;
  }
  chunks.forEach((c, i) => { c.end = i + 1 < chunks.length ? Math.min(chunks[i + 1].s, c.e + 0.6) : c.e + 0.8; });
  const duration = words[words.length - 1].e + tail;
  return { words, w, we, chunks, duration };
}

/** scenes: [{ start, draw(ctx, lt, t) }], hideSubs: [ [t0,t1] ] */
export function run({ scenes, chunks, duration, sfx = [], subY = 1250, hideSubs = [] }) {
  const cv = document.getElementById('out'); const ctx = cv.getContext('2d');
  scenes.sort((a, b) => a.start - b.start);
  window.DURATION = duration;
  // automatische Whoosh-SFX bei Szenenwechsel
  const ev = [...sfx]; scenes.slice(1).forEach(s => { if (!s.noWhoosh) ev.push({ t: Math.max(0, s.start - 0.05), type: 'swipe' }); });
  window.SFX_EVENTS = ev.sort((a, b) => a.t - b.t);
  window.renderFrame = (t, q = 0.9) => {
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.clearRect(0, 0, W, H);
    let idx = 0; for (let i = 0; i < scenes.length; i++) if (t >= scenes[i].start) idx = i;
    const sc = scenes[idx]; const lt = t - sc.start;
    // kurzer Slide-In bei Szenenwechsel
    const k = idx > 0 && !sc.noSlide ? Math.min(1, lt / 0.14) : 1;
    ctx.save();
    if (k < 1) { ctx.translate((1 - k) * (1 - k) * W * 0.35, 0); }
    sc.draw(ctx, lt, t);
    ctx.restore();
    if (!hideSubs.some(([a, b]) => t >= a && t < b)) {
      const c = chunks.find(c => t >= c.s - 0.05 && t < c.end);
      if (c) subtitle(ctx, c.text, t - c.s + 0.05, sc.subY || subY);
    }
    return cv.toDataURL('image/jpeg', q);
  };
}
