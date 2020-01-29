// Get the Highlights Table stored in the SQLite database
const Afks = require('../databaseFiles/afkTable.js');
const Discord = require('discord.js');
const config = require('../config.json');

const errHandler = err => {
	console.error('Highlights sequelize error: ', err);
};

module.exports.execute = async (client, message, args) => {
	const afkMessage = args.length > 0 ? args.join(' ') : 'They didn\'t tell us where they went...';
	const user = message.author.id;
    
	await Afks.create({
		message: afkMessage,
		user: user
	}).catch(errHandler);
};

module.exports.config = {
	name: 'afk',
	aliases: ['afk', 'away'],
	description: 'I will mark you as being away. When people tag you, they will be notified that you are not present.',
	usage: ['afk reason']
};