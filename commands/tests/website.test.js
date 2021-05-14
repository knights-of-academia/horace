const website = require('../website.js');
const messageStub = require('../../stub/messageStub');


test('Sends a correct message with a URL to the channel', async () => {
	const message = new messageStub();
	const responseMessage = await website.execute(null, message);
	const expectedResponse = '⚔️ https://knightsofacademia.org/ ⚔️';
	expect(responseMessage).toBe(expectedResponse);
});