const tosActions = require('../eventActions/tosActions');
const accountabilityActions = require('../eventActions/accountabilityActions');
const pinAction = require('../eventActions/pinAction');

module.exports = async (client, reaction, user) => {
	// Handle reaction to the ToS message in ToS channel
	tosActions.userAcceptsTOS(reaction, user, client);

	// Handle reaction to a message in accountability cahnnel
	accountabilityActions.userPinsMessage(reaction, user);
	// Handle message pinning in channels
	pinAction.pinMessage(client, reaction);
};

