const ut = require('./utils');

const alarmList = {};
let alarmIndex = 1;

async function list(message) {
  const { author, channel } = message;
  const now = Math.floor(new Date().getTime() / 1000);

  const alarms = [];

  for (let index in alarmList) {
    const alarm = alarmList[index];

    if (author.id !== alarm.author.id) continue;
    if (channel.id !== alarm.channel.id) continue;
    if (alarm.cancelled) continue;

    alarms.push(alarm);
  }

  if (alarms.length === 0) {
    await message.reply({
      embed: {
        title: '알람 목록',
        description: '등록된 알람이 없습니다.',
      },
    });

    return;
  }

  await message.reply({
    embed: {
      title: '알람 목록',
      fields: alarms.map(alarm => ({
        name: `${alarm.index}번`,
        value: `${alarm.at - now}초 후${alarm.message ? ` (${alarm.message})` : ''}`,
      })),
    },
  });
}

async function add(message) {
  const { author, channel, content } = message;

  const command = content.substr(0, 5);
  const text = content.substr(5).trim();
  const regex = /^(?:(\d+)(?:시간|h))?\s*(?:(\d+)(?:분|m))?\s*(?:(\d+)(?:초|s))?\s*(.+)?/i;
  const match = text.match(regex);
  const [, h, m, s, msg] = match;

  if (!h && !m && !s) {
    await message.reply({
      embed: {
        title: '알람 등록',
        color: ut.COLOR_RED,
        fields: [
          { name: '사용법', value: `\`${command} <시간> (메시지)\`` },
          { name: '시간 형식', value: 'n초 / n분 / n분 n초 / n시간 / n시간 n분 / n시간 n초 / n시간 n분 n초' },
        ],
      },
    });

    return;
  }

  const timeH = parseInt(h, 10) || 0;
  const timeM = parseInt(m, 10) || 0;
  const timeS = parseInt(s, 10) || 0;
  const interval = (timeH * 60 * 60) + (timeM * 60) + timeS;

  const item = {
    index: alarmIndex,
    channel, author,
    message: msg,
    at: Math.floor(new Date().getTime() / 1000) + interval,
    cancelled: false,
  };

  await message.reply({
    embed: {
      title: '알람 등록',
      description: '알람을 등록했습니다',
      color: ut.COLOR_GREEN,
      fields: [
        { name: '시간', value: `${interval}초 후`, inline: true },
        { name: '번호', value: `\`${alarmIndex}\``, inline: true },
      ],
    },
  });

  ((index, after) => {
    const handle = setTimeout(() => {
      const alarm = alarmList[index];

      if (alarm.cancelled) return;

      let message = `${alarm.author}, 요청한 시간입니다.`;
      if (alarm.message) message += ` (${alarm.message})`;
      alarm.channel.send(message);

      delete alarmList[index];
    }, after);

    item.handle = handle;
  })(alarmIndex, interval * 1000);

  alarmList[alarmIndex] = item;
  alarmIndex += 1;
}

async function remove(message) {
  const { author, channel, content } = message;

  const command = content.substr(0, 5);
  const index = content.substr(5).trim();

  if (index.length === 0) {
    await message.reply({
      embed: {
        title: '알람 취소',
        color: ut.COLOR_RED,
        fields: [
          { name: '사용법', value: `\`${command} <번호>\`` },
        ],
      },
    });

    return;
  }

  const alarm = alarmList[index];

  if (!alarm) {
    await message.reply({
      embed: {
        title: '알람 취소',
        descriptiom: '해당 번호의 알람을 찾을 수 없습니다.',
        color: ut.COLOR_RED,
      },
    });
  }

  if (author.id !== alarm.author.id) {
    await message.reply({
      embed: {
        title: '알람 취소',
        descriptiom: '본인의 알람만 취소할 수 있습니다.',
        color: ut.COLOR_RED,
      },
    });
  }

  alarm.cancelled = true;

  await message.reply({
    embed: {
      title: '알람',
      description: '알람을 취소했습니다',
      color: ut.COLOR_GREEN,
    },
  });
}

module.exports = [{
  event: 'message',
  once: false,
  async execute(message, app) {
    if (ut.isBotMessage(message)) return;

    if (/^!알[람림](등록|추가)/.test(message.content)) await add(message);
    else if (/^!알[람림](취소|삭제)/.test(message.content)) await remove(message);
    else if (/^!알[람림]/.test(message.content)) await list(message);
  }
}];
