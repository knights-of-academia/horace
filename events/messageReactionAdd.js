const tosActions = require('../eventActions/tosActions');
const accountabilityActions = require('../eventActions/accountabilityActions');
const pinAction = require('../eventActions/pinAction');
const focusedRaiderActions = require('../eventActions/focusedRaiderActions');
const bookmarkActions = require('../eventActions/bookmarkActions');

module.exports = async (client, reaction, user) => {
  // Handle reaction to the ToS message in ToS channel
  tosActions.userAcceptsTOS(reaction, user, client);

  // Handle reaction to a message in accountability channel
  accountabilityActions.userPinsMessage(reaction, user);

  // Handle message pinning in channels
  pinAction.pinMessage(client, reaction);

  // Add focused raider role
  focusedRaiderActions.giveRole(reaction, user);

  // Bookmark messages in DMs
  bookmarkActions.bookmarkMessage(client, user, reaction);
};
