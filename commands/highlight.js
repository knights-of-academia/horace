// Get the Highlights Table stored in the SQLite database
const Highlights = require('../databaseFiles/highlightsTable.js');
const Discord = require('discord.js');
const config = require('../config.json');

// Error handler
const errHandler = err => {
	console.error('Highlights sequelize error: ', err);
};

module.exports.execute = async (client, message, args) => {
	const cmd = args[0]; // The command of what to do with the following phrase
	const entirePhrase = args.join(' ');
	const keywords = entirePhrase.substring(entirePhrase.indexOf(' ')+1).toLowerCase(); // Remove the first word, i.e. the command
	const user = message.author;
	const userID = user.id;
	const highlightsEmote = config.emotes.highlights;

	if(keywords.length === 0){
		const highlightsHelp = new Discord.RichEmbed()
			.setColor('#FFEC09')
			.setTitle(`${highlightsEmote} Knights of Academia Highlight Help ${highlightsEmote}`)
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

			// If highlight is already added, say so
			let exists = true;
			await Highlights.count({
				where: {
					phrase: keywords
				}
			}).then(count => {
				if(count != 0){
					user.send('Attempted to add **`' + keywords + '`** to your highlights, but it\'s already there!');
					return;
				} else {
					exists = false;
				}
			});

			if(!exists) {
			// Add entry to table
				Highlights.create({
					phrase: keywords,
					users: userID
				}).catch(errHandler);

				// Confirm highlight addition
				const highlightsHelp = new Discord.RichEmbed()
					.setColor('#FFEC09')
					.setTitle(`${highlightsEmote} Knights of Academia Highlight Addition ${highlightsEmote}`)
					.setDescription('I have added the following highlight as requested!')
					.addField('Recently added highlight', `${keywords}`);
				// Maybe send them the remaining highlights (if any)?
				return user.send(highlightsHelp);
			}
		}
		else if (cmd === 'remove') {
			// Remove entry
			let cont = true;
			await Highlights.destroy({
				where: {
					phrase: keywords,
					users: userID
				}
			}).then(result =>{
				if(result == 0){
					// TODO: If the highlight doesn't exist, say so.
					user.send('You tried to remove a highlight, `' + keywords + '`, but it doesn\'t seem to exist.');
					cont = false;
				}
			});

			if(!cont){
				return;
			}
			// Confirm highlight addition
			const highlightsHelp = new Discord.RichEmbed()
				.setColor('#FFEC09')
				.setTitle(`${highlightsEmote} Knights of Academia Highlight Removal ${highlightsEmote}`)
				.setDescription('I have removed the following highlight as requested!')
				.addField('Recently removed highlight', `${keywords}`);
			// Maybe send them the remaining highlights (if any)?
			return await user.send(highlightsHelp);
		}
		else if (cmd === 'list') {
			// Fetch all of the keywords where the user is the user
			let listOfWords = new Array();
			await Highlights.findAll({
				where: {
					users: userID
				}
			}).then(result => {
				if(result.length == 0){
					user.send('_You don\'t have any highlights._ Add some with `!highlights add <keywords>`');
					return;
				}
				for(let i = 0; i < result.length; i++){
					listOfWords.push(result[i].phrase);
				}

				const highlightsHelp = new Discord.RichEmbed()
					.setColor('#FFEC09')
					.setTitle(`${highlightsEmote} Knights of Academia Highlight List ${highlightsEmote}`)
					.setDescription('Here are your current highlights!')
					.addField('Highlighted words and phrases', `${listOfWords}`);

				// DM the embedded list to the user
				user.send(highlightsHelp);
			});
		}
		else { // None of the correct commands were used
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
