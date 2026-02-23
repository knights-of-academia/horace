const { Config } = require('../config.js');
const { EmbedBuilder } = require('discord.js');

class deleteMessageActions {
	static async sendMessageToModeration(client, message) {
		if (!message.author) {
			return;
		}

		const isHoraceBot = message.author.id === client.user.id;
		const isCommand = message.content.startsWith(Config.BOT.PREFIX);

		const isStaffAccountability = message.channel.id === Config.CHANNELS.STAFF_ACCOUNTABILITY;

		if (!(isHoraceBot || isCommand || isStaffAccountability)) {
			let embed = new EmbedBuilder()
				.setTitle('🟡 Warning: Message deleted 🟡')
				.setColor('#ffae42')
				.addFields(
					{ name: 'Author', value: message.author.toString(), inline: true },
					{ name: 'Channel', value: `${message.channel}`, inline: true },
				);

			if (message.content.length > 0) {
				embed.addFields(
					{ name: 'Message', value: message.content }
				);
			}

			if (message.attachments.size > 0) {
				embed.addFields(
					{ name: 'Files attached to message:', value: message.attachments.values().next().value.filename }
				);
			}


			client.channels.cache.get(Config.CHANNELS.MESSAGE_LOGS).send({
				embeds: [embed],
			});
		}
	}
}

module.exports = deleteMessageActions;
