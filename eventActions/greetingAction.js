const config = require('../config.json');

class GreetingAction {


	static async reactToGreeting(client, message) {
		// Handle good morning and goodnight
		if (config.channels.citadel) {
			if (message.channel.id === config.channels.citadel) {
				if (/g+oo+d+\s+m+o+r+n+i+n+g([\s,]+.+)?/mi.test(message.content)) {
					return await message.react(config.emotes.goodmorning);
				} else if (/g+oo+d+\s+n+i+g+h+t+([\s,]+.+)?/mi.test(message.content)) {
					return await message.react(config.emotes.goodnight);
				}
			}
		}
	}
}

module.exports = GreetingAction;
