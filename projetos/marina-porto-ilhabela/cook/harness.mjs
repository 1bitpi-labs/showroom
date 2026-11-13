import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const repoDir = path.resolve(rootDir, '..');
const require = createRequire(import.meta.url);

function resolvePuppeteer() {
  if (process.env.PUPPETEER_PATH && fs.existsSync(process.env.PUPPETEER_PATH)) {
    return require(process.env.PUPPETEER_PATH);
  }
  try {
    return require(require.resolve('puppeteer', { paths: [rootDir, repoDir, process.cwd()] }));
  } catch {
    // Fallback to global/nvm puppeteer locations
  }
  const candidates = [
    '/usr/lib/node_modules/puppeteer',
    '/usr/local/lib/node_modules/puppeteer'
  ];
  const nvmVersionsDir = path.join(os.homedir(), '.nvm', 'versions', 'node');
  if (fs.existsSync(nvmVersionsDir)) {
    for (const ver of fs.readdirSync(nvmVersionsDir).sort().reverse()) {
      candidates.push(
        path.join(nvmVersionsDir, ver, 'lib', 'node_modules', 'puppeteer'),
        path.join(nvmVersionsDir, ver, 'lib', 'node_modules', '@mermaid-js', 'mermaid-cli', 'node_modules', 'puppeteer')
      );
    }
  }
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return require(candidate);
    }
  }
  throw new Error('Could not resolve puppeteer. Set PUPPETEER_PATH or install puppeteer.');
}

function resolveChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser'
  ].filter(Boolean);
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return undefined;
}

function resolveSideBySide() {
  const candidates = [
    process.env.SIDE_BY_SIDE_SCRIPT,
    path.join(repoDir, '.claude', 'skills', 'cook', 'scripts', 'side-by-side.mjs'),
    path.join(os.homedir(), '.claude', 'skills', 'cook', 'scripts', 'side-by-side.mjs'),
    path.join(os.homedir(), '.gemini', 'config', 'skills', 'cook', 'scripts', 'side-by-side.mjs')
  ].filter(Boolean);

  const antigravityDir = path.join(os.homedir(), '.t3', 'userdata', 'providers', 'antigravity');
  if (fs.existsSync(antigravityDir)) {
    for (const entry of fs.readdirSync(antigravityDir)) {
      candidates.push(path.join(antigravityDir, entry, 'config', 'skills', 'cook', 'scripts', 'side-by-side.mjs'));
    }
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  throw new Error('Could not locate side-by-side.mjs. Set SIDE_BY_SIDE_SCRIPT.');
}

const puppeteer = resolvePuppeteer();
const round = process.argv[2] || 'r01';
const stillsDir = path.join(rootDir, 'cook', 'stills', round);
const extraDir = path.join(stillsDir, 'extra');
const compareDir = path.join(rootDir, 'cook', 'compare', round);
fs.mkdirSync(stillsDir, { recursive: true });
fs.mkdirSync(extraDir, { recursive: true });
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
  const stat = fs.statSync(full);
  const ext = path.extname(full).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';
  const range = req.headers.range;

  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (match) {
      const start = match[1] ? Number(match[1]) : 0;
      const end = match[2] ? Math.min(Number(match[2]), stat.size - 1) : stat.size - 1;
      if (start <= end && start < stat.size) {
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${stat.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': end - start + 1,
          'Content-Type': contentType
        });
        fs.createReadStream(full, { start, end }).pipe(res);
        return;
      }
    }
  }

  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': stat.size,
    'Accept-Ranges': 'bytes'
  });
  fs.createReadStream(full).pipe(res);
});

