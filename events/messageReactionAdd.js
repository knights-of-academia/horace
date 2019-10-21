const tosActions = require('../eventActions/tosActions');
<<<<<<< HEAD
const accountabilityActions = require('../eventActions/accountabilityActions');
=======
const pinAction = require('../eventActions/pinAction');
>>>>>>> 126f01c97fb195ada46dfd08916927ac5f72bc22

module.exports = async (client, reaction, user) => {
	// Handle reaction to the ToS message in ToS channel
	tosActions.userAcceptsTOS(reaction, user, client);
<<<<<<< HEAD

	// Handle reaction to a message in accountability cahnnel
	accountabilityActions.userPinsMessage(reaction, user);
=======
	// Handle message pinning in channels
	pinAction.pinMessage(client, reaction);
>>>>>>> 126f01c97fb195ada46dfd08916927ac5f72bc22
};

