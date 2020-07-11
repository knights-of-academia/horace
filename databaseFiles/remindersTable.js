const DataTypes = require('sequelize');
const connect = require('./connect.js');

const sequelize = connect.sequelize;

module.exports = sequelize.define('Reminder', {
	user: {
		type: DataTypes.STRING,
		allowNull: false
	},
	remind: {
		type: DataTypes.DATE,
		allowNull: false,
	},
	recurring: {
		type: DataTypes.BOOLEAN,
		allowNull: false
	}
}, {
	timestamps: false
}); 