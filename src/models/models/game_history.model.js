const {DataTypes} = require('sequelize')
const { sequelize } = require('../postgres.db')

exports.Game_history = sequelize.define('Game_history', {
    // Model attributes are defined here
    id_game_history: {
        type: DataTypes.UUID,
        primaryKey : true,
        allowNull: false
    },
}, {
    tableName: 'Game_history',
});