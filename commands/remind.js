/* eslint-disable no-use-before-define */
const Discord = require('discord.js');
const { Consola } = require('consola');

const config = require('../config.json');

const errors = require('../helpers/remindErrors.js');
const remindUtils = require('../utils/remindUtils.js');

const Reminder = require('../databaseFiles/remindersTable.js');

const monthsData = require('../data/monthsData.js');

module.exports.execute = async (client, message, args) => {
  let destroyed;
  // Restrict command usage to accountability-station and command-center channels.
  if (!(message.channel.id === config.channels.accountability
    || message.channel.id === config.channels.commandcenter)) {
    return message.channel.send(
      `Whoops, sorry, but the "remind" command is only available in <#${config.channels.accountability}> and <#${config.channels.commandcenter}>.`,
    );
  }

  if ((args.length === 0 || args.length === 1) && (args[0] === 'help' || args[0] === 'info')) {
    const remindHelp = new Discord.MessageEmbed()
      .setColor('#FFEC09')
      .setTitle(`${config.emotes.reminders} Knights of Academia Remind Help ${config.emotes.reminders}`)
      .setDescription('Here are some commands to help you out with reminders!')
      .addField('Add a reminder',
        `\`!remind [me to] <task> in <how many> minutes/hours/days/months\`
        Example: \`!remind me to do laundry in 2 hours\`
        
        =================================================
        
        \`!remind [me to] <task> on <date>\`
        Example: \`!remind me to do laundry on July 21st\`
        
        =================================================
        
        \`!remind [me to] <task> every <how many> minute[s]/hour[s]/day[s]/month[s]\`
        Example: \`!remind me to do laundry every day\`
        
        =================================================
        
        *Note: the parts in the square brackets are optional.*`)
      .addField('List your reminders', '`!remind list`')
      .addField('Remove a reminder',
        `\`!remind (remove/delete) <reminder ID to remove>/(all)\`
      You can find out the ID of the reminder by using \`!remind list\``);
    return message.author.send(remindHelp);
  } if (args.length === 1 && args[0] === 'list') {
    const userReminders = await Reminder.findAll({
      where: {
        whoToRemind: message.author.id,
      },
    });

    let remindersStringForEmbed = '';

    userReminders.forEach((reminder) => {
      const { id } = reminder.dataValues;
      const { whatToRemind } = reminder.dataValues;
      let { whenToRemind } = reminder.dataValues;
      const { recurring } = reminder.dataValues;
      const { howOftenToRemind } = reminder.dataValues;

      whenToRemind = remindUtils.parseDateForListing(whenToRemind);

      if (recurring) {
        const parsedHowOftenToRemind = remindUtils.parseSingularOrPlural(howOftenToRemind);

        const reminderToConcat = `${id}: **${whatToRemind}** every ${parsedHowOftenToRemind} (next occurence at ${whenToRemind})\n`;
        remindersStringForEmbed = remindersStringForEmbed.concat(reminderToConcat);
      } else {
        const reminderToConcat = `${id}: **${whatToRemind}** at ${whenToRemind}\n`;
        remindersStringForEmbed = remindersStringForEmbed.concat(reminderToConcat);
      }
    });

    if (remindersStringForEmbed) {
      const remindList = new Discord.MessageEmbed()
        .setColor('#FFEC09')
        .setTitle(`${config.emotes.reminders} Your Reminders ${config.emotes.reminders}`)
        .setDescription('Each entry is in the form of <id>: <reminder>.')
        .addField('Reminders', remindersStringForEmbed);

      return message.author.send(remindList);
    }
    return message.reply('you don\'t have any saved reminders!');
  } if (args.length === 2 && (args[0] === 'remove' || args[0] === 'delete')) {
    if (args[1] === 'all') {
      destroyed = await Reminder.destroy({
        where: {
          whoToRemind: message.author.id,
        },
      }).catch((err) => {
        Consola.error('Reminder Sequelize error: ', err);
      });
    } else if (Number.isInteger(parseInt(args[1], 10))) {
      destroyed = await Reminder.destroy({
        where: {
          id: parseInt(args[1], 10),
          whoToRemind: message.author.id,
        },
      }).catch((err) => {
        Consola.error('Reminder Sequelize error: ', err);
      });
    } else {
      return message.reply('your command usage is invalid! See `!remind help` for guidance.');
    }

    if (!destroyed) return message.reply('there isn\'t a reminder with such ID assigned to you! Check `!remind list` for a list of your reminders.');
    if (destroyed === 1) return message.reply('the reminder has been removed successfully!');
    return message.reply('all your reminders have been removed successfully!');
  }
  const currentDate = new Date();
  const whoToRemind = message.author.id;
  let whatToRemind; let whenToRemind; let recurring; let
    howOftenToRemind;
  try {
    [whatToRemind, whenToRemind, recurring,
      howOftenToRemind] = parseReminder(args, currentDate, message);
  } catch (err) {
    Consola.error(err);

    if (err instanceof errors.MonthLengthValidationError) {
      return message.channel.send(
        `Whoops! ${err.month} doesn't have ${err.days} days! Please correct the command or see \`!remind help\` for guidance!`,
      );
    } if (err instanceof errors.NonmatchingInputValidationError) {
      return message.channel.send(
        'I\'m sorry, but the command you\'ve used is invalid. Please use `!remind help` for guidance on how to structure it correctly!',
      );
    }
  }
  await Reminder.sync(/* { force: true } */).then(() => Reminder.create({
    whoToRemind,
    whatToRemind,
    whenToRemind,
    recurring,
    howOftenToRemind,
  }).catch((err) => {
    Consola.error('Reminder Sequelize error: ', err);
  }));

  return null;
};

