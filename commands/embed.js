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

	async function getTitle() {
		let answer = ask('What should the embed title be?');
		if (answer == null) {
			throw 'Embed title was null!';
		}
	}

	async function getURL() {
		let answer = ask('What URL should the title be hyperlinked to? (Reply with No to skip)');
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
	}

	if (!message.member.roles.cache.has(config.roles.admin)) {
		return message.channel.send('You do not have permission to use this command.');
	}
	message.channel.send('Welcome to Horace Embed Creator!');

	let title;
	let url;

	title = getTitle()
		.then(
			getURL()
		)
		.then (

		)

/* 	let answers = [];
	let questions = [
		'What should the embed title be?',
		'What URL should the title be hyperlinked to? (Reply with No to skip)',
		'What should the description be?',
		'What should the subtitle be?',
		'What should the body be?',
		'What should the embed colour be? (Hex code)',
		'What image (provide link) should the embed have? (Reply with No to skip'
	];

	for (const question of questions) {
		console.log(question);
		let answer = await ask(question);
		let valid;
		if (answer == null) {
			return;
		}
		else if (question == questions[1] || question == questions[6]) {
			valid = true;
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
		}
		else if (question == questions[5]) {
			let pattern = new RegExp('^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$');
			valid = pattern.test(answer);
		}
		else {
			valid = true;
		}

		if (valid) {
			answers.push(answer);
		}
		else {
			return message.channel.send('**There was an error in your response. Embed creation canceled.**');
		}
	} */

	const embed = new Discord.MessageEmbed()
		.setColor(answers[5])
		.setTitle(answers[0])
		.setThumbnail(answers[6])
		.setURL(answers[1])
		.setAuthor(message.author.username, 'https://cdn.discordapp.com/avatars/' + message.author.id + '/' + message.author.avatar + '.webp?size=128')
		.setDescription(answers[2])
		.addField(answers[3], answers[4])
		.setTimestamp();

	message.channel.send(embed);
};

module.exports.config = {
	name: 'embed',
	aliases: ['createEmbed'],
	description: 'Create an embed (admins only)',
	usage: ['embed <header> <body>'],
};
