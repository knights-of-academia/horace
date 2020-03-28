const contribute = require('./contribute.js');
const messageStub = require('../stub/messageStub');

test('Sends correct contribute message to channel', async () => {
    const message = new messageStub();

    const responseMessage = await contribute.execute(message);

    const expectedResponse = new Discord.RichEmbed()
        .setColor('#3486eb')
        .setTitle('Wanna contribute to Horace?')
        .addField('Come checkout my Github!', 'https://github.com/Knights-Of-Academia/horace')
        .addField('How to help', 'Contribute code or report issues, anything helps!')
        .setFooter(`Requested by ${message.author.username}`)

    expect(responseMessage).toBe(expectedResponse);
});