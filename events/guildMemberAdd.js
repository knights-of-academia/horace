const config = require('../config.json');

module.exports = (client, member) => {
	member.addRole(member.guild.roles.find(role => role.id === config.roles.initiate));
};
