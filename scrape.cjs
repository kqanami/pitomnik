const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const BASE_URL = 'https://pitomnik-kukushkin.kz';

const CATEGORY_LINKS = [
  { id: 'coniferous', url: '/hvoiniye-rasteniya' },
  { id: 'deciduous', url: '/listvennye-rasteniya' },
  { id: 'shrubs', url: '/kustarniki' },
];

async function scrape() {
  console.log('Starting scrape...');
  const result = {};

  for (const cat of CATEGORY_LINKS) {
    console.log(`Scraping category: ${cat.id} at ${cat.url}`);
    const { data } = await axios.get(BASE_URL + cat.url);
    const $ = cheerio.load(data);
    
    // Find all links to subpages within the same category
    const plantLinks = [];
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.startsWith('/') && !href.includes('#') && !plantLinks.includes(href) && href !== cat.url) {
        // Tilda often puts links to plant pages like /el, /sosna
        plantLinks.push(href);
      }
    });

    console.log(`Found potential links for ${cat.id}:`, plantLinks);
    
    // For each plant link, fetch the page and extract text and first image
    const plants = [];
    for (const link of plantLinks) {
      if (['/katalog', '/uslugi', '/galereya', '/kontakty'].includes(link)) continue;
      
      try {
        console.log(`  Fetching plant: ${link}`);
        const { data: pData } = await axios.get(BASE_URL + link);
        const p$ = cheerio.load(pData);
        
        let title = p$('h1').text().trim() || p$('title').text().replace('Питомник Кукушкин', '').trim();
        let desc = '';
        p$('div.t-text, div.t-descr, div.t-name').each((i, el) => {
          const text = p$(el).text().trim();
          if (text.length > 50 && !text.includes('Питомник Кукушкин') && !text.includes('ПОСМОТРЕТЬ ПРАЙС')) {
            desc += text + '\n\n';
          }
        });
        
        let img = '';
        p$('img').each((i, el) => {
          const src = p$(el).attr('src') || p$(el).attr('data-original');
          // filter out logos, icons
          if (src && !src.includes('logo') && !src.includes('icon') && src.includes('tildacdn')) {
            if (!img) img = src; // get first good image
          }
        });

        if (desc.length > 50 && img) {
          plants.push({
            id: link.replace('/', ''),
            name: title.split(',')[0].split(' ')[0], // Best effort name
            title: title,
            img: img,
            desc: desc.trim(),
            characteristics: {},
            varieties: [],
            badge: ''
          });
        }
      } catch (e) {
        console.log(`    Failed to fetch ${link}: ${e.message}`);
      }
    }
    result[cat.id] = plants;
  }

  fs.writeFileSync('scraped_data.json', JSON.stringify(result, null, 2), 'utf-8');
  console.log('Scraping complete. Data saved to scraped_data.json');
}

scrape().catch(console.error);
