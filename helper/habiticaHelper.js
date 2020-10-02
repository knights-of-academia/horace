const Habiticas = require('../databaseFiles/habiticaTable.js');
const Clans = require('../databaseFiles/clanTable.js');

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

	// find someone's habitica ID in database, if not exist, return undefined
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
	clanName: async function(partyID) {
		if (!partyID) {
			return 'Not in any party';
		}
		let clan = await Clans.sync().then(() => {
			return Clans.findOne({
				where: {
					clanId: partyID
				}
			})
		}).catch(err=> console.log(err) );
		
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

};


