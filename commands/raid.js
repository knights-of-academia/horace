module.exports.execute = async (client, message) => {
	return await message.channel.send(
		'**RAAAAAAAAAAAAAAAAAAAID⚔** with ' + `<@${message.author.id}>` + '\nhttps://cuckoo.team/koa',
	);
};

module.exports.config = {
	name: 'raid',
	aliases: ['raid' ,'r'],
	description: 'RAAAAAAAAAID!',
	usage: ['raid'],
};
