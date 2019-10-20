const config = require('../config.json');

class hocActions {
	static async reactWithLetsGo(client, message) {
		const emote = config.emotes.hocReaction.toString();
		if (message.channel.id === config.channels.hallofconquests) {
			message.react(emote);
		}
	}
}

module.exports = hocActions;
