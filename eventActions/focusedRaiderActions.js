const config = require('../config.json');

class focusedRaiderActions {
	static async giveRole(reaction, user) {
		// Ensure we're in the proper channel and using the proper reaction
		if (reaction.message.channel.id == config.channels.chooseroles && reaction._emoji.toString() == config.emotes.focusedRaider) {
			if (reaction.message.id != config.focusedRaiderMessageId) return;
			// Create the role variable
			const role = reaction.message.guild.roles.cache.get(config.roles.focusedraider);

			// Create a GuildMember object from passed in user, and add role
			await reaction.message.guild.members.fetch(user.id)
				.then((guildMember) => {
					guildMember.roles.add(role);
				})
				.catch((error) => {
					console.error(error);
				});
		}
	}

	static async removeRole(reaction, user) {
		// Ensure we're in the proper channel and using the proper reaction
		if (reaction.message.channel.id == config.channels.chooseroles && reaction._emoji.toString() == config.emotes.focusedRaider) {
			if (reaction.message.id != config.focusedRaiderMessageId) return;

			// Create the role variable
			const role = reaction.message.guild.roles.cache.get(config.roles.focusedraider);

			// Create a GuildMember object from passed in user, and remove role
			await reaction.message.guild.members.fetch(user.id)
				.then((guildMember) => {
					guildMember.roles.remove(role);
				})
				.catch((error) => {
					console.error(error);
				});
		}
	}
}

module.exports = focusedRaiderActions;
