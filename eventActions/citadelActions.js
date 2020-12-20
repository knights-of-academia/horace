const config = require('../config.json');

class citadelActions {
	static async greetMorningOrNight(client, message) {

		// Handle good morning and goodnight
		let strict_reg_morning = new RegExp(config.strict_morning_regex);
		let strict_reg_night = new RegExp(config.strict_night_regex);
		let normal_reg_morning = new RegExp(config.normal_morning_regex);
		let normal_reg_night = new RegExp(config.normal_night_regex);

		if (message.channel.id === config.channels.citadel) {
			if (config.forceStrictGreetings && strict_reg_morning.test(message.content.toLowerCase())
				|| !config.forceStrictGreetings && normal_reg_morning.test(message.content.toLowerCase())) {
				// return await message.react(config.emotes.goodmorning);
			} else if (config.forceStrictGreetings && strict_reg_night.test(message.content.toLowerCase())
				|| !config.forceStrictGreetings && normal_reg_night.test(message.content.toLowerCase())) {
				// return await message.react(config.emotes.goodnight);
			}
		}
	}
}

module.exports = citadelActions;
