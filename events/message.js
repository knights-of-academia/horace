const config = require('../config.json');
const db = require('quick.db');
const Discord = require('discord.js')
const cotwActions = require('../eventActions/cotwActions');
const hocActions = require('../eventActions/hocActions');
const snapshotActions = require('../eventActions/snapshotActions');
const sleepclubActions = require('../eventActions/sleepclubActions');
const profanityActions = require('../eventActions/profanityActions');
const citadelActions = require('../eventActions/citadelActions');
const accountabilityActions = require('../eventActions/accountabilityActions');
const chainMessageAction = require('../eventActions/checkChainMessage');
const highlightActions = require ('../eventActions/highlightActions');
const afkAction = require('../eventActions/afkMessageCheckAction');
const gratitudeActions =  require('../eventActions/gratitudeActions');
module.exports = async (client, message) => {
	if (!message.guild || message.author.bot) return;
	const bannedWords = await db.get(`bannedWords-${message.guild.id}`)
	if(db.get(`bannedWords-${message.guild.id}`) == null) {
		db.set(`bannedWords-${message.guild.id}`, ["pussy"])
	}
	const args = message.content.split(/\s+/g); // Return the message content and split the prefix.
	const command =
		message.content.startsWith(config.prefix) &&
		args.shift().slice(config.prefix.length).toLowerCase();

	if (command) {
		const commandfile =
			client.commands.get(command) ||
			client.commands.get(client.aliases.get(command));
		if (commandfile) {
			commandfile.execute(client, message, args).then(() => {
				message.delete(1500);
			}); // Execute found command
		}
		if(!commandfile) {
			if(bannedWords.some(word => message.content.includes(word))) {
			 const embedMessage = new Discord.RichEmbed()
					.setColor('#ff0000')
					.setTitle('🚩 Warning: Profanity detected 🚩')
					.setDescription(`Profanity detected in ${message.channel}`)
					.addField('User', message.author, true)
					.addField('Link', `[Go to message](${message.url})`, true)
					.setFooter(message.author.username + '#' + message.author.discriminator, message.author.avatarURL);
					return client.channels.get(config.channels.moderation).send(embedMessage);
		}
	}
	}
	if(!command) {
		if(bannedWords.some(word => message.content.includes(word))) {
		 const embedMessage = new Discord.RichEmbed()
				.setColor('#ff0000')
				.setTitle('🚩 Warning: Profanity detected 🚩')
				.setDescription(`Profanity detected in ${message.channel}`)
				.addField('User', message.author, true)
				.addField('Link', `[Go to message](${message.url})`, true)
				.setFooter(message.author.username + '#' + message.author.discriminator, message.author.avatarURL);
				return client.channels.get(config.channels.moderation).send(embedMessage);
		}
	}
	// Check the message for profanity
	profanityActions.checkForProfanity(client, message);
	// Handle greetings
	citadelActions.greetMorningOrNight(client, message);
	// Handle hall of conquests
	hocActions.reactWithLetsGo(client, message);
	// Handle snapshots
	snapshotActions.userPostsImage(client, message);
	// Handle sleep club case
	sleepclubActions.reactToSleepLog(client, message);
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


};
