// Get the Highlights Table stored in the SQLite database
const Highlights = require('../databaseFiles/highlightsTable.js');
const Discord = require('discord.js');

// Error handler
const errHandler = err => {
	console.error('Highlights sequelize error: ', err);
};

module.exports.execute = async (client, message, args) => {
	const cmd = args[0]; // The command of what to do with the following phrase
	const entirePhrase = args.join(' ');
	const keywords = entirePhrase.substring(entirePhrase.indexOf(' ')+1); // Remove the first word, i.e. the command
	const user = message.author;
	const userID = user.id;
	const sunEmote = '☀️';

	if(keywords.length === 0){
		const highlightsHelp = new Discord.RichEmbed()
			.setColor('#FFEC09')
			.setTitle(`${sunEmote} Knights of Academia Highlight Help ${sunEmote}`)
			.setDescription('Here are some commands to help you out with highlights!')
			.addField('Add a highlight', '`!highlight add <word/phrase>`')
			.addField('Remove a highlight', '`!highlight remove <word/phrase>`')
			.addField('List your highlights', '`!highlight list`');
		return await user.send(highlightsHelp);
	}
	else if (keywords.length > 1) {
		// Ensure the table exists if not already -- Is there a better place for this?
		Highlights.sync();

		if(cmd === 'add') {
			// Add entry to table
			await Highlights.create({
				phrase: keywords,
				users: userID
			}).catch(errHandler);

			// TODO: If highlight is already added, say so

			// Confirm highlight addition
			const highlightsHelp = new Discord.RichEmbed()
				.setColor('#FFEC09')
				.setTitle(`${sunEmote} Knights of Academia Highlight Addition ${sunEmote}`)
				.setDescription('I have added the following highlight as requested!')
				.addField('Recently added highlight', `${keywords}`);
			// Maybe send them the remaining highlights (if any)?
			return await user.send(highlightsHelp);
		}
		else if (cmd === 'remove') {
			// Remove entry
			await Highlights.destroy({
				where: {
					phrase: keywords,
					users: userID
				}
			}).catch(errHandler);

			// TODO: If the highlight doesn't exist, say so.

			// Confirm highlight addition
			const highlightsHelp = new Discord.RichEmbed()
				.setColor('#FFEC09')
				.setTitle(`${sunEmote} Knights of Academia Highlight Removal ${sunEmote}`)
				.setDescription('I have removed the following highlight as requested!')
				.addField('Recently removed highlight', `${keywords}`);
			// Maybe send them the remaining highlights (if any)?
			return await user.send(highlightsHelp);
		}
		else if (cmd === 'list') {
			// Fetch all of the keywords where the user is the user
			let listOfWords = new Array();
			await Highlights.findAll({
				users: userID
			}).then(result => {
				for(var i = 0; i < result.length; i++){
					listOfWords.push(result[i].phrase);
				}
			});
			const highlightsHelp = new Discord.RichEmbed()
				.setColor('#FFEC09')
				.setTitle(`${sunEmote} Knights of Academia Highlight List ${sunEmote}`)
				.setDescription('Here are your current highlights!')
				.addField('Highlighted words and phrases', `${listOfWords}`);

			// DM the embedded list to the user
			user.send(highlightsHelp);
		}
		else { // None of the correct commands were used
			return await user.send('Please use `!highlight add <word/phrase>` to add a new highlight.');
		}
	}
};

module.exports.config = {
	name: 'highlights',
	aliases: ['highlight', 'highlights'],
	description: 'Highlight a word or phrase you want to keep track of!',
	usage: ['highlight']
};
