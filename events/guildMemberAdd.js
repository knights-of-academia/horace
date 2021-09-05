const { Config } = require('../config.js');
const tosReminderAction = require('../eventActions/tosReminderAction');

module.exports = (client, member) => {
	member.roles.add(member.guild.roles.cache.find((role) => role.id === Config.ROLES.INITIATE));
	tosReminderAction.addToDatabase(member, new Date());
};
