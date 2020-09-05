const Sequelize = require('sequelize');
const connect = require('./connect.js');

const sequelize = connect.sequelize;

module.exports = sequelize.define('Habitica', {
	user: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true        
	},
	habiticaID: {
		type: Sequelize.STRING,
		allowNull: true
	}

});