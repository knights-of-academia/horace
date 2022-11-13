const Discord = require('discord.js');
const { Config } = require('../config.js');
const InfoTerms = require('../databaseFiles/infoTermsTable.js');
const SearchWords = require('../databaseFiles/searchWordsTable.js');

const sendSearchTerms = async (client, message) => {
	const delimiter = ',';
	let theInfoTerms = new Array();
	await InfoTerms.findAll({
		attributes: ['term'],
		raw: true
	}).then((result) => {
		for (let i = 0; i < result.length; i++) {
			theInfoTerms.push(result[i].term);
		}
	});

	if (theInfoTerms.length === 0) {
		return await message.channel.send('No search terms available').catch((err) => {
			client.channel.get(Config.CHANNELS.ERRORS).send(err);
		});
	}
	else if (theInfoTerms.length > 0) {
		const infoMessage = '__**List of available search terms:**__\n\n' + theInfoTerms.join(delimiter);

		await message.author.send(infoMessage).catch((err) => {
			client.channel.get(Config.CHANNELS.ERRORS).send(err);
		});

		return await message.channel.send('I have sent you a private message with the list of available search terms.').catch((err) => {
			client.channel.get(Config.CHANNELS.ERRORS).send(err);
		});
	}
};

module.exports.execute = async (client, message, args) => {
	const errHandler = (err) => {
		client.channel.get(Config.CHANNELS.ERRORS).send(err);
	};
	const cmd = args[0];
	const term = args[1];
	const entirePhrase = args.join(' ');
	const keywords = entirePhrase.substring(entirePhrase.indexOf(' ') + 1);
	const desc = keywords.substring(keywords.indexOf('-') + 1);
	const user = message.author;

	if (keywords.length === 0) {
		// if no term or command is provided, show available search terms
		return await sendSearchTerms(client, message);
	}
	else if (keywords.length > 1) {
		if (cmd === 'add') { //Add a new term
			// TODO: reafctor into addSearchTerm
			if (message.channel.id === Config.CHANNELS.COMMAND_CENTER
				&& (message.member.roles.has(Config.ROLES.GUARDIAN) || message.member.roles.has(Config.ROLES.HELPER))) {
				const searchTerms = args[2].split(',');

				let result = await InfoTerms.findAll({
					attributes: ['term', 'description'],
					where: {
						term: term
					},
					raw: true
				}).catch(errHandler);

				console.log(result);

				if (result.length > 0) {
					return await message.channel.send(`${term} already exists. Did you mean to type !info edit?`);
				}

				//Add entry to InfoTerm Table
				await InfoTerms.create({
					term: term,
					description: desc
				}).catch(errHandler);

				//Add keywords to SearchWords Table
				let databaseCalls = [];
				for (const keyword of searchTerms) {
					databaseCalls.push(
						SearchWords.create({
							term: term,
							keyword: keyword
						})
					);
				}

				await Promise.all(databaseCalls).catch(errHandler);

				//Confirm Info Addition
				return await message.channel.send(`New term, ${term}, added!`);
			}
			else {
				//Inform if user doesn't have authority to edit info
				if (!message.member.roles.has(Config.ROLES.GUARDIAN) || !message.member.roles.has(Config.ROLES.HELPER)) {
					message.channel.send('You do not have the experience to complete this command');
				}
			}
		}
		else if (cmd === 'remove') {
			// TODO: reafctor into removeSearchTerm
			if (message.channel.id === Config.CHANNELS.COMMAND_CENTER
					&& (message.member.roles.has(Config.ROLES.GUARDIAN) || message.member.roles.has(Config.ROLES.HELPER))) {
				//Remove entries
				let cont = true;
				await InfoTerms.destroy({
					where: {
						term: term
					}
				}).then((result) => {
					if (result == 0) {
						user.send('You tried to remove info `' + term + '`, but it doesn\'t exist.');
						cont = false;
					}
				});

				await SearchWords.destroy({
					where: {
						term: term
					}
				}).catch(errHandler);

				if (!cont) {
					return;
				}

				//Confirm removal
				return await message.channel.send(term + ' has been removed from the database');
			}
			else {
				//Inform if user doesn't have authority to edit info
				if (!message.member.roles.has(Config.ROLES.GUARDIAN) || !message.member.roles.has(Config.ROLES.HELPER)) {
					message.channel.send('You do not have the experience to complete this command');
				}
			}
		}
		else if (cmd === 'edit') {
			// TODO: reafctor into editSearchTerm
			if (message.channel.id === Config.CHANNELS.COMMAND_CENTER
						&& (message.member.roles.has(Config.ROLES.GUARDIAN) || message.member.roles.has(Config.ROLES.HELPER))) {
				//Update InfoTerms
				let termToUpdate = await SearchWords.findAll({
					attributes: ['term'],
					where: {
						keyword: term
					},
					raw: true
				}).catch(errHandler);

				await InfoTerms.update({
					description: desc
				}, {
					where: {
						term: termToUpdate[0].term
					}
				}).catch(errHandler);

				//Confirm edit
				return await message.channel.send(`The info term ${termToUpdate[0].term} has been updated!`);
			}
			else {
				//Inform if user doesn't have authority to edit info
				if (!message.member.roles.has(Config.ROLES.GUARDIAN) || !message.member.roles.has(Config.ROLES.HELPER)) {
					message.channel.send('You do not have the experience to complete this command');
				}
			}
		}
		else if (cmd === 'help') {
			// TODO: reafctor into helpWithSearchTerms
			const infoHelp = new Discord.RichEmbed()
				.setColor('#FF000')
				.setTitle('Knights of Academia Info Help')
				.setDescription('Here are some commands to help you out with info!')
				.addField('Add info', '`!info add <term> <comma,seperated,keywords> -<description>`')
				.addField('Remove info', '`!info remove <keyword>`')
				.addField('Edit info description', '`!info edit <keyword> -<new description>`')
				.addField('List info terms', '`!info`');
			return await user.send(infoHelp);
		}
		else {
			let inputWord = await SearchWords.findAll({
				attributes: ['term'],
				where: {
					keyword: cmd
				},
				raw: true
			}).catch(errHandler);

			let result = await InfoTerms.findAll({
				attributes: ['term', 'description'],
				where: {
					term: inputWord[0].term
				},
				raw: true
			}).catch(errHandler);

			if (!result) {
				return await message.channel.send(`I dont know about ${cmd} yet, can you teach me?`);
			}

			const response = new Discord.RichEmbed()
				.setTitle(result[0].term)
				.setDescription(result[0].description);
			return await message.channel.send(response);
		}
	}
};

module.exports.config = {
	name: 'info',
	aliases: ['info', 'about'],
	description: 'I will send you information about a term.',
	usage: ['info', 'info add', 'info remove', 'info edit']
};
