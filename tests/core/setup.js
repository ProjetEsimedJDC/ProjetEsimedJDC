require('dotenv').config();
const WebServer = require('../../src/core/web-server');
const { User } = require('../../src/models/user.model');

module.exports = async () => {
  const webServer = new WebServer();
  webServer.start();
  global.webServer = webServer;

  await User.create({
    id: 'eb9789fd-7925-4f22-9ddd-c5c5225b69f9',
    firstName: 'Lorem',
    lastName: 'Ipsum',
    password: '$2a$12$fN90KmxobuGypSm.apeA5.S8eqvAXk40JZ0DKVIX1cBRQlYqfbu6.', // "password"
    isAdmin: true,
  });
}