const config = require('../config.json');
const tosReminderAction = require("../eventActions/tosReminderAction");

module.exports = (client, member) => {
	member.roles.add(member.guild.roles.cache.find(role => role.id === config.roles.initiate));
	console.log(member.id);
	tosReminderAction.addToDatabase(member,new Date());
};