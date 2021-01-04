/* eslint-disable no-underscore-dangle */
const config = require('../config.json');

class focusedRaiderActions {
  static async giveRole(reaction, user) {
    // Ensure we're in the proper channel and using the proper reaction
    if (reaction.message.channel.id === config.channels.chooseroles
      && reaction._emoji.name === config.emotes.hocReaction) {
      if (reaction.message.id !== config.focusedRaiderMessageId) return;
      // Create the role variable
      const frRole = reaction.message.guild.roles.cache.find((role) => role.id
        === config.roles.focusedraider);

      // Create a GuildMember object from passed in user, and add role
      await reaction.message.guild.members.fetch(user.id).then((guildMember) => {
        guildMember.roles.add(frRole);
      });
    }
  }

  static async removeRole(reaction, user) {
    // Ensure we're in the proper channel and using the proper reaction
    if (reaction.message.channel.id === config.channels.chooseroles
      && reaction._emoji.name === config.emotes.hocReaction) {
      if (reaction.message.id !== config.focusedRaiderMessageId) return;

      // Create the role variable
      const frRole = reaction.message.guild.roles.cache.find((role) => role.id
        === config.roles.focusedraider);

      // Create a GuildMember object from passed in user, adn remove role
      await reaction.message.guild.members.fetch(user.id).then((guildMember) => {
        guildMember.roles.remove(frRole);
      });
    }
  }
}

module.exports = focusedRaiderActions;
