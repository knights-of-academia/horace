const apply = require('./apply.js');
const messageStub = require('../stub/messageStub');


test('Returns the correct message when no argument is passed', async () => {
	// Arrange
	const message = new messageStub();

	// Act
	const responseMessage = await apply.execute(null, message, []);

	// Assert
	const expectedResponse = '❌ Please specify the clan you wish to apply for.';
	expect(responseMessage).toBe(expectedResponse);
});


test('Returns the correct message when an invalid clan is passed', async () => {
	// Arrange
	const message = new messageStub();

	// Act
	const responseMessage = await apply.execute(null, message, ['Teh', 'Rounde', 'Table']);

	// Assert
	const expectedResponse = '❌ The clan `teh rounde table` couldn\'t be found.';
	expect(responseMessage).toBe(expectedResponse);
});


test('Returns the correct form url when a valid argument is passed', async () => {
	// Arrange
	const message = new messageStub();

	// Act
	const responseMessage = await apply.execute(null, message, ['The', 'Round', 'Table']);

	// Assert
	const expectedResponse = `✔ **Fill out your user ID to receive an invite!**
*Average Response Time: 24 hours or less*
https://knightsofacademia.org/the-round-table/`;
	expect(responseMessage).toBe(expectedResponse);
});