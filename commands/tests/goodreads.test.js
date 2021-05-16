const goodreads = require('../goodreads.js');
const MockMessage = require('../../stub/MockMessage.js');

test('sends correct goodreads message to channel', async () => {
	const message = new MockMessage();
	const responseMessage = await goodreads.execute(null, message);
	const expectedResponse = 'KOA Goodreads page: https://www.goodreads.com/group/show/756579-knights-of-academia';
	expect(responseMessage).toBe(expectedResponse);
});
