const config = require('../config.json');
const cotwActions = require('../eventActions/cotwActions');
const hocActions = require('../eventActions/hocActions');
const snapshotActions = require('../eventActions/snapshotActions');
const sleepClubActions = require('../eventActions/sleepClubActions');
const profanityActions = require('../eventActions/profanityActions');
const citadelActions = require('../eventActions/citadelActions');
const accountabilityActions = require('../eventActions/accountabilityActions');
const chainMessageAction = require('../eventActions/checkChainMessage');
const highlightActions = require('../eventActions/highlightActions');
const afkAction = require('../eventActions/afkMessageCheckAction');
const gratitudeActions = require('../eventActions/gratitudeActions');
const staffAccountabilityActions = require('../eventActions/staffAcountabilityActions');
const contentActions = require('../eventActions/contentActions');

module.exports = async (client, message) => {
	if (!message.guild || message.author.bot) return;
	const args = message.content.split(/\s+/g);
	const command =
		message.content.startsWith(config.prefix) &&
		args.shift().slice(config.prefix.length)
			.toLowerCase();

	if (command) {
		const commandFile =
			client.commands.get(command) ||
			client.commands.get(client.aliases.get(command));

		if (commandFile) {
			commandFile.execute(client, message, args).then(() => {
				message.delete({ timeout: 1500 });
			});
		}
	}

	// Check the message for profanity
	profanityActions.checkForProfanity(client, message);
	// Handle greetings
	citadelActions.greetMorningOrNight(client, message);
	// Handle holiday reactions
	citadelActions.holidayReacts(client, message);
	// Handle hall of conquests
	hocActions.reactWithLetsGo(client, message);
	// Handle snapshots
	snapshotActions.userPostsImage(client, message);
	// Handle sleep club case
	sleepClubActions.reactToSleepLog(client, message);
	// Handle COTW case
	cotwActions.reactToVowAndReflections(client, message);
	cotwActions.updateCotw(client, message);
	// Handle accountability reactions
	accountabilityActions.addReaction(client, message);
	// Handle chain messages
	chainMessageAction.chainMessageCheck(message);
	// Check for highlights
	highlightActions.checkForHighlight(client, message);
	// Check afk status and mentions
	afkAction.checkIfUserIsAFK(message);
	afkAction.checkForMention(message);
	// Handle reacting to gratitude messages
	gratitudeActions.reactToGratitude(client, message);
	// Staff accountability messages
	staffAccountabilityActions.checkForMessages(client, message);
	// WP Content Notifier reactions
	contentActions.reactToPost(client, message);
};
