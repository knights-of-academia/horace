const { Config } = require('../config.js');
const fs = require('fs');

class cotwActions {
	static async confirmUpdate(message) {
		let path = process.cwd() + '/data/cotw.json';
		const stats = fs.statSync(path);
		let mtime = stats.mtime;
		let lastModified = new Date(mtime);
		let currentDate = new Date();
		let diff = currentDate.getTime() - lastModified.getTime();
		let minute = 1000 * 60;
		if (diff <= minute) {
			return await message.react(Config.EMOTES.YES2);
		}
		else {
			return null;
		}
	}

	static async updateCotw(client, message) {
		if (message.channel.id === Config.CHANNELS.COTW
			&& message.member.roles.cache.has(Config.ROLES.COTW_MANAGER)) {
			const store = require('data-store')({
				path: process.cwd() + '/data/cotw.json'
			});

			if (message.content.toLowerCase().includes('congratulations')
				&& message.mentions.members) {
				const winner = message.mentions.members.first();
				const cotwRole = message.guild.roles.cache.get(Config.ROLES.COTW_CHAMPION);

				// Remove role from all previous winners
				message.guild.members.cache.each(async (member) => {
					if (member.roles.cache.has(cotwRole.id)) {
						await member.roles.remove(cotwRole);
					}
				});

				const emote = Config.EMOTES.CONGRATS;
				try {
					await winner.roles.add(cotwRole),
					Promise.all([
						message.react(emote),
						message.channel.send(`Congratulations <@${winner.id}>!`)
					]);
				}
				catch (err) {
					console.log(err);
				}
			}

			// If message contains link to a new poll, update it in store and send message to confirm the action.
			if (message.content.includes('https://forms.gle')) {
				const messageContent = message.content.split(/[\s\n]+/);
				let link;
				messageContent.map((x) => {
					if (x.includes('https://forms.gle')) {
						link = x;
					}
				});
				store.set('pollActive', true);
				store.set('pollLink', link);
				const emote = Config.EMOTES.ACCEPT_TOS;
				await message.react(emote);
				return;
			}

			// If message contains link to a new challenge, update it in store.
			if (message.content.includes('https://habitica.com/challenges/')) {
				store.set('pollActive', false);
				const Habitica = require('habitica');
				const api = new Habitica({
					id: Config.HABITICA.ID,
					apiToken: Config.HABITICA.TOKEN
				});
				const messageContent = message.content.split(/[\s\n]+/);

				let challengeId;
				messageContent.map((x) => {
					if (x.includes('https://habitica.com/challenges/')) {
						challengeId = x.split('/challenges/')[1];
					}
				});
				store.set('challengeId', challengeId);

				const apiResponse = await api.get(`/challenges/${challengeId}`);
				let challengeName = apiResponse.data.name;
				challengeName = challengeName.replace('Challenge of the Week: ', '');
				store.set('challengeName', challengeName);
				const emote = Config.EMOTES.COTW_REFLECTION;
				await message.react(emote);

				let check = await this.confirmUpdate(message);
				if (check == null) {
					await message.react(Config.EMOTES.NO);
					return await message.channel.send(
						'An error occured and the COTW was not updated.'
					);
				}
				else {
					return await message.channel.send(
						`The COTW has been updated to **${challengeName}**.`
					);
				}
			}
		}
	}
}

module.exports = cotwActions;
