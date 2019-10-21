const config = require('../config.json');
const Discord = require('discord.js');

class deleteMessageActions {
	static async sendMessageToModeration(client, message) {
		let logs = await message.guild.fetchAuditLogs({ type: 72 });
		let entry = logs.entries.first();

		let embed = new Discord.RichEmbed()
			.setTitle('🟡 Warning: Message deleted 🟡')
			.setColor('#ffae42')
			.addField('Author', message.author, true)
			.addField('Channel', message.channel, true)
			.addField('Message', message.content)
			.addField('Link', `[Go to message](${message.url})`, true)
			.addField('Deleted by', entry.executor);
		// Send message to moderation log
		client.channels.get(config.channels.moderation).send(embed);
	}
}

module.exports = deleteMessageActions;
