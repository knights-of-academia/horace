const { Config } = require('../config.js');

// Helper method to loop through pins. I was getting mad when I named it...
function isMessagePinnedAtAll(messageToCheck, setOfPinnedMessages) {
	const fetchedMessagesIterator = setOfPinnedMessages.values();
	let msgVal = fetchedMessagesIterator.next().value;
	while (msgVal != null) {
		if (msgVal.id === messageToCheck.id) {
			return true;
		}
		msgVal = fetchedMessagesIterator.next().value;
	}
}

class accountabilityActions {
	static async userPinsMessage(reaction, user) {
		// Check if we are in the accountability channel and the reaction emote is the proper emote
		if (reaction.message.channel.id == Config.CHANNELS.ACCOUNTABILITY
            && reaction._emoji.name == Config.EMOTES.PIN_MESSAGE) {
			const sentMessage = reaction.message;
			const currentChannel = sentMessage.channel;

			// Check if there are too many existing pins
			currentChannel.messages.fetchPinned().then((messages) => {
				const numOfPins = messages.size;
				if (numOfPins === 50) {
					currentChannel.send('**Uh oh!** This channel has reached its pin limit. Contact a Helper to purge the list.');
				}
			});

			// Make sure a user is pinning their own message
			if (user.id != sentMessage.author.id) return;

			await currentChannel.messages.fetchPinned().then((fetchedPins) => {
				// If the pushpin reaction from the bot does not exist, pin the message
				if (!isMessagePinnedAtAll(sentMessage, fetchedPins)) {
					// Pin the message
					let existingMessageCount = 0;


					// Get the pinned messages within a channel
					if (isMessagePinnedAtAll(sentMessage, fetchedPins) == true) return;
					// Check to see if they already have pinned messages
					const pinMsgIterator = fetchedPins.values();

					for (let i = 0; i < fetchedPins.size; i++) {
						const msgVal = pinMsgIterator.next().value;
						if (msgVal.author.id === user.id) {
							existingMessageCount++;
						}
					}

					// Pin the message
					sentMessage.reactions.removeAll();
					sentMessage.react(Config.EMOTES.PIN_MESSAGE);
					sentMessage.pin();

					// If they have other pinned messages, give them a good 'ol reminder.
					if (existingMessageCount > 1) {
						currentChannel.send('Hey, ' + user.username + ', I just wanted to remind you that you have ' + existingMessageCount + ' other pinned messages 😄');
					}
				} else {
					// Otherwise, the message has already been pinned, so unpin it
					sentMessage.unpin();
					currentChannel.send('Hey, ' + user.username + ', I\'ve unpinned your selected message as requested!');
				}
			});
		}
	}

	// Unpin message via command
	static async userUnpinsMessage(message, user) {
		if (message.channel.id === Config.CHANNELS.ACCOUNTABILITY) {
			const currentChannel = message.channel;

			let hasPinnedMessage = false;

			// Get the pinned messages within a channel
			await currentChannel.messages.fetchPinned().then((fetchedPins) => {
				// Check to see if they already have pinned messages
				const pinMsgIterator = fetchedPins.values();

				for (let i = 0; i < fetchedPins.size; i++) {
					const msgVal = pinMsgIterator.next();
					if (msgVal.value.author.id == user.id) {
						hasPinnedMessage = true;
						msgVal.value.unpin();
						break;
					}
				}

				if (hasPinnedMessage) {
					currentChannel.send('Hey, ' + user.username + ', I\'ve unpinned your most recent message as requested!');
				} else {
					currentChannel.send('Sorry, ' + user.username + '! I couldn\'t seem to find any pinned messages from you.');
				}
			});
		}
	}

	// Removes all pinned messages by a user
	static async userUnpinsAllMessages(message, user) {
		if (message.channel.id === Config.CHANNELS.ACCOUNTABILITY) {
			await message.channel.messages.fetchPinned().then((fetchedPins) => {
				// We're essentially doing the same thing as unpin message, but we don't stop upon finding their most recent pin.
				const pinMsgIterator = fetchedPins.values();
				let hasMessages = false;

				for (let i = 0; i < fetchedPins.size; i++) {
					const msgVal = pinMsgIterator.next();
					if (msgVal.value.author.id == user.id) {
						hasMessages = true;
						msgVal.value.unpin();
					}
				}

				if (hasMessages) {
					message.channel.send('Hey, ' + user.username + ', I\'ve unpinned **_ALL_** of your messages as requested!');
				} else {
					message.channel.send('Sorry, ' + user.username + '! I couldn\'t seem to find any pinned messages from you.');
				}
			});
		}
	}
}

module.exports = accountabilityActions;
