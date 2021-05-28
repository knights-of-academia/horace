const cotw = require('../cotw.js');
const MockMessage = require('../../stub/MockMessage.js');
const mockStore = require('data-store');

beforeEach(async () => {
	jest.resetModules().resetAllMocks();
});

test('Sends the correct response when the poll is open', async () => {
	jest.mock('data-store', () => {
		return jest.fn().mockImplementation(() => {
			return {
				constructor: () => {
					return new mockStore();
				},

				get: (key) => {
					switch (key) {
					case 'pollActive':
						return true;
					case 'pollLink':
						return 'https://forms.gle/AUEXajS9hCLUCe7G7';
					case 'challengeId':
						return '9c7c4e68-a06a-446a-ad1c-b2e13a59b902';
					case 'challengeName':
						return 'Get Outside';
					}
				},
			};
		});
	});
	const message = new MockMessage();
	await cotw.execute(null, message);
	const expectedResponse = '⚔  Challenge of the Week ⚔\n\n🔸 The current challenge, **Get Outside**, can be found here: https://habitica.com/challenges/9c7c4e68-a06a-446a-ad1c-b2e13a59b902\n🔸 The poll for next week\'s challenge can be found here: https://forms.gle/AUEXajS9hCLUCe7G7';
	expect(message.channel.send).toBeCalledWith(expectedResponse);
});

test('Sends the correct response when the poll is closed', async () => {
	jest.mock('data-store', () => {
		return jest.fn().mockImplementation(() => {
			return {
				constructor: () => {
					return new mockStore();
				},

				get: (key) => {
					switch (key) {
					case 'pollActive':
						return false;
					case 'pollLink':
						return 'https://forms.gle/AUEXajS9hCLUCe7G7';
					case 'challengeId':
						return '9c7c4e68-a06a-446a-ad1c-b2e13a59b902';
					case 'challengeName':
						return 'Get Outside';
					}
				},
			};
		});
	});
	const message = new MockMessage();
	await cotw.execute(null, message);
	const expectedResponse = '⚔  Challenge of the Week ⚔\n\n🔸 The current challenge, **Get Outside**, can be found here: https://habitica.com/challenges/9c7c4e68-a06a-446a-ad1c-b2e13a59b902';
	expect(message.channel.send).toBeCalledWith(expectedResponse);
});

test('Sends error response when data is missing', async () => {
	jest.mock('data-store', () => {
		return jest.fn().mockImplementation(() => {
			return {
				constructor: () => {
					return new mockStore();
				},

				get: () => {
					return undefined;
				},
			};
		});
	});
	const message = new MockMessage();
	await cotw.execute(null, message);
	const expectedResponse = 'Could not get the current Challenge of the Week.';
	expect(message.channel.send).toBeCalledWith(expectedResponse);
});
