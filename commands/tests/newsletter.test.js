const newsletter = require('../newsletter.js');
const MockMessage = require('../../stub/MockMessage.js');


test('Sends newletter link to channel', async () => {
	const message = new MockMessage();
	const responseMessage = await newsletter.execute(null, message);
	const expectedResponse = 'The newest newsletter from...';
	expect(responseMessage[0]).toBe(expectedResponse[0]);
});
