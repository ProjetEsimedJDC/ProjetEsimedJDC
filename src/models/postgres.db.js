const { Sequelize } = require('sequelize');

exports.sequelize = new Sequelize('projetJDA', 'postgres', 'admin', {
    host: 'localhost',
    dialect: 'postgres'
});