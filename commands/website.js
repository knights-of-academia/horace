module.exports.execute = async (client, message) => {
	return await message.channel.send('⚔️ https://knightsofacademia.org/ ⚔️');
};

module.exports.config = {
	name: 'website',
	aliases: ['website', 'koa']
};
