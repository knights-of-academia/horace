const config = require('../config.json');

class bookmarkAction {

    static async bookmarkMessage(client, reaction) {
        if (reaction._emoji.name === config.emotes.bookmark) {
            reaction.message.guild.fetchMember(user.id).then(guildMember => {
                const bookmarkEmbed = new Discord.RichEmbed()
                    .setColor('#0F9BF1')
                    .setTitle('Knights of Academia Bookmark')
                    .setDescription('You asked to bookmark this post from the Knights of Academia server.')
                    .addField('Channel', message.channel)
                    .addField('Author', message.author)
                // Doing the same thing as profanityActions here, but with a reaction rather than bad words

                const messageChunk = message.content.match(/[\s\S]{1,1024}/g);

                for (let chunk of messageChunks) {
                    embedMessage.addField('Message', chunk);
                }
                guildMember.send(embedMessage);
            }
        }
    }

}
