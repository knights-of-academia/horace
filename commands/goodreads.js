module.exports.execute = async (client, message ) => {
	return await message.channel.send('KOA Goodreads page: https://www.goodreads.com/group/show/756579-knights-of-academia');
};

module.exports.config = {
	name: 'goodreads',
	aliases: ['goodreads', 'gr'],
	description: 'I will send you the link to the KOA Goodreads page',
	usage: ['goodreads']
};
