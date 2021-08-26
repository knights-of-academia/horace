const { Config } = require('../config.js');

class hocActions {
	static async reactWithLetsGo(client, message) {
		const emote = Config.EMOTES.HOC_REACTION.toString();
		if (message.channel.id === Config.CHANNELS.HALL_OF_CONQUESTS) {
			message.react(emote);
		}
	}
}

module.exports = hocActions;
