const article = require('./article.js');
const messageStub = require('../stub/messageStub.js');

test('Sends Correct article message to the channel' ,async()=>{
	const message = new messageStub();

	const responseMessage = await article.execute(null,message);

	const expectedResponse = 'KOA Articles Page : ' + article.config.latest_article;
	expect(responseMessage).toBe(expectedResponse);
	expect(true).toBe(true);
});