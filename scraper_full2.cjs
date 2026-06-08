const puppeteer = require('puppeteer');
const fs = require('fs');

const LINKS = [
"https://pitomnik-kukushkin.kz/page2891467.html",
"https://pitomnik-kukushkin.kz/page2841198.html",
"https://pitomnik-kukushkin.kz/page2887596.html",
"https://pitomnik-kukushkin.kz/page2887931.html",
"https://pitomnik-kukushkin.kz/page2886792.html",
"https://pitomnik-kukushkin.kz/page2887632.html",
"https://pitomnik-kukushkin.kz/page2887973.html",
"https://pitomnik-kukushkin.kz/page2886938.html",
"https://pitomnik-kukushkin.kz/page2887655.html",
"https://pitomnik-kukushkin.kz/page2887292.html",
"https://pitomnik-kukushkin.kz/page2887696.html",
"https://pitomnik-kukushkin.kz/page2887468.html",
"https://pitomnik-kukushkin.kz/page2887733.html",
"https://pitomnik-kukushkin.kz/page2888019.html",
"https://pitomnik-kukushkin.kz/page2887545.html",
"https://pitomnik-kukushkin.kz/page2887781.html",
"https://pitomnik-kukushkin.kz/page2891826.html",
"https://pitomnik-kukushkin.kz/page2891882.html",
"https://pitomnik-kukushkin.kz/page2890693.html",
"https://pitomnik-kukushkin.kz/page2890717.html",
"https://pitomnik-kukushkin.kz/page2890727.html",
"https://pitomnik-kukushkin.kz/page2890734.html",
"https://pitomnik-kukushkin.kz/page2890751.html",
"https://pitomnik-kukushkin.kz/page2890756.html",
"https://pitomnik-kukushkin.kz/page2890813.html",
"https://pitomnik-kukushkin.kz/page2890791.html",
"https://pitomnik-kukushkin.kz/page2890757.html",
"https://pitomnik-kukushkin.kz/page2890764.html",
"https://pitomnik-kukushkin.kz/page2891069.html",
"https://pitomnik-kukushkin.kz/page2835734.html",
"https://pitomnik-kukushkin.kz/page2885393.html"
];

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // headless: false is CRITICAL to bypass DDoS Guard
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
  
  const results = [];

  for (let url of [...new Set(LINKS)]) {
    console.log(`Fetching ${url}...`);
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      const data = await page.evaluate(() => {
        const title = document.querySelector('h1, .t-name, .t-title, .t015__title')?.innerText?.trim() || '';
        
        // Tilda often uses nested structures. We'll try to extract images and nearby text.
        const allImages = Array.from(document.querySelectorAll('img')).map(img => img.getAttribute('data-original') || img.src).filter(src => src && !src.includes('logo') && !src.includes('icon'));
        const allTexts = Array.from(document.querySelectorAll('.t-name, .t-descr, .t-text, p')).map(el => el.innerText.trim()).filter(t => t.length > 5);

        return {
          url: document.location.href,
          title,
          allImages: [...new Set(allImages)],
          allTexts: [...new Set(allTexts)]
        };
      });
      results.push(data);
      console.log(`Success: ${data.title}`);
    } catch (e) {
      console.error(`Failed ${url}: ${e.message}`);
    }
  }

  fs.writeFileSync('raw_data2.json', JSON.stringify(results, null, 2));
  console.log('Saved to raw_data2.json');
  await browser.close();
})();
