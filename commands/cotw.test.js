const cotw = require('./cotw.js');
const messageStub = require('../stub/messageStub');

const store = require('data-store')({ path: `${process.cwd()}/data/cotw.json` });

test('Returns the correct response when the poll is open', async () => {
  // Arrange
  const message = new messageStub();

  // Act
  const responseMessage = await cotw.execute(null, message);

  // Assert
  const expectedResponse = `⚔  Challenge of the Week ⚔\n\n🔸 The current challenge ***${store.get('challengeName')}*** can be found here: https://habitica.com/challenges/${store.get('challengeId')}\n🔸 The poll for next week's challenge can be found here: ${store.get('pollLink')}`;
  expect(responseMessage).toBe(expectedResponse);
});
