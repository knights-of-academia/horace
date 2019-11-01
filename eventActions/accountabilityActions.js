const config = require('../config.json');

// Helper method to loop through pins. I was getting mad when I named it...
function isMessagePinnedAtAll(messageToCheck, setOfPinnedMessages){
	const fetchedMessagesIterator = setOfPinnedMessages.values();
	var msgVal = fetchedMessagesIterator.next().value;
	while(msgVal != null){
		if(msgVal.id === messageToCheck.id){
			return true;
		}
		msgVal = fetchedMessagesIterator.next().value;
	}
}

class accountabilityActions {
	static async userPinsMessage(reaction, user) {
		/* Structure taken from tosActions.js for sake of consistency */

		// Check if we are in the accountability channel and the reaction emote is the proper emote
		if(reaction.message.channel.id == config.channels.accountability
            && reaction._emoji.name == config.emotes.pinMessage) {

			var sentMessage = reaction.message;
			var currentChannel = sentMessage.channel;

			// Make sure a user is pinning their own message
			if(user.id != sentMessage.author.id) return;

			await currentChannel.fetchPinnedMessages().then(fetchedPins =>{

				// If the pushpin reaction from the bot does not exist, pin the message
				if(!isMessagePinnedAtAll(sentMessage, fetchedPins)){
					// Pin the message
					var existingMessageCount = 0;


					// Get the pinned messages within a channel
					if(isMessagePinnedAtAll(sentMessage, fetchedPins) == true) return;
					// Check to see if they already have pinned messages
					var pinMsgIterator = fetchedPins.values();

					for (var i = 0; i < fetchedPins.size; i++){
						var msgVal = pinMsgIterator.next().value;
						if(msgVal.author.id === user.id){
							existingMessageCount++;
						}
					}

					// Pin the message
					sentMessage.clearReactions();
					sentMessage.pin();

					// If they have other pinned messages, give them a good 'ol reminder.
					if (existingMessageCount > 1){
						currentChannel.send('Hey, ' + user.username + ', I just wanted to remind you that you have ' + existingMessageCount + ' other pinned messages 😄');
					}
				} else {
					// Otherwise, the message has already been pinned, so unpin it
					sentMessage.unpin();
					currentChannel.send('Hey, ' + user.username + ', I\'ve unpinned your selected message as requested!');
				}
				sentMessage.react(config.emotes.pinMessage);

			});
		}
	}

	// Unpin message via command
	static async userUnpinsMessage(message, user){
		if(message.channel.id === config.channels.accountability) {

			var currentChannel = message.channel;

			var hasPinnedMessage = false;

			// Get the pinned messages within a channel
			await currentChannel.fetchPinnedMessages().then(fetchedPins => {

				// Check to see if they already have pinned messages
				var pinMsgIterator = fetchedPins.values();

				for (var i = 0; i < fetchedPins.size; i++){
					var msgVal = pinMsgIterator.next().value;
					if(msgVal.author.id == user.id){
						hasPinnedMessage = true;
						msgVal.unpin();
						break;
					}
				}
			});

			if(hasPinnedMessage){
				currentChannel.send('Hey, ' + user.username + ', I\'ve unpinned your most recent message as requested!');
			} else {
				currentChannel.send('Sorry, ' + user.username + '! I couldn\'t seem to find any pinned messages from you.');
			}
		}
	}
	// Add a random reaction to a message sent
	static async addReaction(client, message){
		if(message.channel.id != config.channels.accountability) return;
		if(message.content.toLowerCase().includes('!unpin')) return;
		// Define an array of emojis to pull from
		var random_emotes = config.emotes.accountability_emotes_array;

		// Flag emotes
		var length = random_emotes.length;
		var flags = [
			{ language: 'french', emote: '🇫🇷'},
			{ language: 'spanish', emote: '🇪🇸'},
			{ language: 'italian', emote: '🇮🇹'}
		];

		// Define special emotes (I didn't want to put all of them in the configuration...)
		var customCheckmark = config.emotes.yes2;
		var pomEmote = config.emotes.pom;

		// Pull a random reaction from the common emotes for and add to post (personally I like the separation of variables, let me know if that's not preferred style)
		var rand = Math.floor(Math.random() * length);
		var selectedEmote = random_emotes[rand];
		message.react(selectedEmote.toString());

		// Check for languages
		flags.forEach(function(langName){
			if(message.content.toLowerCase().includes(' ' + langName.language)){
				message.react(langName.emote);
			}
		});

		// Check for emotes
		if(message.content.toLowerCase().includes(':yes:') || message.content.toLowerCase().includes(':yes2:')){
			message.react(customCheckmark);
		}
		if(message.content.toLowerCase().includes(' pom')){
			message.react(pomEmote);
		}
	}
}

module.exports = accountabilityActions;