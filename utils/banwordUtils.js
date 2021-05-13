const BannedWord = require('../databaseFiles/bannedWordTable.js');

const isBanned = async (word) => {
	const result = await BannedWord.findOne({
		where: {
			word,
		},
	});

	// if it exists return TRUE, else return FALSE
	return !(result == null);
};

const getBannedWords = async () => {
	const queryResult = await BannedWord.findAll({
		attributes: ['word'],
		raw: true,
	});

	const finalResult = [];
	queryResult.forEach((element) => {
		finalResult.push(element.word);
	});

	return finalResult;
};

const getBannedWordsAndAuthors = async() => {
	const queryResult = await BannedWord.findAll({
		attributes: ['word', 'userID'],
		raw: true,
	});

	return queryResult;
};

const addWordToBannedWordTable = async (word, userID) => {
	const isAlreadyBanned = await isBanned(word);

	if (!isAlreadyBanned) {
		await BannedWord.create({
			word,
			userID,
		});

		return `Success! Added ${word} to the blocked word list!`;
	}

	return `Failure! Cannot ban ${word}, because it is already banned!`;
};

const deleteWord = async (word) => {
	const isAlreadyBanned = await isBanned(word);

	if (!isAlreadyBanned) {
		return 'That word isn\'t currently banned!';
	}

	await BannedWord.destroy({
		where: {
			word,
		},
	});

	return `Success! Unbanned ${word} from the list!`;
};

module.exports.addWordToBannedWordTable = addWordToBannedWordTable;
module.exports.deleteWord = deleteWord;
module.exports.isBanned = isBanned;
module.exports.getBannedWords = getBannedWords;
module.exports.getBannedWordsAndAuthors = getBannedWordsAndAuthors;
