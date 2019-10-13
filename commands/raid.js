module.exports.execute = async (client, message) => {
	return await message.channel.send(
		'**RAAAAAAAAAAAAAAAAAAAID!** ⚔\nhttps://cuckoo.team/koa',
	);
};

module.exports.config = {
	name: 'raid',
	aliases: ['raid'],
	description: 'RAAAAAAAAAID!',
	usage: ['raid'],
};
