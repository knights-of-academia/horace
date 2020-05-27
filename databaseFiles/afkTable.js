const Sequelize = require('sequelize');
const connect = require('./connect.js');

const sequelize = connect.sequelize;

module.exports = sequelize.define('Afk', {
	message: {
		type: Sequelize.STRING,
		allowNull: true
	},
	user: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true        
	},
	cooldown: {
		type: Sequelize.STRING,
		allowNull: false
	}
});