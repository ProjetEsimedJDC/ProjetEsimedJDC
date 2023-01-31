const {DataTypes} = require('sequelize')
const { sequelize } = require('../postgres.db')
const {User} = require("./user.model");
const {User_card} = require("./user_card.model");

exports.Card = sequelize.define('Card', {
    // Model attributes are defined here
    id_card: {
        type: DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
        unique : true
    },
    sprite: {
        type: DataTypes.STRING,
        allowNull: false,
        unique : true
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique : true
    },
    HP: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    attack: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    defense: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    special_attack: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    special_defense: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    speed: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type_1: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    type_2: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    apiEvolutions_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    apiPreEvolution_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    tableName: 'Card',
})