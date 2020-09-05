const fs = require('fs');
const Habiticas = require('../databaseFiles/habiticaTable.js');
const Discord = require('discord.js');
const config = require('../config.json');
const memberAPI = 'https://habitica.com/api/v3/members/'; // url used to fetch habitica user profile
const Habitica = require('habitica');
const api = new Habitica({
    id: config.habitica.id,
    apiToken: config.habitica.token
});

// create habitica table
let prefix;
if (fs.existsSync('../config.json')) {
	prefix = require('../config.json');
} else {
	prefix = '!';
}

module.exports.execute = async (client, message,args) => {
    if (!args || args.length === 0 || args[0] == 'help') {// default case: send a help messsage 
        sendHabitacaHelp(message.author);
        message.channel.send(`I have send you a private message of what you can do with ${prefix}habitica`).catch(err => {
            console.error(err);
        }); 
    
    } else {
        switch (args[0]) {
            case 'set':
            case 'link':
                if (args.length === 2) {
                    return setHabiticaProfile(message.author.id, args[1],message);
                } else {
                    return message.channel.send(`I need your habitica ID to link your discord id to your habitica account.`);
                }
            case 'remove':
                return removeHabiticaProfile(message);
            case 'find':
                if (args.length === 2) {
                    message.channel.send(`find function is still under construction!`)
                    return findUser(args[1]);
                }else {
                    return message.channel.send(`I need either an habitica ID or habitica user name to find the corresponding user.`);
                }
            case 'me':
                return sendProfile(message.author,message);
            default:
                let id = getIDFromMention(args[0]);

                if (id) {
                    client.fetchUser(id).then(user=>sendProfile(user,message))
                        .catch(err=> console.log(err)); 
                    return;
                } else {
                    return message.channel.send(`I didn't get what you want to do. Send ${prefix}habitica to get help.`);
                }
                break;
        }

    }
};

module.exports.config = {
	name: 'habitica',
	aliases: ['habitica'],
	description: 'I will send you the sleep logs you made in the sleep club.',
	usage: ['habitica', 'habitica set :uuid', 'habitica remove', 'habitica me', 'habitica @user', 'habitica find'],
};


function sendHabitacaHelp(recipient) {
    let helpMessage = new Discord.RichEmbed()
			.setColor('#ff0000')
			.setTitle(`Available ${prefix}habitica commands`)
		// commands.forEach(command => {
		// 	helpMessage.addField(`**${prefix}${command.config.name}**`, `${command.config.description}`);
        // });
    helpMessage.addField(`**${prefix}habitica**`, `Under construction!`);
    try {
        return recipient.send(helpMessage);
    }
    catch(err) {
        console.log(err);
        return;
    }

}


function setHabiticaProfile(user, habiticaID, message) {
    // TODO: check if the users already has an record in the database: if so, ask them if they want to update
    api.get(`/members/${habiticaID}`)
    .then(res => {
        console.log(res);
        let habiticaUsername = res.data.auth.local.username;
        Habiticas.sync().then(()=> 
            Habiticas.create({// add record to database
                user: message.author.id,
                habiticaID: habiticaID
            }).then(() => {// tell the user that the record has been added
                message.channel.send(`Hey ${message.author.username}, I have linked habitica user ${habiticaUsername} to your profile.`);//.then(message => message.delete(5000).catch());
            }).catch(err => {
                if (err.name == 'SequelizeUniqueConstraintError') return;
                console.error('Habitica set sequelize error: ', err);
            })
        );
    }).catch(err => {
        console.log(`There has been a problem in finding habitica ID: ${err}`);
        message.channel.send('I could find any habitica user by the id you provided. Check the your id or try again later.')
      });
    
}

// remove habitica ID from database
async function removeHabiticaProfile(message) {
    const sender = message.author;
    const reactionFilter = (reaction, user) => {
        if (user.id == sender.id && (reaction.emoji.name === '✅' || reaction.emoji.name === '❌')) {
            if (reaction.emoji.name === '✅') {
                Habiticas.destroy({
                    where: {
                        user: sender.id
                    }
                }).then(result => {
                    // User successfully removed from table
                    if (result == 1) {
                        sender.send('I have removed your habitica ID in my record!');//.then(message => message.delete(5000));
                        reaction.message.delete().catch(() => console.log('Tried deleting message that was already deleted'));
                        return;
                    }
                });
            } else if (reaction.emoji.name === '❌') {
                reaction.message.delete().catch(() => console.log('Tried deleting message that was already deleted'));
                return;
            } else {
                return;
            }
        }
    };
    const removeHabiticaMessage = new Discord.RichEmbed()
        .setTitle(`Do you want me to remove your habitica ID in my record, ${sender.nickname ? sender.nickname : sender.username}?`)
        .addField('Yes', 'React with ✅',true)
        .addField('No', 'React with ❌',true)
        .setFooter('This message will delete itself after 15 seconds')
        .setColor('#FFEC09');

    await Habiticas.sync().then(() => {
        Habiticas.findAll({
            where: {
                user: sender.id
            }
        }).then(result => {
            if (result.length == 1) {
                sender.send(removeHabiticaMessage).then(msg => {
                    msg.react('✅');
                    msg.react('❌');
                    // Use reaction filter to remove to remove the user from the database rather than an event
                    let collector = msg.createReactionCollector(reactionFilter, { time: 15000 });
                    collector.on('end', () => {
                        msg.delete().catch(() => console.log('Tried deleting message that was already deleted'));
                    });
                });
            } else {
                message.channel.send(`Oops ${message.author.nickname ? message.author.nickname : message.author.username}, I don't know your Habitica ID!`)
            }
        });
    });
}

// given habitica ID or nickname, find the corresponding discord user
function findUser(searchTerm) {
    return;
}

// extract user id from the string of metion
function getIDFromMention(mention) {
    // The id is the first and only match found by the RegEx.
    const matches = mention.match(/^<@!?(\d+)>$/);
    // If supplied variable was not a mention, matches will be null instead of an array.
    if (!matches) return;
    // The first element in the matches array will be the entire mention, not just the ID, so use index 1.
    return matches[1];
}

// send a message about someone's habitica profile
async function sendProfile(user, message) {

    Habiticas.sync().then(() => {
        Habiticas.findAll({
            where: {
                user: user.id
            }
        }).then(result=>{
            if (result.length == 1) {
                return message.channel.send(result[0].habiticaID)

            } else {
                return message.channel.send(`Sorry, I do not know ${user.id==message.author.id ? 'your': `${user.username}'s`} habitca account.`);

            }

        }).catch(err=>console.log(err));
    });


}