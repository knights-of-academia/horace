const apply = require('../apply.js');
const MockMessage = require('../../stub/MockMessage.js');

test('Returns the correct message when no argument is passed', async () => {
	const message = new MockMessage();
	const responseMessage = await apply.execute(null, message, []);
	const expectedResponse = '❌ Please specify the clan you wish to apply for.';
	expect(responseMessage).toBe(expectedResponse);
});


test('Returns the correct message when an invalid clan is passed', async () => {
	const message = new MockMessage();
	const responseMessage = await apply.execute(null, message, ['Teh', 'Rounde', 'Table']);
	const expectedResponse = '❌ The clan `teh rounde table` couldn\'t be found.';
	expect(responseMessage).toBe(expectedResponse);
});


test('Returns the correct form url when a valid argument is passed', async () => {
	const message = new MockMessage();
	const responseMessage = await apply.execute(null, message, ['The', 'Round', 'Table']);
	const expectedResponse = `✔ **Fill out your user ID to receive an invite!**
*Average Response Time: 24 hours or less*
https://knightsofacademia.org/the-round-table/`;
	expect(responseMessage).toBe(expectedResponse);
});