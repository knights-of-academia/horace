module.exports = class MockMessage {
	constructor() {
		this.channel = {
			send: jest.fn((msg) => Promise.resolve(msg)),
			id: '',
		};

		this.author = {
			send: jest.fn((msg) => Promise.resolve(msg)),
			id: '',
			username: ''
		};

		this.guild = {
			name: 'KOA',
		};
	}
};
