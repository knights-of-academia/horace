const deleteMessageActions = require ('../eventActions/deleteMessageActions');

module.exports = async (client, message) => {
	// Send copy of deleted message to moderation.
	deleteMessageActions.sendMessageToModeration(client, message);
};
