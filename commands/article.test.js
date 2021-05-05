const article = require('./article.js');
const messageStub = require('../stub/messageStub.js');

test('Sends correct response with no arguments', async() => {
	const message = new messageStub();
	const responseMessage = await article.execute(null, message);
	const expectedStart = 'Here\'s a random article from KOA titled';
	expect(responseMessage.startsWith(expectedStart)).toBeTruthy();
});

test('Sends correct response when home page is requested', async() => {
	const message = new messageStub();
	const responseMessage = await article.execute(null, message, 'home');
	const expectedStart = 'KOA Article Archive:';
	console.log(responseMessage);
	expect(responseMessage.startsWith(expectedStart)).toBeTruthy();
});

test('Sends correct response when latest article is requested', async() => {
	const message = new messageStub();
	const responseMessage = await article.execute(null, message, 'latest');
	const expectedStart = 'The latest article from KOA is';
	expect(responseMessage.startsWith(expectedStart)).toBeTruthy();
});
