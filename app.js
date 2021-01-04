// TODO: Find a way to accomplish this without disabling eslint-stuff.

/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

const fs = require('fs');
const Discord = require('discord.js');
const consola = require('consola');
const config = require('./config.json');
const connect = require('./databaseFiles/connect.js');
const remind = require('./commands/remind.js');

const client = new Discord.Client({ ws: { intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'] } });

fs.readdir('./events/', (err, files) => {
  if (err) return consola.error(err);
  const jsfile = files.filter((f) => f.split('.').pop() === 'js');
  if (jsfile.length <= 0) {
    return consola.error('No errors have been loaded!');
  }
  return jsfile.forEach((file) => {
    const event = require(`./events/${file}`);
    const eventName = file.split('.')[0];
    client.on(eventName, event.bind(null, client));
  });
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

fs.readdir('./commands/', (err, files) => {
  if (err) consola.error(err);
  const jsfile = files
    .filter((t) => !t.includes('.test.'))
    .filter((f) => f.split('.').pop() === 'js');
  if (jsfile.length <= 0) {
    return consola.log('No commands have been loaded!');
  }
  return jsfile.forEach((f) => {
    const pull = require(`./commands/${f}`);
    client.commands.set(pull.config.name, pull);
    pull.config.aliases.forEach((alias) => {
      client.aliases.set(alias, pull.config.name);
    });
  });
});

// Connect to given database
connect.instantiateConnection();

client.login(config.token);

// Catch up on the belated reminders in case the bot was down at a given time.
// Set up an interval to scan the `Reminders` table and remind people as necessary.
client.on('ready', () => {
  remind.catchUp(client);
  setInterval(remind.scanForReminders, 30000, client);
});
