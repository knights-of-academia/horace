module.exports.execute = async (client, message) => {
	return await message.channel.send(`⚔ Here is our list of KOA Clans! ⚔

	🔸 **The Round Table**: All things Hard Mode by **bendre1997**#9332
	🔸 **The Fiction Faction**: Creative Writing & Story Telling by **varrictethras**#5383
	🔸 **The Gathering**: Accountability by **hikikomori**#3771
	🔸 **The Clockwork Knights**: Productivity & Efficiency through the use of Systems by **stoneybaby**#3398 - *looking for new clan leader!*
	🔸 **The Silver Tongues**: Language & Culture by **MonKhan**#1913
	🔸 **The Students**: Academics & all things Education by **ridgel0rd0**#7176
	🔸 **The Wolf Pack**: On the move for Health by **Sergeant Steadfast**#1832`);
};

module.exports.config = {
	name: 'clans',
	aliases: ['clanlist', 'clans'],
	description: 'I will list all the clans for you.',
	usage: ['clans']
};
