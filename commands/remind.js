// Reminder Bot Command List

// :white_small_square: $remind [#channel] [time until reminder e.g. 10m for 10 minutes or 10h for 10 hours] [@user] [message] - Sets up a reminder to be sent to a given channel. You can exclude the channel parameter to make it send a reminder to the same channel you set the reminder on. Example: $remind #accountability-club 10h @Austin#0008 did you get everything done today?
// :white_small_square: $natural - A swifter remind command. Use this command for more info.
// :white_small_square: $del - Choose what reminders to delete (It goes without saying please do not abuse this in ways such as deleting others' reminders)
// :white_small_square: $info - Get bot info

// Note: These commands are only usable in #command-center, #accountability-station and #early-to-sleep and should for the most part be kept to bot interaction. If you try to use them anywhere else they won't work. Have fun!


// 1. I think the todo command was considered a replacement for accountability station, but we still don't appear to hit the pin limit so I would agree. I think the base feature of reminding things at certain times / repetitive intervals is the key idea. 
// 2. I think having 3 types of reminders is what I see people being used; "remind to do X in 2 days",
// "remind me to do X every 5 days", "remind me to do X on july 20th". That's in order of priority, I think.
// Maybe even having a specific format for the command so you don't have to try and parse the exact language...
// but however you do it is fine haha. I think storing things in the same format in the SQLite database is definitely key,
// since Horace could be restarted 5 minutes from setting a reminder to 2 months after.
// Speaking of format, yea just ReminderBot's format seems fine. I'd also recommend limiting it to maybe a specific channel in config, like #accountability-station or something, since that's where that main purpose would arise.Thank you for taking this one on! :conquer:

// TODO Better names for variables.
// TODO Design and handle what happens when the bot was down while he was supposed to remind a person about something.
// TODO "del/delete" argument.

const config = require('../config.json');

const Reminder = require('../databaseFiles/remindersTable.js');
const SpellChecker = require('spellchecker'); // Used to fix the typos.

// Needed when parsing the reminder.
const MONTHS = {
	'jan': 0,
	'feb': 1,
	'mar': 2,
	'apr': 3,
	'may': 4,
	'jun': 5,
	'jul': 6,
	'aug': 7,
	'sep': 8,
	'oct': 9,
	'nov': 10,
	'dec': 11
};

module.exports.execute = async (client, message, args) => {
	// TODO Handle non-matching input.

	// Restrict command usage to accountability-station and command-center channels.
	if (!(message.channel.id === config.channels.accountability || message.channel.id === config.channels.commandcenter)) {
		return await message.channel.send(
			`Whoops, sorry, but the "remind" command is only available in <#${config.channels.accountability}> and <#${config.channels.commandcenter}>.`
		);
	}


	const currentDate = new Date();
	const whoToRemind = message.author.id;

	let whatToRemind, whenToRemind, recurring, howOftenToRemind;
	[whatToRemind, whenToRemind, recurring, howOftenToRemind] = parseArgs(args, currentDate);

	// TODO Think about the table design. Unique: true?
	await Reminder.sync({ force: true }).then(() => {
		return Reminder.create({
			whoToRemind: whoToRemind,
			whatToRemind: whatToRemind,
			whenToRemind: whenToRemind,
			recurring: recurring,
			howOftenToRemind: howOftenToRemind
		}).catch(err => {
			console.error('Reminder Sequelize error: ', err);
		});
	});

	let reminders = await Reminder.findAll();
	console.log(reminders);
};

function addToDate(date, whatToAdd, amountToAdd) {
	var result = new Date(date);

	// TODO Reset the seconds and milliseconds in dates.
	switch (whatToAdd) {
	case 'seconds':
		result.setSeconds(result.getSeconds() + amountToAdd);
		break;
	case 'minutes':
		result.setMinutes(result.getMinutes() + amountToAdd);
		break;
	case 'hours':
		result.setHours(result.getHours() + amountToAdd);
		break;
	case 'days':
		result.setDate(result.getDate() + amountToAdd);
		break;
	case 'months':
		result.setMonth(result.getMonth() + amountToAdd);
		break;
	default:
		console.error('I\'m in the default case of addToDate meaning that something went very, very wrong!');
		return;
	}

	return result;
}

function parseArgs(unparsedArgs, currentDate) {
	// This might be significant later on when constructing Horace's reminding message.
	const regMy = new RegExp('my', 'i');

	// This RegExp matches reminders in the form of "remind [me] to do X in Y seconds/minutes/days/months".
	// The first group is useless, the second group is the action to be reminded of, the third group is how many
	// seconds/minutes/days/months (determined by the fourth group) should pass before the reminder.
	// TODO Get rid of the seconds and update the comment to match non-capturing groups.
	// TODO Should "to" also be encased in a non-capturing group?
	const regOne = new RegExp('(?:me to)? *(.*) +in +(\\d+) +(seconds|minutes|days|months)', 'i');

	// TODO Explanatory comment.
	// remind me to do laundry on july 20th
	const regTwo = new RegExp('(?:me to)? *(.*) +on +((?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)) +(\\d+) *(?:st|nd|rd|th)?', 'i');
	const regThree = undefined;

	let toPush = '';
	let correctedInput = [];

	unparsedArgs.forEach(word => {
		// HACK Spellchecker corrects some of the month names' abbreviations (e.g. "feb" -> "fib").
		// This works around that by checking if the word to be added is in fact a mmonth name
		// abbreviation, and if so, the loop continues to the next iteration.
		if (Object.keys(MONTHS).includes(word)) { correctedInput.push(word); return; }

		// Ternary operator that corrects the word if there's a typo, but leaves it as is if there's not.
		toPush = SpellChecker.isMisspelled(word) ? SpellChecker.getCorrectionsForMisspelling(word)[0] : word;

		// This might be significant later on when constructing Horace's reminding message.
		toPush = toPush.replace(regMy, 'your');

		correctedInput.push(toPush);
	});

	// We need a string to work with regexes.
	let stringInput = correctedInput.join(' ');

	let matchRegOne = stringInput.match(regOne);
	let matchRegTwo = stringInput.match(regTwo);
	// TODO Third regex.
	let matchRegThree = undefined;

	let whatToRemind, whenToRemind, recurring, howOftenToRemind;

	if (matchRegOne) {
		whatToRemind = matchRegOne[1];
		whenToRemind = addToDate(currentDate, matchRegOne[3], parseInt(matchRegOne[2]));
		recurring = false;
		howOftenToRemind = null;
	} else if (matchRegTwo) {
		whatToRemind = matchRegTwo[1];

		let month = MONTHS[matchRegTwo[2].slice(0, 3).toLowerCase()];
		whenToRemind = new Date(currentDate.getFullYear(), month, matchRegTwo[3], currentDate.getHours(), currentDate.getMinutes(), /*currentDate.getSeconds(), currentDate.getMilliseconds()*/);

		recurring = false;
		howOftenToRemind = null;
	} else if (matchRegThree) {
		return;
	} else {
		console.error('Why are we still here? Just to suffer?');
	}

	return [whatToRemind, whenToRemind, recurring, howOftenToRemind];
}

module.exports.config = {
	name: 'remind',
	aliases: ['todo'],
	description: 'todo',
	usage: ['todo']
};
