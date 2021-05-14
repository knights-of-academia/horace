const { Collection } = require('discord.js');
const MockDiscord = require('../../stub/MockDiscord');
const help = require('../help.js');

test('Sends default help message when no argument is provided', async () => {
	const MD = new MockDiscord();
	MD.client.commands = new Collection();
	MD.client.aliases = new Collection();
	MD.message.author.send = jest.fn((string) => {
		return Promise.resolve(string);
	});
	MD.message.channel.send = jest.fn((string) => {
		return Promise.resolve(string);
	});

	['help', 'facebook','invite','coinflip'].forEach(name => 
		MD.client.commands.set(name, require(`../${name}`))
	);
	
	await help.execute(MD.client, MD.message, []);

	const expectedResponse = 'I have sent you a private message with the command list.';
	expect(MD.message.author.send).toHaveBeenCalledTimes(1);
	expect(MD.message.channel.send).toHaveBeenCalledWith(expectedResponse);
});

// test('Sends default help message when an argument is provided', async () => {
// 	const message = new messageStub();
// 	let client = new Discord.Client();
// 	client.commands = new Discord.Collection();
// 	['help', 'facebook','invite','coinflip'].forEach(name => client.commands.set(name, require(`./${name}`)));

// 	const responseMessage = await help.execute(client, message, ['help']);

// 	const expectedResponse = new Discord.RichEmbed()
// 		.setColor('#ff0000')
// 		.setTitle('help')
// 		.setDescription('You asked for information on help')
// 		.addField('Description: ', 'I will send you this message, or the usage of a specific command.')
// 		.addField('Aliases: ', 'help')
// 		.addField('Usage: ', 'help /n help command');
// 	expect(responseMessage).toBe(expectedResponse);
// });

// test('Sends name correction when an incorrect command is looked up', async () => {
// 	const message = new messageStub();
// 	let client = new Discord.Client();
// 	client.commands = new Discord.Collection();
// 	['help', 'facebook','invite','coinflip'].forEach(name => client.commands.set(name, require(`../${name}`)));

// 	const responseMessage = await help.execute(client, message, ['yelp']);
    
// 	const expectedResponse = 'Did you mean `!help help`?';
// 	expect(responseMessage).toBe(expectedResponse);
// });
