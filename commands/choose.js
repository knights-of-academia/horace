module.exports.execute = async (client, message, args) => {
	args = args.join(' ').split(', ');

	const choiceIndex = Math.floor(Math.random() * args.length);
	return await message.channel.send('Horace says... ' + args[choiceIndex] + '!');
};

module.exports.config = {
	name: 'choose',
	aliases: ['choose', 'pick']
};
