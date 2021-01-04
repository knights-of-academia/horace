module.exports.execute = async (client, message) => await message.channel.send(`⚔ Here is our list of KOA Clans! ⚔

	🔸 **The Round Table**: All things Hard Mode by **bendre1997**#9332
	🔸 **Bards of Academia**: All things music by *Position Open!*
	🔸 **The Fiction Faction**: Creative Writing & Story Telling by **varrictethras**#5383
	🔸 **The Gathering**: Accountability by **hikikomori**#3771
	🔸 **The Clockwork Knights**: Productivity & Efficiency through the use of Systems by **stoneybaby**#3398
	🔸 **The Silver Tongues**: Language & Culture by **theamazingsplit**#2229
	🔸 **The Students**: Academics & all things Education by **colin**#3523
	🔸 **The Wolf Pack**: On the move for Health by **QueenWolf**#5509`);

module.exports.config = {
  name: 'clans',
  aliases: ['clanlist', 'clans'],
  description: 'I will list all the clans for you.',
  usage: ['clans'],
};
