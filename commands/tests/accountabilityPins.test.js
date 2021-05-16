const MockMessage = require('../../stub/MockMessage.js');
const unpin = require('../accountabilityUnpin.js');
const unpinAll = require('../accountabilityUnpinAll.js');
const actions = require('../../eventActions/accountabilityActions.js');

// const config = jest.mock('../../config.json');
// jest.mock('../../eventActions/accountabilityActions.js');

const message = new MockMessage();

beforeEach(() => {
	jest.clearAllMocks();
});

test('"Unpin" calls handler when in accountability channel', async () => {
    config.channels = {};
    config.channels.accountability = '123123123123123123';
    await unpin.execute(null, message);
    expect(actions.userUnpinsMessage).toBeCalledTimes(1);
});

test.todo('"Unpin" does not call handler when not in accountability channel');

test.todo('"Unpin All" calls handler when in accountability channel');

test.todo('"Unpin All" does not call handler when not in accountability channel');
