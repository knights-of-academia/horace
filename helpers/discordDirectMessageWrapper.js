/**
 * Attempts to send a message to the user. Logs if user does not allow DMs.
 * @param {*} user - User to which the message is to be sent
 * @param {*} message - Message that is to be sent.
 */
module.exports.sendMessage = async (user, message) => {
	try {
		const result = await user.send(message);
		Promise.resolve(result);
	}
	catch (err) {
		if (err.code === 50007 && err.message === 'Cannot send messages to this user') {
			console.log(`${user.username} does not allow DMs!`);
			return Promise.reject('DMs not allowed');
		}
		else {
			console.log(err);
		}
	}
};
