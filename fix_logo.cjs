const fs = require('fs');
const files = ['index.html', 'catalog.html', 'gallery.html', 'services.html', 'contacts.html'];
files.forEach(f => {
  let txt = fs.readFileSync(f, 'utf8');
  txt = txt.replace(/class="header__logo-img"/g, 'class="header__logo-img" style="height: 48px; width: auto;"');
  txt = txt.replace(/class="footer__logo"/g, 'class="footer__logo" style="height: 44px; width: auto;"');
  fs.writeFileSync(f, txt);
});
