const { Config } = require('../config');

const addReaction = async function(
	message,
	emoteToAdd,
	idWhitelist = [],
	regex = new RegExp()
) {
	const conditions = [
		idWhitelist.includes(message.channel.id),
		regex.test(message)
	];

	if (conditions.every(Boolean)) {
		await message.react(emoteToAdd);
	}
};

const handleReactions = async function(client, message) {
	await addReaction(message, Config.EMOTES.HEART, Config.CHANNELS.CONTENT_NOTIFIER);
	await addReaction(message, Config.EMOTES.GRATITUDE, Config.CHANNELS.GRATITUDE, new RegExp('today +i +am +grateful +for', 'i'));
	await addReaction(message, Config.EMOTES.SLEEP_LOG_REACTION, Config.CHANNELS.SLEEP_CLUB, new RegExp('sleep log', 'gi'));
};

module.exports = handleReactions;
