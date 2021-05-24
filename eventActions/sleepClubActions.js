const config = require('../config.json');

class sleepClubActions {
	static async reactToSleepLog(client, message) {
		const emote = config.emotes.sleeplogReaction;
		if (message.channel.id === config.channels.sleepclub
			&& (message.content.toLowerCase().includes('sleep log'))) {
			message.react(emote);
		}
	}
}

module.exports = sleepClubActions;
