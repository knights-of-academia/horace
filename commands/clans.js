const clans = require('../data/clan-data');
const Habitica = require('habitica');
const habHelper = require('../utils/habiticaHelper')

const clanResponseCache = require('data-store')({
	path: process.cwd() + '/data/clan-response.json'
});

module.exports.execute = async (client, message, args) => {
	if (args[0] == 'update'){ // update the information using Habitica API
		message.channel.send('in update');
		let response = `⚔ Here is our list of KOA Clans! ⚔\n\n`;
		message.channel.send('response okay');
		await clans.reduce(async (memo, clan) => { // ensure the message is in the order of clan-data
			await memo;
			let api = new Habitica({
				id: clan.authId,
				apiToken: clan.apiToken
			});
			let clanInfo = await api.get(`/groups/party`).then(res => {return res.data;})
				.catch(err => {console.log(`There has been a problem in fetching clan ${clan.fullName}: ${err}`);});
			// find the leader's discord id from database, if not exist then use habitica userName
			let clanLeader = await habHelper.findDiscordUser(clanInfo.leader.id, client);
			let leaderInfo = clanLeader.length==1?`**${clanLeader[0].username}**#${clanLeader[0].discriminator}`:`**@${clanInfo.leader.profile.name}**`
			let memberCount = clanInfo.memberCount;
			message.channel.send('calculation okay');

			response += `🔸 **${clanInfo.name}**: ${clan.description} by ${leaderInfo}\n`
			response += `             Member Count: ${memberCount}/30\n`

		}, undefined);
		message.channel.send(response).catch(err=>console.log(err));
		clanResponseCache.set('content',response);
	}

	return await message.channel.send(clanResponseCache.get('content')).catch(err=>console.log(err));
};

module.exports.config = {
	name: 'clans',
	aliases: ['clanlist', 'clans'],
	description: 'I will list all the clans for you.',
	usage: ['clans']
};
