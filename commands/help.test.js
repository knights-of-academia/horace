const help = require('./help.js');
const messageStup = require('../stub/messageStub');

test('Sends default help message when no argument is provided', async () => {
	const messsage = new messageStup();

	const responseMessage = help.execute(null, messsage, null);

	const expectedResponse = 'I have sent you a private message with the command list';
	expect(responseMessage).toContain(expectedResponse);
});