// Get the afk Table stored in the SQLite database
const Afks = require('../databaseFiles/afkTable.js');


module.exports.execute = async (client, message, args) => {
	const sender = message.author;
	const afkMessage = args.length > 0 ? args.join(' ') : 'They didn\'t tell us where they went...';

	Afks.sync().then(() =>

		Afks.create({
			message: afkMessage,
			cooldown: Date.now(),
			user: sender.id
		}).then(() => {
			sender.send('I have marked you as AFK. Safe travels!').then(msg => msg.delete(5000).catch());
		}).catch(err => {
			if (err.name == 'SequelizeUniqueConstraintError') {
				Afks.destroy({
				    where: {
				      user: sender.id,
				    },
				  }).then((result) => {
				    // User successfully removed from table
				    if (result == 1) {
				      return message.channel
					.send(
					  `Welcome back, ${
					    message.member.nickname
					      ? message.member.nickname
					      : message.author.username
					  }!`
					)
					.then((delmessage) => delmessage.delete({ timeout: 5000 }))
					.catch('Error sending message.');
				    }
				  });
			}
			console.error('Afk sequelize error: ', err);
		}));
};

module.exports.config = {
	name: 'afk',
	aliases: ['afk', 'away'],
	description: 'I will mark you as being away. When people tag you, they will be notified that you are not present.',
	usage: ['afk message']
};
