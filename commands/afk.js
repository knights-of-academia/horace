const Afks = require('../databaseFiles/afkTable.js');

module.exports.execute = async (client, message, args) => {
	const afkMessage = args.length > 0 ? args.join(' ') : 'They didn\'t tell us where they went...';

	const findresult = await Afks.findAll({
		where: {
			user: message.author.id,
		},
	});

	if (findresult.length == 0) {
		try {
			await Afks.create({
				message: afkMessage,
				cooldown: Date.now(),
				user: message.author.id
			});

			await message.author.send('I have marked you as AFK. Safe travels!');
		}
		catch (err) {
			console.error('Afk error: ', err);
		}
	} else {
		const result = await Afks.destroy({
			where: {
				user: message.author.id,
			},
		});

		if (result == 1) {
			try {
				await message.channel.send(
					`Welcome back, ${
						message.member.nickname
							? message.member.nickname
							: message.author.username
					}!`
				);
			}
			catch (err) {
				console.error('Afk error: ', err);
			}
		}
	}
};

module.exports.config = {
	name: 'afk',
	aliases: ['afk', 'away'],
	description: 'I will mark you as being away. When people tag you, they will be notified that you are not present.',
	usage: ['afk message']
};
