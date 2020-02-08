const chainMessageAction = require('../eventActions/checkChainMessage');

module.exports = (client) => {
	chainMessageAction.loadChainMessageTracker(client);
	console.log(`Running on ${client.channels.size} channels on ${client.guilds.size} servers.`);
	client.user.setActivity('Ready to !help');
};
