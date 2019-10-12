const prefix = require('../config.json').prefix;

module.exports.execute = async (client, message, args) => {
    if (!args || args.length === 0) {
        let helpMessage = ['__**List of available commands:**__\n\n'];
        let commands = client.commands;
        commands.forEach(command => {
            helpMessage.push(
                `**${command.config.name}** - ${command.config.description}\n`,
            );
        });

        message.author.send(helpMessage.join('')).then((res, err) => {
            if (err) {
                console.error(err);
                return;
            }
            message.reply('I have sent you a private message with the command list')
        });
    }
}

module.exports.config = {
    name: 'help',
    aliases: ['help'],
    description: 'I will send you this message, or the usage of a specific command.',
    usage: [`help`, `help <command>`],
}