// Get the afk Table stored in the SQLite database
const Afks = require('../databaseFiles/afkTable.js');
const Discord = require('discord.js');
const config = require('../config.json');

class afkMessageCheckAction {
	static async checkIfUserIsAFK(message) {
		if (message.content.startsWith(config.prefix)) {
			return;
		}
		
		const result = await Afks.findAll({
			where: {
				user: message.author.id
			}
		});

		if (result.length == 0) {
			return;
		}

		const timeDiffMinutes = Math.floor(
			(Date.now() - result[0].cooldown) / 1000 / 60
		);

		if (timeDiffMinutes >= 3) {
			const name = message.member.nickname ? message.member.nickname : message.author.username;
			try {
				await message.author.send(new Discord.MessageEmbed()
					.setTitle(`You are currently AFK, ${name}`)
					.addField('Are you back?', `Go to <#${config.channels.citadel}> and run \`!afk\` again to turn off AFK!`, true)
					.addField('If you are not back!', 'Ignore this message.', true)
					.setColor('#FFEC09'));
				await Afks.update(
					{ cooldown: Date.now() },
					{ where: {user: message.author.id} }
				);
			}
			catch(err) {
				console.err(err);
			}
		}
	}

	static async checkForMention(message) {
		// Make sure the message is meant for the one person only. This also means the bot will not trigger on tag spams.
		if (message.mentions.members.size == 1) {
			let id = message.mentions.members.firstKey();

			const result = await Afks.findAll({
				where: {
					user: id
				}
			});

			if (result.length == 1) {
				const mentionedUser = message.guild.members.cache.get(result[0].user);
				let name = mentionedUser.nickname ? mentionedUser.nickname : mentionedUser.user.username;
				const embed = new Discord.MessageEmbed()
					.setTitle(`${name} is not here`)
					.addField('AFK Message:',result[0].message)
					.setColor('#FFEC09');
				try {
					await message.channel.send(embed);
				}
				catch(err) {
					console.err(err);
				}
			}
		}
	}
}

module.exports = afkMessageCheckAction;
