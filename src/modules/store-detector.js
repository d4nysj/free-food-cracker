const tesseract = require("node-tesseract-ocr")

const path = require("path")
const fs = require('fs')

const Jimp = require("jimp")
const qrCode = require('qrcode-reader')

const configTesseract = {
    lang: "spa", // default
    oem: 3,
    psm: 3,
}
  

  module.exports = {
    recognizeStore: async (image) => {
        const text = await tesseract.recognize(image, configTesseract)
        const lines = text.split('\n').map(x => x.trim()).filter(x => x.length > 0)

        const store = detectStore(lines)

        const qrResults = await getQRParser(image)

        return {
            store,
            lines,
            text,
            qrResults
        }
    }
}

// HELPERS
const detectStore = (lines) => {
    const stores = ['BK', 'MC', 'TB']
    if ((lines[0] || '').toLowerCase().includes('su pedido')) return stores[0]
    if ((lines[0] || '').toLowerCase().includes('taco bell')) return stores[2]

    if (lines.filter(x => x.toLowerCase().replaceAll(' ', '').match('mcdonald')).length > 0) return stores[1]
    return null
}


const getQRParser = (image) => {
    return new Promise((resolve, reject) => {
        Jimp.read(image, function(err, image) {
            if (err) reject(err)
            let qrcode = new qrCode();
            qrcode.callback = function(err, value) {
                if (err) reject(err);
                resolve(value?.result);
            };
            qrcode.decode(image.bitmap);
         });
    })
}