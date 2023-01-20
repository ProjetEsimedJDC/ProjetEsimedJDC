const { sequelize } = require('../../src/models/sqlite.db');

module.exports = async () => {
  global.webServer.stop();
  sequelize.truncate();
}