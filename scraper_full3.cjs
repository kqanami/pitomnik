const puppeteer = require('puppeteer');
const fs = require('fs');

const LINKS = [
"https://pitomnik-kukushkin.kz/eli",
"https://pitomnik-kukushkin.kz/sosna",
"https://pitomnik-kukushkin.kz/pihta",
"https://pitomnik-kukushkin.kz/mozhevelnik",
"https://pitomnik-kukushkin.kz/tis",
"https://pitomnik-kukushkin.kz/tsuga_kanadskaya",
"https://pitomnik-kukushkin.kz/tuya_zapadnaya",
"https://pitomnik-kukushkin.kz/platikladus",
"https://pitomnik-kukushkin.kz/psevdotsuga_menzisa",
"https://pitomnik-kukushkin.kz/kiparisovik_lousona",
"https://pitomnik-kukushkin.kz/golovchatotis",
"https://pitomnik-kukushkin.kz/gingko",
"https://pitomnik-kukushkin.kz/page2891467.html", // Magnolia
"https://pitomnik-kukushkin.kz/page2841198.html", // Alycha
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
"https://pitomnik-kukushkin.kz/page2891069.html"
];

(async () => {
  const browser = await puppeteer.launch({ headless: false }); 
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
  
  const results = [];

  for (let url of [...new Set(LINKS)]) {
    console.log(`Fetching ${url}...`);
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      const data = await page.evaluate(() => {
        const title = document.querySelector('h1, .t-name, .t-title, .t015__title, .t015')?.innerText?.trim() || '';
        
        // Extracting Cards data directly
        const cards = Array.from(document.querySelectorAll('.t143__col, .t-store__card, .t786__col, .t-item, .t776__col')).map(card => {
           const name = card.querySelector('.t-name, .t-store__card__title, .t776__title, .t143__title')?.innerText?.trim();
           const desc = card.querySelector('.t-descr, .t-text, .t-store__card__descr')?.innerText?.trim();
           const img = card.querySelector('img')?.getAttribute('data-original') || card.querySelector('img')?.src;
           return { name, desc, img };
        }).filter(c => c.name && c.img);

        return {
          url: document.location.href,
          title,
          cards
        };
      });
      results.push(data);
      console.log(`Success: ${data.title} (${data.cards.length} cards)`);
    } catch (e) {
      console.error(`Failed ${url}: ${e.message}`);
    }
  }

  fs.writeFileSync('raw_data3.json', JSON.stringify(results, null, 2));
  console.log('Saved to raw_data3.json');
  await browser.close();
})();
