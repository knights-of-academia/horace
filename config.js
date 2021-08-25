require('dotenv').config();

function toArray(original) {
	return original.split(',').map((s) => s.trim());
}

function validateConfig(object, path = '') {
	for (const [key, value] of Object.entries(object)) {
		const currentPath = path ? `${path}.${key}` : key;
		if (typeof value === 'object') {
			validateConfig(value, currentPath);
		}
		else if (!String(value)) {
			console.log(`[WARNING] config ${currentPath} not defined.`);
		}
	}
}

const config = {
	'BOT': {
		'TOKEN': process.env.BOT_TOKEN,
		'PREFIX': '!',
	},

	// User ID and token to access the Habitica API
	// (https://habitica.com/user/settings/api) Used to access information
	// for Challenge of the Week. Doesn't matter whose account is used.
	'HABITICA': {
		'ID': process.env.HAB_ID,
		'TOKEN': process.env.HAB_TOKEN,
	},

	'MESSAGES': {
		'FOCUSED_RAIDER': process.env.M_FOCUSED_RAIDER,
	},

	'ROLES': {
		'INITIATE': process.env.R_INITIATE,
		'MEMBER': process.env.R_MEMBER,
		'FOCUSED_RAIDER': process.env.R_FOCUSED_RAIDER,
		'COTW_CHAMPION': process.env.R_COTW_CHAMPION,
		'COTW_MANAGER': process.env.R_COTW_MANAGER,
		'GUARDIAN': process.env.R_GUARDIAN,
		'HELPER': process.env.R_HELPER,
	},

	'CHANNELS': {
		'MAP_OF_KOA': process.env.C_MAP_OF_KOA,
		'RAID_ROOM': process.env.C_RAID_ROOM,
		'CITADEL': process.env.C_CITADEL,
		'COTW': process.env.C_COTW,
		'TOS': process.env.C_TOS,
		'SNAPSHOTS': process.env.C_SNAPSHOTS,
		'MODERATION': process.env.C_MODERATION,
		'MESSAGE_LOGS': process.env.C_MESSAGE_LOGS,
		'SLEEP_CLUB': process.env.C_SLEEP_CLUB,
		'HALL_OF_CONQUESTS': process.env.C_HALL_OF_CONQUESTS,
		'ACCOUNTABILITY': process.env.C_ACCOUNTABILITY,
		'CHOOSE_ROLES': process.env.C_CHOOSE_ROLES,
		'GRATITUDE': process.env.C_GRATITUDE,
		'STAFF_ACCOUNTABILITY': process.env.C_STAFF_ACCOUNTABILITY,
		'COMMAND_CENTER': process.env.C_COMMAND_CENTER,
		'CONTENT_NOTIFIER': process.env.C_CONTENT_NOTIFER,
		'ERRORS': process.env.C_ERRORS,
		'FORBIDDEN_HIGHLIGHT_CHANNELS': toArray(process.env.C_FORBIDDEN_HIGHLIGHT_CHANNELS),
	},

	'EMOTES': {
		'HOC_REACTION': process.env.E_HOC_REACTION || '🎉',
		'FOCUSED_RAIDER': process.env.E_FOCUSED_RAIDER,
		'YES2': process.env.E_YES2 || '✔',
		'NO': process.env.E_NO || '❌',
		'CONQUER': process.env.E_CONQUER,
		'WELCOME_ARROW': process.env.E_WELCOME_ARROW || '➡',
		'HORACE': process.env.E_HORACE,
		'ACCEPT_TOS': '✅',
		'BOOKMARK': '🔖',
		'SLEEP_LOG_REACTION': '🛏️',
		'COTW_VOW': '⚔',
		'COTW_REFLECTION': '🛡',
		'PIN_MESSAGE': '📌',
		'GOOD_MORNING': '🌞',
		'GOOD_NIGHT': '🌜',
		'ACCOUNTABILITY_EMOTES_ARRAY': ['💯', '👍', '🔥', '🙌', '👏', '👌', '💪'],
		'POM': '🍅',
		'CONGRATS': '✔️',
		'HIGHLIGHTS': '☀️',
		'WAVE': '👋',
		'GRATITUDE': '☺️',
		'REMINDERS': '❗',
		'CONFIRM': '👍',
		'DENY': '👎',
		'HEART': '❤️',
	},

	// Settings for determining when Horace reacts to messages in #citadel.
	'GREETINGS': {
		// Determine whether or not Horace will use the strict or normal version of the regex.
		'STRICT': false,
		'STRICT_MORNING_REGEX': 'mo*rning (koa[^a-z]*|knights[^a-z]*|friends[^a-z]*|everyone[^a-z]*)$',
		'STRICT_NIGHT_REGEX': 'ni*ght (koa[^a-z]*|knights[^a-z]*|friends[^a-z]*|everyone[^a-z]*)$',
		'NORMAL_MORNING_REGEX': 'g+o{2,}d+\\s*m+o+r+n+i+n+g+',
		'NORMAL_NIGHT_REGEX': 'g+o{2,}d+\\s*n+i+g+h+t+',
	},

	// Configure the Terms and Conditions reminder
	'TOS': {
		'REMINDER_TIMER': 30000,
		'REMIND_AFTER_HOURS': 72,
	},

	'COLORS': {
		'KOA_YELLOW': '#FFFA4F',
	},

	'PIN_LIMIT': 5,
	'REFLECTION_CHECK_DEPTH': 5,
	'REMINDER_SCAN_INTERVAL': 30000,
	'CHAIN_MESSAGE_CHAR_LIMIT': 40,
	'ALLOWED_EMBED_USERS': toArray(process.env.ALLOWED_EMBED_USERS),
};

validateConfig(config);

module.exports.Config = config;
