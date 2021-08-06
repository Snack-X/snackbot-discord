const mathjs = require('mathjs');
const ut = require('./utils');

const math = mathjs.create(mathjs.all, {
  number: 'number',
});

mathEvaluate = math.evaluate;
math.import({
  import:     function () { throw new Error('import() is disabled') },
  createUnit: function () { throw new Error('createUnit() is disabled') },
  evaluate:   function () { throw new Error('evaluate() is disabled') },
  parse:      function () { throw new Error('parse() is disabled') },
  simplify:   function () { throw new Error('simplify() is disabled') },
  derivative: function () { throw new Error('derivative() is disabled') }
}, { override: true });

module.exports = [{
  event: 'message',
  once: false,
  async execute(message, app) {
    if (ut.isBotMessage(message)) return;

    if (message.content.startsWith('!=')) {
      const expr = message.content.substr(2).trim();

      try {
        const result = mathEvaluate(expr);

        await message.channel.send({
          embed: {
            title: '계산기',
            fields: [
              { name: '입력', value: '```' + expr + '```' },
              { name: '결과', value: '```' + result.toString() + '```' },
            ],
          },
        });
      } catch (err) {
        await message.channel.send({
          embed: {
            title: '계산기',
            fields: [
              { name: '입력', value: '```' + expr + '```' },
              { name: '오류', value: err.toString() },
            ],
          },
        });
      }
    }
  },
}];
