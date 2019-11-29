const Discord = require('discord.js');
const help = require('./help.js');
const messageStup = require('../stub/messageStub');

test('Sends default help message when no argument is provided', async () => {
	const messsage = new messageStup();
	let client = new Discord.Client();
	client.commands = new Discord.Collection();
	['help', 'facebook','invite','coinflip'].forEach(name => client.commands.set(name, require(`./${name}`)));

	const responseMessage = await help.execute(client, messsage, []);

	const expectedResponse = 'I have sent you a private message with the command list.';
	expect(responseMessage).toBe(expectedResponse);
});

// test('Sends default help message when an argument is provided', async () => {
// 	const messsage = new messageStup();
// 	let client = new Discord.Client();
// 	client.commands = new Discord.Collection();
// 	['help', 'facebook','invite','coinflip'].forEach(name => client.commands.set(name, require(`./${name}`)));

// 	const responseMessage = await help.execute(client, messsage, ['help']);

// 	const expectedResponse = new Discord.RichEmbed()
// 		.setColor('#ff0000')
// 		.setTitle('help')
// 		.setDescription('You asked for information on help')
// 		.addField('Description: ', 'I will send you this message, or the usage of a specific command.')
// 		.addField('Aliases: ', 'help')
// 		.addField('Usage: ', 'help /n help command');
// 	expect(responseMessage).toBe(expectedResponse);
// });

test('Sends name correction when an incorrect command is looked up', async () => {
	const messsage = new messageStup();
	let client = new Discord.Client();
	client.commands = new Discord.Collection();
	['help', 'facebook','invite','coinflip'].forEach(name => client.commands.set(name, require(`./${name}`)));

	const responseMessage = await help.execute(client, messsage, ['yelp']);
    
	const expectedResponse = 'Did you mean `!help help`?';
	expect(responseMessage).toBe(expectedResponse);
});