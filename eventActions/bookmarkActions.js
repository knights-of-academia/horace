const Discord = require('discord.js');
const config = require('../config.json');

class bookmarkActions {
  static async bookmarkMessage(client, user, reaction) {
    if (reaction._emoji.name === config.emotes.bookmark) {
      const workingMessage = reaction.message;
      const swordsEmote = '⚔';
      const bookmarkEmbed = new Discord.MessageEmbed()
        .setColor('#0F9BF1')
        .setTitle(`${swordsEmote} Knights of Academia Bookmark ${swordsEmote}`)
        .setDescription('You asked to bookmark this post from the Knights of Academia server.')
        .addField('From', workingMessage.author, true)
        .addField('Link to Message', `[Jump to Message](${workingMessage.url})`, true)
        .addField('Channel', workingMessage.channel);
      const messageChunks = workingMessage.content.match(/[\s\S]{1,1024}/g);

      for (const chunk of messageChunks) {
        bookmarkEmbed.addField('Full Message', chunk);
      }

      // Add link to attachment
      if (workingMessage.attachments.array().length > 0) {
        const attchmnt = workingMessage.attachments.array()[0].url;
        console.log(attchmnt);
        bookmarkEmbed.addField('Attachment', attchmnt)
          .setImage(attchmnt);
      }

      user.send(bookmarkEmbed);
    }
  }
}

module.exports = bookmarkActions;
