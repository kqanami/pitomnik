const fs = require('fs');

const htmlFiles = ['index.html', 'catalog.html', 'gallery.html', 'services.html', 'contacts.html'];

htmlFiles.forEach(f => {
  let txt = fs.readFileSync(f, 'utf8');
  // Fix root links
  txt = txt.replace(/href="\/"/g, 'href="./"');
  // Fix other page links
  txt = txt.replace(/href="\/([^"]+)\.html(.*?)"/g, 'href="./$1.html$2"');
  // Fix any other absolute /images/ links in HTML if they exist
  txt = txt.replace(/src="\/images\//g, 'src="./images/');
  txt = txt.replace(/href="\/images\//g, 'href="./images/');
  fs.writeFileSync(f, txt);
});

const jsFiles = ['main.js', 'data.js'];
jsFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let txt = fs.readFileSync(f, 'utf8');
    txt = txt.replace(/'\/images\//g, "'./images/");
    txt = txt.replace(/"\/images\//g, '"./images/');
    txt = txt.replace(/url\('\/images\//g, "url('./images/");
    fs.writeFileSync(f, txt);
  }
});

console.log("Paths fixed!");