(async () => {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/index.html`;

  const chromePath = resolveChrome();
  const browser = await puppeteer.launch({
    headless: 'new',
    ...(chromePath ? { executablePath: chromePath } : {}),
    userDataDir: path.join(os.tmpdir(), `cprofile_cook_${round}_${Date.now()}`),
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1600,1000']
  });

  const page = await browser.newPage();
  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));

  await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 1 });
  await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1200));

  // S01: Hero (still mode)
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: path.join(stillsDir, 'S01.png') });

  // S02: Editorial ("Porto Ilhabela. 40 anos à frente.")
  await page.evaluate(() => {
    const el = document.querySelector('#shot-s02');
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 64);
    else window.scrollTo(0, 1000);
  });
  await new Promise((r) => setTimeout(r, 700));
  await page.screenshot({ path: path.join(stillsDir, 'S02.png') });

  // S03: Temporada & Operação em Foco
  await page.evaluate(() => {
    const el = document.querySelector('#shot-s03');
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 76);
    else window.scrollTo(0, 2060);
  });
  await new Promise((r) => setTimeout(r, 700));
  await page.screenshot({ path: path.join(stillsDir, 'S03.png') });

  // Extra 1: Canal ao vivo (video mode running hero-sea.mp4)
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 300));
  await page.click('[data-hero-mode="video"]');
  await page.waitForFunction(() => {
    const v = document.querySelector('.hero-video');
    return v && v.readyState >= 2 && !v.paused;
  }, { timeout: 10000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 800));
  const videoCheck = await page.evaluate(() => {
    const hero = document.querySelector('#hero');
    const v = document.querySelector('.hero-video');
    return {
      isVideoMode: hero?.classList.contains('is-video-mode') || false,
      readyState: v?.readyState || 0,
      videoWidth: v?.videoWidth || 0,
      paused: v?.paused ?? true
    };
  });
  await page.screenshot({ path: path.join(extraDir, 'hero-live-video.png') });
  await page.click('[data-hero-mode="sunset"]');
  await new Promise((r) => setTimeout(r, 300));

  // Extra 2: #menu-overlay open
  await page.click('#open-menu');
  await new Promise((r) => setTimeout(r, 450));
  const menuOpened = await page.evaluate(() => document.querySelector('#menu-overlay')?.classList.contains('is-open') || false);
  await page.screenshot({ path: path.join(extraDir, 'menu-overlay.png') });
  await page.click('#close-menu');
  await new Promise((r) => setTimeout(r, 400));

  // Extra 3: #concierge-modal open
  await page.click('[data-open-concierge]');
  await new Promise((r) => setTimeout(r, 450));
  const modalOpened = await page.evaluate(() => document.querySelector('#concierge-modal')?.classList.contains('is-open') || false);
  await page.screenshot({ path: path.join(extraDir, 'concierge-modal.png') });
  await page.click('#close-concierge');
  await new Promise((r) => setTimeout(r, 400));

  // Extra 4: #servicos across all 5 tabs
  await page.evaluate(() => {
    document.querySelector('#servicos')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise((r) => setTimeout(r, 400));
  const serviceTabs = await page.$$eval('[data-service-tab]', (els) =>
    els.map((el) => el.getAttribute('data-service-tab'))
  );
  const serviceResults = [];
  for (const tabKey of serviceTabs) {
    await page.click(`[data-service-tab="${tabKey}"]`);
    await page.waitForFunction(() => {
      const img = document.querySelector('#service-img');
      return img && img.complete && img.naturalWidth > 0;
    }, { timeout: 10000 });
    await new Promise((r) => setTimeout(r, 250));
    const tabState = await page.evaluate((key) => ({
      key,
      active: document.querySelector(`[data-service-tab="${key}"]`)?.classList.contains('is-active') || false,
      title: document.querySelector('#service-title')?.textContent?.trim() || '',
      imgLoaded: (() => {
        const img = document.querySelector('#service-img');
        return Boolean(img && img.complete && img.naturalWidth > 0);
      })()
    }), tabKey);
    serviceResults.push(tabState);
    await page.screenshot({ path: path.join(extraDir, `servicos-${tabKey}.png`) });
  }
  await page.click(`[data-service-tab="${serviceTabs[0]}"]`);

  // Extra 5: #historia, #ecossistema, #faq, footer
  for (const [id, file] of [
    ['#historia', 'historia.png'],
    ['#ecossistema', 'ecossistema.png'],
    ['#faq', 'faq.png'],
    ['footer', 'footer.png']
  ]) {
    await page.evaluate((sel) => {
      document.querySelector(sel)?.scrollIntoView({ behavior: 'instant', block: 'start' });
    }, id);
    await new Promise((r) => setTimeout(r, 450));
    if (id === '#faq') {
      await page.evaluate(() => {
        const triggers = document.querySelectorAll('.faq-trigger');
        if (triggers[1]) triggers[1].click();
      });
      await new Promise((r) => setTimeout(r, 400));
    }
    await page.screenshot({ path: path.join(extraDir, file) });
  }

  // Desktop integrity metrics
  const desktopMetrics = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    const brokenImgs = imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.getAttribute('src'));
    const videos = Array.from(document.querySelectorAll('video')).map((v) => ({
      src: v.querySelector('source')?.getAttribute('src'),
      readyState: v.readyState,
      videoWidth: v.videoWidth
    }));
    return {
      totalImgs: imgs.length,
      brokenImgs,
      videos,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth
    };
  });

  // Extra 6: Mobile 390x844 validation & captures
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: path.join(extraDir, 'mobile-hero.png') });
  const mobileTopCheck = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
    overflowX: document.documentElement.scrollWidth > window.innerWidth,
    minTouchTargets: Array.from(document.querySelectorAll('.nav-link, .hero-mode-btn, .service-tab, .btn-pill-dark, .faq-trigger'))
      .map((el) => ({
        text: el.textContent.trim().slice(0, 24),
        height: Math.round(el.getBoundingClientRect().height)
      }))
      .filter((t) => t.height > 0 && t.height < 44)
  }));

  await page.evaluate(() => {
    document.querySelector('#shot-s02')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise((r) => setTimeout(r, 450));
  await page.screenshot({ path: path.join(extraDir, 'mobile-editorial.png') });
  const mobileEditorialOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

  await page.evaluate(() => {
    document.querySelector('#servicos')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise((r) => setTimeout(r, 450));
  await page.screenshot({ path: path.join(extraDir, 'mobile-servicos.png') });
  const mobileServicesOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

  const emDashCheck = ['index.html', 'app.js', 'styles.css'].some((f) =>
    fs.readFileSync(path.join(rootDir, f), 'utf8').includes('\u2014')
  );

  const errs = [...pageErrors];
  if (!menuOpened) errs.push('menu did not open');
  if (!modalOpened) errs.push('concierge modal did not open');
  if (!videoCheck.isVideoMode) errs.push('hero video mode did not activate');
  if (serviceResults.some((s) => !s.active || !s.imgLoaded)) errs.push('one or more service tabs failed');
  if (desktopMetrics.brokenImgs.length > 0) errs.push(`broken images: ${desktopMetrics.brokenImgs.join(', ')}`);
  if (mobileTopCheck.overflowX || mobileEditorialOverflow || mobileServicesOverflow) {
    errs.push('horizontal overflow detected on mobile 390x844');
  }

  console.log('Interactive check:', JSON.stringify({ errs, tabCount: serviceTabs.length }));
  console.log('Telemetry:', JSON.stringify({
    desktopMetrics,
    videoCheck,
    serviceResults,
    mobile390x844: {
      scrollWidth: mobileTopCheck.scrollWidth,
      innerWidth: mobileTopCheck.innerWidth,
      overflowX: mobileTopCheck.overflowX || mobileEditorialOverflow || mobileServicesOverflow,
      smallTouchTargets: mobileTopCheck.minTouchTargets
    },
    emDash: emDashCheck,
    pageErrs: pageErrors.length
  }));

  await browser.close();
  server.close();

  const sideBySide = resolveSideBySide();
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
