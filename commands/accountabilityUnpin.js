const accountabilityActions = require('../eventActions/accountabilityActions');
const config = require('../config.json');

module.exports.execute = async (client, message) => {
	console.log(`message: ${message.channel.id}, config: ${config.channels.accountability}`);
	if(message.channel.id === config.channels.accountability) {
		accountabilityActions.userUnpinsMessage(message, message.author);
	}
};

module.exports.config = {
	name: 'accountabilityUnpin',
	aliases: ['accountabilityUnpin', 'unpin'],
	description: 'This command has me remove your latest pinned message!',
	usage: ['unpin']
};
