const { Config } = require('../config.js');
const Discord = require('discord.js');
const tosReminder = require('../eventActions/tosReminderAction');

class tosActions {
	static userAcceptsTOS(reaction, user, client) {
		if (reaction.message.channel.id === Config.CHANNELS.TOC
            && reaction._emoji.name === Config.EMOTES.ACCEPT_TOC) {
			reaction.message.guild.members.fetch(user.id).then((guildMember) => {
				if (guildMember.roles.cache.has(Config.ROLES.INITIATE)) {
					const initiateRole = reaction.message.guild.roles.cache.find((r) => r.id === Config.ROLES.INITIATE);
					guildMember.roles.remove(initiateRole);
					const memberRole = reaction.message.guild.roles.cache.find((r) => r.id === Config.ROLES.MEMBER);
					guildMember.roles.add(memberRole);
					tosReminder.removeFromDatabase(user);
					// Send welcome message to the Citadel
					client.channels.cache.get(Config.CHANNELS.CITADEL).send(`🎉 **A new member has arrived!** 🎉\nWelcome to Knights of Academia <@${user.id}>!`)
						.then((message) => {
							message.react(Config.EMOTES.WAVE);
						});
				}

				const embed = new Discord.MessageEmbed()
					.setTitle(`**Welcome to KOA! — You’re All Set** ${Config.EMOTES.YES2}`)
					.setDescription(`
						I’m a bot built by the engineering team here at [KOA](<https://knightsofacademia.org>).\
						Whether you’re here to learn, meet new people, or get more done; you’ve come to the right place :)

						\`Quick Suggestions:\`
						${Config.EMOTES.WELCOME_ARROW} <#${Config.CHANNELS.MAP_OF_KOA}> learn about useful features
						${Config.EMOTES.WELCOME_ARROW} <#${Config.CHANNELS.RAID_ROOM}> work alongside others
						${Config.EMOTES.WELCOME_ARROW} <#${Config.CHANNELS.HALL_OF_CONQUESTS}> share your victories
						${Config.EMOTES.WELCOME_ARROW} <#${Config.CHANNELS.CHOOSE_ROLES}> personalize your experience with your very own roles

						${Config.EMOTES.HORACE}  Summon me anytime by typing \`!faq\` in a channel that looks interesting.
					`)
					.setColor(Config.COLORS.KOA_YELLOW);

				return user.send(embed);
			});
		}
	}
}

module.exports = tosActions;
