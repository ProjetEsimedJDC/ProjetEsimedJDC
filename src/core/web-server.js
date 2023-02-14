const express = require('express');
const ably = require('ably');
const { initializeConfigMiddlewares, initializeErrorMiddlwares } = require('./middlewares');
const userRoutes = require('../controllers/user.routes');
const authRoutes = require('../controllers/auth.route');
const cardRoutes = require('../controllers/card.route');
const userCardRoutes = require('../controllers/user-card.routes');

const { sequelize } = require('../models/postgres.db')

const {User} = require("../models/models/user.model");
const {Card} = require("../models/models/card.model");
const {User_card} = require("../models/models/user_card.model");

class WebServer {
  app = undefined;
  port = 3000;
  server = undefined;

  constructor() {
    this.app = express();
    require('dotenv').config()

    User.belongsToMany(Card, { through: User_card, foreignKey: 'id_user' });
    Card.belongsToMany(User, { through: User_card, foreignKey: 'id_card' });

    sequelize.sync();

    initializeConfigMiddlewares(this.app);
    this._initializeRoutes();
    initializeErrorMiddlwares(this.app);
  }

  start() {
    this.server = this.app.listen(this.port, () => {
      console.log(`Example app listening on port ${this.port}`);
    });
    console.log(process.env.NODE_ENV);
  }

  stop() {
    this.server.close();
  }

  _initializeRoutes() {
    this.app.use('/users', userRoutes.initializeRoutes());
    this.app.use('/auth', authRoutes.initializeRoutes());
    this.app.use('/cards', cardRoutes.initializeRoutes());
    this.app.use('/user-cards', userCardRoutes.initializeRoutes());

    this.app.use('/ws', (req, res) => {
      const ablyClient = new ably.Realtime({
        key: process.env.ABLY_API_KEY,
        clientId: "8c76c82f-10de-4900-961c-bd9c64dee3d5",
      });
      ablyClient.connection.on('connected', () => {
        const channel = ablyClient.channels.get('example-channel');
        channel.subscribe((message) => {
          console.log('connect')
          res.json(message.data);
        });
      });
    });
  }
}

module.exports = WebServer;
