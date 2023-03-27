const {DataTypes} = require('sequelize')
const { sequelize } = require('../postgres.db')

exports.Trophy = sequelize.define('Trophy', {
    // Model attributes are defined here
    id_trophy: {
        type: DataTypes.UUID,
        primaryKey : true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    svg: {
        type: DataTypes.BLOB,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(250),
        allowNull: false,
    },
}, {
    tableName: 'Trophy',
})
