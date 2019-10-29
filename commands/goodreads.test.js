const goodreads = require('./goodreads.js');
const messageStub = require('../stub/messageStub');

test('sends correct goodreads message to channel', async () => {
	//Arrange
	const message = new messageStub();

	//Act
	const responseMessage = await goodreads.execute(null, message);

	//Assert
	const expectedResponse = 'KOA goodreads page: https://www.goodreads.com/group/show/756579-knights-of-academia';
	expect(responseMessage).toBe(expectedResponse);
});