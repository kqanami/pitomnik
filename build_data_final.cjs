const fs = require('fs');

const rawData = JSON.parse(fs.readFileSync('processed_data.json'));

const baseCategories = [
  { id: 'conifers', name: 'Хвойные растения', groups: [] },
  { id: 'deciduous', name: 'Лиственные растения', groups: [] },
  { id: 'shrubs', name: 'Кустарники', groups: [] },
  { id: 'berries', name: 'Ягодные растения', groups: [] }
];

const catMap = {
    'Хвойные': 'conifers',
    'Лиственные': 'deciduous',
    'Кустарники': 'shrubs',
    'Ягодные': 'berries'
};

const processedCats = {};
baseCategories.forEach(c => processedCats[c.id] = c);

rawData.forEach(d => {
    let catId = catMap[d.categoryName] || 'shrubs';
    let group = processedCats[catId].groups.find(g => g.name === d.groupName);
    if (!group) {
        group = {
            id: 'g_' + d.groupName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-zа-я0-9_]/gi, ''),
            name: d.groupName,
            image: d.cards[0]?.img || '',
            varieties: []
        };
        processedCats[catId].groups.push(group);
    }
    
    d.cards.forEach(c => {
        let cleanName = c.name.replace(/\n/g, ' ').replace('ОПИСАНИЕ', '').trim();
        let nameParts = cleanName.split('(');
        let ruName = nameParts[0].trim();
        let latName = nameParts.length > 1 ? '(' + nameParts[1] : '';
        
        group.varieties.push({
            id: 'v_' + Math.random().toString(36).substr(2, 9),
            name: ruName + (latName ? ' ' + latName : ''),
            image: c.img,
            description: c.desc || 'Роскошный сорт для вашего сада.',
            characteristics: {
                'Тип': catId === 'conifers' ? 'Хвойное растение' : (catId === 'deciduous' ? 'Лиственное растение' : 'Кустарник'),
                'Применение': 'Ландшафтный дизайн, солитер, живая изгородь'
            }
        });
    });
});

const output = `// ============================================================
// ПИТОМНИК КУКУШКИН — Полная База Данных 
// ============================================================

export const GALLERY_IMAGES = [
  "https://static.tildacdn.pro/tild6166-6335-4637-b662-383039393265/1.png",
  "https://static.tildacdn.pro/tild3233-6361-4036-b135-303661646437/photo.png",
  "https://static.tildacdn.pro/tild3962-3139-4235-a331-353265313933/04052018_255.jpg",
  "https://static.tildacdn.pro/img/tildacopy.png"
];

export const TESTIMONIALS = [
  { name: "Ирина В.", text: "Отличный питомник, брали туи Смарагд, все прижились!" },
  { name: "Сергей К.", text: "Огромный выбор растений и профессиональная консультация. Рекомендую!" }
];

export const CATEGORIES = ${JSON.stringify(baseCategories, null, 2)};
`;

fs.writeFileSync('data.js', output);
console.log('data.js full catalog generated successfully!');
