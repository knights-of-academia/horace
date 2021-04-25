const config = require('../config.json');
const Discord = require('discord.js');

class tosActions {
	static userAcceptsTOS(reaction, user, client) {
		if (reaction.message.channel.id === config.channels.tos
            && reaction._emoji.name === config.emotes.acceptTOS) {
			reaction.message.guild.members.fetch(user.id).then(guildMember => {
				if (guildMember.roles.cache.has(config.roles.initiate)) {
					const initiateRole = reaction.message.guild.roles.cache.find(r => r.id === config.roles.initiate);
					guildMember.roles.remove(initiateRole);
					const memberRole = reaction.message.guild.roles.cache.find(r => r.id === config.roles.member);
					guildMember.roles.add(memberRole);
					// Send welcome message to the Citadel
					client.channels.cache.get(config.channels.citadel).send(`🎉 **A new member has arrived!** 🎉\nWelcome to Knights of Academia <@${user.id}>!`)
						.then(message => {
							message.react(config.emotes.wave);
						});
				}

				const embed = new Discord.MessageEmbed()
					.setTitle(`**Welcome to KOA! — You’re All Set** ${config.emotes.yes2}`)
					.setDescription(`
						I’m a bot built by the engineering team here at [KOA](<https://knightsofacademia.org>).\
						Whether you’re here to learn, meet new people, or get more done; you’ve come to the right place :)

						\`Quick Suggestions:\`
						${config.emotes.welcomearrow} <#${config.channels.mapofkoa}> learn about useful features
						${config.emotes.welcomearrow} <#${config.channels.raidroom}> work alongside others
						${config.emotes.welcomearrow} <#${config.channels.hallofconquests}> share your victories
						${config.emotes.welcomearrow} <#${config.channels.chooseroles}> personalize your experience with your very own roles

						${config.emotes.horace}  Summon me anytime by typing \`!faq\` in a channel that looks interesting.
					`)
					.setColor(config.colors.koaYellow)

				return user.send(embed);
			});
		}
	}
}

module.exports = tosActions;
