const config = require('../config.json');

class bookmarkAction {

    static async bookmarkMessage(client, reaction) {
        if (reaction._emoji.name === config.emotes.bookmark) {
            console.log('bookmark emoji detected')
            reaction.message.guild.fetchMember(user.id).then(guildMember => {
                const bookmarkEmbed = new Discord.RichEmbed()
                    .setColor('#0F9BF1')
                    .setTitle('Knights of Academia Bookmark')
                    .setDescription('You asked to bookmark this post from the Knights of Academia server.')
                    .addField('Channel', message.channel)
                    .addField('Author', message.author)
            });

                console.log('embed created')

                guildMember.send(embedMessage);

                console.log('message sent')
            }
        }
}
