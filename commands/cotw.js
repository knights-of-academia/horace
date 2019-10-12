
module.exports.execute = async (client, message) => {
	const store = require('data-store')({ path: process.cwd() + '/data/cotw.json'});
	const pollOpen = store.get('pollActive');
	let response = `⚔  Challenge of the Week ⚔\n\n🔸 The current challenge ***${store.get('challengeName')}*** can be found here: https://habitica.com/challenges/${store.get('challengeId')}`;

	if(pollOpen) {
		response += `\n🔸 The poll for next week's challenge can be found here: ${store.get('pollLink')}`;
	}
	return await message.channel.send(response);
};

module.exports.config = {
	name: 'cotw',
	aliases: ['cotw'],
    description: 'TEMPLATE',
    usage: [`TEMPLATE`]
};
