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
	embed.ask.mockReturnValue('notAURL');
	await expect(embed.getURL())
		.rejects
		.toThrow('Embed URL not valid!');
});

test('Validates description correctly given correct input', async () => {
	jest.spyOn(embed, 'ask').mockImplementation(jest.fn());
	embed.ask.mockReturnValue('testDescription');
	const expectedResponse = 'testDescription';
	const responseMessage = await embed.getDescription();
	expect(responseMessage).toBe(expectedResponse);
});

test('Validates description correctly given incorrect input', async () => {
	jest.spyOn(embed, 'ask').mockImplementation(jest.fn());
	embed.ask.mockReturnValue(null);
	await expect(embed.getDescription())
		.rejects
		.toThrow('Embed description not valid!');
});

test('Validates subtitle correctly given correct input', async () => {
	jest.spyOn(embed, 'ask').mockImplementation(jest.fn());
	embed.ask.mockReturnValue('testSubtitle');
	const expectedResponse = 'testSubtitle';
	const responseMessage = await embed.getSubtitle();
	expect(responseMessage).toBe(expectedResponse);
});

test('Validates subtitle correctly given incorrect input', async () => {
	jest.spyOn(embed, 'ask').mockImplementation(jest.fn());
	embed.ask.mockReturnValue(null);
	await expect(embed.getSubtitle())
		.rejects
		.toThrow('Embed subtitle not valid!');
});

test('Validates body correctly given correct input', async () => {
	jest.spyOn(embed, 'ask').mockImplementation(jest.fn());
	embed.ask.mockReturnValue('testBody');
	const expectedResponse = 'testBody';
	const responseMessage = await embed.getDescription();
	expect(responseMessage).toBe(expectedResponse);
});

test('Validates body correctly given incorrect input', async () => {
	jest.spyOn(embed, 'ask').mockImplementation(jest.fn());
	embed.ask.mockReturnValue(null);
	await expect(embed.getBody())
		.rejects
		.toThrow('Embed body not valid!');
});

test('Validates colour correctly given correct input', async () => {
	jest.spyOn(embed, 'ask').mockImplementation(jest.fn());
	embed.ask.mockReturnValue('#ffffff');
	const expectedResponse = '#ffffff';
	const responseMessage = await embed.getColour();
	expect(responseMessage).toBe(expectedResponse);
});

test('Validates colour correctly given incorrect input', async () => {
	jest.spyOn(embed, 'ask').mockImplementation(jest.fn());
	embed.ask.mockReturnValue('notAHexCode');
	await expect(embed.getColour())
		.rejects
		.toThrow('Embed colour hex code not valid!');
});

test('Validates image correctly given correct input', async () => {
	jest.spyOn(embed, 'ask').mockImplementation(jest.fn());
	embed.ask.mockReturnValue('https://example.com');
	const expectedResponse = 'https://example.com';
	const responseMessage = await embed.getImage();
	expect(responseMessage).toBe(expectedResponse);
});

test('Validates image correctly given incorrect input', async () => {
	jest.spyOn(embed, 'ask').mockImplementation(jest.fn());
	embed.ask.mockReturnValue('notAURL');
	await expect(embed.getImage())
		.rejects
		.toThrow('Embed image URL not valid!');
});
