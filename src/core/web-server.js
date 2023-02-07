const express = require('express');
const { initializeConfigMiddlewares, initializeErrorMiddlwares } = require('./middlewares');
const userRoutes = require('../controllers/user.routes');
const authRoutes = require('../controllers/auth.route');
const cardRoutes = require('../controllers/card.route');
const userCardRoutes = require('../controllers/user-card.routes');
const tempGameRoutes = require('../controllers/temp-game.routes');

const { sequelize } = require('../models/postgres.db')

const {User} = require("../models/models/user.model");
const {Card} = require("../models/models/card.model");
const {User_card} = require("../models/models/user_card.model");
const {Temp_Game} = require("../models/models/temp_game.model");

class WebServer {
  app = undefined;
  port = 3000;
  server = undefined;

  constructor() {
    this.app = express();
    require('dotenv').config()

    User.belongsToMany(Card, { through: User_card, foreignKey: 'id_user' });
    Card.belongsToMany(User, { through: User_card, foreignKey: 'id_card' });
    User.hasOne(Temp_Game,{ through: Temp_Game, foreignKey: 'id_user' });

    sequelize.sync();
    // sequelize.sync({ force: true });

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
    this.app.use('/temp-games', tempGameRoutes.initializeRoutes());
  }
}

module.exports = WebServer;