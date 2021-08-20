class EmbedInputErr extends Error {
	constructor(message) {
		super(message);
		this.name = 'EmbedInputErr';
		this.errMsg = message;
	}
}

module.exports.EmbedInputErr = EmbedInputErr;
