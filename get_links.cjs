const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
  await page.goto('https://pitomnik-kukushkin.kz/', { waitUntil: 'networkidle2' });
  const links = await page.$$eval('a', as => as.map(a => a.href));
  console.log(links.filter(l => l.includes('page')).join('\n'));
  await browser.close();
})();
