const config = require('../config.json');

class contentActions {
	static async reactToPost(client, message) {
		if (message.channel.id === config.channels.contentNotifier) {
			return await message.react(config.emotes.heart);
		}
	}
}

module.exports = contentActions;