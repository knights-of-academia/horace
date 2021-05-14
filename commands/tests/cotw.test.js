const cotw = require('../cotw.js');
const MockMessage = require('../../stub/MockMessage.js');

const store = require('data-store')({ path: process.cwd() + '/data/cotw.json' });


test('Returns the correct response when the poll is open', async () => {
	const message = new MockMessage();
	const responseMessage = await cotw.execute(null, message);
	const expectedResponse = `⚔  Challenge of the Week ⚔\n\n🔸 The current challenge ***${store.get('challengeName')}*** can be found here: https://habitica.com/challenges/${store.get('challengeId')}\n🔸 The poll for next week's challenge can be found here: ${store.get('pollLink')}`;
	expect(responseMessage).toBe(expectedResponse);
});
