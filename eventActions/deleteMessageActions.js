const { Config } = require('../config.js');
const Discord = require('discord.js');

class deleteMessageActions {
	static async sendMessageToModeration(client, message) {
		const isHoraceBot = message.author.id === client.user.id;

		const isCommand = message.content.startsWith(Config.BOT.PREFIX);

		const isStaffAccountability = message.channel.id == Config.CHANNELS.STAFF_ACCOUNTABILITY;

		if (!(isHoraceBot || isCommand || isStaffAccountability)) {
			let embed = new Discord.MessageEmbed()
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


			client.channels.cache.get(Config.CHANNELS.MESSAGE_LOGS).send(embed);
		}
	}
}

module.exports = deleteMessageActions;
