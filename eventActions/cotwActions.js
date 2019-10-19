const config = require('../config.json');

class cotwActions {

	static async reactToVowAndReflections(client, message) {
		// React to vow
		if (message.channel.id === config.channels.cotw
			&& message.content.toLowerCase().includes('i vow to')) {
			const emote = config.emotes.cotwVow;
			message.react(emote);
		}

		// React to reflection
		if (message.channel.id === config.channels.cotw
			&& message.content.toLowerCase().includes('reflection')) {
			const emote = config.emotes.cotwReflection;
			message.react(emote);
		}
	}
	static async updateCotw(client, message) {
		if (message.channel.id === config.channels.cotw
			&& message.member.roles.has(config.roles.cotwManager)) {
			const store = require('data-store')({
				path: process.cwd() + '/data/cotw.json'
			});

			if (message.content.toLowerCase().includes('congratulations')
				&& message.mentions.members) {
				const winner = message.mentions.members.first();
				const cotwRole = message.guild.roles.find(role => role.id === config.roles.cotwChampion
				);

				// Remove role from all previous winners
				message.guild.members.forEach(member => {
					if (!member.roles.find(t => t.id === cotwRole.id)) return;
					member.removeRole(cotwRole.id);
				});

				winner.addRole(cotwRole);
				return message.channel.send(`Congratulations <@${winner.id}>!`);
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
	}
}

module.exports = cotwActions;
