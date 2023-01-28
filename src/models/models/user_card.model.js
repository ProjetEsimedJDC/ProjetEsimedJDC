const {DataTypes} = require('sequelize')
const { sequelize } = require('../postgres.db')

exports.User_card = sequelize.define('User_card', {
    // Model attributes are defined here
    id_user_card: {
        type: DataTypes.UUID,
        primaryKey : true,
        allowNull: false
    },
}, {
    tableName: 'User_card',
});