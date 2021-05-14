const dice = require('../dice');
const MockMessage = require('../../stub/MockMessage.js');

test('Sends correct message when args is null', async() => {
	const message = new MockMessage();
	const responseMessage = await dice.execute(null, message, null);

	expect(responseMessage).toBe('❌ Please specify the dice size.');
});

test('Sends correct message when args isn\'t a number', async() => {
	const message = new MockMessage();
	const responseMessage = await dice.execute(null, message, ['null']);

	expect(responseMessage).toBe('❌ Please specify a number for the dice size.');
});

test('Sends correct dice result', async() => {
	const message = new MockMessage();
	const mockMath = Object.create(global.Math);
	mockMath.random = () => 0.5;
	global.Math = mockMath;

	const responseMessage = await dice.execute(null, message, [6]);

	expect(responseMessage).toBe('⚅ result: 4');
});
