const clans = require('../contribute.js');
const MockMessage = require('../../stub/MockMessage.js');

test('Sends correct message to channel', async () => {
	const message = new MockMessage();
	const responseMessage = await clans.execute(null, message);

	const expectedResponse = `To submit a feature, simply click on the link below and submit a request. Our Engineering Team will sort through these requests and once approved, build them in the following Horace update/patch. If you know Javascript or want to learn, feel free to submit a Pull Request!
	https://github.com/Knights-Of-Academia/horace/issues
	*Note: you do need to sign up for a Github account to do this*`;

	expect(responseMessage).toBe(expectedResponse);
});
