const { Telegraf, Context } = require('telegraf')
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();
const os = require("os");



const botToken = process.env.BOT_TOKEN;

const bot = new Telegraf(botToken)
const savePath = path.join(os.tmpdir(), 'fotos');
console.log(savePath)

const authorizedUsers = (process.env.AUTORIZED || '').split(",").map(x=> parseInt(x));
console.log(authorizedUsers)

function esUsuarioAutorizado(userId) {
    return authorizedUsers.includes(userId);
  }


// Verificar y crear el directorio si no existe
if (!fs.existsSync(savePath)) {
  fs.mkdirSync(savePath);
}


const commands = [
    { command: 'subeticket', description: 'Enviar Ticket' },
    { command: 'ayuda', description: 'Obtener ayuda' },
    // Agrega más comandos aquí
  ];
  
  bot.telegram.setMyCommands(commands);



bot .start((ctx) => {
ctx.reply("Hola¡ Soy un bot tan inutil que no se hacer nada");
})

//bot .help((ctx) => {
 //   ctx.reply("Yo tambien necesito ayuda sabs ...");
  //  })

bot.command("subeticket", (ctx) => {
    if (esUsuarioAutorizado(ctx.from.id)) {
        ctx.reply('Envie Una captura del ticket Mamahuevo');
      } else {
        ctx.reply('Lo siento, no tienes acceso autorizado para interactuar con este bot.');
      }
      
  
})


//bot.hears(['Encuesta' , 'encuesta'], ctx => {
 //   ctx.reply("Bu")
//})

//bot.hears(['soy' , 'quiensoy', 'Soy'], ctx => {
  //  ctx.reply("Hola, Eres el Usuario: " + ctx.from.username + " -Con Nombre: " + ctx.from.first_name+ " -Con ID: " + ctx.from.id)
//})


bot.on('photo', async (ctx) => {
    
    const photos = ctx.message.photo;

    if (esUsuarioAutorizado(ctx.from.id)){

        if (photos.length > 0) {
            const photo = photos[photos.length - 1];
            const fileId = photo.file_id;
            
            const fileInfo = await ctx.telegram.getFile(fileId);
            const downloadLink = fileInfo.file_path;
            
            // Usar axios para descargar el archivo
            const response = await axios.get(`https://api.telegram.org/file/bot${botToken}/${downloadLink}`, { responseType: 'arraybuffer' });
        
            // Guardar la foto en disco
            const photoPath = path.join(savePath, `Ticket.jpg`);
            fs.writeFileSync(photoPath, response.data);
            
            console.log(`Foto guardada en: ${photoPath}`);
            }



    }else{

        console.log('Usuario no autorizado.');
        ctx.reply('Lo siento, no tienes acceso autorizado para interactuar con este bot.');
        
    }
  });

  
  bot.command('subeticket', (ctx) => {
    ctx.reply('¡Hola! ¿En qué puedo ayudarte?');
  });
  
  bot.command(['ayuda', 'help'], (ctx) => {
    ctx.reply('Aquí tienes una lista de comandos disponibles:\n/subeticket - Enviar Ticket\n/ayuda - Obtener ayuda');
    
  });


  bot.command(['Soy', 'soy','Quiensoy','QuienSoy'], (ctx) => {
    ctx.reply('Hola¡, Eres el Usuario: ' + ctx.from.username + " - Con ID: ");
    ctx.reply('' + ctx.from.id);
  });



  bot.launch().then(() => {
    console.log('Bot iniciado');
  }).catch(err => console.error(err));