const config = require('../config.json');

class snapshotActions {
    static userPostsImage(client, message) {
        if (message.channel.id === config.channels.snapshots
            && message.attachments.size === 0) {

            // Delete message

            // Send warning to author

            // Send message to moderation log
        }
    }

}

module.exports = snapshotActions;
