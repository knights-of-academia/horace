const config = require('../config.json');
const Parser = require('rss-parser');
const parser = new Parser();
const random = require('random');



module.exports.execute = async (client, message, args) => {
	const feed = await parser.parseURL('https://knightsofacademia.org/category/articles/feed');
	const r = random.int(0 , feed.items.length);
	let response = `Here is a article i found called "${(feed.items[r].title)}" here is the link to it ${feed.items[r].link}`;
	if(args[0]){
		if(args[0].toLowerCase()==='home'){
			response = "This is home page of the articles https://kingsofacademacia.org/category/articles";
		}
		else if(args[0].toLowerCase() === 'latest'){
			response = `Here is the latest article i found called "${(feed.items[0].title)}" here is the link to it ${feed.items[0].link}` 
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
