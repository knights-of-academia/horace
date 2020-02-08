const Highlights = require('../databaseFiles/highlightsTable.js');
const Discord = require('discord.js');
const config = require('../config.json');

class highlightActions {

	// Method to call to check a message for a highlighted message
	static async checkForHighlight(client, message){
		// Ensure commands aren't caught
		const cmdPrefix = config.prefix;
		if(message.content.substring(0, cmdPrefix.length) === cmdPrefix) return;
		if(config.forbiddenHighlightChannels.includes(message.channel.id)) return; // Ensure people can't "spy" on channels
		// For every phrase in the table
		Highlights.findAll({
			attributes: ['phrase', 'users']
		}).then(result => {
			for(let i = 0; i < result.length; i++){
				let currentPhrase = result[i].phrase;
				let currentId = result[i].users;
				// Check if the message.contains(that phrase)
				if(message.content.toLowerCase().includes(currentPhrase)){
					const user = client.users.get(currentId);
					this.sendHighlightDM(client, user, message, currentPhrase);
				}
			}
		});

		// If it does, sendHighlightDM(client, user, message, highlightedPhrase)
	}

	// Method to call that DMs a user about a message containing a highlighted phrase
	static async sendHighlightDM(client, user, message, highlightedPhrase) {
		const workingMessage = message;
		const highlightsEmote = '☀️';
		const highlightNotification = new Discord.RichEmbed()
			.setColor('#FFEC09')
			.setTitle(`${highlightsEmote} Knights of Academia Highlight Alert ${highlightsEmote}`)
			.setDescription('One of your highlights has been triggered!')
			.addField('Highlighted Phrase', highlightedPhrase)
			.addField('Full Message', workingMessage)
			.addField('From', workingMessage.author, true)
			.addField('Link to Message', `[Jump to Message](${workingMessage.url})`, true)
			.addField('Channel', workingMessage.channel);

		user.send(highlightNotification);
	}
}

module.exports = highlightActions;
