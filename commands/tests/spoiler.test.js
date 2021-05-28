const MockMessage = require('../../stub/MockMessage.js');
const spoiler = require('../spoiler.js');

const message = new MockMessage();

beforeEach(() => {
	jest.clearAllMocks();
});

test('Sends clarification when no arguments are provided', async () => {
	await spoiler.execute(null, message, []);
	const expectedResponse = 'Please include text to send as a spoilered message!\n`!spoiler [text to spoiler]`';
	expect(message.author.send).not.toHaveBeenCalled();
	expect(message.channel.send).toHaveBeenCalledTimes(1);
	expect(message.channel.send).toHaveBeenCalledWith(expectedResponse);
});

test('Sends spoiler message when arguments are provided', async () => {
	await spoiler.execute(null, message, ['This', 'is', 'a', 'test', 'message!']);
	expect(message.author.send).not.toHaveBeenCalled();
	expect(message.channel.send).toHaveBeenCalledTimes(1);
	expect(message.channel.send).toHaveBeenCalledWith(
		'<@123456789876543210>\n||This is a test message!||'
	);
});
