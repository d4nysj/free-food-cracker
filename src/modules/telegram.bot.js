const { Telegraf, Context } = require('telegraf')
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const botToken = process.env.BOT_TOKEN;

const bot = new Telegraf(botToken)

module.exports = {
    init: async function () {
        // Definimos los comandos disponibles para el bot
        const auth = await require('./telegram/auth').init();

        if (auth.status === 'init') {
          bot.command('start', (ctx) => {
            if (auth.status !== 'init') return ctx.reply('Bienvenido!.');

            auth.addSudoUser(ctx.from.id);
            ctx.reply('¡Ahora eres un usuario sudo!');
            auth.status = 'ok'
          });
        }
        // Cargamos los comandos
        const commands = fs.readdirSync(path.join(__dirname, './telegram/commands'));
        const commandsList = [];
        for (const command of commands) {
          const commandModule = require(`./telegram/commands/${command}`);
          if (commandModule.init) {
            await commandModule.init(bot);
          }

          if (commandModule.command) {
            bot.command(commandModule.name, (ctx) => {
              console.log('COMANDO', commandModule.name, ctx.from.id)
              ctx.authModule = auth;
              ctx.tokens = { botToken }
              return auth.checkPermissions(ctx, commandModule.command)
            });
          }
          commandsList.push({ command: commandModule.name, description: commandModule.description });
        }

        // Cargamos los eventos
        const events = fs.readdirSync(path.join(__dirname, './telegram/events'));
        console.log('EVENTOS', events)
        for (const event of events) {
          const eventModule = require(`./telegram/events/${event}`);
          if (eventModule.init) {
            await eventModule.init(bot);
          }

          if (eventModule.command) {
            bot.on(eventModule.name, (ctx) => {
              console.log('EVENTO', eventModule.name, ctx.from.id)
              ctx.authModule = auth;
              ctx.tokens = { botToken }
              return auth.checkPermissions(ctx, eventModule.command)
            });
          }
        }

        bot.telegram.setMyCommands(commandsList);

        return bot.launch().then(() => {
          console.log('Bot iniciado');
        }).catch(err => console.error(err));
        
    }
}


/*function esUsuarioAutorizado(userId) {
    return authorizedUsers.includes(userId);
  }*/


// Verificar y crear el directorio si no existe
/*if (!fs.existsSync(savePath)) {
  fs.mkdirSync(savePath);
}
*/




// Mensaje de bienvenida
/*bot.start((ctx) => {
    ctx.reply("Hola¡ Soy un bot tan inutil que no se hacer nada");
})*/

/*bot.help((ctx) => {
    ctx.reply("Yo tambien necesito ayuda sabs ...");
})*/

/*bot.command("subeticket", (ctx) => {
    if (esUsuarioAutorizado(ctx.from.id)) {
        ctx.reply('Envie Una captura del ticket Mamahuevo');
    } else {
        ctx.reply('Lo siento, no tienes acceso autorizado para interactuar con este bot.');
    }
      
  
})*/


//bot.hears(['Encuesta' , 'encuesta'], ctx => {
 //   ctx.reply("Bu")
//})

//bot.hears(['soy' , 'quiensoy', 'Soy'], ctx => {
  //  ctx.reply("Hola, Eres el Usuario: " + ctx.from.username + " -Con Nombre: " + ctx.from.first_name+ " -Con ID: " + ctx.from.id)
//})


/*bot.on('photo', async (ctx) => {
    
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
*/
  
  /*bot.command('subeticket', (ctx) => {
    ctx.reply('¡Hola! ¿En qué puedo ayudarte?');
  });
  
  bot.command(['ayuda', 'help'], (ctx) => {
    ctx.reply('Aquí tienes una lista de comandos disponibles:\n/subeticket - Enviar Ticket\n/ayuda - Obtener ayuda');
    
  });


  bot.command(['Soy', 'soy','Quiensoy','QuienSoy'], (ctx) => {
    ctx.reply('Hola¡, Eres el Usuario: ' + ctx.from.username + " - Con ID: ");
    ctx.reply('' + ctx.from.id);
  });*/



  