const path = require('path');
const puppeteer = require(process.env.PUPPETEER_PATH || 'puppeteer');

const dir = path.join(__dirname, 'screens');

const items = [
  // 1. OMAYA YACHTS
  { id: '01_omaya_1', url: 'https://www.omaya-yachts.com', scroll: 0, wait: 5000 },
  { id: '01_omaya_2', url: 'https://www.omaya-yachts.com', scroll: 1200, wait: 4000 },
  { id: '01_omaya_3', url: 'https://www.omaya-yachts.com', scroll: 2500, wait: 4000 },

  // 2. VANQUISH YACHTS
  { id: '02_vanquish_1', url: 'https://www.vanquish-yachts.com', scroll: 0, wait: 4000, removeCookies: true },
  { id: '02_vanquish_2', url: 'https://www.vanquish-yachts.com', scroll: 1100, wait: 4000, removeCookies: true },
  { id: '02_vanquish_3', url: 'https://www.vanquish-yachts.com', scroll: 2300, wait: 4000, removeCookies: true },

  // 3. AZIMUT YACHTS
  { id: '03_azimut_1', url: 'https://azimutyachts.com/en/', scroll: 0, wait: 4000, removeCookies: true },
  { id: '03_azimut_2', url: 'https://azimutyachts.com/en/', scroll: 1200, wait: 4000, removeCookies: true },
  { id: '03_azimut_3', url: 'https://azimutyachts.com/en/', scroll: 2600, wait: 4000, removeCookies: true },

  // 4. AB YACHTS
  { id: '04_ab_1', url: 'https://www.abyachts.com/en/', scroll: 0, wait: 4000 },
  { id: '04_ab_2', url: 'https://www.abyachts.com/en/', scroll: 1000, wait: 4000 },
  { id: '04_ab_3', url: 'https://www.abyachts.com/en/', scroll: 2200, wait: 4000 },

  // 5. WALLY YACHTS
  { id: '05_wally_1', url: 'https://www.wally.com', scroll: 0, wait: 5000, removeCookies: true },
  { id: '05_wally_2', url: 'https://www.wally.com', scroll: 1100, wait: 4000, removeCookies: true },
  { id: '05_wally_3', url: 'https://www.wally.com', scroll: 2200, wait: 4000, removeCookies: true },

  // 6. BLUE MORE YACHTING
  { id: '06_bluemore_1', url: 'https://www.bluemoreyachting.com', scroll: 0, wait: 4000 },
  { id: '06_bluemore_2', url: 'https://www.bluemoreyachting.com', scroll: 1300, wait: 4000 },
  { id: '06_bluemore_3', url: 'https://www.bluemoreyachting.com/destinations', scroll: 400, wait: 4000 },

  // 7. RIVA YACHT
  { id: '07_riva_1', url: 'https://www.riva-yacht.com/en-us/', scroll: 0, wait: 5000, removeCookies: true },
  { id: '07_riva_2', url: 'https://www.riva-yacht.com/en-us/', scroll: 1200, wait: 4000, removeCookies: true },
  { id: '07_riva_3', url: 'https://www.riva-yacht.com/en-us/', scroll: 2500, wait: 4000, removeCookies: true }
];

async function start() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/usr/bin/google-chrome',
    userDataDir: '/tmp/cprofile_perfect_' + Date.now(),
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1600,1000']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000 });

  for (const item of items) {
    const filename = `${item.id}.png`;
    const targetFile = path.join(dir, filename);
    console.log(`Processing ${item.id} -> ${item.url} (scroll ${item.scroll})`);
    try {
      await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 35000 }).catch(e => console.log('Warn: ' + e.message));
      await new Promise(r => setTimeout(r, item.wait));

      // Dismiss cookie overlays and modals via DOM cleanup
      await page.evaluate(() => {
        const killSelectors = [
          '#CybotCookiebotDialog',
          '.cookie-banner',
          '.cookie-modal',
          '.modal-backdrop',
          '#onetrust-banner-sdk',
          '#iubenda-cs-banner',
          '.cky-consent-container',
          '.gdpr-banner',
          '#cookie-notice'
        ];
        killSelectors.forEach(sel => {
          document.querySelectorAll(sel).forEach(el => el.remove());
        });
        // Click generic accept if visible
        const buttons = Array.from(document.querySelectorAll('button, a'));
        const acceptBtn = buttons.find(b => /accept all|allow all|aceitar todos|accept cookies/i.test(b.innerText || ''));
        if (acceptBtn) acceptBtn.click();
      });

      if (item.scroll > 0) {
        await page.evaluate((s) => window.scrollTo(0, s), item.scroll);
        await new Promise(r => setTimeout(r, 2000));
      }

      await page.screenshot({ path: targetFile, type: 'png' });
      console.log(`-> Saved ${filename}`);
    } catch (e) {
      console.error(`Error on ${item.id}:`, e.message);
    }
  }

  await browser.close();
  console.log('Finished all high quality captures.');
}

start().catch(console.error);
