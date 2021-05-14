const facebook = require('../facebook.js');
const messageStub = require('../../stub/messageStub');


test('Sends correct facebook message to channel', async () => {
	const message = new messageStub();
	const responseMessage = await facebook.execute(null, message);
	const expectedResponse = 'KOA Facebook Group : https://www.facebook.com/groups/1895927804047033/';
	expect(responseMessage).toBe(expectedResponse);
});
