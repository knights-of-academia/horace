
module.exports.execute = async (client, message) => {
	const result = Math.floor(Math.random() * 2) === 0 ? 'Heads' : 'Tails';
	return await message.channel.send(result);
};

module.exports.config = {
	name: 'coinflip',
	aliases: ['flipcoin', 'coinflip']
};
