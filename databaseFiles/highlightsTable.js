const Sequelize = require('sequelize');
const connect = require('./connect.js');

const sequelize = connect.sequelize;

// A table representing highlighted keywords by given users
module.exports = sequelize.define('Highlights', {
	// Attributes of table 'highlights'
	phrase: {
		type: Sequelize.STRING,
		allowNull: false
	},
	users:{
		type: Sequelize.STRING,
		allowNull: false,
	}
});