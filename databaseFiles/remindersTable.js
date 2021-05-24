const DataTypes = require('sequelize');
const connect = require('./connect.js');

const sequelize = connect.sequelize;

module.exports = sequelize.define('Reminder', {
	whoToRemind: {
		type: DataTypes.STRING,
		allowNull: false
	},
	whatToRemind: {
		type: DataTypes.STRING,
		allowNull: false
	},
	whenToRemind: {
		type: DataTypes.DATE,
		allowNull: false
	},
	recurring: {
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	howOftenToRemind: {
		type: DataTypes.STRING
	}
}, {
	timestamps: false
}); 
