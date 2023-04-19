const { Sequelize } = require('sequelize');

exports.sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASWWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
});