const Parser = require('rss-parser');
const parser = new Parser();

module.exports.execute = async (client, message, args) => {
	const feed = await parser.parseURL('https://knightsofacademia.org/category/articles/feed');
	const r = Math.floor(Math.random() * (feed.items.length));
	let response = `Here's a random article from KOA titled "${(feed.items[r].title)}": ${feed.items[r].link}`;
	if (args[0]) {
		const arg = args[0].toLowerCase();
		switch (arg) {
		case 'home':
			response = 'KOA Article Archive: https://knightsofacademia.org/category/articles';
			break;
		case 'latest':
			response = `The latest article from KOA is called "${(feed.items[0].title)}" and can be found here: ${feed.items[0].link}.`;
			break;
		default:
			response = `\`${arg}\` is not a valid argument. Use \`!help article\` for more information.`;
			break;
		}
	}
	return await message.channel.send(response);
};

module.exports.config = {
	name: 'article',
	aliases: ['article'],
	description: 'I will send you the link to a random KOA article. You may also request the article homepage or latest article.',
	usage: ['article', 'article home', 'article latest']
};
