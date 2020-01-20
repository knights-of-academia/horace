const Highlights = require('../databaseFiles/highlightsTable.js');
const Discord = require('discord.js');

class highlightActions {

	// Method to call to check a message for a highlighted message
	static async checkForHighlight(client, message){
		// For every phrase in the table
		Highlights.findAll({
			attributes: ['phrase', 'users']
		}).then(result => {
			for(var i = 0; i < result.length; i++){
				let currentPhrase = result[i].phrase;
				let currentId = result[i].users;
				console.log('Looking for phrase... ' + currentPhrase);
				console.log('That phrase has a user id of... ' + currentId);
				// Check if the message.contains(that phrase)
				if(message.content.includes(currentPhrase)){
					const user = client.users.get(currentId);
					console.log('The user is... ' + user.username);
					this.sendHighlightDM(client, user, message, currentPhrase);
				}
			}
		});

		// If it does, sendHighlightDM(client, user, message, highlightedPhrase)
	}

	// Method to call that DMs a user about a message containing a highlighted phrase
	static async sendHighlightDM(client, user, message, highlightedPhrase) {
		const workingMessage = message;
		const starEmote = '⭐';
		const highlightNotification = new Discord.RichEmbed()
			.setColor('#0F9BF1')
			.setTitle(`${starEmote} Knights of Academia Highlight Alert ${starEmote}`)
			.setDescription('One of your highlights has been triggered!')
			.addField('Highlighted Phrase', highlightedPhrase)
			.addField('Full Message', workingMessage)
			.addField('Channel', workingMessage.channel);

		user.send(highlightNotification);
	}
}

module.exports = highlightActions;
