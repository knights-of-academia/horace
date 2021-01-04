/* eslint-disable no-underscore-dangle */
const config = require('../config.json');

class staffaccountability {
  static async checkForMessages(client, message) {
    // React with conquer emote automatically
    if (message.channel.id === config.channels.staffaccountability) {
      message.react(config.emotes.conquer);
      const filterBy = message.author.id;
      const originalChannel = message.channel;
      message.channel.fetchMessages({
        limit: 100,
      }).then((messages) => {
        const userMessages = messages.filter((m) => m.author.id === filterBy).array();
        if (userMessages) {
          message.author.send(`Hey, you have extra messages in ${message.channel}, should I remove them?`)
            .then((newMessage) => {
              newMessage.react(config.emotes.yes2);
              newMessage.react(config.emotes.no);
              // gather user reactions and ignore bot reactions
              newMessage.awaitReactions((reaction, user) => user !== newMessage.author
                && (reaction.emoji.name === config.emotes.yes2
                || reaction.emoji.name === config.emotes.no),
              { max: 1, time: 10000 }).then((collected) => {
                const item = collected.array()[0];
                if (item._emoji.name === config.emotes.yes2) {
                  userMessages.shift();
                  originalChannel.bulkDelete(userMessages);
                  message.reply('Messages should be deleted.');
                } else {
                  message.reply('Gotcha, I won\'t delete your old messages.');
                }
              }).catch(() => {
                message.reply('No reaction after 60 seconds, messages will not be deleted.');
              });
            });
        }
      });
    }
  }
}

module.exports = staffaccountability;
