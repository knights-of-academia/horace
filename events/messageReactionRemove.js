const focusedRaiderActions = require('../eventActions/focusedRaiderActions');

module.exports = async (client, reaction, user) => {
	if (reaction.message.partial) {
		try {
			await reaction.message.fetch();
		} catch (error) {
			console.error('messageReactionRemove was unable to fetch the reaction message: ', error);
			return;
		}
	}

	focusedRaiderActions.removeRole(reaction, user);
};
