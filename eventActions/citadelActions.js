const { Config } = require('../config.js');

class citadelActions {
	static async greetMorningOrNight(client, message) {
		let strict_reg_morning = new RegExp(Config.GREETINGS.STRICT_MORNING_REGEX);
		let strict_reg_night = new RegExp(Config.GREETINGS.STRICT_NIGHT_REGEX);
		let normal_reg_morning = new RegExp(Config.GREETINGS.NORMAL_MORNING_REGEX);
		let normal_reg_night = new RegExp(Config.GREETINGS.NORMAL_NIGHT_REGEX);

		if (message.channel.id === Config.CHANNELS.CITADEL) {
			if (Config.GREETINGS.STRICT && strict_reg_morning.test(message.content.toLowerCase())
				|| !Config.GREETINGS.STRICT && normal_reg_morning.test(message.content.toLowerCase())) {
				return await message.react(Config.EMOTES.GOOD_MORNING);
			} else if (Config.GREETINGS.STRICT && strict_reg_night.test(message.content.toLowerCase())
				|| !Config.GREETINGS.STRICT && normal_reg_night.test(message.content.toLowerCase())) {
				return await message.react(Config.EMOTES.GOOD_NIGHT);
			}
		}
	}
}

module.exports = citadelActions;
