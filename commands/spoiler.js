module.exports.execute = async (client, message, args) => {

	let spoiler = args.join(' ');
	if (spoiler.length === 0){
		return await message.channel.send('Please include text to send as a spoilered message!\n`!spoiler [text to spoiler]`');
	}
	let spoilerText = '||' + spoiler + '||';
	let author = `<@${message.author.id}>`;

	return await message.channel.send(`${author}\n${spoilerText}`);
};

module.exports.config = {
	name: 'spoiler',
	aliases: ['spoiler', 'censor'],
	description: 'Easily have Horace to spoiler your message!',
	usage: ['spoiler [text]','censor [text]'],
};
