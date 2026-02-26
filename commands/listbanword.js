const Discord = require('discord.js');
const BanWordUtils = require('../utils/banwordUtils.js');

module.exports.execute = async (client, message) => {
	const bannedWords = await BanWordUtils.getBannedWordsAndAuthors();
	const embedMessage = new Discord.MessageEmbed()
		.setColor('#ffff00')
		.setTitle('🚩Banned Words 🚩')
		.setDescription('Here is the list of the banned words: ');

	for (const element of bannedWords) {
		const user = client.users.cache.get(element.userID);
		const username = user ? user.username : 'Unknown User';
		embedMessage.addFields({ name: `${element.word}`, value: `added by ${username}` });
	}

	embedMessage.setFooter({ text: 'To ban more words use the !banword <word> command and to unban words use the !unbanword <word> command.' });

	const sourceMember = await message.member;
	return sourceMember.send({ embeds: [embedMessage] });
};

module.exports.config = {
	name: 'listbanword',
	aliases: ['listblockword'],
	description: 'Lists banned words and their authors.',
	usage: ['listbanword'],
};
