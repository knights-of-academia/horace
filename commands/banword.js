const db = require('quick.db');
const config = require('../config.json');

module.exports.execute = async (client, message, args) => {
  if (message.member.roles.has(config.roles.guardian) | message.member.roles.has(config.roles.helper)) {
    if (!args[0]) {
      return message.channel.send('Please enter a word to ban!');
    }
    db.push(`bannedWords-${message.guild.id}`, args[0]);
    return message.channel.send(`Success! Added ${args[0]} to the blocked word list!`);
  }

  message.reply('Only moderators can run this command!');
};

module.exports.config = {
  name: 'banword',
  aliases: ['blockword'],
  description: 'Bans a specific word.',
  usage: ['banword word'],
};
