const Discord = require('discord.js');
const { Config } = require('../config.js');
const errors = require('../helpers/embedErrors.js');

class Embed {
	static async ask(message, question) {
		const filter = (m) => m.author.id === message.author.id;
		await message.channel.send(question);
		let collected = await message.channel.awaitMessages(filter, {
			max: 1,
			time: 20000
		});
		if (collected.first() !== undefined) {
			return collected.first().content;
		}
		else {
			await message.channel.send('Embed creation timed out.');
			return null;
		}
	}

	static async getChannel(message) {
		let answer = await this.ask(message, 'What channel should the embed be posted in?');
		let channelID = answer.replace(/[<|#|>]/g, '');
		let isIDValid = message.guild.channels.cache.some((channel) => channel.id === channelID);
		if (isIDValid == false) {
			throw new errors.EmbedInputErr('Embed channel not valid!');
		}
		else {
			return message.guild.channels.cache.find((channel) => channel.id === channelID);
		}
	}

	static async getTitle(message) {
		let answer = await this.ask(message, 'What should the embed title be?');
		if (answer == null) {
			throw new errors.EmbedInputErr('Embed title not valid!');
		}
		else {
			return answer;
		}
	}

	static async getURL(message) {
		let answer = await this.ask(message, 'What URL should the title be hyperlinked to? (Reply with No to skip)');
		let valid = true;
		if (answer == 'No') {
			answer = '';
		}
		else {
			try {
				new URL(answer);
			} catch (_) {
				valid = false;
			}
		}
		if (valid) {
			return answer;
		}
		else {
			throw new errors.EmbedInputErr('Embed URL not valid!');
		}
	}

	static async getDescription(message) {
		let answer = await this.ask(message, 'What should the description be?');
		if (answer == null) {
			throw new errors.EmbedInputErr('Embed description not valid!');
		}
		else {
			return answer;
		}
	}

	static async getSubtitle(message) {
		let answer = await this.ask(message, 'What should the subtitle be?');
		if (answer == null) {
			throw new errors.EmbedInputErr('Embed subtitle not valid!');
		}
		else {
			return answer;
		}
	}

	static async getBody(message) {
		let answer = await this.ask(message, 'What should the embed body be?');
		if (answer == null) {
			throw new errors.EmbedInputErr('Embed body not valid!');
		}
		else {
			return answer;
		}
	}

	static async getColour(message) {
		let answer = await this.ask(message, 'What should the embed colour be? (Hex code)');
		let valid;
		let pattern = new RegExp('^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$');
		valid = pattern.test(answer);
		if (valid) {
			return answer;
		}
		else {
			throw new errors.EmbedInputErr('Embed colour hex code not valid!');
		}
	}

	static async getImage(message) {
		let answer = await this.ask(message, 'What image should the title be hyperlinked to? (Reply with No to skip)');
		let valid = true;
		if (answer == 'No') {
			answer = '';
		}
		else {
			try {
				new URL(answer);
			} catch (_) {
				valid = false;
			}
		}
		if (valid) {
			return answer;
		}
		else {
			throw new errors.EmbedInputErr('Embed image URL not valid!');
		}
	}

	static async execute(client, message) {
		if (!message.member.roles.cache.has(Config.ROLES.ADMIN) && !Config.ALLOWED_EMBED_USERS.includes(message.member.id)) {
			return message.channel.send('You do not have permission to use this command.');
		}
		await message.channel.send('Welcome to Horace Embed Creator!');

		let embedMessage;

		try {
			let channel = await this.getChannel(message);
			let title = await this.getTitle(message);
			let url = await this.getURL(message);
			let description = await this.getDescription(message);
			let subtitle = await this.getSubtitle(message);
			let body = await this.getBody(message);
			let colour = await this.getColour(message);
			let imageLink = await this.getImage(message);
			embedMessage = new Discord.MessageEmbed()
				.setColor(colour)
				.setTitle(title)
				.setThumbnail(imageLink)
				.setURL(url)
				.setAuthor(message.author.username, 'https://cdn.discordapp.com/avatars/' + message.author.id + '/' + message.author.avatar + '.webp?size=128')
				.setDescription(description)
				.addField(subtitle, body)
				.setTimestamp();
			await channel.send({ embeds: [embedMessage] });
			await message.channel.send('Your embed was sent!');
		}
		catch (err) {
			if (err instanceof errors.EmbedInputErr) {
				console.log(err.errMsg);
				return message.channel.send(err.errMsg);
			}
		}
		return embedMessage;
	}
}

module.exports = Embed;

module.exports.config = {
	name: 'embed',
	aliases: ['createEmbed'],
	description: 'Create an embed (admins only)',
	usage: ['embed <header> <body>'],
};
