module.exports.execute = async (client, message) => {
	const store = require('data-store')({ path: process.cwd() + '/data/cotw.json' });
	const pollActive = store.get('pollActive');
	const pollLink = store.get('pollLink');
	const challengeId = store.get('challengeId');
	const challengeName = store.get('challengeName');

	let response = '';

	if (challengeId != undefined && challengeName != undefined) {
		response += `⚔  Challenge of the Week ⚔\n\n🔸 The current challenge, **${challengeName}**, can be found here: https://habitica.com/challenges/${challengeId}`;
	}

	if (pollActive && pollLink != undefined) {
		response += `\n🔸 The poll for next week's challenge can be found here: ${pollLink}`;
	}

	if (!response.length) {
		response = 'Could not get the current Challenge of the Week.';
	}

	return await message.channel.send(response);
};

module.exports.config = {
	name: 'cotw',
	aliases: ['cotw'],
	description: 'I will tell you what the challenge of the week is.',
	usage: ['cotw']
};
