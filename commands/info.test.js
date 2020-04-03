// const info = require('./info.js');
// const messageStub = require('../stub/messageStub');


// test('Returns the correct message when no argument is passed', async () => {
// 	// Arrange
// 	const message = new messageStub();

// 	// Act
// 	const responseMessage = await info.execute(null, message, []);

// 	// Assert
// 	const expectedResponse = 'I have sent you a private message with the list of available search terms.';
// 	expect(responseMessage).toBe(expectedResponse);
// });

// test('Returns the correct message unknown term is entered', async () => {
// 	// Arrange
// 	const message = new messageStub();

// 	// Act
// 	const responseMessage = await info.execute(null, message, ['knoths', 'of', 'ocodomoa']);

// 	// Assert
// 	const expectedResponse = 'I don\'t know about knoths of ocodomoa yet, can you teach me?';
// 	expect(responseMessage).toBe(expectedResponse);
// });


// test('Returns the correct response when given a search term', async () => {
// 	// Arrange
// 	const message = new messageStub();

// 	// Act
// 	const responseMessage = await info.execute(null, message, ['jesters']);

// 	// Assert
// 	const expectedResponse = 'The place for memes, ranting, debates, and pretty much anything else that might not be allowed in KOA Main. Feel free to grab a link to it with `!invite jesters` or in <#403260793644384266>!';
// 	expect(responseMessage.description).toBe(expectedResponse);
// });
