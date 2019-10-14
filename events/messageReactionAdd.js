const config = require('../config.json');

module.exports = async (client, reaction, user) => {
	// Handle ToC acceptance
	if (reaction.message.channel.id === config.channels.toc
        && reaction._emoji.name === '✅') {
		reaction.message.guild.fetchMember(user.id).then(guildMember => {
			if(guildMember.roles.has(config.roles.initiate)) {
				const initiateRole = reaction.message.guild.roles.find(r => r.id === config.roles.initiate);
				guildMember.removeRole(initiateRole);

				// Send welcome message to the Citadel
				client.channels.get(config.channels.citadel).send(`🎉 **A new member has arrived!** 🎉\nWelcome to Knights of Academia <@${user.id}>!`);
			}
		});
	}
};
