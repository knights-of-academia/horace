const fs = require('fs');
const Habiticas = require('../databaseFiles/habiticaTable.js');
const Discord = require('discord.js');
const config = require('../config.json');
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
    let id = '';
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
                id = message.author.id;
            default:
                id = id? id: getIDFromMention(args[0]);
                if (id) {
                    let habiticaID = await findHabiticaID(id);
                    try {
                        if (habiticaID) {
                            return renderProfile(habiticaID)
                                .then(msg=> {message.channel.send(msg)})
                                .catch(err=>{console.log(err)});

                        } else {
                            let queriedUser = await client.fetchUser(id);
                            try {
                                profileMessage = `Sorry, I do not know ${id==message.author.id ? 'your': `${queriedUser.username}'s`} habitca account.`;
                                message.channel.send(profileMessage)
                            } catch (err) {
                                console.log(err);
                            }
                        }

                    } catch (err) {
                        console.log(`Error in finding habitica ID from database:`+err);
                    }

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
			.setColor('#442477')
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

// fidn someone's habitica ID in database, if not exist, return an empty string
async function findHabiticaID(userID) {
    return await Habiticas.sync().then(() => {
        return Habiticas.findAll({
            where: {
                user: userID
            }
        }).then(result => {
            if (result.length == 1) {
                return result[0].habiticaID;
            }
            else {
                return;
            }
        });
    });

}

async function renderProfile(habiticaID){
    let profile = await api.get(`/members/${habiticaID}`)
    .then(res => {return res.data});

    try { 
        // calculate values for the party
        let stats = calculateStats(profile);
        let checkInDate = profile.auth.timestamps.updated.slice(0,10);
        let party = profile.party._id;// TODO: check what would be the case of no party: assumed undefined at the moment
        let profileMessage = new Discord.RichEmbed()
			.setColor('#442477')
            .setTitle(profile.profile.name) // habitica display name
            .setDescription(`@${profile.auth.local.username} • Level ${profile.stats.lvl} ${profile.stats.class}`) // habitica username, level and class
            .addField(`**Latest Check In:**`, `${checkInDate}`)
            .addField(`**Party?**`,party?`In a party`:`Not in any party`)
            .addField(`**Stats**`,`Str: ${stats.str} | Con: ${stats.con} | Int: ${stats.int} | Per: ${stats.per}`);
        // TODO: check if it is a KOA clan: if so return the name of clan, if not just say it is a random party.
        return profileMessage; 
    } catch (err) {
        console.log(`There has been a problem in rendering profile: ${err}`);
        return;
    }

}

function calculateStats(profile) {
    const keys = ['str','con','int','per'];
    let stats =Object.create( {} );

    let val;

    keys.forEach(k=>{
        // calculate the stats without equipments
        val = profile.stats.buffs[k]+profile.stats.training[k]+profile.stats[k]+Math.floor(profile.stats.lvl/2);

        // TODO: add the value from equipments
        stats[k] = val;
    })
    return stats;
}