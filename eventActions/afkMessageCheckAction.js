// Get the afk Table stored in the SQLite database
const Afks = require('../databaseFiles/afkTable.js');
const Discord = require('discord.js');
const config = require('../config.json');

class afkMessageCheckAction {
	static async checkIfUserIsAFK(message) {
		// If the message is a command, we ignore it, to prevent the bot from sending the message right away, when a user goes AFK
		if (message.content.startsWith(config.prefix)) {
			return;
		}
		const sender = message.author;
		const reactionFilter = (reaction, user) => {
			if ((reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id == sender.id) {
				if (reaction.emoji.name === '✅') {
					Afks.destroy({
						where: {
							user: sender.id
						}
					}).then(result => {
						if (result == 1) {
							sender.send('Welcome back, knight!');
							reaction.message.delete().catch(() => console.log('Tried deleting afk message that was already deleted'));
							return;
						}
					});
				} else if (reaction.emoji.name === '❌') {
					reaction.message.delete().catch(() => console.log('Tried deleting afk message that was already deleted'));
					return;
				} else {
					return;
				}
			}
		};
		const noLongerAFKMessage = new Discord.RichEmbed()
			.setTitle(`You are currently AFK, ${message.member.nickname ? message.member.nickname : message.author.username}`)
			.addField('Are you back?', 'Then react with ✅. Otherwise react with ❌ or leave this message.')
			.setColor('#FFEC09');
		const user = message.author;

		await Afks.sync().then(() => {
			Afks.findAll({
				where: {
					user: user.id
				}
			}).then(result => {
				if (result.length == 1) {
					message.channel.send(noLongerAFKMessage).then(msg => {
						msg.react('✅');
						msg.react('❌');
						let collector = msg.createReactionCollector(reactionFilter, { time: 15000 });
						collector.on('end', () => {
							msg.delete().catch(() => console.log('Tried deleting afk message that was already deleted'));
						});
					});
				}
			});
		});
	}

	static async checkForMention(message) {
		// Make sure the message is meant for the one person only. This also means the bot will not trigger on tag spams.
		if (message.mentions.members.size == 1) {
			let id = message.mentions.members.firstKey();
			Afks.sync().then(() => {
				Afks.findAll({
					where: {
						user: id
					}
				}).then(result => {
					if (result.length == 1) {

						message.guild.fetchMember(result[0].user).then(user => {
							let name = user.nickname ? user.nickname : user.user.username;
							const embed = new Discord.RichEmbed()
								.setTitle(`${name} is not here`)
								.setDescription(result[0].message)
								.setColor('#FFEC09');
							message.channel.send(embed).then(msg => msg.delete(5000).catch(() => console.log('Tried deleting afk message that was already deleted')));
						});
					}
				});
			});
		}
	}
}

module.exports = afkMessageCheckAction;