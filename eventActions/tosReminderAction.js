const Discord = require('discord.js')
table = require('../databaseFiles/tosReminderTable');

const addToDatabase = async function(user,joinTime,reminded=false){
    table.sync(/*{ force: true }*/).then(async ()=>{
        await table.create({
            user_id: user.user_id,
            joinTime: joinTime,
            reminded: reminded
        })
    })
}
const removeFromDatabase = async function(user_id){
    await table.destory({
        where:{
            user_id:user_id
        }
    })
}
const tosRemind = async function(client){
    messageEmbed = new Discord.MessageEmbed()
    .setColor("#FC0303")
    .addField("Hey :wave: noticed you joined, but never got access to KOA.")
    .addField("Tap the check mark in https://discord.com/channels/382364344731828224/458682389850488862/620385598582292481 in this message to have full access to all KOA channels. Enjoy your newfound powers :relieved:")
    unreminded = table.findAll({
        where:{
            reminded: false
        }
    });
    console.log('unreminded fetcthed');
    unreminded.forEach((user_id) =>  {
        fetchuserid(user_id).send(messageEmbed)
    });
    table.update({
        reminded:true
    },
    {
        where:{
            user_id:userToRemind
        }
    }
    );
}
const fetchuserid = async function(user_id){
    return await client.users.fetch(user_id);
}
module.exports.addToDataBase = addToDatabase;
module.exports.removeFromDataBase = removeFromDatabase;
module.exports.tosRemind = tosRemind;

