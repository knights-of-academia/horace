const config = require('../config.json');

class gratitudeActions {
  static async reactToGratitude(client, message) {
    // Check for gratitude message - case insensitive "today i am grateful for"
    const reg_gratitude = new RegExp('today +i +am +grateful +for', 'i');
    if (message.channel.id === config.channels.gratitude) {
      if (reg_gratitude.test(message.content)) {
        return await message.react(config.emotes.gratitude);
      }
    }
  }
}

module.exports = gratitudeActions;
