const config = require('../config.json');

class citadelActions {
	static async greetMorningOrNight(client, message) {
		// Handle good morning and goodnight
		if (message.channel.id === config.channels.citadel) {
			if (/g+o{2,}d+\s*m+o+r+n+i+n+g+/mi.test(message.content)) {
				return await message.react(config.emotes.goodmorning);
			} else if (/g+o{2,}d+\s*n+i+g+h+t+/mi.test(message.content)) {
				return await message.react(config.emotes.goodnight);
			}
		}
	}
}

module.exports = citadelActions;
