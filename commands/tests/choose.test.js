const choose = require('../choose.js');
const MockMessage = require('../../stub/MockMessage.js');

test('Returns the correct message when no arguments are passed', async () => {
	const message = new MockMessage();
	const responseMessage = await choose.execute(null, message, []);
	const expectedResponse = 'Please specify the options I should choose from!\nHint: !choose option1, option2, ..., optionX';
	expect(responseMessage).toBe(expectedResponse);
});

test('Returns the correct message when partial input is passed', async () => {
	const message = new MockMessage();
	const responseMessage = await choose.execute(null, message, [',', 'Knights']);
	const expectedResponse = 'Choices cannot be empty!';
	expect(responseMessage).toBe(expectedResponse);
});

test('Parses weird input correctly', async () => {
	const message = new MockMessage();
	const mockMath = Object.create(global.Math);
	mockMath.random = () => 0;
	global.Math = mockMath;

	const responseMessage = await choose.execute(null, message, ['Knights',
		'of',
		'Academia,,,,,,,,,,',
		'Academia',
		'of',
		'Knights']
	);

	const expectedResponse = 'Horace says... Knights of Academia!';
	expect(responseMessage).toBe(expectedResponse);
});

test('Returns the correct choice at an index 0', async () => {
	const message = new MockMessage();
	const mockMath = Object.create(global.Math);
	mockMath.random = () => 0;
	global.Math = mockMath;

	const responseMessage = await choose.execute(null, message, ['Knights', 'of', 'Academia,', 'Academia', 'of', 'Knights']);

	const expectedResponse = 'Horace says... Knights of Academia!';
	expect(responseMessage).toBe(expectedResponse);
});

test('Returns the correct choice at an index 1', async () => {
	const message = new MockMessage();
	const mockMath = Object.create(global.Math);
	mockMath.random = () => 0.5;
	global.Math = mockMath;

	const responseMessage = await choose.execute(null, message, ['Knights', 'of', 'Academia,', 'Academia', 'of', 'Knights']);

	const expectedResponse = 'Horace says... Academia of Knights!';
	expect(responseMessage).toBe(expectedResponse);
});