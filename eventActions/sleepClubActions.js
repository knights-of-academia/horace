const { Config } = require('../config.js');

class sleepClubActions {
	static async reactToSleepLog(client, message) {
		const emote = Config.EMOTES.SLEEP_LOG_REACTION;
		if (message.channel.id === Config.CHANNELS.SLEEP_CLUB
			&& (message.content.toLowerCase().includes('sleep log'))) {
			message.react(emote);
		}
	}
}

module.exports = sleepClubActions;
