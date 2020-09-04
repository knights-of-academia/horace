const fs = require('fs');
const Discord = require('discord.js');
const config = require('../config.json');
const { fetchMessageWith, splitArray } = require('../utils/utils');

let prefix;
if (fs.existsSync('../config.json')) {
	prefix = require('../config.json');
} else {
	prefix = '!';
}

module.exports.execute = async (client, message, args) => {
    const checker = str => str.toLowerCase().includes('i vow to');
    if (!args || args.length === 0) {// default case: no args: return the author's record 
        logs = await fetchMessageWith(checker, message, message.author.id, config.channels.cotw);

        return message.channel.send(`Hey, ${message.author.username}, you have vowed in ${logs.length} challenge of the week.
            If you want the details of your vows, send ${prefix}cotwlog details`);

    } else if (args.length === 1 && args[0].toLowerCase() === 'details'){// send a detailed log of the messages
        logs = await fetchMessageWith(checker, message, message.author.id, config.channels.cotw);
        if (logs.length != 0) {// have vows: send a private message of all vows
            let embedArray = splitArray(logs.sort((a,b)=>a.createdAt-b.createdAt),25);
            embedArray.forEach(arr=>{
                let vowLogMessage = new Discord.RichEmbed()
                    .setColor('#442477') // color of habitical logo
                    .setTitle('Your vows') // TODO: let the embed be different when there are multiples.
                    .setDescription(`Below are the vows you made for COTW.`);
                
                    arr.forEach(log => {// v12: each.log=>
                        vowLogMessage.addField(`**In ${log.createdAt.toDateString()}**`, `${log.content}`);
                    });
                try {
                    message.author.send(vowLogMessage);
                }
                catch(err) {
                    console.log(err);
                }

            });

            return message.channel.send('I have sent you private message(s) with all the vows you made.')
                .catch(err => console.error(err) );
        } else {// no log:
            return message.channel.send('Sorry, I cannot find any of your vows.').catch(err => {
                console.error(err);
            });
        }

    }else {// case that mentions one or more users
        let mentionedUsers = message.mentions.users;
        if (mentionedUsers.size == 0){
            return message.channel.send(`I don't know what you means. The allowed command for cowtlog are ${prefix}cowtlog, ${prefix}cowtlog details or ${prefix} @<username>`);
        } else{
            mentionedUsers.forEach(user=>{
                fetchMessageWith(checker, message, user.id, config.channels.cotw).then(logs =>{
                    message.channel.send(`Hey, ${message.author.username}, ${user.username} have vowed in ${logs.length} challenge of the week.`);
                });
            });
            return;
        }

    }
	
};

module.exports.config = {
	name: 'cotwlog',
	aliases: ['cotwlog'],
	description: 'I will tell you how many times a user participates in the challenge of the week.',
	usage: ['cotwlog', 'cotwlog @user', 'cotwlog details'],
};

