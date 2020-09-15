module.exports = {

// returns a collection of messages with content that satisfies the checker from author in channelID

    fetchMessageWith: async function(checker, message, authorID, channelID) {
        //v12: let searchChannel = message.guild.channels.cache.get(channelID);
        let searchChannel = message.guild.channels.get(channelID);
        // function to check if a string contains any of the searchTerms

        let fetchOK = true;
        let messageArr =[];
        do {
            messages = await searchChannel.fetchMessages({ limit: 100 });
            try {
                filtered = messages.filter(m => m.author.id === authorID && checker(m.content) && !m.deleted);
                messageArr = messageArr.concat(Array.from(filtered.values()));
            } catch (err) {
                fetchOK = false;
            }

        } while (messages.size === 100 && fetchOK); // fetch until reaching the beginning of the channel. or have error with fetching
        return messageArr;

    },

    // return an array of array each with length len

    splitArray: function(map,len) {
        let arrayOfMaps = [];
        for (var i=0; i<map.length; i+=len) {
            arrayOfMaps.push(map.slice(i,i+len));
        }
        return arrayOfMaps;
    },
}