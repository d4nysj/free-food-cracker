const axios = require('axios');
const path = require('path');
const os = require("os");
const fs = require('fs');
const { recognizeStore } = require("../../store-detector");

module.exports = {
    name: 'photo',
    description: 'Enviar Ticket',
    command: async function (ctx) {
        const photos = ctx.message.photo;
        if (!photos || photos.length === 0) {
            return ctx.reply('No hay fotos en el mensaje');
        }

        const photo = photos[photos.length - 1];
        const fileId = photo.file_id;
        
        const fileInfo = await ctx.telegram.getFile(fileId);
        const downloadLink = fileInfo.file_path;
        
        // Usar axios para descargar el archivo
        const response = await axios.get(`https://api.telegram.org/file/bot${ctx.tokens.botToken}/${downloadLink}`, { responseType: 'arraybuffer' });
    
        const savePath = path.join(os.tmpdir());
        // Guardar la foto en disco
        const photoPath = path.join(savePath, `${getRandomUUID()}.jpg`);
        fs.writeFileSync(photoPath, response.data);
        
        console.log(`Foto guardada en: ${photoPath}`);

        const { store, lines, text, qrResults } = await recognizeStore(photoPath)
        console.log('Proceso terminado')
        if (store === null) {
            return ctx.reply('No se pudo reconocer la tienda');
        }

        if (store === 'TB') { // Ticket de Taco Bell
            if (lines.filter(x => x.toLowerCase().replaceAll(' ', '').match('tbes')).length === 0) {
                return ctx.reply(`No se pudo reconocer el ticket de Taco Bell \n\n ${text}`);
            }

            const { finalCode, photoPath } = await getCodeTacoBell('TBES124')
            console.log('finalCode', finalCode)
            return ctx.replyWithPhoto({ source: photoPath }, { caption: `Aqui tienes tu codigo: ${finalCode}` });
        }

        ctx.reply(`Ticket reconocido: ${store}\n\nReconocimiento:\n\n${text} \n\n QR: \n\n${qrResults}`);

        fs.unlinkSync(photoPath);
            
    },
}

function getRandomUUID() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}


const getCodeTacoBell = async (code) => {
    const puppeteer = require('puppeteer')
    const moment = require('moment')

    const url = "http://opiniontacobell.es/"
    
    const browser = await puppeteer.launch({headless: 'new'})
    const page = await browser.newPage()
    await page.goto(url)
    await sleep(1000)
    await page.click('#NextButton')
    
    await sleep(2000)
    //await page.type('#InputStoreNum', code.toString())
    await page.type('#InputStoreNum', code, {delay: 100})
    const [year, month, day, hour, minute, ampm] = moment().format("YY-MM-DD-HH-mm-A").split("-")
    
    // select selector
    await page.select('#InputMonth', month)
    await page.select('#InputDay', day)
    await page.select('#InputYear', year)
    await page.select('#InputHour', pad(hour % 12, 2))
    await page.select('#InputMinute', minute)
    // InputMeridian is AM or PM
    await page.select('#InputMeridian', ampm)
    
    await page.type('#InputTransactionNum', "1234", {delay: 100})
    await page.click('#NextButton')
    
    await page.waitForSelector('#NextButton')
    // evaluate [...document.querySelectorAll("input[type='radio']")][randomNUM].click()
    await page.evaluate(() => {
      const radios = [...document.querySelectorAll("input[type='radio']")]
      const randomNum = Math.floor(Math.random() * radios.length)
      radios[randomNum].click()
    })
    await page.click('#NextButton')
    
    await page.waitForSelector('#NextButton')
    // evaluate [...document.querySelectorAll("input[type='radio']")][randomNUM].click()
    await page.evaluate(() => {
      const radios = [...document.querySelectorAll("input[type='radio']")]
      radios[1].click()
    })
    await page.click('#NextButton')
    
    await page.waitForSelector('#NextButton')
    // evaluate [...document.querySelectorAll("input[type='radio']")][randomNUM].click()
    await page.evaluate(() => {
      const radios = [...document.querySelectorAll("input[type='radio'][value='5']")].map(radio => radio.click())
      console.log(radios)
    })
    await page.click('#NextButton')
    
    await page.waitForSelector('#NextButton')
    // evaluate [...document.querySelectorAll("input[type='radio']")][randomNUM].click()
    await page.evaluate(() => {
      const radios = [...document.querySelectorAll("input[type='radio'][value='5']")].map(radio => radio.click())
      console.log(radios)
    })
    await page.click('#NextButton')
    
    await page.waitForSelector('#NextButton')
    // evaluate [...document.querySelectorAll("input[type='radio']")][randomNUM].click()
    await page.evaluate(() => {
      const radios = [...document.querySelectorAll("input[type='radio'][value='5']")].map(radio => radio.click())
      console.log(radios)
    })
    await page.click('#NextButton')
    
    await page.waitForSelector('#NextButton')
    // evaluate [...document.querySelectorAll("input[type='radio']")][randomNUM].click()
    await page.evaluate(() => {
      const radios = [...document.querySelectorAll("input[type='radio']")]
      radios[1].click()
    })
    await page.click('#NextButton')
    
    await page.waitForSelector('#NextButton')
    // evaluate [...document.querySelectorAll("input[type='radio']")][randomNUM].click()
    await page.evaluate(() => {
      const radios = [...document.querySelectorAll("input[type='radio'][value='5']")].map(radio => radio.click())
      console.log(radios)
    })
    await page.click('#NextButton')
    
    await page.waitForSelector('#NextButton')
    await page.click('#NextButton')
    
    await page.waitForSelector('#NextButton')
    // evaluate [...document.querySelectorAll("input[type='radio']")][randomNUM].click()
    await page.evaluate(() => {
      const radios = [...document.querySelectorAll("input[type='radio']")]
      radios[1].click()
    })
    await page.click('#NextButton')
    
    await page.waitForSelector('#NextButton')
    // evaluate [...document.querySelectorAll("input[type='radio']")][randomNUM].click()
    await page.evaluate(() => {
      const radios = [...document.querySelectorAll("input[type='radio']")]
      radios[1].click()
    })
    await page.click('#NextButton')
    await sleep(2000)
    // print page content in image and save locally
    const savePath = path.join(os.tmpdir());
    // Guardar la foto en disco
    const photoPath = path.join(savePath, `${getRandomUUID()}.jpg`);
    await page.screenshot({path: photoPath})
    
    
    // get content of p element ValCode class
    let finalCode = await page.evaluate(() => {
        
      return document.querySelector(".ValCode").textContent
    })
    finalCode = finalCode.split(':')[1].trim()
    
    console.log('codigo', finalCode)
    return {finalCode, photoPath}
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function pad (num, length) {
  return (num / Math.pow(10, length)).toFixed(length).substr(2)
}