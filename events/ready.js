const chainMessageAction = require('../eventActions/checkChainMessage');
const remind = require('../commands/remind');
const config = require('../config.json');

module.exports = (client) => {
	chainMessageAction.loadChainMessageTracker(client);
	console.log(`Running on ${client.channels.cache.size} channels on ${client.guilds.cache.size} servers.`);
	remind.catchUp(client);
	setInterval(remind.scanForReminders, config.reminderScanInterval, client);
	client.user.setActivity('Ready to !help');
};
