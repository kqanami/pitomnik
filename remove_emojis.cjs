const fs = require('fs');

// We will define icons. For links, we add small styles. For big icons, we just make them scalable.
const getIcon = (name, isInline = true) => {
  const style = isInline ? 'style="margin-bottom:-3px; margin-right:4px;" width="18" height="18"' : 'width="1em" height="1em"';
  const paths = {
    'phone': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    'home': '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    'leaf': '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    'image': '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
    'scissors': '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" x2="8.12" y1="4" y2="15.88"/><line x1="14.47" x2="20" y1="14.48" y2="20"/><line x1="8.12" x2="12" y1="8.12" y2="12"/>',
    'pine': '<path d="M12 22v-6"/><path d="m6 16 6-12 6 12Z"/>',
    'tree': '<path d="M12 22v-6"/><path d="M12 8c-2 0-3 2-3 4s1 4 3 4 3-2 3-4-1-4-3-4Z"/><path d="M9 12c-2 0-3-2-3-4s1-4 3-4"/><path d="M15 12c2 0 3-2 3-4s-1-4-3-4"/>',
    'berry': '<circle cx="12" cy="12" r="10"/><path d="M12 12v.01"/>',
    'car': '<path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H9.3a2 2 0 0 0-1.6.8L5 11l-5.16.86a1 1 0 0 0-.84.99V16h3m10 0a2 2 0 1 1-4 0m4 0a2 2 0 1 0-4 0m-6 0a2 2 0 1 1-4 0m4 0a2 2 0 1 0-4 0"/>',
    'check': '<polyline points="20 6 9 17 4 12"/>',
    'grad': '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>'
  };
  return `<svg ${style} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
};

const map = {
  '📞': 'phone',
  '🏠': 'home',
  '🌿': 'leaf',
  '🖼️': 'image',
  '✂️': 'scissors',
  '🌲': 'pine',
  '🌳': 'tree',
  '🍓': 'berry',
  '🚗': 'car',
  '✅': 'check',
  '🎓': 'grad',
  '🏡': 'home'
};

const files = ['index.html', 'catalog.html', 'gallery.html', 'services.html', 'contacts.html', 'main.js'];

files.forEach(f => {
  let txt = fs.readFileSync(f, 'utf8');
  
  // Replace big icons
  txt = txt.replace(/<div class="service-icon">([📞🏠🌿🖼️✂️🌲🌳🍓🚗✅🎓🏡])<\/div>/g, (match, emoji) => {
    return `<div class="service-icon">${getIcon(map[emoji], false)}</div>`;
  });
  txt = txt.replace(/<div style="font-size:3rem; margin-bottom:1rem;">([📞🏠🌿🖼️✂️🌲🌳🍓🚗✅🎓🏡])<\/div>/g, (match, emoji) => {
    return `<div style="font-size:3rem; margin-bottom:1rem;">${getIcon(map[emoji], false)}</div>`;
  });
  txt = txt.replace(/<div style="font-size:2rem; margin-bottom:.5rem;">([📞🏠🌿🖼️✂️🌲🌳🍓🚗✅🎓🏡])<\/div>/g, (match, emoji) => {
    return `<div style="font-size:2rem; margin-bottom:.5rem;">${getIcon(map[emoji], false)}</div>`;
  });
  txt = txt.replace(/<div class="contact-icon">([📞🏠🌿🖼️✂️🌲🌳🍓🚗✅🎓🏡])<\/div>/g, (match, emoji) => {
    return `<div class="contact-icon">${getIcon(map[emoji], false)}</div>`;
  });

  // Replace inline emojis
  Object.keys(map).forEach(emoji => {
    const re = new RegExp(emoji + ' ?', 'g');
    txt = txt.replace(re, getIcon(map[emoji], true) + ' ');
  });

  fs.writeFileSync(f, txt);
});

console.log("Emojis removed!");
