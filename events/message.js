const { Config } = require('../config.js');
const cotwActions = require('../eventActions/cotwActions');
const snapshotActions = require('../eventActions/snapshotActions');
const profanityActions = require('../eventActions/profanityActions');
const accountabilityActions = require('../eventActions/accountabilityActions');
const chainMessageAction = require('../eventActions/checkChainMessage');
const highlightActions = require('../eventActions/highlightActions');
const staffAccountabilityActions = require('../eventActions/staffAcountabilityActions');
const handleReactions = require('../eventActions/reactions');

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

	const handlers = [
		// todo: don't react to commands.
		handleReactions(message),
		profanityActions.checkForProfanity(client, message),
		snapshotActions.userPostsImage(client, message),
		cotwActions.updateCotw(client, message),
		accountabilityActions.addReaction(client, message),
		chainMessageAction.chainMessageCheck(message),
		highlightActions.checkForHighlight(client, message),
		staffAccountabilityActions.checkForMessages(client, message),
	].map((p) => p.catch((e) => console.log(e)));

	await Promise.all(handlers);
};
