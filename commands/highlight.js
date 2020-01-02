// Get the Highlights Table stored in the SQLite database
const Highlights = require('../databaseFiles/highlightsTable.js');

// Error handler
const errHandler = err => {
	console.error('Highlights sequelize error: ', err);
};

module.exports.execute = async (client, message, args) => {
	const keywords = args.join(' ');
	const user = message.author;
	const userID = user.id;

	if(keywords.length === 0){
		return await message.channel.send('Please specify the word or phrase you want to highlight!');
	} else {
		// Ensure the table exists if not already -- Is there a better place for this?
		Highlights.sync();

		// Add entry to memory
		const addition = await Highlights.create({
			phrase: keywords,
			users: userID
		}).catch(errHandler);

		// Confirm highlight
		message.channel.send('Here\'s the loaded addition: ' + JSON.stringify(addition));
		const store = await Highlights.findAll({
			where: { users: userID },
		}).catch(errHandler);
		message.channel.send('Here are all the stored things for your id, ' + userID + ': ' + JSON.stringify(store));
		return await message.channel.send('I have gone ahead and highlighted the following for you: ' + keywords);

		// Ensure database matches memory (?)
	}
};

module.exports.config = {
	name: 'highlights',
	aliases: ['highlight', 'highlights'],
	description: 'Highlight a word or phrase you want to keep track of!',
	usage: ['highlight']
};
