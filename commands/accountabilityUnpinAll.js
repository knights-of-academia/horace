const accountabilityActions = require('../eventActions/accountabilityActions');
const { Config } = require('../config.js');

module.exports.execute = async (client, message) => {
	if (message.channel.id === Config.CHANNELS.ACCOUNTABILITY) {
		accountabilityActions.userUnpinsAllMessages(message, message.author);
	}
};

module.exports.config = {
	name: 'accountabilityUnpinAll',
	aliases: ['accountabilityUnpinAll', 'unpinall'],
	description: 'This command has me remove all of your pinned messages!',
	usage: ['unpinall']
};
