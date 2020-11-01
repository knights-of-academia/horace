const infoTerms = require('../data/infoTerms');
const Discord = require('discord.js');

module.exports.execute = async (client, message, args) => {
	const searchTerm = args.join('-').toLowerCase();
		
	if (searchTerm.length === 0) {
		// if no term is provided, show the available search terms
		let theSearchTerms = [];
		const delimiter = ', ';
		infoTerms.forEach(term => {
			theSearchTerms.push(term.names.join(delimiter));
		});

		const infoMessage = '__**List of available search terms:**__\n\n' + theSearchTerms.join(delimiter);

		await message.author.send(infoMessage).catch(err => {
			console.error(err);
		});
		return await message.channel.send('I have sent you a private message with the list of available search terms.').catch(err => {
			console.error(err);
		});
	}

	let result = infoTerms.find((c) => c.names.includes(searchTerm));

	if (!result) {
		return await message.channel.send(
			`I don't know about ${args.join(' ')} yet, can you teach me?`
		);
	}

	const response = new Discord.MessageEmbed()
		.setTitle(result.displayname)
		.setDescription(result.description);

	return await message.channel.send(response);

};

module.exports.config = {
	name: 'info',
	aliases: ['info', 'about'],
	description: 'I will send you information about a term.',
	usage: ['info, about, info searchTerm, about searchTerm']
};
