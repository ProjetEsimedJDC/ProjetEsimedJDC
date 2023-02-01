const { Sequelize } = require('sequelize');

exports.sequelize = new Sequelize('projetJDA', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb'
});