const chainMessageAction = require('../eventActions/checkChainMessage.js');
const { Config } = require('../config.js');
const { sequelize } = require('../databaseFiles/connect.js');
const remind = require('../commands/remind.js');
const tosRemind = require('../eventActions/tosReminderAction.js');

module.exports = async (client) => {
	await sequelize.sync();
	await chainMessageAction.loadChainMessageTracker(client);
	await remind.catchUp(client);
	setInterval(remind.scanForReminders, Config.REMINDER_SCAN_INTERVAL, client);
	setInterval(tosRemind.tosRemind, Config.TOS.REMINDER_TIMER, client);
	await client.user.setActivity('Ready to !help');
	console.log(`Running on ${client.channels.cache.size} channels on ${client.guilds.cache.size} servers.`);
};
