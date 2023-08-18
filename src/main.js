const tesseract = require("node-tesseract-ocr")
const puppeteer = require('puppeteer');

const path = require("path")
const Jimp = require("jimp");
const fs = require('fs')
const qrCode = require('qrcode-reader');

const config = {
  lang: "spa", // default
  oem: 3,
  psm: 3,
}

async function main() {
  try {
    const image = path.join(__dirname, "assets/TB.jpeg")
    const text = await tesseract.recognize(image, config)
    const lines = text.split('\n').map(x => x.trim()).filter(x => x.length > 0)

    const store = detectStore(lines)

    console.log('store', store)
    
    
    if (store == "MC" ) {
        const qrResults = await getQRParser(image)
        console.log('qrResults', qrResults)

    } else if (store == "TB") {
      
      lines.forEach((line, idx) => {
        console.log(idx, line)
      })
      
      const code = lines[1].split(' ').reverse()[0]
      console.log('code', code)
      const url = "http://opiniontacobell.es/"

      

      const browser = await puppeteer.launch({ headless: false })
      const page = await browser.newPage()
      await page.goto(url)
      await page.waitForSelector('#NextButton')
      

      await page.type('#InputStoreNum', code)



        
    }
    
    const nPedidoBk = parseInt(lines[2].replace(/\D/g, '') || 0)
    //console.log('nPedidoBk', nPedidoBk)
  } catch (error) {
    console.log(error.message)
  }
  
}

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
                resolve(value.result);
            };
            qrcode.decode(image.bitmap);
         });
    })
}

main()