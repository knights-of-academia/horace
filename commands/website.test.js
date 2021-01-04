const website = require('./website.js');
const messageStub = require('../stub/messageStub');

test('Sends a correct message with a URL to the channel', async () => {
  // Arrange
  const message = new messageStub();

  // Act
  const responseMessage = await website.execute(null, message);

  // Assert
  const expectedResponse = '⚔️ https://knightsofacademia.org/ ⚔️';
  expect(responseMessage).toBe(expectedResponse);
});
