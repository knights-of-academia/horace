const Discord = require('discord.js');
const config = require('../config.json');

module.exports.execute = async (client, message) => {
	const filter = (m) => m.author.id === message.author.id;

	async function ask(question) {
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

	async function getChannel() {
		let answer = await ask('What channel should the embed be posted in?');
		let channelID = answer.replace(/[<|#|>]/g, '');
		let isIDValid = message.guild.channels.cache.some((channel) => channel.id === channelID);
		if (isIDValid == false) {
			throw 'Embed channel was not valid!';
		}
		else {
			return message.guild.channels.cache.find((channel) => channel.id === channelID);
		}
	}

	async function getTitle() {
		let answer = await ask('What should the embed title be?');
		if (answer == null) {
			throw 'Embed title was not valid!';
		}
		else {
			return answer;
		}
	}

	async function getURL() {
		let answer = await ask('What URL should the title be hyperlinked to? (Reply with No to skip)');
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

	async function getDescription() {
		let answer = await ask('What should the description be?');
		if (answer == null) {
			throw 'Embed description not valid';
		}
		else {
			return answer;
		}
	}

	async function getSubtitle() {
		let answer = await ask('What should the subtitle be?');
		if (answer == null) {
			throw 'Embed subtitle not valid';
		}
		else {
			return answer;
		}
	}

	async function getBody() {
		let answer = await ask('What should the embed body be?');
		if (answer == null) {
			throw 'Embed body not valid';
		}
		else {
			return answer;
		}
	}

	async function getColour() {
		let answer = await ask('What should the embed colour be? (Hex code)');
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

	async function getImage() {
		let answer = await ask('What image should the title be hyperlinked to? (Reply with No to skip)');
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

	if (!message.member.roles.cache.has(config.roles.admin)) {
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

	getChannel()
		.then((answer) => { channel = answer; })
		.then(getTitle)
		.then((answer) => { title = answer; })
		.then(getURL)
		.then((answer) => { url = answer; })
		.then(getDescription)
		.then((answer) => { description = answer; })
		.then(getSubtitle)
		.then((answer) => { subtitle = answer; })
		.then(getBody)
		.then((answer) => { body = answer; })
		.then(getColour)
		.then((answer) => { colour = answer; })
		.then(getImage)
		.then((answer) => { imageLink = answer; })
		.then(() => {
			const embed = new Discord.MessageEmbed()
				.setColor(colour)
				.setTitle(title)
				.setThumbnail(imageLink)
				.setURL(url)
				.setAuthor(message.author.username, 'https://cdn.discordapp.com/avatars/' + message.author.id + '/' + message.author.avatar + '.webp?size=128')
				.setDescription(description)
				.addField(subtitle, body)
				.setTimestamp();

			channel.send(embed);
		})
		.catch((err) => console.log(err));
};

module.exports.config = {
	name: 'embed',
	aliases: ['createEmbed'],
	description: 'Create an embed (admins only)',
	usage: ['embed <header> <body>'],
};
