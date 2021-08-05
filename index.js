const fs = require('fs');
const path = require('path');


// Bot client

const { Client, Intents } = require('discord.js');
const config = require('./secrets/app');

const app = new Client({
  intents: [
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
});

app.login(config.token);


// Plugins

const pluginDir = path.join(__dirname, 'plugins');
const files = fs.readdirSync(pluginDir);

for (const filename of files) {
  if (/\.plugin\.js$/.test(filename)) {
    const plugin = require(path.join(pluginDir, filename));

    for (const definition of plugin) {
      if (definition.once) {
        app.once(definition.event, (...args) => definition.execute(...args, app));
      } else {
        app.on(definition.event, (...args) => definition.execute(...args, app));
      }
    }
  }
}
