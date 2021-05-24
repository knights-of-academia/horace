const facebook = require('../facebook.js');
const MockMessage = require('../../stub/MockMessage.js');


test('Sends correct facebook message to channel', async () => {
	const message = new MockMessage();
	const responseMessage = await facebook.execute(null, message);
	const expectedResponse = 'KOA Facebook Group : https://www.facebook.com/groups/1895927804047033/';
	expect(responseMessage).toBe(expectedResponse);
});
