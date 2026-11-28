// Thumbnail Folge 1 (Still bei t = 0.5)
import { setup, reflect, W, H, FLOOR, GOLD, RED, WHITE, x, text, stamp, coin, vignette } from '/engine/core.js';
import { actor } from '/engine/characters.js';
import { SETS } from '/engine/sets.js';
const r = actor('richard', { x: 1330, y: 1640, s: 2.3, keys: [[0, { expr: 'smug', look: -0.5, tilt: -0.04 }]] });
const f = actor('finanzamt', { x: 1790, y: 1010, s: 0.72, keys: [[0, { expr: 'shock', armL: 'up', armR: 'up', look: -0.7 }]] });
setup({
  words: [{ w: '', s: 99, e: 99 }], mouth: [], chapters: [], duration: 1, scenes: [{
    start: 0, noCaption: true,
    stage: t => { SETS.stage(t, { gx: 1350, a: 0.3 }); f.draw(t); r.draw(t); for (const [a, b, rr, k] of [[960, 150, 28, 0.3], [1040, 270, 20, 1.2], [900, 340, 22, 2.1], [1600, 110, 26, 0.7], [1680, 250, 18, 1.8]]) coin(a, b, rr, k); },
    ui: t => {
      text('−94 %', 480, 330, { size: 270, color: GOLD, weight: 900, glow: 0.75, stroke: 14 });
      text('STEUERN', 480, 590, { size: 160, color: WHITE, weight: 900, glow: 0.3, stroke: 14 });
      stamp('LEGAL', 480, 800, { size: 90, rot: -0.06 });
    },
  }],
});
