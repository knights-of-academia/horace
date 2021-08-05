const Discord = require('discord.js');
const embed = require('../embed.js');
const MockMessage = require('../../stub/MockMessage.js');

beforeEach(async () => {
	jest.resetModules().resetAllMocks();
});

test('Validates title correctly given correct input', async () => {
	jest.spyOn(embed, 'ask').mockImplementation(jest.fn());
	embed.ask.mockReturnValue('testTitle');
	const expectedResponse = 'testTitle';
	const responseMessage = await embed.getTitle();
	expect(responseMessage).toBe(expectedResponse);
});

test('Validates title correctly given incorrect input', async () => {
	jest.spyOn(embed, 'ask').mockImplementation(jest.fn());
	embed.ask.mockReturnValue(null);
	await expect(embed.getTitle())
		.rejects
		.toThrow('Embed title not valid!');
});

test('Validates URL correctly given correct input', async () => {
	jest.spyOn(embed, 'ask').mockImplementation(jest.fn());
	embed.ask.mockReturnValue('https://example.com');
	const expectedResponse = 'https://example.com';
	const responseMessage = await embed.getURL();
	expect(responseMessage).toBe(expectedResponse);
});

test('Validates URL correctly given incorrect input', async () => {
	jest.spyOn(embed, 'ask').mockImplementation(jest.fn());
	embed.ask.mockReturnValue(null);
	await expect(embed.getURL())
		.rejects
		.toThrow('Embed URL not valid!');
});
