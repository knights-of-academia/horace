const coinflip = require('../coinflip');
const MockMessage = require('../../stub/MockMessage.js');

test('random return value less than 0.5', async () => {
	const message = new MockMessage();
	const mockMath = Object.create(global.Math);
	mockMath.random = () => 0.495;
	global.Math = mockMath;
	
	const responseMessage = await coinflip.execute(null, message);

	expect(responseMessage).toBe('Heads');
});

test('random return equals to 0.5', async () => {
	const message = new MockMessage();
	const mockMath = Object.create(global.Math);
	mockMath.random = () => 0.5;
	global.Math = mockMath;
	
	const responseMessage = await coinflip.execute(null, message);

	expect(responseMessage).toBe('Tails');
});

test('random return bigger than 0.5', async () => {
	const message = new MockMessage();
	const mockMath = Object.create(global.Math);
	mockMath.random = () => 0.51;
	global.Math = mockMath;
	
	const responseMessage = await coinflip.execute(null, message);

	expect(responseMessage).toBe('Tails');
});
