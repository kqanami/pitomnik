const fs = require('fs');
const https = require('https');
const path = require('path');

const data = JSON.parse(fs.readFileSync('d:\\pitomnik\\data.json', 'utf8'));

const imagesDir = 'd:\\pitomnik\\public\\images';
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

let downloadCount = 0;

data.forEach(category => {
    category.images.forEach(url => {
        if (!url) return;
        const filename = path.basename(url.split('?')[0]);
        const filepath = path.join(imagesDir, filename);
        if (!fs.existsSync(filepath)) {
            https.get(url, (res) => {
                if (res.statusCode === 200) {
                    const file = fs.createWriteStream(filepath);
                    res.pipe(file);
                    file.on('finish', () => {
                        file.close();
                        console.log('Downloaded', filename);
                    });
                }
            }).on('error', (err) => {
                console.error('Error downloading', url, err.message);
            });
            downloadCount++;
        }
    });
});
console.log(`Started downloading ${downloadCount} new images...`);
