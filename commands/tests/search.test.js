const search = require('../search.js');
const MockMessage = require('../../stub/MockMessage.js');

test('Returns the correct message when no argument is passed', async () => {
	const message = new MockMessage();
	const responseMessage = await search.execute(null, message, []);
	const expectedResponse = '❌ Please specify a search term.';
	expect(responseMessage).toBe(expectedResponse);
});

test('Returns the correct URL when a valid argument is passed', async () => {
	const message = new MockMessage();
	const args = ['Knights', 'of', 'Academia'];
	const responseMessage = await search.execute(null, message, args);
	const expectedResponse = 'Search for Knights of Academia: https://www.google.com/search?q=Knights+of+Academia';
	expect(responseMessage).toBe(expectedResponse);
});