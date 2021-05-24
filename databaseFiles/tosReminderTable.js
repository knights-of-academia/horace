const DataTypes = require('sequelize');
const connect = require('./connect.js');

const sequelize = connect.sequelize;

module.exports = sequelize.define('TosReminder', {
	user_id: {
		type: DataTypes.STRING,
		allowNull: false
	},
	joinTime: {
		type: DataTypes.DATE,
		allowNull: false
	},
	reminded: {
		type: DataTypes.BOOLEAN,
		allowNull: false
	}
}, {
	timestamps: false
});
