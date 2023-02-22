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
const { Game } = require("../models/models/game.model");
const { Game_history } = require("../models/models/game_history.model");

const gameRepository = require('../models/repostories/game-repository');


const http = require('http');
const socketIo = require('socket.io');
const userRepository = require("../models/repostories/user-repository");

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

    User.belongsToMany(Game, { through: Game_history, foreignKey: 'id_user' });
    Game.belongsToMany(User, { through: Game_history, foreignKey: 'id_game' });

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
    let playerCount = 0;
    let playerCountRoom = 0;
    let roomCount = 1;
    let currentRoom = `room${roomCount}`;

    let usersRoom = [];

    this.io.on('connection', (socket) => {
      playerCount++;

      socket.on('playerData', async (player) => {
        usersRoom.push(player.id_user)
        console.log(`***** ${player.pseudo} vient de se connecter, total de joueurs : ${playerCount}`);    //Log le serveur

        socket.join(currentRoom);                                                  //Rejoint la room
        console.log(`***** ${player.pseudo} a rejoint la room : ${currentRoom}`)   //Log le serveur

        socket.emit('joined-lobby', currentRoom);                                 //Informe le client qu'il a rejoint la room

        this.io.to(currentRoom).emit('new-player', player, usersRoom.length);    // Informe le client qu'un utilisateur a rejoint la partie


        if (usersRoom.length === 2) {
          //Création de la room avec les joueurs à l'intérieur en BDD
          await gameRepository.createGame(currentRoom,usersRoom);

          //Affiche qui on affronte
          this.io.to(currentRoom).emit('game-created', usersRoom)

          // Si deux joueurs sont connectés, crée une nouvelle salle
          roomCount++;
          currentRoom = `room${roomCount}`;
          usersRoom = [];
        }

        socket.on('disconnect', () => {
          playerCount--
          playerCountRoom--
          console.log(`***** ${player.pseudo} s'est déconnecté`);         //Log le serveur
          console.log('***** nombre de joueurs connecté ', playerCount)   //Log le serveur
        });
      });

      // this.io.to(room).emit('connected-player', player);          //Envoie un message à tous les clients


      // if (isPairOrImpair % 2 === 0) {
      //   countRoom++
      //   room = `room${countRoom}`
      //   console.log(`***** La ${room} vient d'etre créé`)   //Log le serveur
      // }


    });
  }
}

module.exports = WebServer;