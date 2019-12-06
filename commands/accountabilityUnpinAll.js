const accountabilityActions = require('../eventActions/accountabilityActions');
const config = require('../config.json');

module.exports.execute = async (client, message) => {
	if(message.channel.id === config.channels.accountability) {
		// Call to method elsewhere
		accountabilityActions.userUnpinsAllMessages(message, message.author);
	}
};

module.exports.config = {
	name: 'accountabilityUnpinAll', // Chose this name for organizational sake
	aliases: ['accountabilityUnpinAll', 'unpinall'],
	description: 'This command has me remove all of your pinned messages!',
	usage: ['unpinall']
};
