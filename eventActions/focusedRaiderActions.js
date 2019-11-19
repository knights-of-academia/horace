const config = require('../config.json');

class focusedRaiderActions {

	static async giveRole(reaction, user){
		// Ensure we're in the proper channel and using the proper reaction
<<<<<<< HEAD
		if(reaction.message.channel.id == config.channels.chooseroles && reaction._emoji.id == config.emotes.hocReaction) {
			if(reaction.message.id != config.focusedRaiderMessageId) return;
			// Create the role variable
			const role = reaction.message.guild.roles.find(role => role.id === config.roles.focusedraider);
=======
		if(reaction.message.channel.id == config.channels.chooseroles && reaction._emoji.name == config.emotes.hocReaction) {

			if(reaction.message.id != config.focusedRaiderMessageId) return;

			// Create the role variable
			const role = reaction.message.guild.roles.find(role => role.name === config.roles.focusedraider);
>>>>>>> 83df7b1a0087fc84407eb2bed8b473b26b8e2d7d

			// Create a GuildMember object from passed in user, and add role
			await reaction.message.guild.fetchMember(user).then(activeMember => activeMember.addRole(role));
		}
	}

	static async removeRole(reaction, user){
		// Ensure we're in the proper channel and using the proper reaction
<<<<<<< HEAD
		if(reaction.message.channel.id == config.channels.chooseroles && reaction._emoji.id == config.emotes.hocReaction) {
=======
		if(reaction.message.channel.id == config.channels.chooseroles && reaction._emoji.name == config.emotes.hocReaction) {
>>>>>>> 83df7b1a0087fc84407eb2bed8b473b26b8e2d7d

			if(reaction.message.id != config.focusedRaiderMessageId) return;

			// Create the role variable
<<<<<<< HEAD
			const role = reaction.message.guild.roles.find(role => role.id === config.roles.focusedraider);
=======
			const role = reaction.message.guild.roles.find(role => role.name === config.roles.focusedraider);
>>>>>>> 83df7b1a0087fc84407eb2bed8b473b26b8e2d7d

			// Create a GuildMember object from passed in user, adn remove role
			await reaction.message.guild.fetchMember(user).then(activeMember => activeMember.removeRole(role));
		}
	}
}

<<<<<<< HEAD
module.exports = focusedRaiderActions;
=======
module.exports = focusedRaiderActions;
>>>>>>> 83df7b1a0087fc84407eb2bed8b473b26b8e2d7d
