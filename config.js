require('dotenv').config({ debug: process.env.DEBUG });

module.exports = {
	'bot': {
		'token': process.env.BOT_TOKEN,
		'prefix': '!',
	},

	// User ID and token to access the Habitica API
	// (https://habitica.com/user/settings/api) Used to access information
	// for Challenge of the Week. Doesn't matter whose account is used.
	'habitica': {
		'id': process.env.HAB_ID,
		'token': process.env.HAB_TOKEN,
	},

	'messages': {
		'focusedRaider': process.env.M_FOCUSED_RAIDER,
	},

	'roles': {
		'initiate': process.env.R_INITIATE,
		'member': process.env.R_MEMBER,
		'focusedraider': process.env.R_FOCUSED_RAIDER,
		'cotwChampion': process.env.R_COTW_CHAMPION,
		'cotwManager': process.env.R_COTW_MANAGER,
		'guardian': process.env.R_GUARDIAN,
		'helper': process.env.R_HELPER,
	},

	'channels': {
		'mapofkoa': process.env.C_MAP_OF_KOA,
		'raidroom': process.env.C_RAID_ROOM,
		'citadel': process.env.C_CITADEL,
		'cotw': process.env.C_COTW,
		'toc': process.env.C_TOC,
		'snapshots': process.env.C_SNAPSHOTS,
		'moderation': process.env.C_MODERATION,
		'messagelogs': process.env.C_MESSAGE_LOGS,
		'sleepclub': process.env.C_SLEEP_CLUB,
		'hallofconquests': process.env.C_HALL_OF_CONQUESTS,
		'accountability': process.env.C_ACCOUNTABILITY,
		'chooseroles': process.env.C_CHOOSE_ROLES,
		'gratitude': process.env.C_GRATITUDE,
		'staffaccountability': process.env.C_STAFF_ACCOUNTABILITY,
		'commandcenter': process.env.C_COMMAND_CENTER,
		'contentNotifier': process.env.C_CONTENT_NOTIFER,
		'forbiddenHighlightChannels': process.env.C_FORBIDDEN_HIGHLIGHT_CHANNELS,
		'errors': process.env.C_ERRORS
	},

	'emotes': {
		'hocReaction': process.env.E_HOC_REACTION || '🎉',
		'focusedRaider': process.env.E_FOCUSED_RAIDER,
		'yes2': process.env.E_YES2 || '✔',
		'no': process.env.E_NO || '❌',
		'conquer': process.env.E_CONQUER,
		'welcomearrow': process.env.E_WELCOME_ARROW || '➡',
		'horace': process.env.E_HORACE,
		'acceptTOS': '✅',
		'bookmark': '🔖',
		'sleeplogReaction': '🛏️',
		'cotwVow': '⚔',
		'cotwReflection': '🛡',
		'pinMessage': '📌',
		'goodmorning': '🌞',
		'goodnight': '🌜',
		'accountability_emotes_array': ['💯', '👍', '🔥', '🙌', '👏', '👌', '💪'],
		'pom': '🍅',
		'congrats': '✔️',
		'highlights': '☀️',
		'wave': '👋',
		'gratitude': '☺️',
		'reminders': '❗',
		'confirm': '👍',
		'deny': '👎',
		'heart': '❤️',
	},

	// Settings for determining when Horace reacts to messages in #citadel.
	'greetings': {
		// Determine whether or not Horace will use the strict or normal version of the regex.
		'forceStrict': false,
		'strict_morning_regex': 'mo*rning (koa[^a-z]*|knights[^a-z]*|friends[^a-z]*|everyone[^a-z]*)$',
		'strict_night_regex': 'ni*ght (koa[^a-z]*|knights[^a-z]*|friends[^a-z]*|everyone[^a-z]*)$',
		'normal_morning_regex': 'g+o{2,}d+\\s*m+o+r+n+i+n+g+',
		'normal_night_regex': 'g+o{2,}d+\\s*n+i+g+h+t+',
	},

	// Configure the Terms and Conditions reminder
	'toc': {
		'tocReminderTimer': '30000',
		'tocRemindAfterHours': 72,
	},

	'colors': {
		'koaYellow': '#FFFA4F',
	},

	'pinLimit': 5,
	'reflectionCheckDepth': 5,
	'reminderScanInterval': 30000,
	'chainMessageCharLimit': '40',
	'allowedEmbedCmdUsers': process.env.ALLOWED_EMBED_USERS,
};
