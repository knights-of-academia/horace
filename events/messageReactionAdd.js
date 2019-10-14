const config = require('../config.json');

module.exports = async (client, reaction, user) => {
	// Handle reaction to the ToS message in ToS channel
	if (reaction.message.channel.id === config.channels.tos
        && reaction._emoji.name === config.emotes.acceptTOS) {
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
