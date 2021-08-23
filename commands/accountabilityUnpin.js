const accountabilityActions = require('../eventActions/accountabilityActions');
const { Config } = require('../config.js');

module.exports.execute = async (client, message) => {
	if (message.channel.id === Config.CHANNELS.ACCOUNTABILITY) {
		accountabilityActions.userUnpinsMessage(message, message.author);
	}
};

module.exports.config = {
	name: 'accountabilityUnpin',
	aliases: ['accountabilityUnpin', 'unpin'],
	description: 'This command has me remove your latest pinned message!',
	usage: ['unpin']
};
