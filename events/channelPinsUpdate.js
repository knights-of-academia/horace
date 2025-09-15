module.exports = async (client, channel) => {
	const currentChannel = client.channels.cache.get(channel.id);
	//TODO: make sure to put back the original 50 limit and 45 warning
	//TODO: deprecated and to be replaced with fetchPins in v14
	currentChannel.messages.fetchPinned().then((messages) => {
		const numOfPins = messages.size;
		if (numOfPins === 5) {
			currentChannel.send('**Uh oh!** This channel has reached its pin limit. Contact a Helper to purge the list.');
		}
		else if (numOfPins >= 3) {
			currentChannel.send('**Heads up!** This channel is almost at its pin limit! There are currently ' + numOfPins + ' pinned messages.');
		}
	})
		.catch(console.error);
};
