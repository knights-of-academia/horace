/* eslint-disable no-underscore-dangle */
const config = require('../config.json');

class pinAction {
  static async pinMessage(client, reaction) {
    // Accountability station has its own manager
    if (reaction.message.channel.id === config.channels.accountability) return;

    // Server-wide pin feature
    const { pinLimit } = config;
    if (reaction._emoji.name === config.emotes.pinMessage && reaction.count >= pinLimit) {
      await reaction.message.pin();
    } if (reaction._emoji.name === config.emotes.pinMessage
      && reaction.message.pinned
      && reaction.message < pinLimit) {
      reaction.message.channel.send('Your message was successfully unpinned');
      await reaction.message.unpin();
    }
  }
}

module.exports = pinAction;
