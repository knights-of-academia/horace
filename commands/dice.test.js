const dice = require('./dice');
const messageStub = require('../stub/messageStub');

test('Sends correct message when args is null', async() => {
	const message = new messageStub();

	// Act
	const responseMessage = await dice.execute(null, message, null);

	expect(responseMessage).toBe('❌ Please specify the dice size.');
});

test('Sends correct message when args isn\'t a number', async() => {
	const message = new messageStub();

	// Act
	const responseMessage = await dice.execute(null, message, ['null']);

	expect(responseMessage).toBe('❌ Please specify a number for the dice size.');
});

test('Sends correct dice result', async() => {
	const message = new messageStub();

	const mockMath = Object.create(global.Math);
	mockMath.random = () => 0.5;
	global.Math = mockMath;

	// Act
	const responseMessage = await dice.execute(null, message, [6]);

	expect(responseMessage).toBe('⚅ result: 4');
});
