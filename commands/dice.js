module.exports.execute = async (client, message, args) => {
	if(!!args || !args[0] ) {
		return await message.channel.send('❌ Please specify the dice size.');
	}

	if(args[0].isNaN()) {
		return await message.channel.send('❌ Please specify a number for the dice size.');
	}
	const diceSize = Number.parseInt(args[0], 10);
	const diceResult = Math.floor(Math.random()*diceSize)+1;

	return await message.channel.send(`⚅ result: ${diceResult}`);
};


module.exports.config = {
	name: 'dice',
	aliases: ['dice'],
};
