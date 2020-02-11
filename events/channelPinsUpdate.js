module.exports = async (client, channel) => {
	// Check for max pins regardless of channel
	const currentChannel = client.channels.get(channel.id);
	currentChannel.fetchPinnedMessages().then(messages => {
		const numOfPins = messages.size;
		// currentChannel.send('**Listen!** Currently at ' + numOfPins + ' pins');
		if(numOfPins === 50){
			currentChannel.send('**Uh oh!** This channel has reached its pin limit. Contact a Helper to purge the list.');
			return;
		}
		else if(numOfPins >= 45){
			currentChannel.send('**Heads up!** This channel is almost at its pin limit! There are currently ' + numOfPins + ' pinned messages.');
			return;
		}
	});
};