const clans = require('../data/clan-data');
const Habitica = require('habitica');

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
	
	api = new Habitica({
		id: clan.authId,
		apiToken: clan.apiToken
	});
	let memberCount = await api.get(`/groups/party`).then(res => {return res.data.memberCount;})
		.catch(err => {
			console.log(`There has been a problem in fetching clan ${clan.fullName}: ${err}`);
			return -1; // signify api not working
		});

	let response = `✔ **Fill out your user ID to receive an invite!**
*Average Response Time: 24 hours or less*
${clan.formUrl}`;

	if (memberCount == 30) {
		response = `This clan is currently full! Please try again later.`;
	} else if (memberCount > 25) {
		response += '\n 🔶Limited Spot Left!🔶';
	} else if (memberCount == -1) {
		response += `\n 🌫️A wizard's spell hit this party! I cannot tell whether the party is full but you can try your luck...🌫️`;
	}
		return await message.channel.send(response);

};

module.exports.config = {
	name: 'apply',
	aliases: ['apply', 'applyto'],
	description: 'I will send you an application form for the clan you wish to join.',
	usage: ['apply clan']
};
