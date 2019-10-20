const config = require('../config.json');

class pinAction {

	static async pinMessage(client, reaction) {
		if (reaction.message.channel.id === config.channels.accountability) return;
		if (reaction._emoji.name === config.emotes.pinMessage && reaction.count >= 3) {
			return reaction.message.pin();
		} else if (reaction._emoji.name === config.emotes.pinMessage &&
			reaction.message.pinned &&
			reaction.message < 3) {
			reaction.message.channel.send('Your message was successfully unpinned');
			return reaction.message.unpin();
		}
	}
}

module.exports = pinAction;