module.exports.execute = async (client, message, args) => {
	const searchTerm = args.join(' ');
	const query = args.join('+');

	if (searchTerm.length === 0) {
		return await message.channel.send(
			'❌ Please specify a search term.'
		);
	} else {
		return await message.channel.send(
			`Search for ${searchTerm}: https://www.google.com/search?q=${query}`,
		);
	}
};

module.exports.config = {
	name: 'search',
	aliases: ['search'],
	description: 'I will send you link to a Google search based on your query.',
	usage: ['search'],
};
