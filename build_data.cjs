const fs = require('fs');

const data = `// ============================================================
// ПИТОМНИК КУКУШКИН — Plant Database (Premium Descriptions & Russian UI)
// 3-Level Hierarchy: Category -> Group -> Variety
// ============================================================

export const CONTACTS = {
  phones: ['+7 (701) 250 17 71', '+7 (702) 210 00 42', '+7 (705) 113 44 41'],
  email: 'kukushkin_s.i@mail.ru',
  address: 'Алматинская обл., Енбекшиказахский р-н, с. Тургень, 8 км от поворота в Тургенское ущелье',
  hours: 'ПН–ПТ: 9:00 – 18:00',
  experience: '25+ лет'
};

export const CATEGORIES = [
  {
    id: 'coniferous',
    name: 'Хвойные растения',
    name_short: 'Хвойные',
    icon: '🌲',
    slug: 'coniferous',
    hero_img: '/images/Abies_koreana.jpg',
    count: 12,
    desc: 'Вечнозелёные аристократы сада. Придают ландшафту благородный вид круглый год, очищают воздух и создают уникальную атмосферу.',
    groups: [
      {
        id: 'el',
        name: 'Ель (Picea)',
        img: '/images/Abies_koreana.jpg',
        desc: 'Символ классического ландшафтного дизайна. Отличается строгой кроной и густой хвоей.',
        varieties: [
          { id: 'el-glauca', name: 'Ель колючая Глаука Глобоза (Glauca Globosa)', img: 'https://images.unsplash.com/photo-1598449426314-8b01bb60b45d?auto=format&fit=crop&q=80&w=800', desc: 'Карликовая голубая ель с густой шаровидной кроной. Идеальна для альпинариев.', characteristics: {'Высота': '1-1.5 м', 'Форма кроны': 'Шаровидная', 'Хвоя': 'Ярко-голубая'} },
          { id: 'el-iseli', name: 'Ель колючая Изели Фастигиата (Iseli Fastigiata)', img: 'https://images.unsplash.com/photo-1608343464522-861c8a1e8e81?auto=format&fit=crop&q=80&w=800', desc: 'Узкоконическая форма голубой ели с вертикальными ветвями.', characteristics: {'Высота': '3-5 м', 'Форма кроны': 'Узкоконическая', 'Хвоя': 'Сине-голубая'} },
          { id: 'el-fat-albert', name: 'Ель колючая Фэт Альберт (Fat Albert)', img: 'https://images.unsplash.com/photo-1544463428-c11dfaf25087?auto=format&fit=crop&q=80&w=800', desc: 'Идеально ровная коническая ель с превосходным голубым цветом.', characteristics: {'Высота': '3-4 м', 'Форма кроны': 'Ширококоническая', 'Хвоя': 'Серебристо-голубая'} }
        ]
      },
      {
        id: 'tuya',
        name: 'Туя (Thuja)',
        img: '/images/04052018_261.jpg',
        desc: 'Золотой стандарт ландшафтного дизайна. Самое популярное, надежное и пластичное хвойное растение.',
        varieties: [
          { id: 'tuya-danica', name: 'Туя западная Даника (Danica)', img: 'https://images.unsplash.com/photo-1629168913340-0255ebbc63b8?auto=format&fit=crop&q=80&w=800', desc: 'Самый популярный карликовый сорт туи с идеальной шаровидной формой.', characteristics: {'Высота': '0.6 м', 'Диаметр': '1 м', 'Хвоя': 'Ярко-зеленая', 'Особенности': 'Не требует стрижки'} },
          { id: 'tuya-golden-brabant', name: 'Туя западная Голден Брабант (Golden Brabant)', img: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80&w=800', desc: 'Быстрорастущая туя с золотисто-желтой хвоей, которая не тускнеет зимой.', characteristics: {'Высота': '3-4 м', 'Форма кроны': 'Конусовидная', 'Хвоя': 'Золотисто-жёлтая'} },
          { id: 'tuya-golden-smaragd', name: 'Туя западная Голден Смарагд (Golden Smaragd)', img: 'https://images.unsplash.com/photo-1611080765955-467432832ea5?auto=format&fit=crop&q=80&w=800', desc: 'Уникальная желтохвойная версия популярного сорта Смарагд. Идеальная узкая пирамида.', characteristics: {'Высота': '4-5 м', 'Форма кроны': 'Узкоконическая', 'Хвоя': 'Золотисто-зеленая'} },
          { id: 'tuya-holmstrup', name: 'Туя западная Холмструп (Holmstrup)', img: 'https://images.unsplash.com/photo-1589139556211-53e7f60ee3cb?auto=format&fit=crop&q=80&w=800', desc: 'Очень плотная, медленнорастущая туя с темно-зеленой кудрявой хвоей.', characteristics: {'Высота': '3 м', 'Форма кроны': 'Коническая, очень плотная', 'Хвоя': 'Темно-зеленая'} },
          { id: 'tuya-jantar', name: 'Туя западная Янтарь (Jantar)', img: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=800', desc: 'Эффектный сорт с ярко-желтой хвоей, которая зимой приобретает теплый янтарный оттенок.', characteristics: {'Высота': '3-5 м', 'Осенняя окраска': 'Янтарно-бронзовая', 'Хвоя': 'Лимонно-желтая'} },
          { id: 'tuya-ohlendorffii', name: 'Туя западная Олендорффи (Ohlendorffii)', img: 'https://images.unsplash.com/photo-1598449426314-8b01bb60b45d?auto=format&fit=crop&q=80&w=800', desc: 'Экзотический сорт с длинными, тонкими, шнуровидными побегами.', characteristics: {'Высота': '1 м', 'Форма кроны': 'Кустовидная, раскидистая', 'Побеги': 'Длинные, нитевидные'} }
        ]
      },
      {
        id: 'sosna',
        name: 'Сосна (Pinus)',
        img: '/images/04052018_261.jpg',
        desc: 'Воплощение стойкости и долговечности. Наполняет участок ароматом фитонцидов.',
        varieties: [
          { id: 'sosna-mughus', name: 'Сосна горная Мугус (Mughus)', img: 'https://images.unsplash.com/photo-1629168913340-0255ebbc63b8?auto=format&fit=crop&q=80&w=800', desc: 'Популярный кустарниковый сорт горной сосны, идеален для альпинариев.', characteristics: {'Высота': '1-2 м', 'Форма кроны': 'Распростертая', 'Хвоя': 'Темно-зеленая'} },
          { id: 'sosna-watereri', name: 'Сосна обыкновенная Ватерери (Watereri)', img: 'https://images.unsplash.com/photo-1611080765955-467432832ea5?auto=format&fit=crop&q=80&w=800', desc: 'Густая голубоватая сосна, часто формируемая в стиле бонсай (ниваки).', characteristics: {'Высота': '3-4 м', 'Форма кроны': 'Округлая', 'Хвоя': 'Сизовато-голубая'} }
        ]
      },
      {
        id: 'mozhzhevelnik',
        name: 'Можжевельник (Juniperus)',
        img: '/images/04052018_238.jpg',
        desc: 'Стойкий и невероятно разнообразный по формам кустарник для любого стиля сада.',
        varieties: [
          { id: 'mozh-blue-arrow', name: 'Можжевельник скальный Блю Эрроу (Blue Arrow)', img: 'https://images.unsplash.com/photo-1598449426314-8b01bb60b45d?auto=format&fit=crop&q=80&w=800', desc: 'Идеальная синяя колонна, незаменима для вертикальных акцентов.', characteristics: {'Высота': '3-4 м', 'Форма кроны': 'Узкоколонновидная', 'Хвоя': 'Ярко-голубая'} },
          { id: 'mozh-mint-julep', name: 'Можжевельник средний Минт Джулеп (Mint Julep)', img: 'https://images.unsplash.com/photo-1629168913340-0255ebbc63b8?auto=format&fit=crop&q=80&w=800', desc: 'Мощный раскидистый кустарник с сочной ярко-зеленой хвоей.', characteristics: {'Высота': '1.5 м', 'Диаметр': '3 м', 'Форма кроны': 'Дугообразная, раскидистая'} }
        ]
      }
    ]
  },
  {
    id: 'deciduous',
    name: 'Лиственные',
    name_short: 'Лиственные',
    icon: '🌳',
    slug: 'deciduous',
    hero_img: '/images/Malus_Red_Sentinel.jpg',
    count: 16,
    desc: 'Динамика и ритм вашего сада. Роскошное весеннее цветение, летняя тень и пылающие краски осени.',
    groups: [
      {
        id: 'yablonya',
        name: 'Яблоня декоративная (Malus)',
        img: '/images/Malus_Red_Sentinel.jpg',
        desc: 'Настоящее произведение искусства, радующее глаз три сезона в году.',
        varieties: [
          { id: 'malus-red-sentinel', name: 'Яблоня декоративная Ред Сентинел (Red Sentinel)', img: 'https://static.tildacdn.pro/tild3666-3434-4633-b430-363337376463/Malus_Red_Sentinel.jpg', desc: 'Шикарное дерево, усыпанное осенью и зимой красными райскими яблочками.', characteristics: {'Высота': '4-5 м', 'Плоды': 'Красные, держатся до весны', 'Период цветения': 'Май'} },
          { id: 'malus-golden-hornet', name: 'Яблоня декоративная Голден Хорнет (Golden Hornet)', img: 'https://static.tildacdn.pro/tild6237-6533-4033-b966-363761616264/Malus_Golden_Hornet.jpg', desc: 'Осенью ветви обильно покрываются золотисто-желтыми мелкими яблоками.', characteristics: {'Высота': '4-6 м', 'Плоды': 'Желтые, долго висят на ветвях', 'Цветки': 'Бело-розовые'} }
        ]
      },
      {
        id: 'klen',
        name: 'Клён (Acer)',
        img: '/images/04052018_238.jpg',
        desc: 'Абсолютный лидер осенней палитры. Способен преобразить любой ландшафт.',
        varieties: [
          { id: 'acer-globosum', name: 'Клён остролистный Глобозум (Globosum)', img: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=800', desc: 'Привитая форма с идеальной шаровидной кроной. Не требует обрезки.', characteristics: {'Высота': 'Зависит от штамба (обычно 2-4 м)', 'Форма кроны': 'Шаровидная плотная', 'Осенняя окраска': 'Желто-оранжевая'} },
          { id: 'acer-royal-red', name: 'Клён остролистный Роял Ред (Royal Red)', img: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=800', desc: 'Дерево с роскошной пурпурно-красной листвой, сохраняющей цвет весь сезон.', characteristics: {'Высота': '10-15 м', 'Листва': 'Темно-пурпурная', 'Форма кроны': 'Широкопирамидальная'} }
        ]
      }
    ]
  },
  {
    id: 'shrubs',
    name: 'Кустарники',
    name_short: 'Кустарники',
    icon: '🌿',
    slug: 'shrubs',
    hero_img: '/images/Berberis_thun_Golden.jpg',
    count: 13,
    desc: 'Структура и объем ландшафта. Невероятное разнообразие фактур и непрерывное цветение.',
    groups: [
      {
        id: 'gortenziya',
        name: 'Гортензия (Hydrangea)',
        img: 'https://static.tildacdn.pro/tild6431-6137-4763-b763-633863333837/Hydrangea_macrophyll.jpg',
        desc: 'Пышноцветущий кустарник, привлекающий внимание огромными соцветиями.',
        varieties: [
          { id: 'hydrangea-annabelle', name: 'Гортензия древовидная Аннабель (Annabelle)', img: 'https://static.tildacdn.pro/tild6534-3139-4161-a361-353031663930/Hydrangea_pan_Annabe.jpg', desc: 'Знаменитый сорт с гигантскими белоснежными шаровидными соцветиями до 25 см.', characteristics: {'Высота': '1.5 м', 'Период цветения': 'Июль-сентябрь', 'Цветки': 'Белые шаровидные'} },
          { id: 'hydrangea-vanille-fraise', name: 'Гортензия метельчатая Ванилла Фрейз (Vanille Fraise)', img: 'https://images.unsplash.com/photo-1589139556211-53e7f60ee3cb?auto=format&fit=crop&q=80&w=800', desc: 'Шедевр селекции! Соцветия меняют цвет от белого к насыщенно-клубничному.', characteristics: {'Высота': '2 м', 'Период цветения': 'Июль-октябрь', 'Цветки': 'Бело-розовые метелки'} }
        ]
      },
      {
        id: 'barbaris',
        name: 'Барбарис (Berberis)',
        img: '/images/Berberis_thun_Golden.jpg',
        desc: 'Незаменимый кустарник с богатейшей палитрой листвы.',
        varieties: [
          { id: 'berberis-orange-rocket', name: 'Барбарис Тунберга Оранж Рокет (Orange Rocket)', img: 'https://images.unsplash.com/photo-1598449426314-8b01bb60b45d?auto=format&fit=crop&q=80&w=800', desc: 'Колонновидный сорт с яркой оранжево-красной листвой.', characteristics: {'Высота': '1.2 м', 'Форма кроны': 'Колонновидная', 'Листва': 'Оранжево-красная'} },
          { id: 'berberis-admiration', name: 'Барбарис Тунберга Адмирейшн (Admiration)', img: 'https://images.unsplash.com/photo-1629168913340-0255ebbc63b8?auto=format&fit=crop&q=80&w=800', desc: 'Карликовый шаровидный барбарис. Листья красные с желтой каймой.', characteristics: {'Высота': '0.5 м', 'Форма кроны': 'Шаровидная', 'Листва': 'Красная с золотистой каймой'} }
        ]
      }
    ]
  }
];

export const GALLERY_IMAGES = [
  { src: '/images/04052018_261.jpg', caption: 'Величественная хвойная коллекция питомника' },
  { src: '/images/04052018_238.jpg', caption: 'Отборные можжевельники и туи' },
  { src: '/images/Physocarpus_op_Littl.jpg', caption: 'Пузыреплодник в роскошных осенних тонах' },
  { src: '/images/04052018_132.jpg', caption: 'Аллея крупномеров, готовых к посадке' }
];

export const TESTIMONIALS = [
  {
    name: 'Лаура',
    text: 'Питомник поражает своей разнообразностью хвойных и лиственных растений. Хочу обратить внимание, что владельцы вкладывают душу в свою работу. Растения отличного качества и по соответствующим им ценам. Надеюсь и на дальнейшее сотрудничество!',
    avatar: '/images/02e0f9d9-5da5-42e1-9.jpg',
    role: 'Клиент питомника'
  }
];

export const SERVICES = [
  {
    icon: '🌿',
    title: 'Ландшафтный дизайн',
    desc: 'Разработаем эксклюзивный проект сада с учётом архитектуры дома и особенностей рельефа. От идеи до полной реализации.'
  }
];
`;
fs.writeFileSync('data.js', data, 'utf8');
console.log('data.js generated successfully!');
