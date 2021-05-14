const clans = require('../clans.js');
const messageStub = require('../../stub/messageStub');

test('Sends correct clans message to channel', async () => {
	const message = new messageStub();
	const responseMessage = await clans.execute(null, message);

	const expectedResponse = `⚔ Here is our list of KOA Clans! ⚔

	🔸 **The Round Table**: All things Hard Mode by **bendre1997**#9332
	🔸 **The Fiction Faction**: Creative Writing & Story Telling by **varrictethras**#5383
	🔸 **The Gathering**: Accountability by **hikikomori**#3771
	🔸 **The Clockwork Knights**: Productivity & Efficiency through the use of Systems by **stoneybaby**#3398
	🔸 **The Silver Tongues**: Language & Culture by **theamazingsplit**#2229
	🔸 **The Students**: Academics & all things Education by **colin**#3523
	🔸 **The Wolf Pack**: On the move for Health by **QueenWolf**#5509`;

	expect(responseMessage).toBe(expectedResponse);
});
