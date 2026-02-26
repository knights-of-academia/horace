const { Config } = require('../config.js');
const Discord = require('discord.js');

class bookmarkActions {
	static async bookmarkMessage(client, user, reaction) {
		if (reaction._emoji.name === Config.EMOTES.BOOKMARK) {
			const workingMessage = reaction.message;
			const swordsEmote = '⚔';
			const bookmarkEmbed = new Discord.MessageEmbed()
				.setColor('#0F9BF1')
				.setTitle(`${swordsEmote} Knights of Academia Bookmark ${swordsEmote}`)
				.setDescription('You asked to bookmark this post from the Knights of Academia server.')
				.addFields(
					{ name: 'From', value: workingMessage.author, inline: true },
					{ name: 'Link to Message', value: `[Jump to Message](${workingMessage.url})`, inline: true },
					{ name: 'Channel', value: workingMessage.channel }
				);
			const messageChunks = workingMessage.content.match(/[\s\S]{1,1024}/g);

			for (const chunk of messageChunks) {
				bookmarkEmbed.addFields({ name: 'Full Message', value: chunk });
			}

			// Add link to attachment
			if (workingMessage.attachments.size > 0) {
				const attchmnt = workingMessage.attachments.first().url;
				console.log(attchmnt);
				bookmarkEmbed
					.addFields({ name: 'Attachment', value: attchmnt })
					.setImage(attchmnt);
			}

			user.send({ embeds: [bookmarkEmbed] });
		}
	}
}

module.exports = bookmarkActions;
