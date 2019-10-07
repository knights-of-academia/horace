const newsletter = require('./newsletter.js');
const messageStub = require('../stub/messageStub');


test('Sends newletter link to channel', async () => {
	// Arrange
	const message = new messageStub();

	// Act
	const responseMessage = await newsletter.execute(null, message);

	// Assert
	const expectedResponse = 'The newest newsletter from...';
	expect(responseMessage[0]).toBe(expectedResponse[0]);
});