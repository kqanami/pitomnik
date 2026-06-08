const puppeteer = require('puppeteer');

(async () => {
  try {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
    console.log('Navigating to Thuja page...');
    await page.goto('https://pitomnik-kukushkin.kz/page2887278.html', { waitUntil: 'networkidle2' });
    const title = await page.title();
    console.log('Title:', title);
    const content = await page.content();
    console.log('Content length:', content.length);
    if (content.includes('403 Forbidden') || content.includes('ddos-guard')) {
      console.log('Still blocked by DDoS Guard.');
    } else {
      console.log('Success! We bypassed DDoS guard.');
    }
    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
