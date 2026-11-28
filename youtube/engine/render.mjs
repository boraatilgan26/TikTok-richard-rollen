// Nutzung: node youtube/engine/render.mjs youtube/ep01 [--stills 1,5,10] [--from s --to s --out part.mp4] [--sfx-only]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const args = process.argv.slice(2);
const ep = path.relative(ROOT, path.resolve(args[0]));
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const FPS = 30;
const NM = fs.existsSync(path.join(ROOT, 'node_modules')) ? ROOT : path.join(ROOT, '..');

const types = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.html': 'text/html', '.json': 'application/json', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  const p = u.startsWith('/node_modules/') ? path.join(NM, u) : path.join(ROOT, u);
  fs.readFile(p, (e, d) => { if (e) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream' }); res.end(d); });
}).listen(0);
const port = server.address().port;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
page.on('console', m => console.log('[page]', m.text()));
page.on('pageerror', e => console.error('[pageerror]', e.message));
await page.goto(`http://localhost:${port}/engine/render.html?ep=${ep}`);
await page.waitForFunction(() => window.READY === true, null, { timeout: 60000 });
const duration = await page.evaluate(() => window.DURATION);
fs.writeFileSync(path.join(ROOT, ep, 'sfx.json'), JSON.stringify(await page.evaluate(() => window.SFX_EVENTS)));

const stills = opt('stills');
if (args.includes('--sfx-only')) {
  console.log('duration', duration); fs.writeFileSync(path.join(ROOT, ep, 'scenes.json'), JSON.stringify(await page.evaluate(() => window.SCENE_T)));
} else if (stills) {
  const dir = path.join(ROOT, ep, 'stills'); fs.mkdirSync(dir, { recursive: true });
  for (const s of stills.split(',').map(Number)) {
    const url = await page.evaluate(t => window.renderFrame(t, 0.88), s);
    fs.writeFileSync(path.join(dir, `t${s.toFixed(1).padStart(6, '0')}.jpg`), Buffer.from(url.split(',')[1], 'base64'));
  }
  console.log('stills done');
} else {
  const from = Number(opt('from', 0)), to = Math.min(Number(opt('to', duration)), duration);
  const outFile = path.resolve(opt('out', path.join(ROOT, ep, 'video_noaudio.mp4')));
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', outFile], { stdio: ['pipe', 'inherit', 'inherit'] });
  const f0 = Math.round(from * FPS), f1 = Math.round(to * FPS), N = f1 - f0, t0 = Date.now();
  for (let f = f0; f < f1; f++) {
    const url = await page.evaluate(t => window.renderFrame(t, 0.92), f / FPS);
    const buf = Buffer.from(url.split(',')[1], 'base64');
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if ((f - f0) % 300 === 0) { const el = (Date.now() - t0) / 1000, d = f - f0 + 1; console.log(`[${path.basename(outFile)}] frame ${d}/${N}  ${(el / d).toFixed(3)}s/frame  ETA ${((N - d) * el / d / 60).toFixed(1)} min`); }
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  console.log('video done', outFile);
}
await browser.close(); server.close();
