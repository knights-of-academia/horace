// Get the InfoTerms Table and Search Words Table in the SQLite database
const Discord = require('discord.js');
const { Consola } = require('consola');
const InfoTerms = require('../databaseFiles/infoTermsTable.js');
const SearchWords = require('../databaseFiles/searchWordsTable.js');
const config = require('../config.json');

// Ensure the tables exist if not already
InfoTerms.sync();
SearchWords.sync();

module.exports.execute = async (client, message, args) => {
  // Error handler
  const errHandler = (err) => {
    client.channel.get('666758807363387404').send(err);
  };
  const cmd = args[0];
  const term = args[1];
  const entirePhrase = args.join(' ');
  const keywords = entirePhrase.substring(entirePhrase.indexOf(' ') + 1);
  const desc = keywords.substring(keywords.indexOf('-') + 1);
  const user = message.author;
  const infoEmote = config.emotes.info;

  if (keywords.length === 0) {
    // if no term or command is provided, show available search terms
    const delimiter = ',';
    const theInfoTerms = [];
    await InfoTerms.findAll({
      attributes: ['term'],
      raw: true,
    }).then((result) => {
      for (let i = 0; i < result.length; i += 1) {
        theInfoTerms.push(result[i].term);
      }
    });

    const infoMessage = `___**List of available search terms:**__\n\n${theInfoTerms.join(delimiter)}`;

    await message.author.send(infoMessage).catch((err) => {
      client.channel.get('666758807363387404').send(err);
    });
    return message.channel.send('I have sent you a private message with the list of available search terms.').catch((err) => {
      client.channel.get('666758807363387404').send(err);
    });
  }
  if (keywords.length > 1) {
    if (cmd === 'add') { // Add a new term
      if (message.channel.id === config.channels.commandcenter
        && (message.member.roles.has(config.roles.guardian))) {
        const searchTerms = args[2].split(',');

        const result = await InfoTerms.findAll({
          attributes: ['term', 'description'],
          where: {
            term,
          },
          raw: true,
        }).catch(errHandler);

        Consola.log(result);

        if (result.length > 0) {
          return message.channel.send(`${term} already exists. Did you mean to type !info edit?`);
        }

        // Add entry to InfoTerm Table
        await InfoTerms.create({
          term,
          description: desc,
        }).catch(errHandler);

        // Add keywords to SearchWords Table
        // TODO: How can we avoid disabling this?
        // eslint-disable-next-line no-restricted-syntax
        for (const keyword of searchTerms) {
          SearchWords.create({
            term,
            keyword,
          }).catch(errHandler);
        }

        // Confirm Info Addition
        return message.channel.send(`New term, ${term}, added!`);
      }

      // Inform if user doesn't have authority to edit info
      if (!message.member.roles.has(config.roles.guardian)) {
        message.channel.send('You do not have the experience to complete this command');
      }
    } else if (cmd === 'remove') {
      if (message.channel.id === config.channels.commandcenter
                    && (message.member.roles.has(config.roles.guardian))) {
        // Remove entries
        let cont = true;
        await InfoTerms.destroy({
          where: {
            term,
          },
        }).then((result) => {
          if (result === 0) {
            user.send(`You tried to remove info \`${term}\`, but it doesn't exist.`);
            cont = false;
          }
        });

        await SearchWords.destroy({
          where: {
            term,
          },
        }).catch(errHandler);

        if (!cont) {
          return false;
        }

        // Confirm removal
        return message.channel.send(`${term} has been removed from the database`);
      }

      // Inform if user doesn't have authority to edit info
      if (!message.member.roles.has(config.roles.guardian)) {
        message.channel.send('You do not have the experience to complete this command');
      }
    } else if (cmd === 'edit') {
      if (message.channel.id === config.channels.commandcenter
                        && (message.member.roles.has(config.roles.guardian))) {
        // Update InfoTerms
        const termToUpdate = await SearchWords.findAll({
          attributes: ['term'],
          where: {
            keyword: term,
          },
          raw: true,
        }).catch(errHandler);

        await InfoTerms.update({
          description: desc,
        }, {
          where: {
            term: termToUpdate[0].term,
          },
        }).catch(errHandler);

        // Confirm edit
        return message.channel.send(`The info term ${termToUpdate[0].term} has been updated!`);
      }

      // Inform if user doesn't have authority to edit info
      if (!message.member.roles.has(config.roles.guardian)) {
        message.channel.send('You do not have the experience to complete this command');
      }
    } else if (cmd === 'help') {
      const infoHelp = new Discord.RichEmbed()
        .setColor('#FF000')
        .setTitle(`${infoEmote} Knights of Academia Info Help ${infoEmote}`)
        .setDescription('Here are some commands to help you out with info!')
        .addField('Add info', '`!info add <term> <comma,seperated,keywords> -<description>`')
        .addField('Remove info', '`!info remove <keyword>`')
        .addField('Edit info description', '`!info edit <keyword> -<new description>`')
        .addField('List info terms', '`!info`');
      return user.send(infoHelp);
    } else {
      const inputWord = await SearchWords.findAll({
        attributes: ['term'],
        where: {
          keyword: cmd,
        },
        raw: true,
      }).catch(errHandler);

      const result = await InfoTerms.findAll({
        attributes: ['term', 'description'],
        where: {
          term: inputWord[0].term,
        },
        raw: true,
      }).catch(errHandler);

      if (!result) {
        return message.channel.send(`I dont know about ${cmd} yet, can you teach me?`);
      }

      const response = new Discord.RichEmbed()
        .setTitle(result[0].term)
        .setDescription(result[0].description);
      return message.channel.send(response);
    }
  }

  const inputWord = await SearchWords.findAll({
    attributes: ['term'],
    where: {
      keyword: cmd,
    },
    raw: true,
  }).catch(errHandler);

  const result = await InfoTerms.findAll({
    attributes: ['term', 'description'],
    where: {
      term: inputWord[0].term,
    },
    raw: true,
  }).catch(errHandler);

  const response = new Discord.MessageEmbed()
    .setTitle(result.displayname)
    .setDescription(result.description);

  return message.channel.send(response);
};

module.exports.config = {
  name: 'info',
  aliases: ['info', 'about'],
  description: 'I will send you information about a term.',
  usage: ['info', 'info add', 'info remove', 'info edit'],
};
