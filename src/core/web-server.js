const express = require('express');
const { initializeConfigMiddlewares, initializeErrorMiddlwares } = require('./middlewares');
const userRoutes = require('../controllers/user.routes');
const authRoutes = require('../controllers/auth.route');
const cardRoutes = require('../controllers/card.route');
const userCardRoutes = require('../controllers/user-card.routes');

const { sequelize } = require('../models/postgres.db')
const { User } = require("../models/models/user.model");
const { Card } = require("../models/models/card.model");
const { User_card } = require("../models/models/user_card.model");
const http = require('http');
const socketIo = require('socket.io');

class WebServer {
  app = undefined;
  port = 3000;
  server = undefined;
  io = undefined;

  constructor() {
    this.app = express();
    require('dotenv').config();

    User.belongsToMany(Card, { through: User_card, foreignKey: 'id_user' });
    Card.belongsToMany(User, { through: User_card, foreignKey: 'id_card' });

    sequelize.sync();
    // sequelize.sync({ force: true });

    initializeConfigMiddlewares(this.app);
    this._initializeRoutes();
    initializeErrorMiddlwares(this.app);
  }

  start() {
    this.server = http.createServer(this.app);
    this.io = socketIo(this.server,{ cors: { origin: '*', } });
    this._initializeWebSocket();
    this.server.listen(this.port, () => {
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
  }

  _initializeWebSocket() {
    let isPairOrImpair = 1
    let countRoom = 1;
    let room = `room${countRoom}`

    this.io.on('connection', (socket) => {
      console.log(`A user connected: ${socket.id}`);

      console.log('size : ',socket.rooms.size)
      socket.join(room);
      console.log(`${socket.id} a rejoint la room : ${room}`)
      this.io.to(room).emit('roomCreated', room);

      if (isPairOrImpair%2 === 0) {
        room = `room${countRoom}`
      }
      isPairOrImpair++

      socket.on('playerData', (player) => {
        console.log(`[playerData] ${player.pseudo}`, player);

        // envoyer les données du joueur à tous les sockets connectés à la salle "room1"
        this.io.to(room).emit('test', player);
      });

      socket.on('disconnect', () => {
        console.log(`A user disconnected: ${socket.id}`);
      });
    });
  }
}

module.exports = WebServer;