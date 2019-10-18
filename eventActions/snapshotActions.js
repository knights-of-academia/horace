const config = require('../config.json');
const Discord = require('discord.js');

class snapshotActions {
	static async userPostsImage(client, message) {
		if (message.channel.id === config.channels.snapshots
            && message.attachments.size === 0) {

			// Delete message
			await message.delete();

			// Send warning to author
			await message.author.send(`Hey! I noticed you sent a message in <#${config.channels.snapshots}> that wasn't a picture. To help maintain the integrity of the channel, the staff team has made the decision to only allow pictures, captions and reactions there. As a result of this, your message has been removed. Thanks for understanding! 😄`);

			const embedMessage = new Discord.RichEmbed()
				.setColor('#ff0000')
				.setTitle('🚩 Warning: Snapshots message 🚩')
				.setDescription(`An unapproved message was sent in <#${config.channels.snapshots}>`)
				.addField('User', message.author, true)
				.addField('Message', message.content);
			// Send message to moderation log
			client.channels.get(config.channels.moderation).send(embedMessage);
		}
	}

}

module.exports = snapshotActions;
