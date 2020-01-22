const Highlights = require('../databaseFiles/highlightsTable.js');
const Discord = require('discord.js');

class highlightActions {

	// Method to call to check a message for a highlighted message
	static async checkForHighlight(client, message){
		if(message.content.charAt(0) === '!') return; // Ensure commands aren't caught
		// For every phrase in the table
		Highlights.findAll({
			attributes: ['phrase', 'users']
		}).then(result => {
			for(var i = 0; i < result.length; i++){
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
		const sunEmote = '☀️';
		const highlightNotification = new Discord.RichEmbed()
			.setColor('#FFEC09')
			.setTitle(`${sunEmote} Knights of Academia Highlight Alert ${sunEmote}`)
			.setDescription('One of your highlights has been triggered!')
			.addField('Highlighted Phrase', highlightedPhrase)
			.addField('Full Message', workingMessage)
			.addField('Channel', workingMessage.channel);

		user.send(highlightNotification);
	}
}

module.exports = highlightActions;
