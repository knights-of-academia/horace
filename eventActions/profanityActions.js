const config = require('../config.json');
const Discord = require('discord.js');

class profanityActions {
	static async checkForProfanity(client, message) {
		const profanityList = [
			'bitch',
			'cock',
			'dick',
			'fag',
			'fuck',
			'idiot',
			'piss',
			'pussy',
			'porn',
			'retard',
			'shit',
			'tranny'
		];

		const containedProfanity = profanityList.some(substring => message.content.includes(substring));

		if (containedProfanity) {
			const embedMessage = new Discord.RichEmbed()
				.setColor('#ff0000')
				.setTitle('🚩 Warning: Profanity detected 🚩')
				.setDescription(`Profanity detected in ${message.channel}`)
				.addField('User', message.author, true)
				.addField('Link', `[Go to message](${message.url})`, true)
				.setFooter(message.author.username + '#' + message.author.discriminator, message.author.avatarURL);

			// Split message into multiple, in case takes up more space than
			// what discordjs allows for a field.
			const messageChunks = message.content.match(/[\s\S]{1,1024}/g);

			for (let chunk of messageChunks) {
				embedMessage.addField('Message', chunk);
			}

			// Send message to moderation log
			client.channels.get(config.channels.moderation).send(embedMessage);
		}
	}

}

module.exports = profanityActions;