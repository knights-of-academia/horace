const website = require('../website.js');
const MockMessage = require('../../stub/MockMessage.js');


test('Sends a correct message with a URL to the channel', async () => {
	const message = new MockMessage();
	const responseMessage = await website.execute(null, message);
	const expectedResponse = '⚔️ https://knightsofacademia.org/ ⚔️';
	expect(responseMessage).toBe(expectedResponse);
});