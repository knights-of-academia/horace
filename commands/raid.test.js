const raid = require('./raid.js');
const messageStub = require('../stub/messageStub');


test('Sends correct raid message to channel', async () => {
	// Arrange
	const message = new messageStub();

	// Act
	const responseMessage = await raid.execute(null, message);

	// Assert
	const expectedResponse = '**RAAAAAAAAAAAAAAAAAAAID!** ⚔\nhttps://cuckoo.team/koa';
	expect(responseMessage).toBe(expectedResponse);
});