/* eslint-disable no-warning-comments */
module.exports = async (client, channel) => {
	const currentChannel = await client.channels.fetch(channel.id);
	//TODO: deprecated and to be replaced with fetchPins in v14
	currentChannel.messages.fetchPinned().then((messages) => {
		const numOfPins = messages.size;
		if (numOfPins === 50) {
			currentChannel.send('**Uh oh!** This channel has reached its pin limit. Contact a Helper to purge the list.');
		}
		else if (numOfPins >= 45) {
			currentChannel.send('**Heads up!** This channel is almost at its pin limit! There are currently ' + numOfPins + ' pinned messages.');
		}
	})
		.catch(console.error);
};
