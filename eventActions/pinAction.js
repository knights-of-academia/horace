const config = require('../config.json');

class pinAction {

	static async pinMessage(client, reaction) {
		// Check for max pins regardless of channel
		const currentChannel = reaction.message.channel;
		let numOfPins = 0;
		currentChannel.fetchPinnedMessages().then(messages =>
			numOfPins = messages.size);
		if(numOfPins == 50){
			currentChannel.send('**Uh oh!** This channel has reached its pin limit.');
			return;
		}
		else if(numOfPins >= 45){
			currentChannel.send('**Heads up!** This channel has almost at its pin limit! There are currently ' + numOfPins + ' pinned messages.');
			return;
		}

		// If it's accountability station, manage that
		if (currentChannel.id === config.channels.accountability) return;

		// Server-wide pin feature
		const pinLimit = config.pinLimit;
		if (reaction._emoji.name === config.emotes.pinMessage && reaction.count >= pinLimit) {
			return reaction.message.pin();
		} else if (reaction._emoji.name === config.emotes.pinMessage &&
			reaction.message.pinned &&
			reaction.message < pinLimit) {
			currentChannel.send('Your message was successfully unpinned');
			return reaction.message.unpin();
		}
	}
}

module.exports = pinAction;