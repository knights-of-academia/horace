// TODO: move the information to a db
const clans = require('../data/clan-data');
const Discord = require('discord.js');
const Habitica = require('habitica');
//const Habiticas = require('../databaseFiles/habiticaTable.js');
const habHelper = require('../utils/habiticaHelper')
const config = require('../config.json');
let api;

module.exports.execute = async (client, message) => {
	let response = `⚔ Here is our list of KOA Clans! ⚔\n\n` // Header pf response message
	//await Promise.all(clans.map(async clan => {
	await clans.reduce(async (memo, clan) => { // ensure they return in the order of clan-data
		await memo;
		let api = new Habitica({
			id: clan.authId,
			apiToken: clan.apiToken
		});
		let clanInfo = await api.get(`/groups/party`).then(res => {return res.data;})
			.catch(err => {console.log(`There has been a problem in fetching clan ${clan.fullName}: ${err}`);});
		// find the leader's discord id using database, if not exist then use habitica userName
		let clanLeader = await habHelper.findDiscordUser(client, clanInfo.leader.id);// TODO: deal with the case that there are two user having same habitica ID
		let leaderInfo = clanLeader.length==1?`**${clanLeader[0].username}**#${clanLeader[0].discriminator}`:`**@${clanInfo.leader.profile.name}**`
		let memberCount = clanInfo.memberCount;
		response += `🔸 **${clanInfo.name}**: ${clan.description} by ${leaderInfo}\n`
		response += `             Current members: ${memberCount}/30\n`
		console.log(clan.fullName+': ' +clanInfo.id)
	//}));
	}, undefined);
	return await message.channel.send(response);
};

module.exports.config = {
	name: 'clans',
	aliases: ['clanlist', 'clans'],
	description: 'I will (dynamically) list all the clans for you.',
	usage: ['clans']
};