function parseReminder(unparsedArgs, currentDate, message) {
  // This might be significant later on when constructing Horace's reminding message.
  const regMy = new RegExp('my', 'i');

  // This RegExp matches reminders in the form of
  // "!remind [me to] <task> in <how many> minutes/hours/days/months".
  // The first group is the action to be reminded about, the second group is how many
  // minutes/hoursdays/months (determined by the third group) should pass before the reminder.
  const regOne = new RegExp('(?:me to)? *(.*) +in +((?:\\d+)|(?:a)|(?:an)) +(minutes?|hours?|days?|months?)', 'i');

  // This RegExp matches reminders in the form of "!remind [me to] <task> on <date>".
  // The first group is the action to be reminded about, the second group is the month,
  // and the third group is the day.
  const regTwo = new RegExp('(?:me to)? *(.*) +on +((?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)) +(\\d+) *(?:st|nd|rd|th)?', 'i');

  // This RegExp matches reminders in the form of
  // "!remind [me to] <task> every <how many> minutes/hours/days/months".
  // The first group is the action to be remided about, and the second and third group
  // dictate how often to remind.
  const regThree = new RegExp('(?:me to)? *(.*) +every +(\\d+ )?(minutes?|hours?|days?|months?)', 'i');

  let toPush = '';
  const correctedInput = [];

  unparsedArgs.forEach((word) => {
    // HACK SpellChecker corrects some of the month names' abbreviations (e.g. "feb" -> "fib").
    // This works around that by checking if the word to be added is in fact such abbreviation,
    // and if so, the loop continues with the next iteration.
    if (Object.keys(monthsData).includes(word)) { correctedInput.push(word); return; }

    // Ternary operation that corrects the word if there's a typo, but leaves it as is if there's
    // not.
    toPush = word;

    // This might be significant later on when constructing Horace's reminding message.
    toPush = toPush.replace(regMy, 'your');

    correctedInput.push(toPush);
  });

  // We need a string to work with regexes.
  const stringInput = correctedInput.join(' ');

  const matchRegOne = stringInput.match(regOne);
  const matchRegTwo = stringInput.match(regTwo);
  const matchRegThree = stringInput.match(regThree);

  let whatToRemind; let whenToRemind; let recurring; let
    howOftenToRemind;

  if (matchRegOne) {
    // eslint-disable-next-line prefer-destructuring
    whatToRemind = matchRegOne[1];

    const amountToAdd = ['a', 'an'].includes(matchRegOne[2].toLowerCase()) ? 1 : parseInt(matchRegOne[2], 10);
    const whatToAdd = matchRegOne[3];

    whenToRemind = remindUtils.addToDate(currentDate, amountToAdd, whatToAdd);

    recurring = false;
    howOftenToRemind = null;

    // We need to build the confirmation message differently than in the database.
    const whenToRemindForConfirmation = `in ${amountToAdd} ${whatToAdd}`;

    confirmReminder(whatToRemind, whenToRemindForConfirmation, message);
  } else if (matchRegTwo) {
    // eslint-disable-next-line prefer-destructuring
    whatToRemind = matchRegTwo[1];

    const monthAbbreviation = matchRegTwo[2].slice(0, 3).toLowerCase();
    const month = monthsData[monthAbbreviation].number;
    const day = matchRegTwo[3];

    if (day > monthsData[monthAbbreviation].length) {
      const errorMessage = `${monthsData[monthAbbreviation].fullname} doesn't have ${day} days.`;
      throw new errors.MonthLengthValidationError(errorMessage,
        monthsData[monthAbbreviation].fullname, day);
    }

    whenToRemind = new Date(currentDate.getFullYear(), month, day,
      currentDate.getHours(), currentDate.getMinutes());

    if (whenToRemind - currentDate < 0) {
      whenToRemind = remindUtils.addToDate(whenToRemind, 1, 'year');
    }

    recurring = false;
    howOftenToRemind = null;

    // We need to build the confirmation message differently than in the database.
    const whenToRemindForConfirmation = `on ${monthsData[monthAbbreviation].fullname} ${day}`;
    confirmReminder(whatToRemind, whenToRemindForConfirmation, message);
  } else if (matchRegThree) {
    // eslint-disable-next-line prefer-destructuring
    whatToRemind = matchRegThree[1];

    const amountToAdd = matchRegThree[2] ? parseInt(matchRegThree[2], 10) : 1;
    const whatToAdd = matchRegThree[3];
    whenToRemind = remindUtils.addToDate(currentDate, amountToAdd, whatToAdd);

    recurring = true;
    howOftenToRemind = [amountToAdd, whatToAdd].join(' ');

    const parsedHowOftenToRemind = remindUtils.parseSingularOrPlural(howOftenToRemind);

    // We need to build the confirmation message differently than in the database.
    const whenToRemindForConfirmation = `every ${parsedHowOftenToRemind}`;

    confirmReminder(whatToRemind, whenToRemindForConfirmation, message);
  } else {
    throw new errors.NonmatchingInputValidationError('The command format doesn\'t match any of the regexes.');
  }

  return [whatToRemind, whenToRemind, recurring, howOftenToRemind];
}

