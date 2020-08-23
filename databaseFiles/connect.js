// Database requirements - Connection created at end
const Sequelize = require('sequelize');

// Create connection
const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: './databaseFiles/storagedata.db'
});


// Make sure sequelize can be accessed outside of this file
module.exports.sequelize = sequelize;

module.exports.instantiateConnection = function (){

	// Test connection
	sequelize
		.authenticate()
		.then(() => {
			console.log('Horace reporting... connection to database successful!');
		})
		.catch(err => {
			console.error('Horace reporting... connection to database could not be established!', err);
		});
};