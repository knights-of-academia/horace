const raid = require('./raid.js');
const messageStub = require('../stub/messageStub');
const config = require('../config.json');


test('Sends correct raid message to normal channels', async () => {
	const message = new messageStub();
	message.channel.id = config.channels.raidroom;

	const responseMessage = await raid.execute(null, message);

	const expectedResponse = '**RAAAAAAAAAAAAAAAAAAAID⚔** with ' + message.author + '\nhttps://cuckoo.team/koa';
	expect(responseMessage).toBe(expectedResponse);
});

test('Sends correct raid message to raidroom50', async () => {
	const message = new messageStub();
	message.channel.id = config.channels.raidroom50;

	const responseMessage = await raid.execute(null, message);

	const expectedResponse = '**RAAAAAAAAAAAAAAAAAAAID⚔** with ' + message.author + '\nhttps://cuckoo.team/raid50';
	expect(responseMessage).toBe(expectedResponse);
});

test('Sends correct raid message to raidroom90', async () => {
	const message = new messageStub();
	message.channel.id = config.channels.raidroom90;

	const responseMessage = await raid.execute(null, message);

	const expectedResponse = '**RAAAAAAAAAAAAAAAAAAAID⚔** with ' + message.author + '\nhttps://cuckoo.team/raid90';
	expect(responseMessage).toBe(expectedResponse);
});