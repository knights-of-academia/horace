// Get the afk Table stored in the SQLite database
const Afks = require('../databaseFiles/afkTable.js');
const Discord = require('discord.js');
const config = require('../config.json');


module.exports.execute = async (client, message, args) => {
    const noLongerAFKMessage = new Discord.RichEmbed()
        .setTitle(`You are currently AFK, ${message.member.nickname}`)
        .addField('Are you back?', 'Then react with ✅. Otherwise react with ❌ or leave this message.')
        .setColor('#FFEC09')
    const afkMessage = args.length > 0 ? args.join(' ') : 'They didn\'t tell us where they went...';
	const user = message.author.id;   
    Afks.sync()

	await Afks.create({
		message: afkMessage,
		user: user
    }).then(() => {
        message.channel.send('I have marked you as AFK. Safe travels!').then(msg => msg.delete(5000))
    }).catch(err => {
        if (err.name == 'SequelizeUniqueConstraintError') {
            message.channel.send(noLongerAFKMessage).then(msg => {
                msg.react('✅');
                msg.react('❌');
                msg.delete(15000)
            });
            return;
        }
        console.error('Afk sequelize error: ', err);
    });
};

module.exports.config = {
	name: 'afk',
	aliases: ['afk', 'away'],
	description: 'I will mark you as being away. When people tag you, they will be notified that you are not present.',
	usage: ['afk message']
};