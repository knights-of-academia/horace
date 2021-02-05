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
		await Highlights.sync();
		Highlights.findAll({
			attributes: ['phrase', 'users']
		}).then(result => {
			for(let i = 0; i < result.length; i++){
				let currentPhrase = result[i].phrase;
				let currentId = result[i].users;
				let contains = false;
				// Check if the message and the phrase are the same
				if(message.content.toLowerCase() == currentPhrase.toLowerCase()){
					contains = true;
					console.log('its the same');
				}
				// Check if the message contains the phrase, allowing for start and end of messages
				else if(message.content.toLowerCase().includes(' ' + currentPhrase + ' ')) {
					console.log('surrounded by spaces');
					contains = true;
				}
				else if(message.content.toLowerCase().includes(currentPhrase + ' ') || message.content.toLowerCase().includes(' ' + currentPhrase)){
					// Ensure the message isn't part of another phrase
					const indexOfPhraseStart = message.content.indexOf(currentPhrase);
					const indexOfPhraseEnd = indexOfPhraseStart + currentPhrase.length - 1;
					// Go ahead and check if it is a part of a word at all or has surrounding punctuation
					const punctuation = [' ', '.', ',', '?', '!', ':', ';', ''];
					console.log(indexOfPhraseEnd);
					console.log(message.content.length);
					// If it's at the start, check for containment within a word (i.e. may in mayflower)
					if(indexOfPhraseStart == 0){
						if(message.content.charAt(indexOfPhraseEnd+1) == ' '){
							contains = true;
						}
					}
					// If it's at the end, check for containment within a word
					else if(indexOfPhraseEnd == message.content.length-1){
						if(message.content.charAt(indexOfPhraseStart-1) == ' '){
							contains = true;
						}
					}

					// Check if within word with space before (-1 because we already checked for the beginning of a message)
					else if(message.content.charAt(indexOfPhraseStart-1) == ' '){
						// Separated from below check because of potential following punctuation
						if(punctuation.includes(message.content.charAt(indexOfPhraseEnd+1))){
							contains = true;
						}
					}

					// Check if within word with space after, including a check for punctuation (which is why it's separate from above)
					else if(message.content.charAt(indexOfPhraseEnd+1) == ' '){
						if(message.content.charAt(indexOfPhraseStart-1) == ' '){
							contains = true;
						}
					}

					// Check for basic punctuation
					else if(!punctuation.includes(message.content.charAt(indexOfPhraseEnd+1))) {
						contains = true;
					}
				}
				if(contains){
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
		const highlightNotification = new Discord.MessageEmbed()
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
