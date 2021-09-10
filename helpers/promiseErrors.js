const { Config } = require('../config');

const promiseErrorHandler = async function(client, err) {
	console.err(err);
	const errChannel = await client.channels.fetch(Config.CHANNELS.ERRORS);
	if (errChannel) {
		let errMessage = `Error: \`${err.message}\``;
		await errChannel.send(errMessage);
	}
};

module.exports = promiseErrorHandler;
