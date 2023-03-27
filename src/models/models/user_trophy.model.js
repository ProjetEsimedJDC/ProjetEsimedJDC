const {DataTypes} = require('sequelize')
const { sequelize } = require('../postgres.db')

exports.User_trophy = sequelize.define('User_trophy', {
    // Model attributes are defined here
    id_user_trophy: {
        type: DataTypes.UUID,
        primaryKey : true,
        allowNull: false
    },
}, {
    tableName: 'User_trophy',
});