const { Consola } = require('consola');
const chainMessageAction = require('../eventActions/checkChainMessage');

module.exports = (client) => {
  chainMessageAction.loadChainMessageTracker(client);
  Consola.log(`Running on ${client.channels.cache.size} channels on ${client.guilds.cache.size} servers.`);
  client.user.setActivity('Ready to !help');
};
