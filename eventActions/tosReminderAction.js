const Discord = require('discord.js');
const table = require('../databaseFiles/tosReminderTable');
const { Config } = require('../config.js');

const addToDatabase = async (user, joinTime, reminded = false) => {
	try {
		await table.create({
			user_id: user.id,
			joinTime: joinTime,
			reminded: reminded
		});
	}
	catch (err) {
		console.error('TosReminder error: ', err);
	}
};

const removeFromDatabase = async (user) => {
	try {
		await table.destroy({
			where: {
				user_id: user.id
			}
		});
	}
	catch (err)
	{
		console.error('TosReminder error: ', err);
	}
};

const tosRemind = async (client) => {
	const messageEmbed = new Discord.MessageEmbed()
		.setColor(Config.COLORS.KOA_YELLOW)
		.setTitle('Hey :wave: noticed you joined, but never got access to KOA.')
		.setDescription(`Tap the check mark in <#${Config.CHANNELS.TOS}> to have full access to all KOA channels. Enjoy your newfound powers :relieved:`);

	let unreminded;

	try {
		unreminded = await table.findAll({
			where: {
				reminded: false
			}
		});
	}
	catch (err) {
		console.error('TosReminder error: ', err);
	}

	if (!unreminded) {
		return;
	}

	unreminded.forEach(async (reminder) => {
		const userToRemind = reminder.dataValues.user_id;
		// Checks if the time given in config has passed
		if (new Date() - reminder.dataValues.joinTime >= Config.TOS.REMIND_AFTER_HOURS * 3600000) {
			try {
				const user = await client.users.fetch(userToRemind);
				await user.send(messageEmbed);
			}
			catch (err) {
				console.error('TosReminder error: ', err);
			}

			try {
				await table.update(
					{ reminded: true },
					{ where: { user_id: userToRemind } }
				);
			}
			catch (err) {
				console.log('TosReminder error: ', err);
			}
		}
	});
};

module.exports.addToDatabase = addToDatabase;
module.exports.removeFromDatabase = removeFromDatabase;
module.exports.tosRemind = tosRemind;
