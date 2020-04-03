//Get the InfoTerms Table and Search Words Table in the SQLite database
const InfoTerms = require('../databaseFiles/infoTermsTable.js');
const SearchWords = require('../databaseFiles/searchWordsTable.js');
const Discord = require('discord.js');
const config = require('../config.json');

// Error handler
const errHandler = err => {
	console.error('Info sequelize error: ', err);
};

//Ensure the tables exist if not already
InfoTerms.sync();
SearchWords.sync();

module.exports.execute = async (client, message, args) => {
	const cmd = args[0]; //The command action word
	const term = args[1];
	const entirePhrase = args.join(' ');
	const keywords = entirePhrase.substring(entirePhrase.indexOf(' ')+1);
	const descript = keywords.substring(keywords.indexOf('-')+1);
	const user = message.author;
	const infoEmote = config.emotes.info;
	
	if(keywords.length === 0){
		// if no term or command is provided, show available search terms
		const delimiter = ',';
		let theInfoTerms = new Array();
		await InfoTerms.findAll({
			attributes: ['term'],
			raw: true
		}).then(result => {
			for (let i = 0; i < result.length; i++){
				theInfoTerms.push(result[i].term);
			}
		});
		
		const infoMessage = '___**List of available search terms:**__\n\n' + theInfoTerms.join(delimiter);
		
		await message.author.send(infoMessage).catch(err => {
			console.error(err);
		});
		return await message.channel.send('I have sent you a private message with the list of available search terms').catch(err => {
			console.error(err);
		});
		
	}
	else if (keywords.length > 1) {
		
		if (cmd === 'add') { //Add a new term
			if(message.channel.id === config.channels.commandcenter
				&& (message.member.roles.has(config.roles.guardian) || message.member.roles.has(config.roles.helper))){
				const searchTerms = args[2].split(',');
					
				let result = await InfoTerms.findAll({
					attributes: ['term', 'description'],
					where: {
						term: term
					},
					raw: true
				}).catch(errHandler);
					
				console.log(result);
					
				if (result.length > 0){
					return await message.channel.send(`${term} already exists. Did you mean to type !info edit?`);
				}
					
				//Add entry to InfoTerm Table
				await InfoTerms.create({
					term: term,
					description: descript
				}).catch(errHandler);
					
				//Add keywords to SearchWords Table
				for (const keyword of searchTerms) {
					await SearchWords.create({
						term: term,
						keyword: keyword
					}).catch(errHandler);
				}
					
				//Confirm Info Addition
				return await message.channel.send(`New term, ${term}, added!`);
					
			}
			else {
				//Inform if user doesn't have authority to edit info
				if (!message.member.roles.has(config.roles.guardian) || !message.member.roles.has(config.roles.helper)){
					message.channel.send('You do not have the experience to complete this command');
				}
			}
				
		}
		else if (cmd === 'remove'){
			if(message.channel.id === config.channels.commandcenter
					&& (message.member.roles.has(config.roles.guardian) || message.member.roles.has(config.roles.helper))){
						
				//Remove entries
				let cont = true;
				await InfoTerms.destroy({
					where: {
						term: term
					}
				}).then(result =>{
					if(result == 0){
						user.send('You tried to remove info `' + term + '`, but it doesn\'t exist.');
						cont = false;
					}
				});
						
				await SearchWords.destroy({
					where: {
						term: term
					}
				}).catch(errHandler);
						
				if (!cont){
					return;
				}
						
				//Confirm removal
				return await message.channel.send(term + ' has been removed from the database');
						
			}
			else {
				//Inform if user doesn't have authority to edit info
				if (!message.member.roles.has(config.roles.guardian) || !message.member.roles.has(config.roles.helper)){
					message.channel.send('You do not have the experience to complete this command');
				}
			}
		}
		else if (cmd === 'edit'){
			if(message.channel.id === config.channels.commandcenter
						&& (message.member.roles.has(config.roles.guardian) || message.member.roles.has(config.roles.helper))){
							
				//Update InfoTerms
				let termToUpdate = await SearchWords.findAll({
					attributes: ['term'],
					where: {
						keyword: term
					},
					raw: true
				}).catch(errHandler);
							
				await InfoTerms.update({
					description: descript
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
				if (!message.member.roles.has(config.roles.guardian) || !message.member.roles.has(config.roles.helper)){
					message.channel.send('You do not have the experience to complete this command');
				}
			}
		}
		else if (cmd === 'help'){
			const infoHelp = new Discord.RichEmbed()
				.setColor('#FFEC09')
				.setTitle(`${infoEmote} Knights of Academia Info Help ${infoEmote}`)
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
	usage: ['info']
};