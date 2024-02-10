var request = require('request');
var fs = require('fs');
var path = require('path');

function downloadImage(url, filename, callback) {
    var imagePath = path.join(__dirname, 'images', filename);
    // 'images' フォルダが存在するか確認し、なければ作成
    var dir = path.dirname(imagePath);
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    request.head(url, function(err, res, body) {
        if (err) return callback(err);
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(url).pipe(fs.createWriteStream(imagePath)).on('close', function() {
            callback(null, imagePath);
        });
    });
}

function fetchAndReplaceImage(imageNumber) {
    var url = 'https://source.unsplash.com/random';
    var filename = 'image' + imageNumber + '.jpg';

    downloadImage(url, filename, function(err, savedFilename) {
        if (err) {
            console.error('Error downloading image:', err);
        } else {
            console.log('Image saved as', savedFilename);
            // ここでさらにコールバック地獄を深める
            downloadImage('https://source.unsplash.com/random', 'image' + (imageNumber + 1) + '.jpg', function(err, nextSavedFilename) {
                if (err) {
                    console.error('Error downloading next image:', err);
                } else {
                    console.log('Next image saved as', nextSavedFilename);
                    // さらに深いコールバック
                    downloadImage('https://source.unsplash.com/random', 'image' + (imageNumber + 2) + '.jpg', function(err, finalSavedFilename) {
                        if (err) {
                            console.error('Error downloading final image:', err);
                        } else {
                            console.log('Final image saved as', finalSavedFilename);
                            // ここで終了、またはさらにネストする
                        }
                    });
                }
            });
        }
    });
}

// 例の実行
fetchAndReplaceImage(1);