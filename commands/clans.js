// TODO: move the information to a db
const clans = require('../data/clan-data');
const Discord = require('discord.js');
const Habitica = require('habitica');

const config = require('../config.json');
let api;

module.exports.execute = async (client, message) => {
	let response = `⚔ Here is our list of KOA Clans! ⚔\n\n` // Header pf response message
	await Promise.all(clans.map(async clan => {
	//await clans.reduce(async (memo, clan) => { // ensure they return in the order of clan-data
		//await memo;
		api = new Habitica({
			id: clan.id,
			apiToken: clan.apiToken
		});
		clanInfo = await api.get(`/groups/party`).then(res => {return res.data;})
			.catch(err => {console.log(`There has been a problem in fetching clan ${clan.fullName}: ${err}`);});
		// TODO: read in leader's discord id using database, if not exist then use habitica userName
		clanLeader = clanInfo.leader.profile.name;//id;
		clanLeaderDescriptor = '0000';
		memberCount = clanInfo.memberCount;
		response += `🔸 **${clanInfo.name}**: ${clan.description} by **${clanLeader}**#${clanLeaderDescriptor}\n`
		response += `        Current members: ${memberCount}/30\n`
	}));
	//}, undefined);
	return await message.channel.send(response);
};

module.exports.config = {
	name: 'clans',
	aliases: ['clanlist', 'clans'],
	description: 'I will (dynamically) list all the clans for you.',
	usage: ['clans']
};
