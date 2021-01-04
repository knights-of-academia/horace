const config = require('../config.json');

class gratitudeActions {
  static async reactToGratitude(client, message) {
    // Check for gratitude message - case insensitive "today i am grateful for"
    const gratitudeReg = new RegExp('today +i +am +grateful +for', 'i');
    if (message.channel.id === config.channels.gratitude) {
      if (gratitudeReg.test(message.content)) {
        return message.react(config.emotes.gratitude);
      }
    }
    return null;
  }
}

module.exports = gratitudeActions;
