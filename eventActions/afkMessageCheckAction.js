/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// Get the afk Table stored in the SQLite database
const Discord = require('discord.js');
const { Consola } = require('consola');

const Afks = require('../databaseFiles/afkTable.js');
const config = require('../config.json');

class afkMessageCheckAction {
  static async checkIfUserIsAFK(message) {
    /* If the message is a command, we ignore it,
       to prevent the bot from sending the message right away, when a user goes AFK
    */
    if (message.content.startsWith(config.prefix)) {
      return;
    }
    const sender = message.author;
    const reactionFilter = (reaction, user) => {
      if ((reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === sender.id) {
        if (reaction.emoji.name === '✅') {
          Afks.destroy({
            where: {
              user: sender.id,
            },
          }).then((result) => {
            // User successfully removed from table
            if (result === 1) {
              sender.send('Welcome back, knight!').then((welcomeMessage) => welcomeMessage.delete(5000));
              reaction.message.delete().catch(() => Consola.log('Tried deleting afk message that was already deleted'));
            }
          });
        } else if (reaction.emoji.name === '❌') {
          reaction.message.delete().catch(() => Consola.log('Tried deleting afk message that was already deleted'));
        }
      }
    };
    const noLongerAFKMessage = new Discord.MessageEmbed()
      .setTitle(`You are currently AFK, ${message.member.nickname ? message.member.nickname : message.author.username}`)
      .addField('Are you back?', 'Go to <#415261994887938048> and run `!afk` again to turn off AFK!', true)
      .addField('If you are not back!', 'Ignore this message. It will be deleted after 15 seconds.', true)
      .setColor('#FFEC09');
    const user = message.author;

    // Returns a single integer rounded down for the difference in minutes
    // between two Date.now() timestamps
    function timedifference(timestamp1, timestamp2) {
      // redefine the variables to do math on
      // TODO: this might break...
      const timestampOriginal = new Date(parseInt(timestamp1, 10));
      const timestampNow = new Date(parseInt(timestamp2, 10));

      let difference = timestampNow.getTime() - timestampOriginal.getTime();

      difference = Math.floor(difference / 1000 / 60);

      return difference;
    }

    await Afks.sync().then(() => {
      Afks.findAll({
        where: {
          user: user.id,
        },
      }).then((result) => {
        // Test to see if the difference between the cooldown and the current time is more than or
        // equal to 3 minutes call function with variables timestamp1 and timestamp2 in call
        if (result.length === 1 && timedifference(result[0].cooldown, Date.now()) >= 3) {
          message.author.send(noLongerAFKMessage).then((msg) => {
            Afks.update(
              { cooldown: Date.now() },
              { where: { user: user.id } },
            ).catch((error) => {
              Consola.error('Update error: ', error);
            });
            collector.on('end', () => {
              msg.delete().catch(() => Consola.log('Tried deleting afk message that was already deleted'));
            });
          });
        }
      });
    });
  }

  static async checkForMention(message) {
    // Make sure the message is meant for the one person only.
    // This also means the bot will not trigger on tag spams.
    if (message.mentions.members.size === 1) {
      const id = message.mentions.members.firstKey();
      Afks.sync().then(() => {
        Afks.findAll({
          where: {
            user: id,
          },
        }).then((result) => {
          if (result.length === 1) {
            message.guild.fetchMember(result[0].user).then((user) => {
              const name = user.nickname ? user.nickname : user.user.username;
              const embed = new Discord.MessageEmbed()
                .setTitle(`${name} is not here`)
                .addField('AFK Message:', result[0].message)
                .setColor('#FFEC09');
              message.channel.send(embed).then((msg) => msg.delete(5000).catch(() => Consola.log('Tried deleting afk message that was already deleted')));
            });
          }
        });
      });
    }
  }
}

module.exports = afkMessageCheckAction;
