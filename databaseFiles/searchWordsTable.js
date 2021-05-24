const Sequelize = require('sequelize');
const connect = require('./connect.js');

const sequelize = connect.sequelize;

// A table representing the keyword inputs
module.exports = sequelize.define('SearchWords', {
	term: {
		type: Sequelize.STRING,
		allowNull: false
	},
	keyword: {
		type: Sequelize.STRING,
		allowNull: false
	}
});
