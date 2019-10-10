module.exports.execute = async (client, message, args) => {
	// Convert everything to string so the args can be parsed more easily
	for (let i = 0; i < args.length - 1; i++) {
		args[i] = args[i].toString();
	}

	args = args.join(' ').split(', ');

	const choiceIndex = Math.floor(Math.random() * args.length);
	return await message.channel.send('Horace says... ' + args[choiceIndex] + '!');
};

module.exports.config = {
	name: 'choose',
	aliases: ['choose', 'pick']
};
