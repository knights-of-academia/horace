const config = require('../config.json');
const Discord = require('discord.js');

class bookmarkActions {

	static async bookmarkMessage(client, reaction) {
		if (reaction._emoji.name === config.emotes.bookmark) {
			const workingMessage = reaction.message;
			const swordsEmote = '⚔';
			workingMessage.guild.fetchMember(workingMessage.author.id).then(guildMember => {
				const bookmarkEmbed = new Discord.RichEmbed()
					.setColor('#0F9BF1')
					.setTitle(`${swordsEmote} Knights of Academia Bookmark ${swordsEmote}`)
					.setDescription('You asked to bookmark this post from the Knights of Academia server.')
					.addField('Channel', workingMessage.channel)
					.addField('Author', workingMessage.author);
				const messageChunks = workingMessage.content.match(/[\s\S]{1,1024}/g);

				for (const chunk of messageChunks) {
					bookmarkEmbed.addField('Message', chunk);
				}

				guildMember.send(bookmarkEmbed);
			});
		}
	}
}

module.exports = bookmarkActions;
