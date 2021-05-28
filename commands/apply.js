const clans = require('../data/clan-data');

module.exports.execute = async (client, message, args) => {
	const searchTerm = args.join(' ').toLowerCase();

	if (searchTerm.length === 0) {
		return await message.channel.send(
			'❌ Please specify the clan you wish to apply for.'
		);
	}

	let clan = clans.find((c) => c.names.includes(searchTerm));

	if (!clan) {
		return await message.channel.send(
			`❌ The clan \`${searchTerm}\` couldn't be found.`
		);
	}

	const response = `✔ **Fill out your user ID to receive an invite!**
*Average Response Time: 24 hours or less*
${clan.formUrl}`;

	return await message.channel.send(response);
};

module.exports.config = {
	name: 'apply',
	aliases: ['apply', 'applyto'],
	description: 'I will send you an application form for the clan you wish to join.',
	usage: ['apply clan']
};
