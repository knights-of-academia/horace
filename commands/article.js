module.exports.execute = async (client, message) => {
	return await message.channel.send(
		'KOA Articles Page : https://knightsofacademia.org/category/articles/',
	);
};

module.exports.config = {
	name: 'article',
	aliases: ['article'],
	description: 'I will send you the link to our Articles page.',
	usage: ['article']
};
