const Habiticas = require('../databaseFiles/habiticaTable.js');
const clans = require('../data/clan-data');
const Participants = require('../databaseFiles/cowtParticipantTable.js');
const config = require('../config.json');

const Habitica = require('habitica');
const api = new Habitica({
	id: config.habitica.id,
	apiToken: config.habitica.token
});

module.exports = {
	// given a habitica ID (a valid uuid), return an array of the corresponding discord user(s). If no user is present, return an empty array
	findDiscordUser: async function(habiticaID, client) {
		return await Habiticas.sync().then(() => {
			return Habiticas.findAll({
				where: {
					habiticaID: habiticaID
				}
			}).then(async results => {
				if (results.length > 0) {
					return await Promise.all(results.map(async result => client.fetchUser(result.user)));
				}else{
					return [];
				}
			});
		});
	},

	// fidn someone's habitica ID in database, if not exist, return undefined
	findHabiticaID: async function(userID) {
		return await Habiticas.sync().then(() => {
			return Habiticas.findAll({
				where: {
					user: userID
				}
			}).then(result => {
				if (result.length == 1) {
					return result[0].habiticaID;
				}
				else {
					return;
				}
			}).catch(err=> console.log(err) );
		}).catch(err=> console.log(err) );

	},

	// return the name of the clan if the input match the id for a clan in clan-data.js
	// if the input is empty/undefined, return 'Not in any party'
	// if partyID is not an ID for any KOA clan, return 'A myserious party'
	clanName: function(partyID) {
		if (!partyID) {
			return 'Not in any party';
		}
		let clan = clans.find(clan=>clan.id==partyID);
		if (clan){
			return clan.fullName;
		} else {
			return 'A mysterious party';
		}
	},

	// check if str is a valid uuid: hex in the form 8-4-4-4-12
	isUuid: function (str) {
		let uuidReg = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
		return uuidReg.test(str);
        
	},

	updateParticipantTable: async function (challengeID) {
		const participants = await api.get(`/challenges/${challengeID}/members`,{includeAllMembers:true}).then(res => {return res.data;} ).catch(err=> console.log(err));
		try {
			Participants.sync().then(()=>{
				participants.forEach(participant=>{
					Participants.findOrCreate({
						where: {
							challengeID: challengeID,
							participantID: participant.id,
						}
					});
				});
			});
		} catch (err) {
			console.log(err);			
		}

	},
};


