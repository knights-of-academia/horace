const clans = require('../data/clan-data');
const positions = require('../data/staffteam-data');

module.exports.execute = async (client, message, args) => {
	const searchTerm = args.join(' ').toLowerCase();

	if (searchTerm.length === 0) {
		return await message.channel.send(
			'❌ Please specify the clan or staff position you wish to apply for.'
		);
	}

	let clan = clans.find((c) => c.names.includes(searchTerm));
	let position = positions.find((p) => p.names.includes(searchTerm));
    if (!position && !clan) {
	return await message.channel.send(
			`❌ The clan or staff position \`${searchTerm}\` couldn't be found.
			
			Here is our list of KOA Clans!
				🔸 **The Round Table**: All things Hard Mode
				🔸 **The Fiction Faction**: Creative Writing & Story Telling 
				🔸 **The Gathering**: Accountability 
				🔸 **The Clockwork Knights**: Productivity & Efficiency through the use of Systems
				🔸 **The Silver Tongues**: Language & Culture
				🔸 **The Students**: Academics & all things Education
				🔸 **The Wolf Pack**: On the move for Health
				
			Here is our list of KOA Staff Positions!
				🔸 **Clan Leaders** 
				🔸 **Sector Leaders** 
				🔸 **Web Producers**
				🔸 **Engineers**
				🔸 **Content Crafters**
				🔸 **KOAI Keepers**`
				
		);
	}

	let response = null;
	if (clan) {
		response = `✔ **Fill out your user ID to receive an invite!**
*Average Response Time: 24 hours or less*
${clan.formUrl}`;
    } else if (position) {
		response = `✔ **Fill out your user ID to receive an invite!**
*Average Response Time: 24 hours or less*
${position.formUrl}`;
		}
	

	return await message.channel.send(response);
};

module.exports.config = {
	name: 'apply',
	aliases: ['apply', 'applyto'],
	description: 'I will send you an application form for the clan or staff position you wish to join.',
	usage: ['apply clan', 'apply position']
};
