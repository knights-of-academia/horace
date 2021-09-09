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
		await message.react(
			Array.isArray(emoteToAdd)
				? emoteToAdd[Math.floor(Math.random() * emoteToAdd.length)]
				: emoteToAdd
		);
	}
};

const handleReactions = async function(client, message) {
	await addReaction(message, Config.EMOTES.HEART, Config.CHANNELS.CONTENT_NOTIFIER);
	await addReaction(message, Config.EMOTES.GRATITUDE, Config.CHANNELS.GRATITUDE, new RegExp('today +i +am +grateful +for', 'i'));
	await addReaction(message, Config.EMOTES.SLEEP_LOG_REACTION, Config.CHANNELS.SLEEP_CLUB, new RegExp('sleep log', 'gi'));
	await addReaction(message, Config.EMOTES.HOC_REACTION, Config.CHANNELS.HALL_OF_CONQUESTS);
	await addReaction(message, ['🎄', '☃️', '❄️'], Config.CHANNELS.CITADEL, new RegExp('merry|christmas', 'gi'));
};

module.exports = handleReactions;
