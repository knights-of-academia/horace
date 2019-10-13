const Parser = require('rss-parser');
const parser = new Parser();

module.exports.execute = async (client, message) => {
	const feed = await parser.parseURL('https://knightsofacademia.org/category/announcements/feed');

	return await message.channel.send(
		`The newest newsletter from ${(feed.items[0].isoDate).split('T')[0]} can be found here: ${feed.items[0].link}.`
	);
};

module.exports.config = {
	name: 'newsletter',
	aliases: ['newsletter', 'news'],
	description: 'Want to read our newsletter? This is the command for that.',
	usage: ['newsletter'],
};
