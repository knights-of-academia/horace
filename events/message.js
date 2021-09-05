const { Config } = require('../config.js');
const cotwActions = require('../eventActions/cotwActions');
const hocActions = require('../eventActions/hocActions');
const snapshotActions = require('../eventActions/snapshotActions');
const sleepClubActions = require('../eventActions/sleepClubActions');
const profanityActions = require('../eventActions/profanityActions');
const citadelActions = require('../eventActions/citadelActions');
const accountabilityActions = require('../eventActions/accountabilityActions');
const chainMessageAction = require('../eventActions/checkChainMessage');
const highlightActions = require('../eventActions/highlightActions');
const gratitudeActions = require('../eventActions/gratitudeActions');
const staffAccountabilityActions = require('../eventActions/staffAcountabilityActions');
const contentActions = require('../eventActions/contentActions');

module.exports = async (client, message) => {
	if (!message.guild || message.author.bot) return;
	const args = message.content.split(/\s+/g);
	let command = '';
	if (message.content.startsWith(Config.BOT.PREFIX)) {
		command = args
			.shift()
			.slice(Config.BOT.PREFIX.length)
			.toLowerCase();
	}

	if (command) {
		const commandFile =
			client.commands.get(command) ||
			client.commands.get(client.aliases.get(command));

		if (commandFile) {
			await commandFile.execute(client, message, args);
		}
	}

	// TODO: how to get these to run independently?
	try {
		await Promise.all([
			profanityActions.checkForProfanity(client, message),
			citadelActions.greetMorningOrNight(client, message),
			citadelActions.holidayReacts(client, message),
			hocActions.reactWithLetsGo(client, message),
			snapshotActions.userPostsImage(client, message),
			sleepClubActions.reactToSleepLog(client, message),
			cotwActions.reactToVowAndReflections(client, message),
			cotwActions.updateCotw(client, message),
			accountabilityActions.addReaction(client, message),
			chainMessageAction.chainMessageCheck(message),
			highlightActions.checkForHighlight(client, message),
			gratitudeActions.reactToGratitude(client, message),
			staffAccountabilityActions.checkForMessages(client, message),
			contentActions.reactToPost(client, message)
		]);
	}
	catch (error) {
		console.log(error);
	}
};
