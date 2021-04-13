module.exports.execute = async (client, message, args) => {

	let spoilerText = '||' + args.join(' ') + '||';
	let author = '**' + message.author.username + '**';

	return await message.channel.send(`${author}\n${spoilerText}`);
};

module.exports.config = {
	name: 'spoiler',
	aliases: ['spoiler', 'censor'],
	description: 'Easily have Horace to spoiler your message!',
	usage: ['spoiler [text]','censor [text]'],
};
