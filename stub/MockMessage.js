module.exports = class MockMessage {
	constructor() {
		this.channel = {
			send: jest.fn((msg) => Promise.resolve(msg)),
			id: '123123123123123123',
		};

		this.author = {
			send: jest.fn((msg) => Promise.resolve(msg)),
			id: '123456789876543210',
			username: 'MockedUser'
		};

		this.guild = {
			name: 'KOA',
		};
	}
};
