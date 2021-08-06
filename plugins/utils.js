// Ref: https://discord.com/branding
module.exports.COLOR_BLUE = '#5865F2';
module.exports.COLOR_GREEN = '#57F287';
module.exports.COLOR_YELLOW = '#FEE75C';
module.exports.COLOR_PINK = '#EB459E';
module.exports.COLOR_RED = '#ED4245';

module.exports.isBotMessage = message => {
  return message.author.bot;
};
