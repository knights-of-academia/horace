const Parser = require('rss-parser');
const parser = new Parser();

module.exports.execute = async (client, message, args) => {
	const feed = await parser.parseURL('https://knightsofacademia.org/category/articles/feed');
	const r = Math.floor(Math.random() * (feed.items.length));
	let response = `Here's a random article from KOA titled "${(feed.items[r].title)}": ${feed.items[r].link}`;
	if(args[0]) {
		if(args[0].toLowerCase() === 'home') {
			response = 'KOA Article Archive: https://knightsofacademia.org/category/articles';
		}
		else if(args[0].toLowerCase() === 'latest') {
			response = `The latest article from KOA is called "${(feed.items[0].title)}" and can be found here: ${feed.items[0].link}.`;
		}
	}
	return await message.channel.send(response);
};

module.exports.config = {
	name: 'article',
	aliases: ['article'],
	description: 'I will send you the link to our latest Article page.',
	usage: ['article','article home','article latest']
};
