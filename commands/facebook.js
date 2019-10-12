module.exports.execute = async (client, message) => {
	return await message.channel.send(
		'KOA Facebook Group : https://www.facebook.com/groups/1895927804047033/',
	);
};

module.exports.config = {
	name: 'facebook',
	aliases: ['facebook', 'fb'],
    description: 'TEMPLATE',
    usage: [`${prefix}TEMPLATE`]
};
