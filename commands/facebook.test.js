const facebook = require('./facebook.js');
const messageStub = require('../stub/messageStub');


test('Sends correct facebook message to channel', async () => {
	// Arrange
	const message = new messageStub();

	// Act
	const responseMessage = await facebook.execute(null, message);

	// Assert
	const expectedResponse = 'KOA Facebook Group : https://www.facebook.com/groups/1895927804047033/';
	expect(responseMessage).toBe(expectedResponse);
});
