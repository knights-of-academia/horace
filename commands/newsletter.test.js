const newsletter = require('./newsletter.js');
const messageStub = require('../stub/messageStub');


test('Sends newletter link to channel', async () => {
	const message = new messageStub();
	const responseMessage = await newsletter.execute(null, message);
	const expectedResponse = 'The newest newsletter from...';
	expect(responseMessage[0]).toBe(expectedResponse[0]);
});
