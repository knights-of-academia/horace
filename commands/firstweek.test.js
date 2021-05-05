/* eslint-disable linebreak-style */
const firstweek = require('./firstweek.js');
const messageStub = require('../stub/messageStub');


test('Sends a correct message with a URL to the channel', async () => {
	// Arrange
	const message = new messageStub();

	// Act
	const responseMessage = await firstweek.execute(null, message);

	// Assert
	const expectedResponse = 'Your first week at KOA: <https://knightsofacademia.org/your-first-week-at-koa>';
	expect(responseMessage).toBe(expectedResponse);
});