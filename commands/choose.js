module.exports.execute = async (client, message, args) => {
	if (args.length) {
		args = args.join(' ').split(/,+ */);


		const choiceIndex = Math.floor(Math.random() * args.length);
		return await message.channel.send('Horace says... ' + args[choiceIndex] + '!');
	}

	return await message.channel.send('Please specify the options I should choose from!\nHint: !choose option1, option2, ..., optionX');
};

module.exports.config = {
	name: 'choose',
	aliases: ['choose', 'pick']
};
