const tosActions = require('../eventActions/tosActions');
const pinAction = require('../eventActions/pinAction');

module.exports = async (client, reaction, user) => {
	// Handle reaction to the ToS message in ToS channel
	tosActions.userAcceptsTOS(reaction, user, client);
	// Handle message pinning in channels
	pinAction.pinMessage(client, reaction);
};

