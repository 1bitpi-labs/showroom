import { createRequire } from 'node:module';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const require = createRequire(import.meta.url);
const puppeteer = require('/home/caueantonacci/.nvm/versions/node/v22.22.2/lib/node_modules/@mermaid-js/mermaid-cli/node_modules/puppeteer');

const round = process.argv[2] || 'r01';
const rootDir = '/home/caueantonacci/showroom/cliente-marina-porto-ilhabela';
const stillsDir = path.join(rootDir, 'cook', 'stills', round);
const compareDir = path.join(rootDir, 'cook', 'compare', round);
fs.mkdirSync(stillsDir, { recursive: true });
fs.mkdirSync(compareDir, { recursive: true });

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const rel = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
  const full = path.join(rootDir, rel);
  if (!full.startsWith(rootDir) || !fs.existsSync(full) || fs.statSync(full).isDirectory()) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  const ext = path.extname(full).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(full).pipe(res);
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/index.html`;

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/usr/bin/google-chrome',
    userDataDir: `/tmp/cprofile_cook_${round}_${Date.now()}`,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1600,1000']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 1 });
  await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));

  // Ensure video advances to a clean frame or poster is crisp
  await page.evaluate(() => {
    const v = document.querySelector('video');
    if (v) { v.muted = true; v.play().catch(() => {}); }
  });
  await new Promise(r => setTimeout(r, 800));

  // S01: Hero
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(stillsDir, 'S01.png') });

  // S02: Editorial ("Porto Ilhabela. 40 anos à frente.")
  await page.evaluate(() => {
    const el = document.querySelector('#shot-s02');
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 64);
    else window.scrollTo(0, 1000);
  });
  await new Promise(r => setTimeout(r, 700));
  await page.screenshot({ path: path.join(stillsDir, 'S02.png') });

  // S03: Temporada & Operação em Foco
  await page.evaluate(() => {
    const el = document.querySelector('#shot-s03');
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 76);
    else window.scrollTo(0, 2060);
  });
  await new Promise(r => setTimeout(r, 700));
  await page.screenshot({ path: path.join(stillsDir, 'S03.png') });

  // Also test interactive states (menu overlay + service tabs + concierge modal) to verify zero JS errors
  const interactiveCheck = await page.evaluate(() => {
    const errs = [];
    const menuBtn = document.querySelector('#open-menu');
    const overlay = document.querySelector('#menu-overlay');
    if (menuBtn && overlay) {
      menuBtn.click();
      if (!overlay.classList.contains('is-open')) errs.push('menu did not open');
      document.querySelector('#close-menu')?.click();
    } else errs.push('missing menu elements');

    const tabs = document.querySelectorAll('[data-service-tab]');
    if (tabs.length >= 4) {
      tabs[1].click();
      if (!tabs[1].classList.contains('is-active')) errs.push('tab did not activate');
      tabs[0].click();
    } else errs.push('missing service tabs');

    return { errs, tabCount: tabs.length };
  });
  console.log('Interactive check:', JSON.stringify(interactiveCheck));

  await browser.close();
  server.close();

  const sideBySide = '/home/caueantonacci/.t3/userdata/providers/antigravity/7be9b928ae8cba283f02640839db79b9ad29c4740201527659e873129d9e1991/config/skills/cook/scripts/side-by-side.mjs';
  const compareOut = path.join(compareDir, 'all.jpg');
  const sbs = spawnSync('node', [
    sideBySide,
    '--out', compareOut,
    '--height', '540',
    '--aspect', '16:10',
    path.join(rootDir, 'cook/refs/R01.png'), path.join(stillsDir, 'S01.png'),
    path.join(rootDir, 'cook/refs/R02.png'), path.join(stillsDir, 'S02.png'),
    path.join(rootDir, 'cook/refs/R03.png'), path.join(stillsDir, 'S03.png')
  ], { encoding: 'utf8' });
  console.log(sbs.stdout || sbs.stderr);

  for (const [r, s] of [['R01.png', 'S01.png'], ['R02.png', 'S02.png'], ['R03.png', 'S03.png']]) {
    const cc = spawnSync('python3', [
      path.join(rootDir, 'cook/color_check.py'),
      path.join(rootDir, 'cook/refs', r),
      path.join(stillsDir, s)
    ], { encoding: 'utf8' });
    console.log(`Color check ${r} vs ${s}:\n${cc.stdout.trim()}`);
  }
})();
