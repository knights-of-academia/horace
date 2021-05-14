const firstweek = require('../firstweek.js');
const messageStub = require('../../stub/messageStub');

test('Sends a correct message with a URL to the channel', async () => {
	const message = new messageStub();
	const responseMessage = await firstweek.execute(null, message);
	const expectedResponse = 'Your first week at KOA: <https://knightsofacademia.org/your-first-week-at-koa>';
	expect(responseMessage).toBe(expectedResponse);
});
