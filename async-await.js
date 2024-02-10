
var rp = require('request-promise-native');
var fs = require('fs').promises;
var path = require('path');

async function downloadImage(url, filename) {
    var imagePath = path.join(__dirname, 'images', filename);
    // Check if 'images' folder exists, if not, create it
    var dir = path.dirname(imagePath);
    try {
        await fs.access(dir, fs.constants.F_OK);
    } catch {
        await fs.mkdir(dir, { recursive: true });
    }
    const imageBuffer = await rp({ url, encoding: null });
    await fs.writeFile(imagePath, imageBuffer);
    return imagePath;
}

async function fetchAndReplaceImage(imageNumber) {
    var url = 'https://source.unsplash.com/random';
    var filename = 'image' + imageNumber + '.jpg';

    try {
        const savedFilename = await downloadImage(url, filename);
        console.log('Image saved as', savedFilename);

        const nextSavedFilename = await downloadImage('https://source.unsplash.com/random', 'image' + (imageNumber + 1) + '.jpg');
        console.log('Next image saved as', nextSavedFilename);

        const finalSavedFilename = await downloadImage('https://source.unsplash.com/random', 'image' + (imageNumber + 2) + '.jpg');
        console.log('Final image saved as', finalSavedFilename);
    } catch (err) {
        console.error('Error downloading image:', err);
    }
}

fetchAndReplaceImage(1);