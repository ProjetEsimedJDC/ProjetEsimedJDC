const {DataTypes} = require('sequelize')
const { sequelize } = require('../postgres.db')

exports.User = sequelize.define('User', {
    // Model attributes are defined here
    id_user: {
        type: DataTypes.UUID,
        primaryKey : true,
        allowNull: false
    },
    pseudo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    coins: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: '0'
    },
    id_card_1: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    id_card_2: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    id_card_3: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
}, {
    tableName: 'User',
})
