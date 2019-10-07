module.exports.execute = async (client, message) => {
	return await message.channel.send(
		`⚔ Here is our list of KOA Clans! ⚔

🔸 **The Round Table**: All things Hard Mode by **Alex**#8758
🔸 **Bards of Academia**: All things music by **Rose**#9845
🔸 **The Fiction Faction**: Creative Writing & Story Telling by **varrictethras**#5383
🔸 **The Wolf Pack**: Data Science & all things STEM by **QueenWolf**#5509
🔸 **The Gathering**: Accountability by **nurse4truth**#0929
🔸 **The Clockwork Knights**: Productivity & Efficiency through the use of Systems by **vonKobra**#0286
🔸 **The Silver Tongues**: Language & Culture by **mi6blk**#5137
🔸 **The Students**: Academics & all things Education by **erschmid**#2994`,
	);
};

module.exports.config = {
	name: 'clans',
	aliases: ['clanlist', 'clans'],
};
