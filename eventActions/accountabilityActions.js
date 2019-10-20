const config = require('../config.json');

class accountabilityActions {
	static async userPinsMessage(reaction, user, client) {
		/* Structure taken from tosActions.js for sake of consistency */

		// Check if we are in the accountability channel and the reaction emote is the proper emote
		if(reaction.message.channel.id == config.channels.accountability
            && reaction._emoji.name == config.emotes.pinMessage) {

			// Get the user, message, and currently pinned messages
			var member = reaction.message.member;
            var message = reaction.message;
			var pinnedMessages;
			await message.channel.fetchPinnedMessages().then(messages => pinnedMessages = messages); // Doesn't store reaction data, those need to be obtained from individual messages.

			// Check to see if they already have a pinned message
			console.log("Pinned messages: " + pinnedMessages.keys());

			// Pin the message

		}
	}
}

module.exports = accountabilityActions;