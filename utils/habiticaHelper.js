const Habiticas = require('../databaseFiles/habiticaTable.js');
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

    // check if str is a valid uuid: hex in the form 8-4-4-4-12
    isUuid: function (str) {
        let uuidReg = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
        return uuidReg.test(str);
        
    },
};


