const infoTerms = require('../data/infoTerms');
const Discord = require('discord.js');

module.exports.execute = async (client, message, args) => {
	const searchTerm = args.join('-').toLowerCase();

	if (searchTerm.length === 0) {
		return await message.channel.send(
			'❌ Please specify a search term.'
		);
	}

	let result = infoTerms.find((c) => c.names.includes(searchTerm));

	if (!result) {
		return await message.channel.send(
			`I don't know about ${args.join(' ')} yet, can you teach me?`
		);
	}

	const response = new Discord.RichEmbed()
		.setTitle(result.displayname)
		.setDescription(result.description);

	return await message.channel.send(response);

};

module.exports.config = {
	name: 'info',
	aliases: ['info', 'about'],
	description: 'I will send you information about a term.',
	usage: ['apply searchTerm']
};
