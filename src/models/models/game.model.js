const {DataTypes} = require('sequelize')
const { sequelize } = require('../postgres.db')

exports.Game = sequelize.define('Game', {
    // Model attributes are defined here
    id_game: {
        type: DataTypes.UUID,
        primaryKey : true,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
}, {
    tableName: 'Game',
})
