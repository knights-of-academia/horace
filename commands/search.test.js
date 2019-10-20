const search = require('./search.js');
const messageStub = require('../stub/messageStub');

test('Returns the correct message when no argument is passed', async () => {
	// Arrange
	const message = new messageStub();

	// Act
	const responseMessage = await search.execute(null, message, []);

	// Assert
	const expectedResponse = '❌ Please specify a search term.';
	expect(responseMessage).toBe(expectedResponse);
});

test('Returns the correct URL when a valid argument is passed', async () => {
	// Arrange
	const message = new messageStub();

	// Act
	const args = ['Knights', 'of', 'Academia'];
	const responseMessage = await search.execute(null, message, args);

	// Assert
	const searchTerm = args.join(' ');
	const query = args.join('+');
	const expectedResponse = `Search for ${searchTerm}: https://www.google.com/search?q=${query}`;
	expect(responseMessage).toBe(expectedResponse);
});