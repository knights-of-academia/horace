const Sequelize = require('sequelize');
const connect = require('./connect.js');

const sequelize = connect.sequelize;

// A table representing info terms about key aspects of KOA
module.exports = sequelize.define('InfoTerms', {
	term: {
		type: Sequelize.STRING,
		allowNull: false
	},
	description: {
		type: Sequelize.STRING,
		allowNull: false
	}
});
