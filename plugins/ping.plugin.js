const ut = require('./utils');

module.exports = [{
  event: 'message',
  once: false,
  async execute(message, app) {
    if (ut.isBotMessage(message)) return;

    if (message.content === '!ping') {
      await message.reply('pong!');
    }
  },
}];
