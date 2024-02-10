var rp = require('request-promise-native');
var fs = require('fs').promises;
var path = require('path');

function downloadImage(url, filename) {
    var imagePath = path.join(__dirname, 'images', filename);
    // Check if 'images' folder exists, if not, create it
    var dir = path.dirname(imagePath);
    return fs.access(dir, fs.constants.F_OK)
        .catch(() => fs.mkdir(dir, { recursive: true }))
        .then(() => rp({ url, encoding: null }))
        .then(imageBuffer => fs.writeFile(imagePath, imageBuffer))
        .then(() => imagePath);
}

function fetchAndReplaceImage(imageNumber) {
    var url = 'https://source.unsplash.com/random';
    var filename = 'image' + imageNumber + '.jpg';

    return downloadImage(url, filename)
        .then(savedFilename => {
            console.log('Image saved as', savedFilename);
            return downloadImage('https://source.unsplash.com/random', 'image' + (imageNumber + 1) + '.jpg');
        })
        .then(nextSavedFilename => {
            console.log('Next image saved as', nextSavedFilename);
            return downloadImage('https://source.unsplash.com/random', 'image' + (imageNumber + 2) + '.jpg');
        })
        .then(finalSavedFilename => {
            console.log('Final image saved as', finalSavedFilename);
        })
        .catch(err => {
            console.error('Error downloading image:', err);
        });
}

fetchAndReplaceImage(1);