const { Config } = require('../config.js');

class gratitudeActions {
	static async reactToGratitude(client, message) {
		// Check for gratitude message - case insensitive "today i am grateful for"
		let reg_gratitude = new RegExp('today +i +am +grateful +for', 'i');
		if (message.channel.id === Config.CHANNELS.GRATITUDE) {
			if (reg_gratitude.test(message.content)) {
				return await message.react(Config.EMOTES.GRATITUDE);
			}
		}
	}
}

module.exports = gratitudeActions;
