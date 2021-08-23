const invite = require('../invite.js');
const MockMessage = require('../../stub/MockMessage.js');

test('Sends default message on no parameters', async () => {
	const message = new MockMessage();
	const responseMessage = await invite.execute(null, message, []);
	const expectedResponse = 'Invite to the KOA server: https://discord.gg/EYX7XGG';
	expect(responseMessage).toBe(expectedResponse);
});

test('Sends default message on non-defined parameters', async () => {
	const message = new MockMessage();
	const responseMessage = await invite.execute(null, message, ['otherwise']);
	const expectedResponse = 'Invite to the KOA server: https://discord.gg/EYX7XGG';
	expect(responseMessage).toBe(expectedResponse);
});

test('Sends right message on args kod', async () => {
	const message = new MockMessage();
	const responseMessage = await invite.execute(null, message, ['kod']);
	const expectedResponse = 'Invite to the Knights off Duty server: https://discord.gg/wu3a6JA';
	expect(responseMessage).toBe(expectedResponse);
});

test('Sends right message on args KOD', async () => {
	const message = new MockMessage();
	const responseMessage = await invite.execute(null, message, ['KOD']);
	const expectedResponse = 'Invite to the Knights off Duty server: https://discord.gg/wu3a6JA';
	expect(responseMessage).toBe(expectedResponse);
});

test('Sends right message on args koai', async () => {
	const message = new MockMessage();
	const responseMessage = await invite.execute(null, message, ['koai']);
	const expectedResponse = 'Invite to the Knights of Academia: International server: https://discord.gg/Fuvabsm';
	expect(responseMessage).toBe(expectedResponse);
});

test('Sends right message on args KOAI', async () => {
	const message = new MockMessage();
	const responseMessage = await invite.execute(null, message, ['KOAI']);
	const expectedResponse = 'Invite to the Knights of Academia: International server: https://discord.gg/Fuvabsm';
	expect(responseMessage).toBe(expectedResponse);
});

test('Sends right message on args camelot', async () => {
	const message = new MockMessage();
	const responseMessage = await invite.execute(null, message, ['camelot']);
	const expectedResponse = 'Invite to the Camelot server: https://discord.gg/sfW7dU9';
	expect(responseMessage).toBe(expectedResponse);
});

test('Sends right message on args Camelot', async () => {
	const message = new MockMessage();
	const responseMessage = await invite.execute(null, message, ['Camelot']);
	const expectedResponse = 'Invite to the Camelot server: https://discord.gg/sfW7dU9';
	expect(responseMessage).toBe(expectedResponse);
});
