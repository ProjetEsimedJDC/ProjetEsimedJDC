const {DataTypes} = require('sequelize')
const { sequelize } = require('../models/sqlite.db')

exports.User = sequelize.define('User', {
    // Model attributes are defined here
    id: {
        type: DataTypes.STRING,
        primaryKey : true,
        allowNull: false
      },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    password: {
        type: DataTypes.STRING
        // allowNull defaults to true
      }
  }, {
    // Other model options go here
  });