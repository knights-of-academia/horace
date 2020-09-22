//const clans = require('../data/clan-data');
const Habitica = require('habitica');
const habHelper = require('../helper/habiticaHelper');
const clanHelper = require('../helper/clanHelper');
const Clans = require('../databaseFiles/clanTable.js');

module.exports.execute = async (client, message, args) => {
	const clans = await Clans.findAll();
	if (args[0] == 'update'){ // update the information using Habitica API
		await Promise.all(clans.map(async (clan,idx, clansArr) => {
			let api = new Habitica({
				id: clan.authId,
				apiToken: clan.apiToken
			});
			let clanInfo = await api.get(`/groups/party`).then(res => {return res.data;})
				.catch(err => {console.log(`There has been a problem in fetching clan ${clan.fullName}: ${err}`);});
			if (clanInfo){// fetching from API successful: update array and db
				// find the leader's discord id from database, if not exist then use habitica userName
				let clanLeader = await habHelper.findDiscordUser(clanInfo.leader.id, client);
				
				clansArr[idx].leader = clanLeader.length==1?`**${clanLeader[0].username}**#${clanLeader[0].discriminator}`:`**@${clanInfo.leader.profile.name}**`
				clansArr[idx].memberCount = clanInfo.memberCount;

				await clanHelper.updateClanInDB(clansArr[idx].clanId, clansArr[idx].leader, clansArr[idx].memberCount);
			}

		}));
	}

	let response = `⚔ Here is our list of KOA Clans! ⚔\n\n`;
	clans.forEach(clan=>{ // ternary operator in template string account for the possibility that fetching from API is not successful in the first instance
		response += `🔸 **${clan.fullName}**: ${clan.description} by ${clan.leader? clan.leader:'*A mysterious leader*'}\n`
		response += `             Member Count: ${clan.memberCount?clan.memberCount:'??'}/30\n`

	});

	return await message.channel.send(response).catch(err=>console.log(err));
};

module.exports.config = {
	name: 'clans',
	aliases: ['clanlist', 'clans'],
	description: 'I will list all the clans for you.',
	usage: ['clans']
};
