const fs = require('fs');
const Discord = require('discord.js');
let prefix;
if (fs.existsSync('../config.json')) {
	prefix = require('../config.json').prefix;
} else {
	prefix = '!';
}

module.exports.execute = async (client, message, args) => {
	let commands = client.commands;
	let commandNames = [];

	if (!args || args.length === 0) {
		let helpMessage = new Discord.MessageEmbed()
			.setColor('#ff0000')
			.setTitle('List of available commands')
			.setDescription('Commands available in ' + message.guild.name);
		commands.forEach((command) => {
			helpMessage.addField(`**${prefix}${command.config.name}**`, `${command.config.description}`);
		});
		try {
			await message.author.send(helpMessage);
			await message.channel.send('I have sent you a private message with the command list.');
		}
		catch (err) {
			console.log(err);
		}
	} else if (args.length === 1) {
		let command = commands.find((theCommand) =>
			theCommand.config.name === args[0].toLowerCase() ||
			theCommand.config.aliases.find((alias) => alias === args[0].toLowerCase())
		);

		if (command) {
			let helpMessage = new Discord.MessageEmbed()
				.setColor('#ff0000')
				.setTitle(`${prefix}${command.config.name}`)
				.setDescription(`You asked for information on ${prefix}${command.config.name}`);
			helpMessage.addField('Description:', command.config.description);
			helpMessage.addField('Aliases:', command.config.aliases);
			helpMessage.addField('Usage:', command.config.usage);

			try {
				await message.channel.send(helpMessage);
			}
			catch (err) {
				console.log(err);
			}
		} else {
			commands.forEach((theCommand) => {
				commandNames.push(theCommand.config.name);
				theCommand.config.aliases.forEach((alias) => commandNames.push(alias));
			});
			return didYouMean(commandNames, args[0].toLowerCase(), message);
		}
	}
};


async function didYouMean(commands, search, message) {
	if (!commands.includes(search)) {
		let score = [];
		let lev = 1000;
		let str = [];
		for (let command of commands) {
			if (levenshtein(search, command) <= lev) {
				lev = levenshtein(search, command);
				str.push(command);
			}
		}
		if (str.length > 1) {
			let arr = [];
			for (let string of str) {
				arr.push(string.split(''));
			}
			for (let i = 0; i < arr.length; i++) {
				score[i] = 0;
				for (let j = 0; j < arr[i].length; j++) {
					if (search.split('')[j] === arr[i][j]) {
						score[i]++;
					}
				}
			}
			return await message.channel.send(`Did you mean \`${prefix}help ${str[score.indexOf(Math.max(...score))]}\`?`).catch((err) => console.log(err));
		} else {
			return await message.channel.send(`Did you mean \`${prefix}help ${str[0]}\`?`).catch((err) => console.log(err));
		}
	}
}

function levenshtein(searchTerm, commandName) {
	if (searchTerm.length === 0) return commandName.length;
	if (commandName.length === 0) return searchTerm.length;
	let tmp, i, j, previous, val, row;
	if (searchTerm.length > commandName.length) {
		tmp = searchTerm;
		searchTerm = commandName;
		commandName = tmp;
	}

	row = Array(searchTerm.length + 1);
	for (i = 0; i <= searchTerm.length; i++) {
		row[i] = i;
	}

	for (i = 1; i <= commandName.length; i++) {
		previous = i;
		for (j = 1; j <= searchTerm.length; j++) {
			if (commandName[i - 1] === searchTerm[j - 1]) {
				val = row[j - 1];
			} else {
				val = Math.min(row[j - 1] + 1,
					Math.min(previous + 1,
						row[j] + 1));
			}
			row[j - 1] = previous;
			previous = val;
		}
		row[searchTerm.length] = previous;
	}
	return row[searchTerm.length];
}

module.exports.config = {
	name: 'help',
	aliases: ['help'],
	description: 'I will send you this message, or the usage of a specific command.',
	usage: ['help', 'help command'],
};
