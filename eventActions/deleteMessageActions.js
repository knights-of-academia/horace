const config = require('../config.json');
const Discord = require('discord.js');

class deleteMessageActions {
	static async sendMessageToModeration(client, message) {
		if (!message.content.startsWith(config.prefix)) {
			let embed = new Discord.RichEmbed()
				.setTitle('🟡 Warning: Message deleted 🟡')
				.setColor('#ffae42')
				.addField('Author', message.author, true)
				.addField('Channel', message.channel, true)
				.addField('Message', message.content);
			// Send message to moderation log
			client.channels.get(config.channels.moderation).send(embed);
		}
	}
}

module.exports = deleteMessageActions;
