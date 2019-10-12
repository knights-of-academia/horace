module.exports.execute = async (client, message, args) => {
	if(!args || !args.length === 0 ) {
		return await message.channel.send('❌ Please specify the dice size.');
	}

	if(isNaN(args[0])) {
		return await message.channel.send('❌ Please specify a number for the dice size.');
	}
	const diceSize = Number.parseInt(args[0], 10);
	const diceResult = Math.floor(Math.random()*diceSize)+1;

	return await message.channel.send(`⚅ result: ${diceResult}`);
};


module.exports.config = {
	name: 'dice',
	aliases: ['dice'],
	description: 'Roll the dice for a random number.',
	usage: [`dice <sides>`]
};
