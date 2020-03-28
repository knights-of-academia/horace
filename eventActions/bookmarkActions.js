const config = require('../config.json');
const Discord = require('discord.js');

class bookmarkActions {

	static async bookmarkMessage(client, user, reaction) {
		if (reaction._emoji.name === config.emotes.bookmark) {
			const workingMessage = reaction.message;
			const swordsEmote = '⚔';
			const bookmarkEmbed = new Discord.RichEmbed()
				.setColor('#0F9BF1')
				.setTitle(`${swordsEmote} Knights of Academia Bookmark ${swordsEmote}`)
				.setDescription('You asked to bookmark this post from the Knights of Academia server.')
				.addField('Full Message', workingMessage)
				.addField('From', workingMessage.author, true)
				.addField('Link to Message', `[Jump to Message](${workingMessage.url})`, true)
				.addField('Channel', workingMessage.channel);
			const messageChunks = workingMessage.content.match(/[\s\S]{1,1024}/g);

			for (const chunk of messageChunks) {
				bookmarkEmbed.addField('Message', chunk);
			}

			user.send(bookmarkEmbed);
		}
	}
}

module.exports = bookmarkActions;
