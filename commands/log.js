const fs = require('fs');
const Discord = require('discord.js');
const config = require('../config.json');

const Participants = require('../databaseFiles/cowtParticipantTable.js');

const helper = require('../helper/logHelper');
const habHelper = require('../helper/habiticaHelper');

const Habitica = require('habitica');
const api = new Habitica({
    id: config.habitica.id,
    apiToken: config.habitica.token
});

let prefix;
if (fs.existsSync('../config.json')) {
	prefix = require('../config.json');
} else {
	prefix = '!';
}

module.exports.execute = async (client, message, args) => {
    if (message.channel.id === config.channels.cotw) {
        checker = str => str.toLowerCase().includes('i vow to');
    } else{
        return await message.channel.send(`${prefix}log is only avaliable in <#${config.channels.cotw}>`);
    }

    if (!args || args.length === 0) {// default case: no args: return the author's record
        logs = await helper.fetchMessageWith(checker, message, message.author.id, config.channels.cotw);

        return await message.channel.send(`Hey, ${message.author.username}, you have vowed in ${logs.length} challenge of the week.
    If you want the details of your vows, send ${prefix}log details`);

    } else if (args.length === 1 && args[0].toLowerCase() === 'details'){// DM the vows and time of vows to the user
        logs = await helper.fetchMessageWith(checker, message, message.author.id, config.channels.cotw);
        if (logs.length != 0) {// have vows: send a private message of all vows
            // TODO: ensure the message does not exceed character limit
            let embedArray = helper.splitArray(logs.sort((a,b)=>a.createdAt-b.createdAt),25);
            embedArray.forEach(arr=>{
                let vowLogMessage = new Discord.RichEmbed()
                    .setColor('#442477') // color of habitical logo
                    .setTitle('Your vows')
                    .setDescription(`Below are the vows you made for COTW.`);
                
                arr.forEach(log => {
                    vowLogMessage.addField(`**In ${log.createdAt.toDateString()}**`, `${log.content}`);
                });

                message.author.send(vowLogMessage).catch(err => console.error(err) );

            });

            return await message.channel.send('I have sent you private message(s) with all the vows you made.')
                .catch(err => console.error(err) );
        } else {// no log:
            return await message.channel.send('Sorry, I cannot find any of your vows.').catch(err => {
                console.error(err);
            });
        }

    }else {// case that mentions one or more users
        let mentionedUsers = message.mentions.users;
        if (mentionedUsers.size == 0){
            return await message.channel.send(`I don't know what you means. The allowed command for log are ${prefix}log, ${prefix}log details or ${prefix}log @<username>`);
        } else{
            mentionedUsers.forEach(user=>{
                helper.fetchMessageWith(checker, message, user.id, config.channels.cotw).then(logs =>{
                    message.channel.send(`Hey, ${message.author.username}, ${user.username} have vowed in ${logs.length} challenge of the week.`);
                }).catch(err=>console.log(err) );
            });
            return;
        }

    }
	
};

module.exports.config = {
	name: 'log',
	aliases: ['log'],
	description: 'I will tell you how many times a user participates in the challenge of the week.',
	usage: ['log', 'log @user', 'log details'],
};

