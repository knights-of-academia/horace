const Discord = require('discord.js')
table = require('../databaseFiles/tosReminderTable');

const addToDatabase = async function(user,joinTime,reminded=false){
    table.sync(/*{ force: true }*/).then(async ()=>{
        await table.create({
            user_id: user.id,
            joinTime: joinTime,
            reminded: reminded
        }).catch(err =>{
            console.error('Tosreminder error: ' + err )
        })
    })
}
const removeFromDatabase = async function(user_id){
    await table.destory({
        where:{
            user_id:user_id
        }
    }).catch(err =>{
        console.error("Tos reminder error" + err)
    })
}
const tosRemind = async function(client){
    messageEmbed = new Discord.MessageEmbed()
    .setColor("#FC0303")
    .addField("Hey :wave: noticed you joined, but never got access to KOA.")
    .addField("Tap the check mark in https://discord.com/channels/382364344731828224/458682389850488862/620385598582292481 in this message to have full access to all KOA channels. Enjoy your newfound powers :relieved:")
    const unreminded = await table.findAll({
        where:{
            reminded: false
        }
    }).catch(err =>{
        console.error('Tos reminder error : ' + err)
    });
    console.log('unreminded fetcthed');
    unreminded.forEach(async reminder =>{
        const userToRemind = reminder.dataValues.user_id;
        const user = await fetchuserid(userToRemind,client).catch(err => {
            console.error('TosReminder error: ',err);
        });
        user.send(messageEmbed);
        await table.update({
            reminded:true
        },{
            where:{
                user_id:userToRemind
            }
        }).catch(err => {
            console.log('tosReminder error : ', err)
        });
    })
    
}
const fetchuserid = async function(user_id,client){
    return await client.users.fetch(user_id).catch(err =>{
        console.error('Tosreminder errror : '+ err)
    });
}
module.exports.addToDatabase = addToDatabase;
module.exports.removeFromDatabase = removeFromDatabase;
module.exports.tosRemind = tosRemind;

