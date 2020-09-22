const fs = require('fs');
const Habiticas = require('../databaseFiles/habiticaTable.js');
const Discord = require('discord.js');
const config = require('../config.json');
const habHelper = require('../helper/habiticaHelper')
const Habitica = require('habitica');
const api = new Habitica({
    id: config.habitica.id,
    apiToken: config.habitica.token
});
// description of habitica user ID
const userIDinfo = `The User ID (UID) or Universally Unique IDentifier (UUID) is a complex hexadecimal number that Habitica automatically generates when you joins. To find your User ID:
• For the website: User Icon > Settings > API
• For iOS/Android App: Menu > Settings > API > User ID (tap on it to copy it to your clipboard). `
// create habitica table
let prefix;
if (fs.existsSync('../config.json')) {
	prefix = require('../config.json');
} else {
	prefix = '!';
}

module.exports.execute = async (client, message,args) => {
    let queriedUser;
    let id = '';
    if (!args || args.length === 0 || args[0] == 'help') {// default case: send a help messsage 
        sendHabitacaHelp(message.author);
        return await message.channel.send(`I have send you a private message of what you can do with ${prefix}habitica`)
            .catch(err => console.error(err) ); 
    
    } else {
        switch (args[0]) {
            case 'set':
            case 'link': // link the habitica ID to a discord user
                let user;
                let habiticaID;
                if (args.length === 2) {// !habitica habiticaID
                    if (!habHelper.isUuid(args[1])){
                        return await message.channel.send(`I need a valid uuid to find your habitica account. Check this id is correct or try again later.`);
                    }
                    user = message.author;
                    habiticaID = args[1];
                } else if ((message.member.roles.has(config.roles.habiticaManager) || message.member.roles.has(config.roles.guardian)) && message.mentions.members.size === 1){
                    // !habitica @user habiticaID
                    user = message.mentions.members.first().user;
                    habiticaID = args.filter(arg=>isUuid(arg));
                    if (habiticaID.length == 1) {
                        habiticaID = habiticaID[0];
                    } else {
                        return await message.channel.send(`To tell me someone else's habitica ID, use ${prefix}habitica @user *habiticaID*`);
                    }
                }else {
                    return await message.channel.send(`I need your habitica ID to link your discord id to your habitica account.`);
                }
                return await setHabiticaProfile(user, habiticaID , message);
            case 'remove':
                return removeHabiticaProfile(message);
            case 'userid':
            case 'uuid':
                return await message.channel.send(userIDinfo);
            case 'find':
                if (args.length === 2) {
                    let discorUsers = await habHelper.findDiscordUser(args[1], client);
                    if (discorUsers.length>0){
                        let messageContent = `This ID corresponds to user${(discorUsers.length>1)?'s':''} `;
                        discorUsers.forEach(user=>messageContent+=user.username);
                        return await message.channel.send(messageContent); 
                    }else{
                        return await message.channel.send(`I cannot find any user by the habitica ID you provided.`); 
                    }
                }else {
                    return await message.channel.send(`I need either an habitica ID or habitica user name to find the corresponding user.`);
                }
            case 'me':
                queriedUser = message.author;
            default:

                queriedUser = queriedUser? queriedUser: message.mentions.members.first()? message.mentions.members.first().user: '';
                if (queriedUser) {
                    let habiticaID = await habHelper.findHabiticaID(queriedUser.id);
                    try {
                        if (habiticaID) {
                            profileMessage = await renderProfile(habiticaID,queriedUser);

                        } else {
                            profileMessage = `Sorry, I do not know ${queriedUser.id==message.author.id ? 'your': `${queriedUser.username}'s`} habitca account.`;

                        }
                        return await message.channel.send(profileMessage).catch(err=>{console.log(err)});

                    } catch (err) {
                        console.log(`Error in finding habitica ID from database:`+err);
                    }

                } else {
                    return await message.channel.send(`I didn't get what you want to do. Send ${prefix}habitica to get help.`);
                }
                break;
        }

    }
};

module.exports.config = {
	name: 'habitica',
	aliases: ['habitica'],
	description: 'I will tell you what I can do with habitica if you send this command.',
	usage: ['habitica', 'habitica set :uuid', 'habitica remove', 'habitica me', 'habitica @user', 'habitica find'],
};

// send a private help message to the user for !habitica
function sendHabitacaHelp(recipient) {
    let helpMessage = new Discord.RichEmbed()
			.setColor('#442477')
			.setTitle(`Available ${prefix}habitica commands`)
		// commands.forEach(command => {
		// 	helpMessage.addField(`**${prefix}${command.config.name}**`, `${command.config.description}`);
        // });
    for (const [commandName, commandProperty] of Object.entries(habiticaCommands)) {
        helpMessage.addField(`**${prefix} habitica ${commandName}**`, `${commandProperty.description}`);

    }

    try {
        return recipient.send(helpMessage);
    }
    catch(err) {
        console.log(err);
        return;
    }

}

