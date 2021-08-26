const Discord = require('discord.js');
const BanWordUtils = require('../utils/banwordUtils.js');
const { Config } = require('../config.js');

class profanityActions {
	static async checkForProfanity(client, message) {
		const bannedWordsSQL = await BanWordUtils.getBannedWords();

		// check that moderation channelID is valid before attempting profanity check
		if (client.channels.cache.get(Config.CHANNELS.MODERATION) === undefined) {
			return console.log('Error! Moderation Channel ID in Config in likely invalid. Please verify!');
		}

		if (bannedWordsSQL.length == 0) {
			return;
		}

		if (bannedWordsSQL.some((word) => message.content.toLowerCase().includes(word))) {
			const embedMessage = new Discord.MessageEmbed()
				.setColor('#ff0000')
				.setTitle('🚩 Warning: Profanity detected 🚩')
				.setDescription(`Profanity detected in ${message.channel}`)
				.addField('User', message.author, true)
				.addField('Link', `[Go to message](${message.url})`, true)
				.addField('Message', `**${message.content}**`, true)
				.setFooter(
					`${message.author.username}#${message.author.discriminator}`,
					message.author.avatarURL,
				);
			return client.channels.cache
				.get(Config.CHANNELS.MODERATION)
				.send(embedMessage);
		}
	}
}

module.exports = profanityActions;
