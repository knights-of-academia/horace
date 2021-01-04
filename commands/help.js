// TODO: this file really sucks...

/* eslint-disable no-restricted-syntax */
/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
const { Consola } = require('consola');
const Discord = require('discord.js');
const config = require('../config.json');

let prefix;
if (config) {
  prefix = config.prefix;
} else {
  prefix = '!';
}

module.exports.execute = async (client, message, args) => {
  const { commands } = client;
  const commandNames = [];

  if (!args || args.length === 0) {
    const helpMessage = new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setTitle('List of available commands')
      .setDescription(`Commands available in ${message.guild.name}`);
    commands.forEach((command) => {
      helpMessage.addField(`**${prefix}${command.config.name}**`, `${command.config.description}`);
    });
    try {
      message.author.send(helpMessage);
    } catch (err) {
      Consola.log(err);
    }
    return message.channel.send('I have sent you a private message with the command list.').catch((err) => {
      Consola.error(err);
    });
  } if (args.length === 1) {
    const command = commands.find((command) => command.config.name === args[0].toLowerCase()
            || command.config.aliases.find((alias) => alias === args[0].toLowerCase()));

    if (command) {
      const helpMessage = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle(`${prefix}${command.config.name}`)
        .setDescription(`You asked for information on ${prefix}${command.config.name}`);
      helpMessage.addField('Description:', command.config.description);
      helpMessage.addField('Aliases:', command.config.aliases);
      helpMessage.addField('Usage:', command.config.usage);

      try {
        message.channel.send(helpMessage);
      } catch (err) {
        Consola.log(err);
      }
    } else {
      commands.forEach((command) => {
        commandNames.push(command.config.name);
        command.config.aliases.forEach((alias) => commandNames.push(alias));
      });
      return didYouMean(commandNames, args[0].toLowerCase(), message);
    }
  }
  return null;
};

async function didYouMean(commands, search, message) {
  if (!commands.includes(search)) {
    const score = [];
    let lev = 1000;
    const str = [];
    for (const command of commands) {
      if (levenshtein(search, command) <= lev) {
        lev = levenshtein(search, command);
        str.push(command);
      }
    }
    if (str.length > 1) {
      const arr = [];
      for (const string of str) {
        arr.push(string.split(''));
      }
      for (let i = 0; i < arr.length; i += 1) {
        score[i] = 0;
        for (let j = 0; j < arr[i].length; j += 1) {
          if (search.split('')[j] === arr[i][j]) {
            score[i] += 1;
          }
        }
      }
      return message.channel.send(`Did you mean \`${prefix}help ${str[score.indexOf(Math.max(...score))]}\`?`).catch((err) => Consola.log(err));
    }
    return message.channel.send(`Did you mean \`${prefix}help ${str[0]}\`?`).catch((err) => Consola.log(err));
  }
  return null;
}

function levenshtein(searchTerm, commandName) {
  if (searchTerm.length === 0) return commandName.length;
  if (commandName.length === 0) return searchTerm.length;
  let tmp; let i; let j; let previous; let val;
  if (searchTerm.length > commandName.length) {
    tmp = searchTerm;
    searchTerm = commandName;
    commandName = tmp;
  }

  const row = Array(searchTerm.length + 1);
  for (i = 0; i <= searchTerm.length; i += 1) {
    row[i] = i;
  }

  for (i = 1; i <= commandName.length; i += 1) {
    previous = i;
    for (j = 1; j <= searchTerm.length; j += 1) {
      if (commandName[i - 1] === searchTerm[j - 1]) {
        val = row[j - 1];
      } else {
        val = Math.min(row[j - 1] + 1,
          Math.min(previous + 1,
            row[j] + 1));
      }
      row[j - 1] = previous;
      previous = val;
    }
    row[searchTerm.length] = previous;
  }
  return row[searchTerm.length];
}

module.exports.config = {
  name: 'help',
  aliases: ['help'],
  description: 'I will send you this message, or the usage of a specific command.',
  usage: ['help', 'help command'],
};
