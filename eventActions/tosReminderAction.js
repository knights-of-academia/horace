const Discord = require('discord.js');
table = require('../databaseFiles/tosReminderTable');
const config = require('../config.json');

//Adds to database
const addToDatabase = async function(user,joinTime,reminded=false){
    table.sync().then(async ()=>{
        await table.create({
            user_id: user.id,
            joinTime: joinTime,
            reminded: reminded
        }).catch(err =>{
            console.error('Tosreminder error:',err )
        })
    })
}

//Removes user from Database
const removeFromDatabase = async function(user){
    await table.destroy({
        where:{
            user_id:user.id
        }
    }).catch(err =>{
        console.error("Tos reminder error:",err)
    })
}

//Reminds the user
const tosRemind = async function(client){
    table.sync().catch(err =>{
        console.error("Tos reminder error:",err);
    });
    messageEmbed = new Discord.MessageEmbed()
     .setColor(config.colors.koaYellow)
     .setTitle("Hey :wave: noticed you joined, but never got access to KOA.")
     .setDescription(`Tap the check mark in <#${config.channels.tos}> to have full access to all KOA channels. Enjoy your newfound powers :relieved:`)
     
     const unreminded = await table.findAll({
        where:{
            reminded: false 
        }
    }).catch(err =>{
        console.error('TosReminder error:',err)
    });
    unreminded.forEach(async reminder =>{
        const userToRemind = reminder.dataValues.user_id;
        //Checks if the time given in config has passed
        if(new Date() - reminder.dataValues.joinTime  >= config.tosRemindAfterHours * 3600000){
            //Gets the user
            const user = await client.users.fetch(userToRemind).catch(err => {
                console.error('TosReminder error: ',err);
            });

            //Sends the meassage to the user
            user.send(messageEmbed);
            
            //Updates the table
            await table.update({
                reminded:true
            },
            {
                where:{
                    user_id:userToRemind
                }
            }).catch(err => {
                console.log('TosReminder error : ', err)
            });
        }
    })   
}
module.exports.addToDatabase = addToDatabase;
module.exports.removeFromDatabase = removeFromDatabase;
module.exports.tosRemind = tosRemind;