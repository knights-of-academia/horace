module.exports.execute = async (client, message) => {
	// Link enclosed in angle brackets to stop Discord from automatically embedding the link
	return await message.channel.send('Your first week at KOA: <https://knightsofacademia.org/your-first-week-at-koa>');
};

module.exports.config = {
	name: 'firstweek',
	aliases: ['fw'],
	description: 'I will fetch you the link to the First Week at KOA post.',
	usage: ['firstweek']
};
