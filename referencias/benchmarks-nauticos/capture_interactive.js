const path = require('path');
const puppeteer = require(process.env.PUPPETEER_PATH || 'puppeteer');
const dir = path.join(__dirname, 'screens');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
    userDataDir: '/tmp/cprofile_inter_' + Date.now(),
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1600,1000']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000 });

  // 1. OMAYA YACHTS - click the model or dismiss cookie
  try {
    console.log('Omaya interaction...');
    await page.goto('https://www.omaya-yachts.com', { waitUntil: 'networkidle2', timeout: 35000 });
    await page.evaluate(() => {
      const btn = document.querySelector('button.cookie, #cookie-agree, [data-action="accept"]');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(dir, '01_omaya_1.png') });
    
    // Scroll down to showcase specs and catamaran 3D render
    await page.evaluate(() => window.scrollBy(0, 1600));
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(dir, '01_omaya_2.png') });

    await page.evaluate(() => window.scrollBy(0, 2200));
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(dir, '01_omaya_3.png') });
  } catch (e) { console.error('Omaya:', e.message); }

  // 2. AB YACHTS - video frame after 4s
  try {
    console.log('AB Yachts interaction...');
    await page.goto('https://www.abyachts.com/en/', { waitUntil: 'domcontentloaded', timeout: 35000 });
    await new Promise(r => setTimeout(r, 5500)); // wait for drone cut
    await page.screenshot({ path: path.join(dir, '04_ab_1.png') });

    await page.evaluate(() => window.scrollBy(0, 1400));
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(dir, '04_ab_2.png') });

    await page.evaluate(() => window.scrollBy(0, 2400));
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(dir, '04_ab_3.png') });
  } catch (e) { console.error('AB Yachts:', e.message); }

  await browser.close();
  console.log('Interactive capture done.');
})();
