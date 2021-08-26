const { Config } = require('../config.js');

class contentActions {
	static async reactToPost(client, message) {
		if (message.channel.id === Config.CHANNELS.CONTENT_NOTIFIER) {
			return await message.react(Config.EMOTES.HEART);
		}
	}
}

module.exports = contentActions;
