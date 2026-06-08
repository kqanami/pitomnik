const fs = require('fs');
const cheerio = require('cheerio');
const file = 'C:\\Users\\Yura\\.gemini\\antigravity\\brain\\1319b6af-e48c-4f2a-8321-f7fe98692bea\\.system_generated\\steps\\236\\content.md';
const html = fs.readFileSync(file, 'utf8');
const $ = cheerio.load(html);
console.log('IMAGES:');
$('img').each((i, el) => {
  console.log($(el).attr('src') || $(el).attr('data-original'));
});
console.log('TEXTS:');
$('div.t-name, div.t-descr, div.t-text, div.t-heading, p').each((i, el) => {
  const t = $(el).text().trim();
  if(t.length > 20) console.log(t);
});
