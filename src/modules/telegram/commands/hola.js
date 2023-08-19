module.exports = {
    name: 'hola',
    description: 'Mensaje de bienvenida',
    command: async function (ctx) {
        console.log('isAdmin', ctx.state.isAdmin);
        ctx.reply('¡Hola! ¿En qué puedo ayudarte?');
    },
}