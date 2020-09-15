const Habiticas = require('../databaseFiles/habiticaTable.js');
const clans = require('../data/clan-data');
module.exports = {
    // given habitica ID (a valid uuid), return an array of the corresponding discord user(s). If no user is present, return an empty array
    findDiscordUser: async function(client, searchID) {
        return await Habiticas.sync().then(() => {
            return Habiticas.findAll({
                where: {
                    habiticaID: searchID
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
            });
        });

    },
    // return the name of the clan if the input is the id for a clan in clan-data.js, if not return an empty string
    clanName: function(partyID) {
        let clan = clans.find(clan=>clan.id==partyID);
        if (clan){
            return clan.fullName;
        }else{
            return 'A mysterious party';
        }
    },

    // check if str is a valid uuid: hex in the form 8-4-4-4-12
    isUuid: function (str) {
        let uuidReg = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
        return uuidReg.test(str);
        
    },
};


