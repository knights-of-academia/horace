const config = require('../config.json');

class accountabilityActions {
	static async userPinsMessage(reaction, user) {
		/* Structure taken from tosActions.js for sake of consistency */

		// Check if we are in the accountability channel and the reaction emote is the proper emote
		if(reaction.message.channel.id == config.channels.accountability
            && reaction._emoji.name == config.emotes.pinMessage) {

			// Pin the message
			var sentMessage = reaction.message;
			var currentChannel = sentMessage.channel;

			// Make sure a user is pinning their own message
			if(user.id != sentMessage.member.id) return;
			currentChannel.send('Hey, ' + user.username + ', I\'ve pinned your message for you as requested!');

			// Get the pinned messages within a channel
			await currentChannel.fetchPinnedMessages().then(fetchedPins => {

				// Check to see if they already have pinned messages
				var pinMsgIterator = fetchedPins.values();
				var existingMessageCount = 0;

				for (var i = 0; i < fetchedPins.size; i++){
					var msgVal = pinMsgIterator.next().value;
					if(msgVal.author.id === user.id){
						existingMessageCount++;
					}
				}

				// If they have other pinned messages, give them a good 'ol reminder.
				if (existingMessageCount > 1){
					currentChannel.send('Also, I just wanted to remind you that you have ' + existingMessageCount + ' other pinned messages :smile:');
				}
			});

			// Pin the message
			sentMessage.pin();

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
					if(msgVal.author.id === user.id){
						hasPinnedMessage = true;
						msgVal.unpin();
						break;
					}
					break;
				}
			});

			if(hasPinnedMessage){
				currentChannel.send('Hey, ' + user.username + ', I\'ve unpinned your most recent message as requested!');
			} else {
				currentChannel.send('Sorry, ' + user.username + '! I couldn\'t seem to find any pinned messages from you.');
			}
		}
	}

	// Unpin message by removing the reaction
	static async userManuallyUnpinsMessage(reaction, user){
		var curMessage = reaction.message;
		if(curMessage.channel.id === config.channels.accountability){
			if(curMessage.author.id === user.id){
				if(curMessage.pinned){
					curMessage.unpin();
					curMessage.channel.send('Hey, ' + user.username + ', I\'ve unpinned your message as requested!');
				}
			}
		}
	}
}

module.exports = accountabilityActions;