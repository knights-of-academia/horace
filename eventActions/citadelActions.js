const config = require('../config.json');

class citadelActions {
	static async greetMorningOrNight(client, message) {
		// Handle good morning and goodnight
		let reg_morning = new RegExp('mo*rning (koa[^a-z]*|knights[^a-z]*|friends[^a-z]*|everyone[^a-z]*)$');
		let reg_night = new RegExp('ni*ght (koa[^a-z]*|knights[^a-z]*|friends[^a-z]*|everyone[^a-z]*)$');
		if (message.channel.id === config.channels.citadel) {
			if (reg_morning.test(message.content.toLowerCase())) {
				return await message.react(config.emotes.goodmorning);
			} else if (reg_night.test(message.content.toLowerCase())) {
				return await message.react(config.emotes.goodnight);
			}
		}
	}
}

module.exports = citadelActions;
