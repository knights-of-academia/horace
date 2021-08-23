const { Config } = require('../config.js');

class pinAction {
	static async pinMessage(client, reaction) {
		// Accountability station has its own manager
		if (reaction.message.channel.id === Config.CHANNELS.ACCOUNTABILITY) return;

		// Server-wide pin feature
		const pinLimit = Config.PIN_LIMIT;
		if (reaction._emoji.name === Config.EMOTES.PIN_MESSAGE && reaction.count >= pinLimit) {
			return reaction.message.pin();
		} else if (reaction._emoji.name === Config.EMOTES.PIN_MESSAGE &&
			reaction.message.pinned &&
			reaction.message < pinLimit) {
			reaction.message.channel.send('Your message was successfully unpinned');
			return reaction.message.unpin();
		}
	}
}

module.exports = pinAction;
