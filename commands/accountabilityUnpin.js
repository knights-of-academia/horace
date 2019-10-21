const accountabilityActions = require('../eventActions/accountabilityActions');
const config = require('../config.json');

module.exports.execute = async (client, message) => {
	if(message.channel.id === config.channels.accountability) {
		// Call to method elsewhere
		accountabilityActions.userUnpinsMessage(message, message.author);
	}
};

module.exports.config = {
	name: 'accountabilityUnpin', // Chose this name for organizational sake
	aliases: ['accountabilityUnpin', 'unpin'],
	description: 'I will unpin a message for you in accountability',
	usage: ['unpin']
};
