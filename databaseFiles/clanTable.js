const Sequelize = require('sequelize');
const connect = require('./connect.js');

const sequelize = connect.sequelize;
module.exports = sequelize.define('Clan', {
	fullName: {
		type: Sequelize.STRING,
		allowNull: false 
	},
	clanId: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true
	},
	authId: {
		type: Sequelize.STRING,
		allowNull: false
	},
	apiToken: {
		type: Sequelize.STRING,
		allowNull: false
	},
	description: {
		type: Sequelize.STRING,
		allowNull: false
	},
	formUrl: {
		type: Sequelize.STRING,
		allowNull: false
	},
	leader: {
		type: Sequelize.STRING,
		allowNull: true
	},
	memberCount: {
		type: Sequelize.INTEGER,
		allowNull: true
	},// names array not included for now
});
