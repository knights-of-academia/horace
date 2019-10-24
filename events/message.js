const config = require('../config.json');
const cotwActions = require('../eventActions/cotwActions');
const hocActions = require('../eventActions/hocActions');
const snapshotActions = require('../eventActions/snapshotActions');
const sleepclubActions = require('../eventActions/sleepclubActions');
const profanityActions = require('../eventActions/profanityActions');
const greetinAction = require('../eventActions/greetingAction');

module.exports = async (client, message) => {
	if (!message.guild || message.author.bot) return;
	const args = message.content.split(/\s+/g); // Return the message content and split the prefix.
	const command =
    message.content.startsWith(config.prefix) &&
    args.shift().slice(config.prefix.length).toLowerCase();

	if (command) {
		const commandfile =
      client.commands.get(command) ||
      client.commands.get(client.aliases.get(command));

		if (commandfile) commandfile.execute(client, message, args); // Execute found command
	}

	// Check the message for profanity
	profanityActions.checkForProfanity(client, message);
	// Handle greetings
	greetinAction.reactToGreeting(client, message);
	// Handle hall of conquests
	hocActions.reactWithLetsGo(client, message);
	// Handle snapshots
	snapshotActions.userPostsImage(client, message);
	// Handle sleep club case
	sleepclubActions.reactToSleepLog(client, message);
	// Handle COTW case
	cotwActions.reactToVowAndReflections(client, message);
	cotwActions.updateCotw(client, message);
};
