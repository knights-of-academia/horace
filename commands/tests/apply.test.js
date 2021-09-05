const apply = require('../apply.js');
const MockMessage = require('../../stub/MockMessage.js');

test('Returns the correct message when no argument is passed', async () => {
	const message = new MockMessage();
	const responseMessage = await apply.execute(null, message, []);
	const expectedResponse = '❌ Please specify the clan or staff position you wish to apply for.';
	expect(responseMessage).toBe(expectedResponse);
});


test('Returns the correct message when an invalid clan is passed', async () => {
	const message = new MockMessage();
	const responseMessage = await apply.execute(null, message, ['Teh', 'Rounde', 'Table']);
	const expectedResponse = `❌ The clan or staff position \`teh rounde table\` couldn\'t be found.
			
			Here is our list of KOA Clans!
				🔸 **The Round Table**: All things Hard Mode
				🔸 **The Fiction Faction**: Creative Writing & Story Telling 
				🔸 **The Gathering**: Accountability 
				🔸 **The Clockwork Knights**: Productivity & Efficiency through the use of Systems
				🔸 **The Silver Tongues**: Language & Culture
				🔸 **The Students**: Academics & all things Education
				🔸 **The Wolf Pack**: On the move for Health
				
			Here is our list of KOA Staff Positions!
				🔸 **Clan Leaders** 
				🔸 **Sector Leaders** 
				🔸 **Web Producers**
				🔸 **Engineers**
				🔸 **Content Crafters**
				🔸 **KOAI Keepers**`;
	expect(responseMessage).toBe(expectedResponse);
});


test('Returns the correct form url when a valid argument is passed', async () => {
	const message = new MockMessage();
	const responseMessage = await apply.execute(null, message, ['The', 'Round', 'Table']);
	const expectedResponse = `✔ **Fill out your user ID to receive an invite!**
*Average Response Time: 24 hours or less*
https://knightsofacademia.org/the-round-table/`;
	expect(responseMessage).toBe(expectedResponse);
});
