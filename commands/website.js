module.exports.execute = async (client, message) => message.channel.send('⚔️ https://knightsofacademia.org/ ⚔️');

module.exports.config = {
  name: 'website',
  aliases: ['website', 'koa'],
  description: 'I will fetch you the link for our website.',
  usage: ['website'],
};
