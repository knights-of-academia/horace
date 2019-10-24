const config = require('../config.json');

module.exports = async (client, message) => {
	if (!message.guild || message.author.bot) return;
	const args = message.content.split(/\s+/g); // Return the message content and split the prefix.
	const command =
    message.content.startsWith(config.prefix) &&
    args.shift().slice(config.prefix.length).toLowerCase();

	if (command) {
		const commandfile =
      client.commands.get(command) ||
      client.commands.get(client.aliases.get(command));

		if (commandfile) commandfile.execute(client, message, args); // Execute found command
	}
	// Handle good morning and goodnight
	if (config.channels.citadel) {
		if (message.channel.id === config.channels.citadel) {
			if (/g+oo+d+\s+m+o+r+n+i+n+g([\s,]+.+)?/mi.test(message.content)) {
				return await message.react('🌞');
			} else if (/g+oo+d+\s+n+i+g+h+t+([\s,]+.+)?/mi.test(message.content)) {
				return await message.react('🌜');
			}
		}
	}
	// Handle COTW case
	if (
		message.channel.id === config.cotw.channel &&
    message.member.roles.has(config.cotw.managerrole)
	) {
		const store = require('data-store')({
			path: process.cwd() + '/data/cotw.json'
		});

		if (
			message.content.toLowerCase().includes('congratulations') &&
      message.mentions.members
		) {
			const winner = message.mentions.members.first();
			const cotwRole = message.guild.roles.find(
				role => role.id === config.cotw.role
			);
			winner.addRole(cotwRole);
			return message.channel.send('Success!');
		}

		// If message contains link to a new poll, update it in store.
		if (message.content.includes('https://forms.gle')) {
			const messageContent = message.content.split(' ');
			let link;
			messageContent.map(x => {
				if (x.includes('https://forms.gle')) {
					link = x;
				}
			});
			store.set('pollActive', true), store.set('pollLink', link);
			return;
		}

		// If message contains link to a new challenge, update it in store.
		if (message.content.includes('https://habitica.com/challenges/')) {
			store.set('pollActive', false);
			const Habitica = require('habitica');
			const api = new Habitica({
				id: config.habitica.id,
				apiToken: config.habitica.token
			});
			const messageContent = message.content.split(' ');

			let challengeId;
			messageContent.map(x => {
				if (x.includes('https://habitica.com/challenges/')) {
					challengeId = x.split('/challenges/')[1];
				}
			});
			console.log(challengeId);
			store.set('challengeId', challengeId);
			const challengeName = await api
				.get(`/challenges/${challengeId}`)
				.then(res => {
					const challengeName = res.data.name;
					return challengeName.replace('Challenge of the Week: ', '');
				});
			store.set('challengeName', challengeName);
			return message.channel.send(
				`The COTW has been updated to ${challengeName}.`
			);
		}
	}
};
