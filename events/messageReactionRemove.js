const focusedRaiderActions = require('../eventActions/focusedRaiderActions');

module.exports = async (client, reaction, user) => {
  // Remove focused raider role
  focusedRaiderActions.removeRole(reaction, user);
};
