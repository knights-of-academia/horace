const db = require('quick.db');
module.exports.execute = async (client, message, args) => {
const bannedWord = args[0];
if(!args[0]) {
  return message.channel.send("Please enter a word to ban!")
}
db.push(`bannedWords-${message.guild.id}`, args[0])
return message.channel.send(`Success! Added ${args[0]} to the blocked word list!`);

};

module.exports.config = {
	name: 'banword',
	aliases: ['blockword'],
	description: 'Bans a specific word.',
	usage: ['banword word']
};
