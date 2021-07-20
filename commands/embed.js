const Discord = require('discord.js');
const config = require('../config.json');

// module.exports.execute = async (client, message)

class embed {
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
			message.channel.send('Embed creation timed out.');
			return null;
		}
	}

	static async getChannel(message) {
		let answer = await this.ask(message, 'What channel should the embed be posted in?');
		let channelID = answer.replace(/[<|#|>]/g, '');
		let isIDValid = message.guild.channels.cache.some((channel) => channel.id === channelID);
		if (isIDValid == false) {
			throw 'Embed channel was not valid!';
		}
		else {
			return message.guild.channels.cache.find((channel) => channel.id === channelID);
		}
	}

	static async getTitle(message) {
		let answer = await this.ask(message, 'What should the embed title be?');
		if (answer == null) {
			throw 'Embed title was not valid!';
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
			throw 'Embed URL was not valid';
		}
	}

	static async getDescription(message) {
		let answer = await this.ask(message, 'What should the description be?');
		if (answer == null) {
			throw 'Embed description not valid';
		}
		else {
			return answer;
		}
	}

	static async getSubtitle(message) {
		let answer = await this.ask(message, 'What should the subtitle be?');
		if (answer == null) {
			throw 'Embed subtitle not valid';
		}
		else {
			return answer;
		}
	}

	static async getBody(message) {
		let answer = await this.ask(message, 'What should the embed body be?');
		if (answer == null) {
			throw 'Embed body not valid';
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
			throw 'Embed colour hex code was invalid';
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
			throw 'Embed image URL was not valid';
		}
	}

	static async execute(client, message) {
		if (!message.member.roles.cache.has(config.roles.admin) && !config.allowedEmbedCmdUsers.includes(message.member.id)) {
			return message.channel.send('You do not have permission to use this command.');
		}
		message.channel.send('Welcome to Horace Embed Creator!');

		let channel;
		let title;
		let url;
		let description;
		let subtitle;
		let body;
		let colour;
		let imageLink;

		/*
		this.getChannel(message)
			.then((answer) => { channel = answer; })
			.then((result) => { this.getTitle(message, result); })
			.then((answer) => { title = answer; })
			.then((result) => { this.getURL(message, result); })
			.then((answer) => { url = answer; })
			.then((result) => { this.getDescription(message, result); })
			.then((answer) => { description = answer; })
			.then((result) => { this.getSubtitle(message, result); })
			.then((answer) => { subtitle = answer; })
			.then((result) => { this.getBody(message, result); })
			.then((answer) => { body = answer; })
			.then((result) => { this.getColour(message, result); })
			.then((answer) => { colour = answer; })
			.then((result) => { this.getImage(message, result); })
			.then((answer) => { imageLink = answer; })
			.then((result) => {
				const embedMessage = new Discord.MessageEmbed()
					.setColor(colour)
					.setTitle(title)
					.setThumbnail(imageLink)
					.setURL(url)
					.setAuthor(message.author.username, 'https://cdn.discordapp.com/avatars/' + message.author.id + '/' + message.author.avatar + '.webp?size=128')
					.setDescription(description)
					.addField(subtitle, body)
					.setTimestamp();

				channel.send(embedMessage);
			})
			.catch((err) => console.log(err));
			*/

		try {
			channel = await this.getChannel(message);
			title = await this.getTitle(message);
			url = await this.getURL(message);
			description = await this.getDescription(message);
			subtitle = await this.getSubtitle(message);
			body = await this.getBody(message);
			colour = await this.getColour(message);
			imageLink = await this.getImage(message);
			const embedMessage = new Discord.MessageEmbed()
				.setColor(colour)
				.setTitle(title)
				.setThumbnail(imageLink)
				.setURL(url)
				.setAuthor(message.author.username, 'https://cdn.discordapp.com/avatars/' + message.author.id + '/' + message.author.avatar + '.webp?size=128')
				.setDescription(description)
				.addField(subtitle, body)
				.setTimestamp();
			channel.send(embedMessage);
		}
		catch (err) {
			console.log(err);
			return message.channel.send(err);
		}
	}
}

module.exports = embed;

module.exports.config = {
	name: 'embed',
	aliases: ['createEmbed'],
	description: 'Create an embed (admins only)',
	usage: ['embed <header> <body>'],
};
