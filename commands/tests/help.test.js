const Discord = require('discord.js');
const MockMessage = require('../../stub/MockMessage.js');
const help = require('../help.js');

const client = new Discord.Client();
const message = new MockMessage();

beforeAll(() => {
	client.commands = new Discord.Collection();
	client.aliases = new Discord.Collection();
	['help', 'cotw', 'highlight'].forEach((name) =>
		client.commands.set(name, require(`../${name}`))
	);
});

beforeEach(() => {
	jest.clearAllMocks();
});

afterAll(() => {
	client.destroy();
});

test('Sends default help message when no argument is provided', async () => {
	await help.execute(client, message, []);

	const expectedEmbed = new Discord.MessageEmbed()
		.setColor('#ff0000')
		.setTitle('List of available commands')
		.setDescription('Commands available in KOA')
		.addField('**!help**', 'I will send you this message, or the usage of a specific command.')
		.addField('**!cotw**', 'I will tell you what the challenge of the week is.')
		.addField('**!highlights**', 'Highlight a word or phrase you want to keep track of!');
	expect(message.author.send).toHaveBeenCalledWith(expectedEmbed);
	expect(message.author.send).toHaveBeenCalledTimes(1);

	const expectedResponse = 'I have sent you a private message with the command list.';
	expect(message.channel.send).toHaveBeenCalledWith(expectedResponse);
});

test('Sends default help message when an argument is provided', async () => {
	await help.execute(client, message, ['help']);

	const expectedResponse = new Discord.MessageEmbed()
		.setColor('#ff0000')
		.setTitle('!help')
		.setDescription('You asked for information on !help')
		.addField('Description:', 'I will send you this message, or the usage of a specific command.')
		.addField('Aliases:', 'help')
		.addField('Usage:', 'help\nhelp command');
	expect(message.channel.send).toHaveBeenCalledWith(expectedResponse);
});

test('Sends name correction when an incorrect command is looked up', async () => {
	await help.execute(client, message, ['yelp']);

	const expectedResponse = 'Did you mean `!help help`?';
	expect(message.channel.send).toHaveBeenCalledWith(expectedResponse);
});
