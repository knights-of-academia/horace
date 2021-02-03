const Sequelize = require('sequelize');
const connect = require('./connect.js');

const { sequelize } = connect;

module.exports = sequelize.define('bannedWord', {
	word: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
	},
	userID: {
		type: Sequelize.STRING,
		allowNull: false,
	},
});
