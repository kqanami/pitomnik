const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
  await page.goto('https://pitomnik-kukushkin.kz/', { waitUntil: 'networkidle2' });
  
  // Click on a category to reveal its links if they are hidden behind tabs
  try { await page.click('.t228__list_item a[href="#cat2"]'); await page.waitForTimeout(1000); } catch(e){}
  
  const links = await page.$$eval('a', as => as.map(a => a.href));
  const validLinks = links.filter(l => l.includes('pitomnik-kukushkin.kz') && !l.includes('#'));
  console.log([...new Set(validLinks)].join('\n'));
  
  await browser.close();
})();
