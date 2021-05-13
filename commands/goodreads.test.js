const goodreads = require('./goodreads.js');
const messageStub = require('../stub/messageStub');

test('sends correct goodreads message to channel', async () => {
	const message = new messageStub();
	const responseMessage = await goodreads.execute(null, message);
	const expectedResponse = 'KOA Goodreads page: https://www.goodreads.com/group/show/756579-knights-of-academia';
	expect(responseMessage).toBe(expectedResponse);
});
