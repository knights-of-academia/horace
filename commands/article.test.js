const article = require('./article.js');
const messageStub = require('../stub/messageStub.js');

test("Sends Correct article message to the channel",async()=>{
    //Arange 
    const message = new messageStub();

    //Act
    const responseMessage = await article.execute(null,message);

    //Assert
    // Assert
	const expectedResponse = 'KOA Articles Page : ' + article.config.latest_article;
	expect(responseMessage).toBe(expectedResponse);



});