const config = require('../config.json');

module.exports.execute = async (client, message) => {
	return await message.channel.send(
		'KOA Articles Page : ' + config.latest_article,
	);
};

module.exports.config = {
	name: 'article',
	aliases: ['article'],
	description: 'I will send you the link to our latest Article page.',
	usage: ['article']
};
