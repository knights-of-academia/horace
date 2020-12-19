const config = require('../config.json');

module.exports = (client, member) => {
	member.roles.add(member.guild.roles.cache.find(role => role.id === config.roles.initiate));
};
