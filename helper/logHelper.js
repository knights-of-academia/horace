module.exports = {

	// returns an array of messages with content that satisfies the checker from author with autherID in channelID
	fetchMessageWith: async function(checker, message, authorID, channelID) {
		//v12: let searchChannel = message.guild.channels.cache.get(channelID);
		let searchChannel = message.guild.channels.get(channelID);
		let fetchOK = true;
		let messageArr =[];
		let messages;
		const options = { limit: 100 };

		do {
			messages = await searchChannel.fetchMessages(options);

			options.before = messages.last().id;
			try {
				filtered = messages.filter(m => m.author.id === authorID && checker(m.content) && !m.deleted);
				messageArr = messageArr.concat(Array.from(filtered.values()));
			} catch (err) {
				fetchOK = false;
				console.log(err);
			}

		} while (messages.size === 100 && fetchOK); // fetch until reaching the beginning of the channel. or have error with fetching
		return messageArr;

	},

	// return an array of array each with length len or smaller

	splitArray: function(map,len) {
		let arrayOfMaps = [];
		for (var i=0; i<map.length; i+=len) {
			arrayOfMaps.push(map.slice(i,i+len));
		}
		return arrayOfMaps;
	},

	// extract user id from the string of mention
	getIDFromMention: function (mention) {
		// The id is the first and only match found by the RegEx.
		const matches = mention.match(/^<@!?(\d+)>$/);
		// If supplied variable was not a mention, matches will be null instead of an array.
		if (!matches) return;
		// The first element in the matches array will be the entire mention, not just the ID, so use index 1.
		return matches[1];
	},

};