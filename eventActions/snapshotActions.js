const config = require('../config.json');
const Discord = require('discord.js');

class snapshotActions {
	static async userPostsImage(client, message) {
		if (message.channel.id === config.channels.snapshots
            && message.attachments.size === 0) {
			await message.delete();

			await message.author.send(`Hey! I noticed you sent a message in <#${config.channels.snapshots}> that wasn't a picture. To help maintain the integrity of the channel, the staff team has made the decision to only allow pictures, captions and reactions there. As a result of this, your message has been removed. Thanks for understanding! 😄`);

			const embedMessage = new Discord.MessageEmbed()
				.setColor('#ff0000')
				.setTitle('🚩 Warning: Snapshots message 🚩')
				.setDescription(`An unapproved message was sent in <#${config.channels.snapshots}>`)
				.addField('User', message.author, true);

			// Split message into multiple, in case takes up more space than
			// what discordjs allows for a field.
			const messageChunks = message.content.match(/[\s\S]{1,1024}/g);

			for (let chunk of messageChunks) {
				embedMessage.addField('Message', chunk);
			}
			// Send message to moderation log
			client.channels.cache.get(config.channels.moderation).send(embedMessage);
		}
		else if (message.channel.id === config.channels.snapshots) {
			return message.react(config.emotes.heart);
		}
	}
}

module.exports = snapshotActions;
