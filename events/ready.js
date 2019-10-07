module.exports = (client) => {
	console.log(`Running on ${client.channels.size} channels on ${client.guilds.size} servers.`);
	client.user.setActivity('I will take over the world!');
};