async function setHabiticaProfile(user, habiticaID, message) {
    // check if the user already has habitica id in database.    
    let existingRecord = await Habiticas.sync().then(()=>{
        return Habiticas.findAll({
            where: {
                user: user.id
            }
        })
    });

    let queryName = message.author.id==user.id?'your':user.username+"'s";
    
    if (existingRecord.length == 1) {
        return await message.channel.send(`Seems that I already know ${queryName} habitica account!`);
        // TODO: ask the user if he/she want to update the record
    }

    api.get(`/members/${habiticaID}`)
    .then(res => {
        let habiticaUsername = res.data.auth.local.username;
        Habiticas.sync().then(()=> 
            Habiticas.create({// add record to database
                user: user.id,
                habiticaID: habiticaID
            }).then(() => {// tell the user that the record has been added
                message.channel.send(`Hey ${message.author.username}, I have linked habitica user ${habiticaUsername} to ${queryName} profile.`);
            }).catch(err => {
                if (err.name == 'SequelizeUniqueConstraintError') return;
                console.error('Habitica set sequelize error: ', err);
            })
        );
    }).catch(err => {
        console.log(`There has been a problem in fetching habitica ID: ${err}`);
        message.channel.send('I could not find any habitica user by the user id you provided. Check this id is correct or try again later.')
      });
    
}

// remove habitica ID from database
async function removeHabiticaProfile(message) {
    const sender = message.author;

    const confirmRemoveMessage = new Discord.RichEmbed()
        .setTitle(`Do you want me to remove your habitica ID in my record, ${sender.nickname ? sender.nickname : sender.username}?`)
        .addField('Yes', 'React with ✅',true)
        .addField('No', 'React with ❌',true)
        .setFooter('This message will delete itself after 15 seconds')
        .setColor('#FFEC09');

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
                        sender.send('I have removed your habitica ID in my record!');
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

    Habiticas.sync().then(() => {
        Habiticas.findAll({
            where: {
                user: sender.id
            }
        }).then(result => {
            if (result.length == 1) {
                sender.send(confirmRemoveMessage).then(msg => {
                    msg.react('✅');
                    msg.react('❌');
                    // Use reaction filter to remove to remove the user from the database rather than an event
                    let collector = msg.createReactionCollector(reactionFilter, { time: 15000 });
                    collector.on('end', () => {
                        msg.delete().catch(() => console.log('Tried deleting message that was already deleted'));
                    });
                });
            } else { // record does not exist
                message.channel.send(`Oops ${message.author.nickname ? message.author.nickname : message.author.username}, I don't know your Habitica ID!`)
            }
        });
    });
}
async function renderProfile(habiticaID, user){
    let profile = await api.get(`/members/${habiticaID}`)
    .then(res => {return res.data});

    try { 
        // get name for the party for the party
        let stats = await calculateStats(profile);
        let checkInDate = profile.auth.timestamps.updated.slice(0,10);
        let partyName = habHelper.clanName(profile.party._id);

        let profileMessage = new Discord.RichEmbed()
			.setColor('#442477')
            .setTitle(`${user.nickname ? user.nickname : user.username}'s Habitica Profile`)
            .setDescription(`**${profile.profile.name}**\n@${profile.auth.local.username} • Level ${profile.stats.lvl} ${profile.stats.class}`) // habitica display name, username, level and class
            .addField(`**Stats**`,`Str: ${stats.str} | Con: ${stats.con} | Int: ${stats.int} | Per: ${stats.per}`)
            .addField(`**Party:**`,partyName)
            .addField(`**Latest Check In:**`, `${checkInDate}`);
        return profileMessage; 
    } catch (err) {
        console.log(`There has been a problem in rendering profile: ${err}`);
        return;
    }

}

// calculate strength, constitution, intellegence and preception for a given habitica profile
// profile is the res.data for the response res from https://habitica.com/api/v3/members/:memberId
async function calculateStats(profile) {
    const keys = ['str','con','int','per'];
    let stats = Object.create( {} );

    let equipments = await api.get('/content').then(res => {return res.data.gear.flat} );
    let userEquipment = profile.items.gear.equipped;
    
    // calculate the stats without equipments
    keys.forEach(k=>{
        stats[k] = profile.stats.buffs[k]+profile.stats.training[k]+profile.stats[k]+Math.floor(profile.stats.lvl/2); 
    });

    // add contribution for each equipment to stats
    Object.keys(userEquipment).forEach(equ=>{
        equObj = equipments[userEquipment[equ]]; // find the record for the equipment
        keys.forEach(k=>{
            stats[k] += equObj[k];
        });

    });

    return stats;
}

// TODO: a generic function for confimraiton embed (for the check if need update feature for !habitica set)

let habiticaCommands = {
	'set':{
        aliases: ['set', 'link'],
        description: 'I will find and take a note of your habitica account usint the user id you provide.',
        usage: ['habitica set :uuid','habitica link :uuid'],
    },
    'help':{
        aliases: ['', 'help'],
        description: 'I will send you a help message about what I can do with habitica.',
        usage: ['habitica','habitica help'],
    },
    'remove':{
        aliases: ['remove'],
        description: 'I will remove your habitica information from my record.',
        usage: ['habitica remove'],
    },
    'me':{
        aliases: ['me'],
        description: 'I will send your habitica profile to where this command is used.',
        usage: ['habitica me'],
    },
    'userid':{
        aliases: ['userid'],
        description: 'I will tell you what habitica user ID is and how to find it.',
        usage: ['habitica userid'],
    },
    // 'find':{
    //     aliases: ['find'],
    //     description: 'I will find the corresponding discord user for a given habitica id.',
    //     usage: ['habitica find'],
    // },
    '@user':{
        aliases: ['@user'],
        description: `I will send the mentioned user's habitica profile to where this command is used`,
        usage: ['habitica @user'],
    }
};