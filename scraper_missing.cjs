const puppeteer = require('puppeteer');
const fs = require('fs');

const LINKS = [
  'https://pitomnik-kukushkin.kz/tsuga_kanadskaya',
  'https://pitomnik-kukushkin.kz/tuya_zapadnaya',
  'https://pitomnik-kukushkin.kz/platikladus',
  'https://pitomnik-kukushkin.kz/psevdotsuga_menzisa',
  'https://pitomnik-kukushkin.kz/kiparisovik_lousona',
  'https://pitomnik-kukushkin.kz/golovchatotis',
  'https://pitomnik-kukushkin.kz/gingko',
  'https://pitomnik-kukushkin.kz/page2841198.html',
  'https://pitomnik-kukushkin.kz/page2887596.html',
  'https://pitomnik-kukushkin.kz/page2887931.html',
  'https://pitomnik-kukushkin.kz/page2886792.html',
  'https://pitomnik-kukushkin.kz/page2887632.html',
  'https://pitomnik-kukushkin.kz/page2887973.html',
  'https://pitomnik-kukushkin.kz/page2886938.html',
  'https://pitomnik-kukushkin.kz/page2887655.html',
  'https://pitomnik-kukushkin.kz/page2887292.html',
  'https://pitomnik-kukushkin.kz/page2887696.html',
  'https://pitomnik-kukushkin.kz/page2887468.html',
  'https://pitomnik-kukushkin.kz/page2887733.html',
  'https://pitomnik-kukushkin.kz/page2888019.html',
  'https://pitomnik-kukushkin.kz/page2887545.html',
  'https://pitomnik-kukushkin.kz/page2887781.html',
  'https://pitomnik-kukushkin.kz/page2890693.html',
  'https://pitomnik-kukushkin.kz/page2890717.html',
  'https://pitomnik-kukushkin.kz/page2890727.html',
  'https://pitomnik-kukushkin.kz/page2890734.html',
  'https://pitomnik-kukushkin.kz/page2890751.html',
  'https://pitomnik-kukushkin.kz/page2890756.html',
  'https://pitomnik-kukushkin.kz/page2890813.html',
  'https://pitomnik-kukushkin.kz/page2890791.html',
  'https://pitomnik-kukushkin.kz/page2890757.html',
  'https://pitomnik-kukushkin.kz/page2890764.html',
  'https://pitomnik-kukushkin.kz/page2891069.html'
];

(async () => {
  const browser = await puppeteer.launch({ headless: false }); 
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
  
  const results = JSON.parse(fs.readFileSync('final_data.json'));

  for (let url of [...new Set(LINKS)]) {
    console.log(`Fetching ${url}...`);
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      const data = await page.evaluate(() => {
        const title = document.querySelector('h1, .t-name, .t-title, .t015__title, .t015')?.innerText?.trim() || '';
        
        // Target specific Tilda structure that holds Danica
        const cards = Array.from(document.querySelectorAll('.t772__col, .t-store__card, .t-item')).map(card => {
           let name = card.querySelector('.t772__title, .t-name, .t-store__card__title')?.innerText?.trim();
           if (!name) name = card.innerText.split('\n')[0].trim(); // Fallback to first line of text
           
           const desc = card.querySelector('.t772__descr, .t-descr, .t-text, .t-store__card__descr')?.innerText?.trim() || '';
           
           let img = card.querySelector('img')?.getAttribute('data-original') || card.querySelector('img')?.src;
           if (!img) {
               const imgDiv = card.querySelector('.t-bgimg, .t772__imgwrapper');
               if (imgDiv) {
                   img = imgDiv.getAttribute('data-original') || (imgDiv.style.backgroundImage || '').replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
               }
           }
           return { name, desc, img };
        }).filter(c => c.name && c.name.length > 2 && c.img);

        return {
          url: document.location.href,
          title,
          cards
        };
      });
      
      const existingIdx = results.findIndex(r => r.url === url);
      if (existingIdx !== -1) {
          results[existingIdx] = data;
      } else {
          results.push(data);
      }
      
      console.log(`Success: ${data.title} (${data.cards.length} cards)`);
    } catch (e) {
      console.error(`Failed ${url}: ${e.message}`);
    }
  }

  fs.writeFileSync('final_data2.json', JSON.stringify(results, null, 2));
  console.log('Saved to final_data2.json');
  await browser.close();
})();
