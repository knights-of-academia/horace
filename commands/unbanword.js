const db = require('quick.db');
const config = require('../config.json');
module.exports.execute = async (client, message, args) => {
	if(message.member.roles.has(config.roles.guardian) | message.member.roles.has(config.roles.helper)) {
		if(!args[0]) {
			return message.channel.send('Please enter a word to unban!');
		}
		const currentBannedWords = await db.get(`bannedWords-${message.guild.id}`);
		if(!currentBannedWords.some(word => word == args[0]) ) {
			return message.channel.send('That word isn\'t currently banned!');
		}
		const newBannedWords = currentBannedWords.filter(e => e !== args[0]);
		db.set(`bannedWords-${message.guild.id}`, newBannedWords);
		return message.channel.send(`Success! Unbanned ${args[0]} from the list!`);	
	}
	else {
		message.reply('Only moderators can run this command!');
	}
};

module.exports.config = {
	name: 'unbanword',
	aliases: ['unblockword'],
	description: 'Unbans a specific word.',
	usage: ['unbanword word']
};
