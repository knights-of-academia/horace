const { Config } = require('../config');

// TODO: order should be channel, emote - switch these two
const react = async function(
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

const handleReactions = async function(message, isCommand) {
	if (isCommand) return;

	// TODO: run these together. make a convenience function for this promise pattern
	// TODO: avoid repeated code: build an object? some functional programming?
	await react(message, Config.EMOTES.HOC_REACTION, Config.CHANNELS.HALL_OF_CONQUESTS);
	await react(message, Config.EMOTES.HEART, Config.CHANNELS.CONTENT_NOTIFIER);
	await react(message, Config.EMOTES.GRATITUDE, Config.CHANNELS.GRATITUDE, new RegExp('today +i +am +grateful +for', 'i'));
	await react(message, Config.EMOTES.SLEEP_LOG_REACTION, Config.CHANNELS.SLEEP_CLUB, new RegExp('sleep log', 'gi'));
	await react(message, ['🎄', '☃️', '❄️'], Config.CHANNELS.CITADEL, new RegExp('merry|christmas', 'gi'));
	await react(message, Config.EMOTES.COTW_VOW, Config.CHANNELS.COTW, new RegExp('i vow to', 'gi'));
	await react(message, Config.EMOTES.POM, Config.CHANNELS.ACCOUNTABILITY, new RegExp(' pom', 'gi'));

	await react(message, '🇫🇷', Config.CHANNELS.ACCOUNTABILITY, new RegExp('french', 'gi'));
	await react(message, '🇪🇸', Config.CHANNELS.ACCOUNTABILITY, new RegExp('spanish', 'gi'));
	await react(message, '🇮🇹', Config.CHANNELS.ACCOUNTABILITY, new RegExp('italian', 'gi'));

	await react(
		message,
		Config.EMOTES.ACCOUNTABILITY_EMOTES_ARRAY,
		Config.CHANNELS.ACCOUNTABILITY,
		new RegExp(`${Config.EMOTES.YES2}|:✅:`, 'gi')
	);

	await react(
		message,
		Config.EMOTES.COTW_REFLECTION,
		Config.CHANNELS.COTW,
		// Match 0 - n instances of a word followed by space, followed by "reflection".
		// This tests if "reflection" is present in the first n words of the string.
		new RegExp(`^(\\w+\\s+){0,${Config.REFLECTION_CHECK_DEPTH - 1}}(reflection)`, 'i')
	);

	await react(
		message,
		Config.EMOTES.GOOD_MORNING,
		Config.CHANNELS.CITADEL,
		Config.STRICT_GREETINGS
			? new RegExp('mo*rning (koa[^a-z]*|knights[^a-z]*|friends[^a-z]*|everyone[^a-z]*)$')
			: new RegExp('g+o{2,}d+\\s*m+o+r+n+i+n+g+')
	);

	await react(
		message,
		Config.EMOTES.GOOD_NIGHT,
		Config.CHANNELS.CITADEL,
		Config.STRICT_GREETINGS
			? new RegExp('ni*ght (koa[^a-z]*|knights[^a-z]*|friends[^a-z]*|everyone[^a-z]*)$')
			: new RegExp('g+o{2,}d+\\s*n+i+g+h+t+')
	);
};

module.exports = handleReactions;
