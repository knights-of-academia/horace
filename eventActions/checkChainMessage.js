let trackerObject = {
	msgContents: [],
	msgCounts: []
};
class CheckChainMessage {

	// "Load" tracker object with necessary data. Called in 'ready.js'
	static async loadChainMessageTracker(client) {

		client.channels.forEach(channel => {
			const channelId = channel.id;
			trackerObject.msgContents[channelId] = 'NIL';
			trackerObject.msgCounts[channelId] = 1;
		});

		console.log('Channels have been added to track chain messages!');
	}

	// Helper method to reset a chain
	static async resetChannelChain(channelId, newMessageContent){
		trackerObject.msgContents[channelId] = newMessageContent;
		trackerObject.msgCounts[channelId] = 1;
	}

	// Helper method to run the comparison if enough chains have been reached
	static async makeChainMessage(channelId, channelInst){
		if(trackerObject.msgCounts[channelId] == 3){
			channelInst.send('' + trackerObject.msgContents[channelId]);
			// this.resetChannelChain(channelId, 'NIL'); If this is set, then we'd have another message sent if 3 more people send the same message... Anyway, all good!
		}
	}

	// Check a message and then call helper methods depending on the status of the message
	static async chainMessageCheck(message) {
		const channelId = message.channel.id;
		const messageContent = message.content;

		// If the message length is greater than 20, forgettaboutit (potentially something editable in config?)
		if(messageContent.length >= 20) {
			this.resetChannelChain(channelId);
		}

		const lastMessageInChannel = trackerObject.msgContents[channelId];
		const currentChainCount = trackerObject.msgCounts[channelId];
		if(messageContent === lastMessageInChannel){
			trackerObject.msgCounts[channelId] = currentChainCount+1;
			this.makeChainMessage(channelId, message.channel);
		} else {
			this.resetChannelChain(channelId, messageContent);
		}

	}
}

module.exports = CheckChainMessage;
