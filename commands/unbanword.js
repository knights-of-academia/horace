const { Config } = require('../config.js');
const BanWordUtils = require('../utils/banwordUtils.js');

module.exports.execute = async (client, message, args) => {
	if (message.member.roles.cache.has(Config.ROLES.GUARDIAN)
  || message.member.roles.cache.has(Config.ROLES.HELPER)) {
		if (!args[0]) {
			return message.channel.send('Please enter a word to unban!');
		}

		const removalQueryResult = await BanWordUtils.deleteWord(args[0].toLowerCase());
		return message.channel.send(removalQueryResult);
	}

	return message.reply('Only moderators can run this command!');
};

module.exports.config = {
	name: 'unbanword',
	aliases: ['unblockword'],
	description: 'Unbans a specific word.',
	usage: ['unbanword word'],
};
