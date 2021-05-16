const deleteMessageActions = require ('../eventActions/deleteMessageActions');

module.exports = async (client, message) => {
	deleteMessageActions.sendMessageToModeration(client, message);
};
