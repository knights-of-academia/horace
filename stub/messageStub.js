module.exports = class messageStub {
	constructor() {
		this.channel = {
			send: async function (message) { return Promise.resolve(message); }
		};
		this.author = {
			send: async function (message) { return Promise.resolve(message); }
		};
	}
};