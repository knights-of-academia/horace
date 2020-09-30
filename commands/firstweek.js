module.exports.execute = async (client, message) => {
	return await message.channel.send('Your first week at KOA: https://koa.gg/firstweek');
};

module.exports.config = {
	name: 'firstweek',
	aliases: ['fw'],
	description: 'I will fetch you the link to the First Week at KOA post.',
	usage: ['firstweek']
};
