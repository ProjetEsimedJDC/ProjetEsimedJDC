const {DataTypes} = require('sequelize')
const { sequelize } = require('./postgres.db')

exports.Card = sequelize.define('Card', {
    // Model attributes are defined here
    id_card: {
        type: DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique : true
    },
    power: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    // Other model options go here
});