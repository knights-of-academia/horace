const chainMessageAction = require('../eventActions/checkChainMessage');
const config = require('../config.json');
const { sequelize } = require('../databaseFiles/connect');
const remind = require('../commands/remind');

module.exports = async (client) => {
	chainMessageAction.loadChainMessageTracker(client);
	console.log(`Running on ${client.channels.cache.size} channels on ${client.guilds.cache.size} servers.`);
	await sequelize.sync();
	remind.catchUp(client);
	setInterval(remind.scanForReminders, config.reminderScanInterval, client);
	client.user.setActivity('Ready to !help');
};
