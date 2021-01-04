module.exports = class messageStub {
  constructor() {
    this.channel = {
      async send(message) { return Promise.resolve(message); },
    };
    this.author = {
      async send(message) { return Promise.resolve(message); },
    };
  }
};
