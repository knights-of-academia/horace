const article = require('./article.js');
const messageStub = require('../stub/messageStub.js');

test("Sends Correct article message to the channel",async()=>{
    //Arange 
    const message = new messageStub();

    //Act
    const responseMessage = await article.execute(null,message);

    // Assert
    const expectedResponse = 'KOA Articles Page : https://knightsofacademia.org/category/articles/';
    expect(responseMessage).toBe(expectedResponse);
});
