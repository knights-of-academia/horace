const config = require('../config.json');
const fs = require('fs');

class cotwActions {
	
	static async reactToVowAndReflections(client, message) {
		// React to vow
		if (message.channel.id === config.channels.cotw
			&& message.content.toLowerCase().includes('i vow to')) {
				const emote = config.emotes.cotwVow;
				message.react(emote);
			}
			
			// React to reflection
			if (message.channel.id === config.channels.cotw) {
				let arrayMatching = message.content.toLowerCase().replace(/  +/g, ' ').split(' ').slice(0, config.reflectionCheckDepth);
				if (arrayMatching.some(str => {
					return str.includes('reflection');
				})) {
					const emote = config.emotes.cotwReflection;
					message.react(emote);
				}
			}
		}
	static async updateCotw(client, message) {
		if (message.channel.id === config.channels.cotw
			&& message.member.roles.cache.some(role => role.id === config.roles.cotwManager)) {
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
				const emote = config.emotes.congrats;
				message.react(emote);
				return message.channel.send(`Congratulations <@${winner.id}>!`);
			}

			// If message contains link to a new poll, update it in store and send message to confirm the action.
			if (message.content.includes('https://forms.gle')) {
				const messageContent = message.content.split(' ');
				let link;
				messageContent.map(x => {
					if (x.includes('https://forms.gle')) {
						link = x;
					}
				});
				store.set('pollActive', true), store.set('pollLink', link);
				const emote = config.emotes.acceptTOS;
				message.react(emote);
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
				const emote = config.emotes.cotwReflection;
				message.react(emote);
				let check = await confirmUpdate(message)
				console.log("eeeeeee")
				console.log(check)
				if (check == null) {
					message.react(config.emotes.no)
					return message.channel.send(
						`An error occured and the COTW was not updated.`
					);
				}
				else {
					return message.channel.send(
						`The COTW has been updated to ${challengeName}.`
					);
				}
			}
			async function confirmUpdate(message) {
				let path = process.cwd() + '/data/cotw.json'
				const stats = fs.statSync(path)
				let mtime = stats.mtime
				let lastModified = new Date(mtime)
				console.log(lastModified)
				let currentDate = new Date()
				console.log(currentDate)
				let diff = currentDate.getTime() - lastModified.getTime()
				let minute = 1000 * 60
				if (diff <= minute) {
					return message.react(config.emotes.yes2)
				}
				else {
					return null
				}
			}
		}
	}
}

module.exports = cotwActions;
