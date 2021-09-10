const { Config } = require('../config.js');
const promiseErrorHandler = require('../helpers/promiseErrors');
const cotwActions = require('../eventActions/cotwActions');
const snapshotActions = require('../eventActions/snapshotActions');
const profanityActions = require('../eventActions/profanityActions');
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
		handleReactions(client, message, !!command),
		profanityActions.checkForProfanity(client, message),
		snapshotActions.userPostsImage(client, message),
		cotwActions.updateCotw(client, message),
		chainMessageAction.chainMessageCheck(message),
		highlightActions.checkForHighlight(client, message),
		staffAccountabilityActions.checkForMessages(client, message),
	].map((p) => p.catch((err) => promiseErrorHandler(client, err)));

	await Promise.all(handlers);
};
