const choose = require('./choose.js');
const messageStub = require('../stub/messageStub');


test('Returns the correct choice with the spaces preserved', async () => {
	// Arrange
	const message = new messageStub();
	const mockMath = Object.create(global.Math);
	mockMath.random = () => 0;

	global.Math = mockMath;

	// Act
	const responseMessage = await choose.execute(null, message, ['Knights', 'of', 'Academia,', 'Academia', 'of', 'Knights']);

	// Assert
	const expectedResponse = 'Horace says... Knights of Academia!';
	expect(responseMessage).toBe(expectedResponse);
});