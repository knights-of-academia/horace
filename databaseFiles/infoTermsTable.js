const Sequelize = require('sequelize');
const connect = require('./connect.js');

const { sequelize } = connect;

// A table representing info terms about key aspects of KOA
module.exports = sequelize.define('InfoTerms', {
  // Attributes of table 'infoterms'
  term: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});
