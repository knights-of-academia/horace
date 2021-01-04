// Database requirements - Connection created at end
const { Consola } = require('consola');
const Sequelize = require('sequelize');

// Create connection
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './databaseFiles/storagedata.db',
});

// Make sure sequelize can be accessed outside of this file
module.exports.sequelize = sequelize;

module.exports.instantiateConnection = function instantiateConnection() {
  // Test connection
  sequelize
    .authenticate()
    .then(() => {
      Consola.log('Horace reporting... connection to database successful!');
    })
    .catch((err) => {
      Consola.error('Horace reporting... connection to database could not be established!', err);
    });
};
