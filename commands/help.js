const prefix = require('../config.json').prefix;

module.exports.execute = async (client, message, args) => {
    if (!args || args.length === 0) {
        

        message.channel.send()
    }
}

module.exports.config = {
    name: 'help',
    aliases: ['help'],
    description: 'TEMPLATE',
    usage: [`${prefix}TEMPLATE`]
}