async function confirmReminder(whatToRemind, whenToRemind, message) {
  const confirmationMessage = await message.channel.send(`
Hey ${message.author.username}! I'm not perfect, so please confirm if that is correct.
Do you want me to remind you to ${whatToRemind} ${whenToRemind}? React with thumbs up or thumbs down!

**Please note that this message will disappear in 20 seconds.**`);

  const [confirm, deny] = [config.emotes.confirm, config.emotes.deny];

  confirmationMessage.react(confirm).then(() => confirmationMessage.react(deny));

  const filter = (reaction, user) => [confirm, deny].includes(reaction.emoji.name)
    && user.id === message.author.id;

  confirmationMessage.awaitReactions(filter, { max: 1, time: 20000, errors: ['time'] })
    .then((collected) => {
      const reaction = collected.first();

      confirmationMessage.delete();

      if (reaction.emoji.name === confirm) {
        message.reply('I added your reminder to the database!');
      } else if (reaction.emoji.name === deny) {
        const errorMessage = 'User decided that the parsed reminder is invalid.';
        const toSend = 'yikes! Please consider trying again or use `!remind help` for guidance!';

        throw new errors.ReminderDeniedValidationError(errorMessage, toSend);
      }
    })
    .catch((err) => {
      confirmationMessage.delete();

      if (err instanceof errors.ReminderDeniedValidationError) {
        Consola.error(err);
        return message.reply(err.toSend);
      }
      return message.reply('you didn\'t confirm nor deny. Please try again or use `!remind help` for guidance!');
    });
}

// eslint-disable-next-line no-shadow
async function remind(client, date, reminder, catchUp = false) {
  const userToRemind = await client.fetchUser(reminder.dataValues.whoToRemind);
  let color; let
    description;

  if (catchUp) {
    color = '#FF4500';
    description = `Whoops! Sorry for being late, I was probably down for maintenance. 😅
    Anyway, you asked me to remind you to **${reminder.dataValues.whatToRemind}**. I hope it's not too late. 🤐`;
  } else {
    color = '#FFCC00';
    description = `Hello! I'm sorry to barge in like that. 🤐
    I just wanted to remind you to **${reminder.dataValues.whatToRemind}**. Off I go. 😄`;
  }

  const remindMessage = new Discord.MessageEmbed()
    .setColor(color)
    .setTitle(`${config.emotes.reminders} Reminder ${config.emotes.reminders}`)
    .setDescription(description);

  userToRemind.send(remindMessage);

  if (!reminder.dataValues.recurring) {
    await Reminder.destroy({
      where: {
        id: reminder.dataValues.id,
      },
    }).catch((err) => {
      Consola.error('Reminder Sequelize error: ', err);
    });
  } else {
    let [amountToAdd] = reminder.dataValues.howOftenToRemind.split(' ');
    const whatToAdd = amountToAdd;
    amountToAdd = parseInt(amountToAdd, 10);
    await Reminder.update({ whenToRemind: remindUtils.addToDate(date, amountToAdd, whatToAdd) }, {
      where: {
        id: reminder.dataValues.id,
      },
    }).catch((err) => {
      Consola.error('Reminder Sequelize error: ', err);
    });
  }
}

async function scanForReminders(client) {
  const currentDate = new Date();
  const reminders = await Reminder.findAll().catch((err) => {
    Consola.error('Reminder Sequelize error: ', err);
  });

  if (reminders) {
    let difference;
    reminders.forEach(async (reminder) => {
      difference = currentDate - reminder.dataValues.whenToRemind;
      if (difference > -30000) {
        remind(client, currentDate, reminder);
      }
    });
  }
}

async function catchUp(client) {
  const currentDate = new Date();
  const reminders = await Reminder.findAll().catch((err) => {
    Consola.error('Reminder Sequelize error: ', err);
  });

  if (reminders) {
    let difference;
    reminders.forEach(async (reminder) => {
      difference = currentDate - reminder.dataValues.whenToRemind;
      if (difference > 0) {
        remind(client, currentDate, reminder, true);
      }
    });
  }
}

module.exports.scanForReminders = scanForReminders;
module.exports.catchUp = catchUp;

module.exports.config = {
  name: 'remind',
  aliases: ['remind'],
  description: 'Set up a reminder!',
  usage: ['`!remind [me to] <task> in <how many> minutes/hours/days/months`', '`!remind [me to] <task> on <date>`', '`!remind [me to] <task> every <how many> minute[s]/hour[s]/day[s]/month[s]`'],
};
