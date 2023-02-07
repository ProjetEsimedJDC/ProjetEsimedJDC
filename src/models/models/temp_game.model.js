const {DataTypes} = require('sequelize')
const { sequelize } = require('../postgres.db')

exports.Temp_Game = sequelize.define('Temp_Game', {
    // Model attributes are defined here
    id_temp_game: {
        type: DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true,
        allowNull: false
    },
}, {
    tableName: 'Temp_Game',
})
