const config = require('../config.json');

class citadelActions {
	static async greetMorningOrNight(client, message) {
		if (message.channel.id === config.channels.citadel) {
			if (/go+d\s+mo+rni+ng/mi.test(message.content)) {
				return await message.react(config.emotes.goodmorning);
			} else if (/go+d\s+ni+ght/mi.test(message.content)) {
				return await message.react(config.emotes.goodnight);
			}
		}
	}
}

module.exports = citadelActions;
