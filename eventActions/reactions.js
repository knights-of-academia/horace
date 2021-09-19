const { Config } = require('../config');
const { promiseErrorHandler } = require('../helpers/promiseErrors');

/**
 * Add a reaction to a message if it fulfills the given conditions.
 * message is the original message object picked up by the message handler.
 * channelId specifies where this reaction should be added.
 * emoteToAdd specifies which emote to add for the reaction.
 * regex is an optional RegEx pattern to test against before reacting.
 */
const react = async function(message, channelId, emoteToAdd, regex = new RegExp())
{
	const conditions = [
		channelId === message.channel.id,
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

// The repeated code in this function will be easier to clean up in TypeScript.
const handleReactions = async function(client, message, isCommand) {
	if (isCommand) return;
	const reactions = [
		react(message, Config.CHANNELS.HALL_OF_CONQUESTS, Config.EMOTES.HOC_REACTION),
		react(message, Config.CHANNELS.CONTENT_NOTIFIER, Config.EMOTES.HEART),
		react(message, Config.CHANNELS.GRATITUDE, Config.EMOTES.GRATITUDE, new RegExp('today +i +am +grateful +for', 'i')),
		react(message, Config.CHANNELS.SLEEP_CLUB, Config.EMOTES.SLEEP_LOG_REACTION, new RegExp('sleep log', 'gi')),
		react(message, Config.CHANNELS.COTW, Config.EMOTES.COTW_VOW, new RegExp('i vow to', 'gi')),
		react(message, Config.CHANNELS.CITADEL, ['🎄', '☃️', '❄️'], new RegExp('merry|christmas', 'gi')),
		react(message, Config.CHANNELS.ACCOUNTABILITY, Config.EMOTES.POM, new RegExp('pom', 'gi')),
		react(message, Config.CHANNELS.ACCOUNTABILITY, '🇫🇷', new RegExp('french', 'gi')),
		react(message, Config.CHANNELS.ACCOUNTABILITY, '🇪🇸', new RegExp('spanish', 'gi')),
		react(message, Config.CHANNELS.ACCOUNTABILITY, '🇮🇹', new RegExp('italian', 'gi')),

		react(
			message,
			Config.CHANNELS.ACCOUNTABILITY,
			Config.EMOTES.ACCOUNTABILITY_EMOTES_ARRAY,
			new RegExp(`${Config.EMOTES.YES2}|:✅:`, 'gi')
		),

		react(
			message,
			Config.CHANNELS.COTW,
			Config.EMOTES.COTW_REFLECTION,
			// Match 0 - n instances of a word followed by space, followed by "reflection".
			// This tests if "reflection" is present in the first n words of the string.
			new RegExp(`^(\\w+\\s+){0,${Config.REFLECTION_CHECK_DEPTH - 1}}(reflection)`, 'i')
		),

		react(
			message,
			Config.CHANNELS.CITADEL,
			Config.EMOTES.GOOD_MORNING,
			Config.STRICT_GREETINGS
				? new RegExp('mo*rning (koa|knights|friends|everyone)\\W*$', 'i')
				: new RegExp('g+o{2,}d+\\s*m+o+r+n+i+n+g+', 'gi')
		),

		react(
			message,
			Config.CHANNELS.CITADEL,
			Config.EMOTES.GOOD_NIGHT,
			Config.STRICT_GREETINGS
				? new RegExp('ni*ght (koa|knights|friends|everyone)\\W*$', 'i')
				: new RegExp('g+o{2,}d+\\s*n+i+g+h+t+', 'gi')
		),
	].map((p) => p.catch((err) => promiseErrorHandler(client, err)));

	await Promise.all(reactions);
};

module.exports = handleReactions;
