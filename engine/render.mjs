// Nutzung: node engine/render.mjs <videoDir> [--stills 0,5,10] [--from s --to s] [--fps 30]
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const args = process.argv.slice(2);
const videoDir = args[0];
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const FPS = Number(opt('fps', 30));
const types = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.html': 'text/html', '.json': 'application/json', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  fs.readFile(p, (e, d) => { if (e) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream' }); res.end(d); });
}).listen(0);
const port = server.address().port;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
page.on('console', m => console.log('[page]', m.text()));
page.on('pageerror', e => console.error('[pageerror]', e.message));
await page.goto(`http://localhost:${port}/engine/render.html?video=${videoDir}`);
await page.waitForFunction(() => window.READY === true, null, { timeout: 60000 });
const duration = await page.evaluate(() => window.DURATION);
fs.writeFileSync(path.join(ROOT, videoDir, 'sfx.json'), JSON.stringify(await page.evaluate(() => window.SFX_EVENTS)));
const stills = opt('stills');
if (stills) {
  const dir = path.join(ROOT, videoDir, 'stills'); fs.mkdirSync(dir, { recursive: true });
  for (const s of stills.split(',').map(Number)) {
    const url = await page.evaluate(t => window.renderFrame(t, 0.85), s);
    fs.writeFileSync(path.join(dir, `t${s.toFixed(2).padStart(6, '0')}.jpg`), Buffer.from(url.split(',')[1], 'base64'));
  }
  console.log('stills done');
} else {
  const from = Number(opt('from', 0)), to = Number(opt('to', duration));
  const outFile = path.join(ROOT, videoDir, opt('out', 'video_noaudio.mp4'));
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', outFile], { stdio: ['pipe', 'inherit', 'inherit'] });
  const N = Math.round((to - from) * FPS); const t0 = Date.now();
  for (let f = 0; f < N; f++) {
    const url = await page.evaluate(t => window.renderFrame(t, 0.92), from + f / FPS);
    const buf = Buffer.from(url.split(',')[1], 'base64');
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 150 === 0) { const el = (Date.now() - t0) / 1000; console.log(`frame ${f}/${N}  ${(el / (f + 1)).toFixed(3)}s/frame`); }
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  console.log('video done', outFile);
}
await browser.close(); server.close();
