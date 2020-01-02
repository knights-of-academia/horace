class highlightActions {

	// Method to call that DMs a user about a message containing a highlighted phrase

	// Method to call to check a message for a highlighted message

	/*
	static async sendNotificationDM(client, user, reaction) {
		if (reaction._emoji.name === config.emotes.bookmark) {
			const workingMessage = reaction.message;
			const swordsEmote = '⚔';
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

			user.send(bookmarkEmbed);
		}
	} */
}

module.exports = highlightActions;
