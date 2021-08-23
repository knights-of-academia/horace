const Highlights = require('../databaseFiles/highlightsTable.js');
const Discord = require('discord.js');
const { Config } = require('../config.js');

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

const addHighlight = async (keywords, user) => {
	const userID = user.id;
	let exists = true;
	await Highlights.count({
		where: {
			phrase: keywords
		}
	}).then((count) => {
		if (count != 0) {
			user.send('Attempted to add **`' + keywords + '`** to your highlights, but it\'s already there!');
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
		return user.send(highlightsHelp);
	}
};

const removeHighlight = async (keywords, user) => {
	const userID = user.id;
	let exists = true;
	await Highlights.destroy({
		where: {
			phrase: keywords,
			users: userID
		}
	}).then((result) => {
		if (result == 0) {
			// TODO: If the highlight doesn't exist, say so.
			user.send('You tried to remove a highlight, `' + keywords + '`, but it doesn\'t seem to exist.');
			exists = false;
		}
	});

	if (!exists) {
		return;
	}

	const highlightsRemovalMsg = getHiglightRemovalReplyMsg(keywords);
	return await user.send(highlightsRemovalMsg);
};

const listHighlights = async (user) => {
	let listOfWords = new Array();
	await Highlights.findAll({
		where: {
			users: user.id
		}
	}).then((result) => {
		if (result.length == 0) {
			user.send('_You don\'t have any highlights._ Add some with `!highlights add <keywords>`');
			return;
		}
		for (let i = 0; i < result.length; i++) {
			listOfWords.push(result[i].phrase);
		}

		const HighlightsListMsg = getHighlightsListReplyMsg(listOfWords);
		user.send(HighlightsListMsg);
	});
};

module.exports.execute = async (client, message, args) => {
	const cmd = args[0]; // The command of what to do with the following phrase
	const entirePhrase = args.join(' ');
	const keywords = entirePhrase.substring(entirePhrase.indexOf(' ') + 1).toLowerCase(); // Remove the first word, i.e. the command
	const user = message.author;

	if (keywords.length === 0) {
		const highlightsHelp = getHelpReply();
		return await user.send(highlightsHelp);
	}
	else if (keywords.length > 1) {
		if (cmd === 'add') {
			return await addHighlight(keywords, user);
		}
		else if (cmd === 'remove' || cmd === 'delete') {
			return await removeHighlight(keywords, user);
		}
		else if (cmd === 'list') {
			return await listHighlights(user);
		}
		else {
			return await user.send('Please use `!highlight add <word/phrase>` to add a new highlight. (case insensitive)');
		}
	}
};

module.exports.config = {
	name: 'highlights',
	aliases: ['highlight', 'highlights'],
	description: 'Highlight a word or phrase you want to keep track of!',
	usage: ['highlight']
};
