const BanWordUtils = require('../utils/banwordUtils.js');
const { Config } = require('../config.js');

module.exports.execute = async (client, message, args) => {
	if (message.member.roles.cache.has(Config.ROLES.GUARDIAN)
  || message.member.roles.cache.has(Config.ROLES.HELPER)) {
		if (!args[0]) {
			message.channel.send('Please enter a word to ban!');
			return;
		}

		const returnMessage = await BanWordUtils.addWordToBannedWordTable(args[0].toLowerCase(), message.member.id);
		message.channel.send(returnMessage);
		return;
	}

	message.reply('Only moderators can run this command!');
};

module.exports.config = {
	name: 'banword',
	aliases: ['blockword'],
	description: 'Bans a specific word.',
	usage: ['banword word'],
};
