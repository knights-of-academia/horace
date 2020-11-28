const config = require('../config.json');
const Discord = require('discord.js');
const db = require('quick.db');
class profanityActions {



	static async checkForProfanity(client, message) {
		const bannedWords = await db.get(`bannedWords-${message.guild.id}`);
		if (bannedWords.some((word) => message.content.includes(word))) {
			const embedMessage = new Discord.MessageEmbed()
				.setColor('#ff0000')
				.setTitle('🚩 Warning: Profanity detected 🚩')
				.setDescription(`Profanity detected in ${message.channel}`)
				.addField('User', message.author, true)
				.addField('Link', `[Go to message](${message.url})`, true)
				.addField('Message', `**${message.content}**`, true)
				.setFooter(
					message.author.username + '#' + message.author.discriminator,
					message.author.avatarURL
				);
			return client.channels.cache
				.get(config.channels.moderation)
				.send(embedMessage);
		}
	}
}

module.exports = profanityActions;
