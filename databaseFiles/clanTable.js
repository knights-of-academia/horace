const Sequelize = require('sequelize');
const connect = require('./connect.js');

const sequelize = connect.sequelize;
// TODO: write module to import existing data to database
//       ? write a function that insert new clan into database 
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