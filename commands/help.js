const prefix = require('../config.json').prefix;

module.exports.execute = async (client, message, args) => {
    let commands = client.commands;
    let commandNames = [];

    if (!args || args.length === 0) {
        let helpMessage = ['__**List of available commands:**__\n\n'];
        commands.forEach(command => {
            helpMessage.push(
                `**${command.config.name}** - ${command.config.description}\n`,
            );
        });

        message.author.send(helpMessage.join('')).then(res => message.reply('I have sent you a private message with the command list')).catch(err => {
            console.error(err);
        });
    } else if (args.length === 1) {
        let command = commands.find(command => command.config.name === args[0].toLowerCase()
            || command.config.aliases.find(alias => alias === args[0].toLowerCase()));

        if (command) {
            let helpMessage = [`__**Help for the ${command.config.name} command:**__\n\n`];
            helpMessage.push(command.config.description, '\n\n');
            helpMessage.push('Aliasses: ', command.config.aliases.map(alias => '`' + alias + '`').join(', '), '\n');
            helpMessage.push('Usage: ', command.config.usage.map(usage => '`' + usage + '`').join(', '), '\n');

            message.author.send(helpMessage.join('')).then(res => message.reply('I have sent you a private message with command information')).catch(err => {
                console.error(err);
            });
        } else {
            commands.forEach(command => {
                commandNames.push(command.config.name);
                command.config.aliases.forEach(alias => commandNames.push(alias));
            });
            didYouMean(commandNames, args[0].toLowerCase(), message);
        }
    }
}


function didYouMean(commands, search, message) {
    if (!commands.includes(search)) {
        let score = [];
        let lev = 1000;
        let str = [];
        for (let command of commands) {
            if (levenshtein(search, command) <= lev) {
                lev = levenshtein(search, command);
                str.push(command);
            }
        }
        if (str.length > 1) {
            let arr = []
            for (let string of str) {
                arr.push(string.split(""))
            }
            for (let i = 0; i < arr.length; i++) {
                score[i] = 0;
                for (let j = 0; j < arr[i].length; j++) {
                    if (search.split("")[j] === arr[i][j]) {
                        score[i]++;
                    }
                }
            }
            return message.channel.send(`Did you mean \`${prefix}help ${str[score.indexOf(Math.max(...score))]}\``).catch(err => console.log(err));

        } else {
            return message.channel.send(`Did you mean \`${prefix}help ${str[0]}\``).catch(err => console.log(err));
        }
    }
}

function levenshtein(searchTerm, commandName) {
    if (searchTerm.length === 0) return commandName.length
    if (commandName.length === 0) return searchTerm.length
    let tmp, i, j, previous, val, row
    if (searchTerm.length > commandName.length) {
        tmp = searchTerm
        searchTerm = commandName
        commandName = tmp
    }

    row = Array(searchTerm.length + 1)
    for (i = 0; i <= searchTerm.length; i++) {
        row[i] = i
    }

    for (i = 1; i <= commandName.length; i++) {
        previous = i
        for (j = 1; j <= searchTerm.length; j++) {
            if (commandName[i - 1] === searchTerm[j - 1]) {
                val = row[j - 1]
            } else {
                val = Math.min(row[j - 1] + 1,
                    Math.min(previous + 1,
                        row[j] + 1))
            }
            row[j - 1] = previous
            previous = val
        }
        row[searchTerm.length] = previous
    }
    return row[searchTerm.length]
}

module.exports.config = {
    name: 'help',
    aliases: ['help'],
    description: 'I will send you this message, or the usage of a specific command.',
    usage: [`help`, `help command`],
}