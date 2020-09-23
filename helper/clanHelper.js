const clans = require('../databaseFiles/clanTable.js');
const clansData = require('../data/clan-data-auth.js');

module.exports = {
	initClanTable : function(){// module to add existing clan records from js file to db: this should only be called once!
		clans.sync().then(() => {
			clans.bulkCreate(clansData).catch(err=> console.log('bulkCreate error :'+err) );
		}).then(console.log('initializing clan table successful!')).catch(err=> console.log(err) );
	},

	updateClanInDB: async function(clanId, leaderName, memberCount){
		return clans.sync().then(() => {
			clans.update({ leader: leaderName, memberCount:memberCount }, {
				where: {
					clanId: clanId
				}
			}).catch(err=> console.log('clan update error :'+err) );
		});
	},

};
