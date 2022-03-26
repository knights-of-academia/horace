const Highlights = require('../databaseFiles/highlightsTable.js');
const Discord = require('discord.js');
const { Config } = require('../config.js');
const discordDMWrapper = require('../helpers/discordDirectMessageWrapper');

class highlightActions {
	// Method to call to check a message for a highlighted message
	static async checkForHighlight(client, message) {
		// Ensure commands aren't caught
		if (message.content.substring(0, Config.BOT.PREFIX.length) === Config.BOT.PREFIX) return;

		// Ensure people can't "spy" on channels
		if (Config.CHANNELS.FORBIDDEN_HIGHLIGHT_CHANNELS.includes(message.channel.id)) return;

		let idsToDelete = new Set();
		const results = await Highlights.findAll({
			attributes: ['phrase', 'users']
		});

		// Fetch all of the users first to ensure they are in the cache
		const allUsers = [...new Set(results.map((model) => model.users))];
		await Promise.all(
			allUsers.map((id) =>
				client.users.fetch(id).catch((e) => console.log(e))
			)
		);

		for (let { phrase: currentPhrase, users: currentId } of results) {
			// Verify that user is still in the server
			const user = client.users.cache.get(currentId);
			if (!user) {
				idsToDelete.add(currentId);
				continue;
			}

			let contains = false;

			// Check if the message and the phrase are the same
			if (message.content.toLowerCase() == currentPhrase.toLowerCase()) {
				contains = true;
			}
			// Check if the message contains the phrase, allowing for start and end of messages
			else if (message.content.toLowerCase().includes(' ' + currentPhrase + ' ')) {
				contains = true;
			}
			else if (message.content.toLowerCase().includes(currentPhrase + ' ') || message.content.toLowerCase().includes(' ' + currentPhrase)) {
				// Ensure the message isn't part of another phrase
				const indexOfPhraseStart = message.content.indexOf(currentPhrase);
				const indexOfPhraseEnd = indexOfPhraseStart + currentPhrase.length - 1;
				// Go ahead and check if it is a part of a word at all or has surrounding punctuation
				const punctuation = [' ', '.', ',', '?', '!', ':', ';', ''];
				// If it's at the start, check for containment within a word (i.e. may in mayflower)
				if (indexOfPhraseStart == 0) {
					if (message.content.charAt(indexOfPhraseEnd + 1) == ' ') {
						contains = true;
					}
				}
				// If it's at the end, check for containment within a word
				else if (indexOfPhraseEnd == message.content.length - 1) {
					if (message.content.charAt(indexOfPhraseStart - 1) == ' ') {
						contains = true;
					}
				}

				// Check if within word with space before (-1 because we already checked for the beginning of a message)
				else if (message.content.charAt(indexOfPhraseStart - 1) == ' ') {
					// Separated from below check because of potential following punctuation
					if (punctuation.includes(message.content.charAt(indexOfPhraseEnd + 1))) {
						contains = true;
					}
				}

				// Check if within word with space after, including a check for punctuation (which is why it's separate from above)
				else if (message.content.charAt(indexOfPhraseEnd + 1) == ' ') {
					if (message.content.charAt(indexOfPhraseStart - 1) == ' ') {
						contains = true;
					}
				}

				// Check for basic punctuation
				else if (punctuation.includes(message.content.charAt(indexOfPhraseEnd + 1))) {
					contains = true;
				}
			}
			if (contains) {
				this.sendHighlightDM(client, user, message, currentPhrase);
			}
		}

		// Delete ids that could not be found, they are no longer in the server
		if (idsToDelete.size) {
			await Highlights.destroy({
				where: {
					users: [...idsToDelete]
				},
			});
		}
	}

	// Method to call that DMs a user about a message containing a highlighted phrase
	static async sendHighlightDM(client, user, message, highlightedPhrase) {
		const highlightsEmote = '☀️';
		if (message.author != user) {
			const highlightNotification = new Discord.MessageEmbed()
				.setColor('#FFEC09')
				.setTitle(`${highlightsEmote} Knights of Academia Highlight Alert ${highlightsEmote}`)
				.setDescription('One of your highlights has been triggered!')
				.addField('Highlighted Phrase', highlightedPhrase)
				.addField('Full Message', message)
				.addField('From', message.author, true)
				.addField('Link to Message', `[Jump to Message](${message.url})`, true)
				.addField('Channel', message.channel);

			await discordDMWrapper.sendMessage(user, highlightNotification)
				.catch(() => {
					// logging a message to console as this is a fire-and-forget reminder, not a reply to a command
					console.log(`A reminder was meant for ${user.username}, but their DMs were disabled`);
				});
		}
	}
}

module.exports = highlightActions;
