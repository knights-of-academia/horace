module.exports.execute = async (client, message) => message.channel.send(`To submit a feature, simply click on the link below and submit a request. Our Engineering Team will sort through these requests and once approved, build them in the following Horace update/patch. If you know Javascript or want to learn, feel free to submit a Pull Request!
  https://github.com/Knights-Of-Academia/horace/issues
  *Note: you do need to sign up for a Github account to do this*`);

module.exports.config = {
  name: 'contribute',
  aliases: ['contribute', 'github'],
  description: 'Want to contribute to Horace? Find out how!',
  usage: ['contribute'],
};
