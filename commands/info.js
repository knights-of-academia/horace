const Discord = require('discord.js');
const { Config } = require('../config.js');
const InfoTerms = require('../databaseFiles/infoTermsTable.js');
const SearchWords = require('../databaseFiles/searchWordsTable.js');

module.exports.execute = async (client, message, args) => {
	const errHandler = (err) => {
		client.channels.cache.get(Config.CHANNELS.ERRORS).send(`${err}`);
	};
	const cmd = args[0];
	const term = args[1];
	const entirePhrase = args.join(' ');
	const keywords = entirePhrase.substring(entirePhrase.indexOf(' ') + 1);
	const desc = keywords.substring(keywords.indexOf('-') + 1);
	const user = message.author;

	if (keywords.length === 0) {
		// if no term or command is provided, show available search terms
		const delimiter = ',';
		let theInfoTerms = [];
		await InfoTerms.findAll({
			attributes: ['term'],
			raw: true
		}).then((result) => {
			for (let i = 0; i < result.length; i++) {
				theInfoTerms.push(result[i].term);
			}
		});

		const infoMessage = '___**List of available search terms:**__\n\n' + theInfoTerms.join(delimiter);

		await message.author.send(infoMessage).catch((err) => {
			client.channels.cache.get(Config.CHANNELS.ERRORS).send(err);
		});
		return await message.channel.send('I have sent you a private message with the list of available search terms.').catch((err) => {
			client.channels.cache.get(Config.CHANNELS.ERRORS).send(err);
		});
	}
	else if (keywords.length > 1) {
		if (cmd === 'add') { //Add a new term
			if (message.channel.id === Config.CHANNELS.COMMAND_CENTER
				&& (message.member.roles.cache.hasAny(Config.ROLES.GUARDIAN, Config.ROLES.HELPER))) {
				const searchTerms = args[2].split(',');

				let result = await InfoTerms.findAll({
					attributes: ['term', 'description'],
					where: {
						term: term
					},
					raw: true
				}).catch(errHandler);

				console.log(result);

				if (Array.isArray(result) && result.length > 0) {
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
				if (!message.member.roles.cache.hasAny(Config.ROLES.GUARDIAN, Config.ROLES.HELPER)) {
					message.channel.send('You do not have the experience to complete this command');
				}
			}
		}
		else if (cmd === 'remove') {
			if (message.channel.id === Config.CHANNELS.COMMAND_CENTER
					&& message.member.roles.cache.hasAny(Config.ROLES.GUARDIAN, Config.ROLES.HELPER)) {
				//Remove entries
				let cont = true;
				await InfoTerms.destroy({
					where: {
						term: term
					}
				}).then((result) => {
					if (result === 0) {
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
				if (!message.member.roles.cache.hasAny(Config.ROLES.GUARDIAN, Config.ROLES.HELPER)) {
					message.channel.send('You do not have the experience to complete this command');
				}
			}
		}
		else if (cmd === 'edit') {
			if (message.channel.id === Config.CHANNELS.COMMAND_CENTER
						&& message.member.roles.cache.hasAny(Config.ROLES.GUARDIAN, Config.ROLES.HELPER)) {
				//Update InfoTerms
				let termToUpdate = await SearchWords.findAll({
					attributes: ['term'],
					where: {
						keyword: term
					},
					raw: true
				}).catch(errHandler);

				if (!termToUpdate || termToUpdate.length === 0) {
					return await message.channel.send(`I couldn't find the term "${term}" to edit.`);
				}

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
				if (!message.member.roles.cache.hasAny(Config.ROLES.GUARDIAN, Config.ROLES.HELPER)) {
					message.channel.send('You do not have the experience to complete this command');
				}
			}
		}
		else if (cmd === 'help') {
			const infoHelp = new Discord.MessageEmbed()
				.setColor('#FF0000')
				.setTitle('Knights of Academia Info Help')
				.setDescription('Here are some commands to help you out with info!')
				.addFields([
					{ name: 'Add info', value: '`!info add <term> <comma,separated,keywords> -<description>`' },
					{ name: 'Remove info', value: '`!info remove <keyword>`' },
					{ name: 'Edit info description', value: '`!info edit <keyword> -<new description>`' },
					{ name: 'List info terms', value: '`!info`' }
				]);
			return await user.send({ embeds: [infoHelp] });
		}
		else {
			let inputWord = await SearchWords.findAll({
				attributes: ['term'],
				where: {
					keyword: cmd
				},
				raw: true
			}).catch(errHandler);

			if (!inputWord || inputWord.length === 0) {
				return await message.channel.send(`I dont know about ${cmd} yet, can you teach me?`);
			}

			let result = await InfoTerms.findAll({
				attributes: ['term', 'description'],
				where: {
					term: inputWord[0].term
				},
				raw: true
			}).catch(errHandler);

			if (!result || result.length === 0) {
				return await message.channel.send('I found the keyword, but I couldn\'t find a description for it.');
			}

			const response = new Discord.MessageEmbed()
				.setTitle(result[0].term)
				.setDescription(result[0].description || 'No description available.');
			return await message.channel.send({ embeds: [response] });
		}
	}
};

module.exports.config = {
	name: 'info',
	aliases: ['info', 'about'],
	description: 'I will send you information about a term.',
	usage: ['info', 'info add', 'info remove', 'info edit']
};
