const config = require('../config.json');

class bookmarkActions {

    static async bookmarkMessage(client, reaction, message) {
        if (reaction._emoji.name === config.emotes.bookmark) {
            console.log('bookmark emoji detected')
            reaction.message.guild.fetchMember(message.author.id).then(guildMember => {
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

module.exports = bookmarkActions;
