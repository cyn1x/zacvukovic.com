const sharp = require('sharp');
const fs = require('fs');
const directory = './static/img/';

if (process.argv.length < 3) {
    console.log('Error: missing directory argument')
    console.log('Usage: node sharp.js <directory>');
    process.exit(1);
}

fs.readdirSync(directory).forEach(file => {
    sharp(`${directory}/${file}`)
    .resize(200, 100) // width, height
    .toFile(`${directory}/${file}-small.jpg`);
});
