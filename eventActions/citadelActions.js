const config = require('../config.json');

class citadelActions {
  static async greetMorningOrNight(message) {
    // Handle good morning and goodnight
    const strictMorningReg = new RegExp(config.strict_morning_regex);
    const strictNightReg = new RegExp(config.strict_night_regex);
    const normalMorningReg = new RegExp(config.normal_morning_regex);
    const normalNightReg = new RegExp(config.normal_night_regex);

    if (message.channel.id === config.channels.citadel) {
      if ((config.forceStrictGreetings && strictMorningReg.test(message.content.toLowerCase()))
        || (!config.forceStrictGreetings && normalMorningReg.test(message.content.toLowerCase()))) {
        return message.react(config.emotes.goodmorning);
      } if ((config.forceStrictGreetings && strictNightReg.test(message.content.toLowerCase()))
        || (!config.forceStrictGreetings && normalNightReg.test(message.content.toLowerCase()))) {
        return message.react(config.emotes.goodnight);
      }
    }

    return false;
  }

  static async holidayReacts(client, message) {
    // Handle merry Christmas
    if (
      message.content.toLowerCase().indexOf('merry') !== -1
            && message.content.toLowerCase().indexOf('christmas') !== -1
    ) {
      const reactions = ['🎄', '☃️', '❄️'];
      const choice = reactions[Math.floor(Math.random() * reactions.length)];
      return message.react(choice);
    }
    return false;
  }
}

module.exports = citadelActions;
