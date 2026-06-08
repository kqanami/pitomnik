const puppeteer = require('puppeteer');
const fs = require('fs');

const LINKS = [
  "https://pitomnik-kukushkin.kz/page2887209.html", // Ель
  "https://pitomnik-kukushkin.kz/page2887231.html", // Сосна
  "https://pitomnik-kukushkin.kz/page2887242.html", // Пихта
  "https://pitomnik-kukushkin.kz/page2887253.html", // Можжевельник
  "https://pitomnik-kukushkin.kz/page2887261.html", // Тис
  "https://pitomnik-kukushkin.kz/page2887269.html", // Тсуга
  "https://pitomnik-kukushkin.kz/page2887278.html", // Туя
  "https://pitomnik-kukushkin.kz/page2887286.html", // Платикладус
  "https://pitomnik-kukushkin.kz/page2887294.html", // Псевдотсуга
  "https://pitomnik-kukushkin.kz/page2887302.html", // Кипарисовик
  "https://pitomnik-kukushkin.kz/page2887310.html", // Головчатотис
  "https://pitomnik-kukushkin.kz/page2887318.html", // Гинкго

  "https://pitomnik-kukushkin.kz/page2887326.html", // Магнолия
  "https://pitomnik-kukushkin.kz/page2887334.html", // Алыча
  "https://pitomnik-kukushkin.kz/page2887342.html", // Береза
  "https://pitomnik-kukushkin.kz/page2887350.html", // Боярышник
  "https://pitomnik-kukushkin.kz/page2887358.html", // Вишня
  "https://pitomnik-kukushkin.kz/page2887366.html", // Вяз
  "https://pitomnik-kukushkin.kz/page2887374.html", // Дуб
  "https://pitomnik-kukushkin.kz/page2887382.html", // Клен
  "https://pitomnik-kukushkin.kz/page2887655.html", // Крушина
  "https://pitomnik-kukushkin.kz/page2887292.html", // Лещина
  "https://pitomnik-kukushkin.kz/page2887696.html", // Липа
  "https://pitomnik-kukushkin.kz/page2887468.html", // Робиния
  "https://pitomnik-kukushkin.kz/page2887733.html", // Сирень
  "https://pitomnik-kukushkin.kz/page2888019.html", // Тополь
  "https://pitomnik-kukushkin.kz/page2887545.html", // Церсис
  "https://pitomnik-kukushkin.kz/page2887781.html", // Яблоня

  "https://pitomnik-kukushkin.kz/page2891826.html", // Барбарис
  "https://pitomnik-kukushkin.kz/page2891882.html", // Гортензия
  "https://pitomnik-kukushkin.kz/page2890693.html", // Вейгела
  "https://pitomnik-kukushkin.kz/page2890717.html", // Дерен
  "https://pitomnik-kukushkin.kz/page2890727.html", // Диервилла
  "https://pitomnik-kukushkin.kz/page2890734.html", // Кизил
  "https://pitomnik-kukushkin.kz/page2890751.html", // Лаванда
  "https://pitomnik-kukushkin.kz/page2890756.html", // Пион
  "https://pitomnik-kukushkin.kz/page2890813.html", // Пузыреплодник
  "https://pitomnik-kukushkin.kz/page2890791.html", // Самшит
  "https://pitomnik-kukushkin.kz/page2890757.html", // Скумпия
  "https://pitomnik-kukushkin.kz/page2890764.html", // Смородина
  "https://pitomnik-kukushkin.kz/page2891069.html"  // Спирея
];

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // headless: false is CRITICAL to bypass DDoS Guard
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
  
  const results = [];

  for (let url of LINKS) {
    console.log(`Fetching ${url}...`);
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      const data = await page.evaluate(() => {
        const title = document.querySelector('h1, .t-name, .t-title')?.innerText?.trim() || '';
        
        const varieties = [];
        const blocks = document.querySelectorAll('.t-item, .t786__col, .t-store__card, .t143__col, .t015, .t-text');
        
        let lastImg = '';
        let lastName = '';
        let lastDesc = '';
        
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

  fs.writeFileSync('raw_data.json', JSON.stringify(results, null, 2));
  console.log('Saved to raw_data.json');
  await browser.close();
})();
