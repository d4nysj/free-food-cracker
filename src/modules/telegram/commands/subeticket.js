module.exports = {
    name: 'subeticket',
    description: 'Enviar Ticket',
    command: async function (ctx) {
        console.log('isAdmin', ctx.state.isAdmin);
        ctx.reply('¡Hola! ¿En qué puedo ayudarte? jj');
    },
}