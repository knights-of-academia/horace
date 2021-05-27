const config = require('../config.json');

let trackerObject = {
	msgContents: [],
	msgCounts: []
};
class CheckChainMessage {
	// "Load" tracker object with necessary data.
	static async loadChainMessageTracker(client) {
		client.channels.cache.forEach((channel) => {
			const channelId = channel.id;
			trackerObject.msgContents[channelId] = 'NIL';
			trackerObject.msgCounts[channelId] = 1;
		});

		console.log('Channels have been added to track chain messages!');
	}

	// Helper method to reset a chain
	static async resetChannelChain(channelId, newMessageContent) {
		trackerObject.msgContents[channelId] = newMessageContent;
		trackerObject.msgCounts[channelId] = 1;
	}

	// Helper method to run the comparison if enough chains have been reached. Horace will randomly chain after 3, 4, or 5 messages.
	static async makeChainMessage(channelId, channelInst) {
		// Send a message randomly on message number 3 or 4
		const rand = Math.round(Math.random(3)+3);
		if (trackerObject.msgCounts[channelId] == rand) {
			channelInst.send('' + trackerObject.msgContents[channelId]);
		}
		// Worst case, send it on 6
		else if (trackerObject.msgCounts[channelId] == 6) {
			channelInst.send('' + trackerObject.msgContents[channelId]);
		}
	}

	// Check a message and then call helper methods depending on the status of the message
	static async chainMessageCheck(message) {
		const channelId = message.channel.id;
		const messageContent = message.content;

		// If the message length is greater than limit set in configuration, forgettaboutit
		if (messageContent.length >= config.chainMessageCharLimit) {
			this.resetChannelChain(channelId);
		}

		const lastMessageInChannel = trackerObject.msgContents[channelId];
		const currentChainCount = trackerObject.msgCounts[channelId];
		if (messageContent === lastMessageInChannel) {
			trackerObject.msgCounts[channelId] = currentChainCount+1;
			this.makeChainMessage(channelId, message.channel);
		} else {
			this.resetChannelChain(channelId, messageContent);
		}
	}
}

module.exports = CheckChainMessage;
