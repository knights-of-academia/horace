const Discord = require('discord.js');
const config = require('../config.json');

class deleteMessageActions {
  static async sendMessageToModeration(client, message) {
    const isHoraceBot = message.author.id === client.user.id;

    const isCommand = message.content.startsWith(config.prefix);

    const isStaffAccountability = message.channel.id == config.channels.staffaccountability;

    if (!(isHoraceBot || isCommand || isStaffAccountability)) {
      const embed = new Discord.MessageEmbed()
        .setTitle('🟡 Warning: Message deleted 🟡')
        .setColor('#ffae42')
        .addField('Author', message.author, true)
        .addField('Channel', message.channel, true);

      if (message.content.length > 0) {
        embed.addField('Message', message.content);
      }

      if (message.attachments.size > 0) {
        embed.addField('Files attached to message:', message.attachments.values().next().value.filename);
      }

      client.channels.cache.get(config.channels.moderation).send(embed);
    }
  }
}

module.exports = deleteMessageActions;
