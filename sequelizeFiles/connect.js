// Database requirements - Connection created at end
const Sequelize = require ('sequelize');
const connectionInfo = require('./connection.json');

module.exports.instantiateConnection = function (){
// Create connection
	const sequelize = new Sequelize(connectionInfo.database, connectionInfo.username, connectionInfo.password, {
		host: connectionInfo.localhost,
		dialect: 'mysql'
	});

	// Test connection
	sequelize
		.authenticate()
		.then(() => {
			console.log('Horace reporting... connection to database successful!');
		})
		.catch(err => {
			console.error('Horace reporting... connection to database could not be established!', err);
		});

	// Make sure sequelize can be accessed outside of this file
	module.exports.sequelize = sequelize;
};