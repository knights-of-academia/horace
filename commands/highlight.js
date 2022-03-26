const Highlights = require('../databaseFiles/highlightsTable.js');
const Discord = require('discord.js');
const { Config } = require('../config.js');
const discordDMWrapper = require('../helpers/discordDirectMessageWrapper');

const errHandler = (err) => {
	console.error('Highlights sequelize error: ', err);
};

const getHelpReply = () => {
	const highlightsEmote = Config.EMOTES.HIGHLIGHTS;
	const highlightsHelp = new Discord.MessageEmbed()
		.setColor('#FFEC09')
		.setTitle(`${highlightsEmote} Knights of Academia Highlight Help ${highlightsEmote}`)
		.setDescription('Here are some commands to help you out with highlights!')
		.addField('Add a highlight', '`!highlight add <word/phrase>`')
		.addField('Remove a highlight', '`!highlight remove <word/phrase>`')
		.addField('List your highlights', '`!highlight list`');
	return highlightsHelp;
};

const getHiglightAdditionReplyMsg = (keywords) => {
	const highlightsEmote = Config.EMOTES.HIGHLIGHTS;
	const highlightsAddMessage = new Discord.MessageEmbed()
		.setColor('#FFEC09')
		.setTitle(`${highlightsEmote} Knights of Academia Highlight Addition ${highlightsEmote}`)
		.setDescription('I have added the following highlight as requested!')
		.addField('Recently added highlight', `${keywords}`);
	return highlightsAddMessage;
};

const getHiglightRemovalReplyMsg = (keywords) => {
	const highlightsEmote = Config.EMOTES.HIGHLIGHTS;
	const highlightsRemovalMsg = new Discord.MessageEmbed()
		.setColor('#FFEC09')
		.setTitle(`${highlightsEmote} Knights of Academia Highlight Removal ${highlightsEmote}`)
		.setDescription('I have removed the following highlight as requested!')
		.addField('Recently removed highlight', `${keywords}`);
		// Maybe send them the remaining highlights (if any)?
	return highlightsRemovalMsg;
};

const getHighlightsListReplyMsg = (listOfWords) => {
	const highlightsEmote = Config.EMOTES.HIGHLIGHTS;
	const HighlightsListReplyMsg = new Discord.MessageEmbed()
		.setColor('#FFEC09')
		.setTitle(`${highlightsEmote} Knights of Academia Highlight List ${highlightsEmote}`)
		.setDescription('Here are your current highlights!')
		.addField('Highlighted words and phrases', `${listOfWords}`);
	return HighlightsListReplyMsg;
};

const addHighlight = async (keywords, user, channel) => {
	const userID = user.id;
	let exists = true;
	await Highlights.count({
		where: {
			phrase: keywords
		}
	}).then((count) => {
		if (count != 0) {
			discordDMWrapper.sendMessage(user, `Attempted to add '${keywords}' to your highlights, but it's already there!`)
				.catch(() => { discordDMWrapper.sendBlockedDMsWarning(channel, 'that the requested highlight is already in my list.'); });
		} else {
			exists = false;
		}
	});

	if (!exists) {
		Highlights.create({
			phrase: keywords,
			users: userID
		}).catch(errHandler);

		const highlightsHelp = getHiglightAdditionReplyMsg(keywords);
		return discordDMWrapper.sendMessage(user, highlightsHelp)
			.catch(() => { discordDMWrapper.sendBlockedDMsWarning(channel, 'that I have added the requested word to the list of highlights I have for you.'); });
	}
};

const removeHighlight = async (keywords, user, channel) => {
	const userID = user.id;
	let exists = true;
	await Highlights.destroy({
		where: {
			phrase: keywords,
			users: userID
		}
	}).then((result) => {
		if (result == 0) {
			discordDMWrapper.sendMessage(user, `You tried to remove a highlight, '${keywords}', but it doesn't seem to exist.`)
				.catch(() => { discordDMWrapper.sendBlockedDMsWarning(channel, 'that I can\'t find the highlight in my list.'); });
			exists = false;
		}
	});

	if (!exists) {
		return;
	}

	const highlightsRemovalMsg = getHiglightRemovalReplyMsg(keywords);
	return await discordDMWrapper.sendMessage(user, highlightsRemovalMsg)
		.catch(() => { discordDMWrapper.sendBlockedDMsWarning(channel, 'that I have removed the highlight from my list.'); });
};

const listHighlights = async (user, channel) => {
	let listOfWords = new Array();
	await Highlights.findAll({
		where: {
			users: user.id
		}
	}).then((result) => {
		if (result.length == 0) {
			discordDMWrapper.sendMessage(user, '_You don\'t have any highlights._ Add some with `!highlights add <keywords>`')
				.catch(() => { discordDMWrapper.sendBlockedDMsWarning(channel, 'that you do not have any highlights.'); });
			return;
		}
		for (let i = 0; i < result.length; i++) {
			listOfWords.push(result[i].phrase);
		}

		const HighlightsListMsg = getHighlightsListReplyMsg(listOfWords);
		discordDMWrapper.sendMessage(user, HighlightsListMsg)
			.catch(() => { discordDMWrapper.sendBlockedDMsWarning(channel, 'the highlights I have for you in my list.'); });
	});
};

module.exports.execute = async (client, message, args) => {
	const cmd = args[0]; // The command of what to do with the following phrase
	const entirePhrase = args.join(' ');
	const keywords = entirePhrase.substring(entirePhrase.indexOf(' ') + 1).toLowerCase(); // Remove the first word, i.e. the command
	const user = message.author;

	if (keywords.length === 0) {
		const highlightsHelp = getHelpReply();
		return await discordDMWrapper.sendMessage(user, highlightsHelp)
			.catch(() => { discordDMWrapper.sendBlockedDMsWarning(message.channel, 'how highlights work.'); });
	}
	else if (keywords.length > 1) {
		if (cmd === 'add') {
			return await addHighlight(keywords, user, message.channel);
		}
		else if (cmd === 'remove' || cmd === 'delete') {
			return await removeHighlight(keywords, user, message.channel);
		}
		else if (cmd === 'list') {
			return await listHighlights(user, message.channel);
		}
		else {
			return discordDMWrapper.sendMessage(user, 'Please use `!highlight add <word/phrase>` to add a new highlight. (case insensitive)')
				.catch(async () => {
					await message.channel.send('I was not able to send you a message, because your DMs were disabled');
				});
		}
	}
};

module.exports.config = {
	name: 'highlights',
	aliases: ['highlight', 'highlights'],
	description: 'Highlight a word or phrase you want to keep track of!',
	usage: ['highlight']
};
