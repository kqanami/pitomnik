const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
  await page.goto('https://pitomnik-kukushkin.kz/tuya_zapadnaya', { waitUntil: 'networkidle2' });
  const cards = await page.$$eval('.t772__col, .t-store__card, .t-item, .t143__col, .t776__col, .js-product, .t-name', items => items.map(card => card.innerText?.trim()).filter(c => c && c.includes('Даника')));
  console.log('Danica text nodes:', cards);
  await browser.close();
})();
