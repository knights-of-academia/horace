const accountabilityActions = require('../eventActions/accountabilityActions');

module.exports = async (client, reaction, user) => {
	// Handle the removal of a reaction to a message in accountability cahnnel
	accountabilityActions.userManuallyUnpinsMessage(reaction, user);
};

