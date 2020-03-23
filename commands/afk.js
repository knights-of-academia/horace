// Get the afk Table stored in the SQLite database
const Afks = require('../databaseFiles/afkTable.js');


module.exports.execute = async (client, message, args) => {
	const sender = message.author;
	const afkMessage = args.length > 0 ? args.join(' ') : 'They didn\'t tell us where they went...';

	Afks.sync().then(() =>

		Afks.create({
			message: afkMessage,
			user: sender.id
		}).then(() => {
			message.channel.send('I have marked you as AFK. Safe travels!').then(msg => msg.delete(5000).catch());
		}).catch(err => {
			if (err.name == 'SequelizeUniqueConstraintError') {
				return;
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