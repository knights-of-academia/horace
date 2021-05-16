const MockMessage = require('../../stub/MockMessage.js');

const message = new MockMessage();

beforeEach(async () => {
	jest.resetModules().resetAllMocks();
});

test('"Unpin" calls handler when in accountability channel', async () => {
	jest.mock('../../config.json', () => {
		return {
			channels: {
				accountability: '123123123123123123'
			}
		};
	});
	jest.mock('../../eventActions/accountabilityActions.js');
	const accActions = require('../../eventActions/accountabilityActions.js');

	const unpin = require('../accountabilityUnpin.js');
	await unpin.execute(null, message);
	expect(accActions.userUnpinsMessage).toBeCalledTimes(1);
});

test('"Unpin" does not call handler when not in accountability channel', async () => {
	jest.mock('../../config.json', () => {
		return {
			channels: {
				accountability: '000'
			}
		};
	});
	jest.mock('../../eventActions/accountabilityActions.js');
	const accActions = require('../../eventActions/accountabilityActions.js');

	const unpin = require('../accountabilityUnpin.js');
	await unpin.execute(null, message);
	expect(accActions.userUnpinsMessage).not.toBeCalled();
});

test('"Unpin All" calls handler when in accountability channel', async () => {
	jest.mock('../../config.json', () => {
		return {
			channels: {
				accountability: '123123123123123123'
			}
		};
	});
	jest.mock('../../eventActions/accountabilityActions.js');
	const accActions = require('../../eventActions/accountabilityActions.js');

	const unpinAll = require('../accountabilityUnpinAll.js');
	await unpinAll.execute(null, message);
	expect(accActions.userUnpinsAllMessages).toBeCalledTimes(1);
});

test('"Unpin All" does not call handler when not in accountability channel', async () => {
	jest.mock('../../config.json', () => {
		return {
			channels: {
				accountability: '000'
			}
		};
	});
	jest.mock('../../eventActions/accountabilityActions.js');
	const accActions = require('../../eventActions/accountabilityActions.js');

	const unpinAll = require('../accountabilityUnpinAll.js');
	await unpinAll.execute(null, message);
	expect(accActions.userUnpinsAllMessages).not.toBeCalled();
});
