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
const cardRepository = require('../models/repostories/card-repository');


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

    let user1Cards;
    let user2Cards;

    let user1turn;
    let user2turn;

    let resultj1;
    let resultj2;
    function j1played() {
      let foundIndex;

      user2Cards.forEach((user2Card, index) => {
        if (user2Card.id_card === user2turn[0].id_card) {
          foundIndex = index
        }
      })

      console.log('pokemon j2 '+user2Cards[0].name + user2Cards[1].name,user2Cards[2].name)

      if (user1turn[1] === 'attack') {
        user2Cards[foundIndex].HP = user2Cards[foundIndex].HP - user1turn[0].attack

        if (user2Cards[foundIndex].HP <= 0) {
          console.log(`***** ${user1turn[0].name} a tué ${user2Cards[foundIndex].name}`);

          return [true, user1turn[0], user2Cards[foundIndex], [usersRoom[1]]]
        }
        return [false, user1turn[0], user2Cards[foundIndex], [usersRoom[1]]]

      }

      if (user1turn[1] === 'defense') {
        console.log('***** j1 a défendu')
      }

      return [false, user1turn[0], user2Cards[foundIndex],[usersRoom[1]]]
    }

    function j2played() {
      let foundIndex;
      user1Cards.forEach((user1Card, index) => {
        if (user1Card.id_card === user1turn[0].id_card) {
          foundIndex = index
        }
      })

      console.log('pokemon j1 '+user1Cards[0].name + user1Cards[1].name,user1Cards[2].name)

      if (user2turn[1] === 'attack') {
        user1Cards[foundIndex].HP = user1Cards[foundIndex].HP - user2turn[0].attack

        if (user1Cards[foundIndex].HP <= 0) {
          console.log(`***** ${user2turn[0].name} a tué ${user1Cards[foundIndex].name}`)
          return [true, user2turn[0], user1Cards[foundIndex], usersRoom[0]]
        }
        return [false, user2turn[0], user1Cards[foundIndex], usersRoom[0]]

      }

      if (user1turn[1] === 'defense') {
        console.log('***** j1 a défendu')
      }
      return [false, user2turn[0] ,user1Cards[foundIndex], usersRoom[0]]
    }


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


          user1Cards = await cardRepository.getCardsUserByUserId(usersRoom[0])
          user2Cards = await cardRepository.getCardsUserByUserId(usersRoom[1])
          this.io.to(currentRoom).emit('start-game', usersRoom[0])


          // // Si deux joueurs sont connectés, crée une nouvelle salle
          // roomCount++;
          // currentRoom = `room${roomCount}`;
          // usersRoom = [];
        }

        socket.on('disconnect', () => {
          playerCount--
          playerCountRoom--
          console.log(`***** ${player.pseudo} s'est déconnecté`);         //Log le serveur
          console.log('***** nombre de joueurs connecté ', playerCount)   //Log le serveur
        });
      });

      socket.on('player-1-action',(i,action)=>{
        console.log(`***** J1 joue ${user1Cards[i-1].name} et ${action}`);
        user1turn = [user1Cards[i-1], action]
        this.io.to(currentRoom).emit('pokemon-player-2', usersRoom[1])
      });

      socket.on('player-2-action',(i,action)=>{
        console.log(`***** J2 joue ${user2Cards[i-1].name} et ${action}`);
        user2turn = [user2Cards[i-1], action]

        console.log('----- calcul des résultats')

        //si la vitesse est superior à l'autre pokemon, il a plus de chance de commencer à attaquer
        let randomNumberBetweenSpeedPokemons = Math.floor(Math.random() * (user1turn[0].speed+user2turn[0].speed - 1 + 1)) + 1;
        if (user1turn[0].speed > user2turn[0].speed) {

          if (randomNumberBetweenSpeedPokemons <= user1turn[0].speed) {
            let playerStart = usersRoom[0]
            let pourcent = Math.round(((user1turn[0].speed)/((user1turn[0].speed)+(user2turn[0].speed)))*100)
            console.log('***** '+playerStart+' commence avec '+ pourcent +'% de chance de commencer')

            resultj1 = j1played();
            if (!resultj1[0]) { // result[0] vérifie le booléen qui check si il a tué le pokémon adverse ou non
              resultj2 = j2played();
              return this.io.to(currentRoom).emit('display round', user1turn, user2turn,playerStart, pourcent, resultj1, resultj2)
            } else {
              return this.io.to(currentRoom).emit('display round', user1turn, user2turn,playerStart, pourcent, resultj1, null)
            }

          } else {
            let playerStart = usersRoom[1]
            let pourcent = Math.round(((user2turn[0].speed) / ((user1turn[0].speed) + (user2turn[0].speed))) * 100)
            console.log('**** '+playerStart+' commence avec ' + pourcent + '% de chance de commencer')

            resultj2 = j2played();
            if (!resultj2[0]) { // result[0] vérifie le booléen qui check si il a tué le pokémon adverse ou non
              resultj1 = j1played();
              return this.io.to(currentRoom).emit('display round', user1turn, user2turn,playerStart, pourcent, resultj2, resultj1)
            } else {
              return this.io.to(currentRoom).emit('display round', user1turn, user2turn,playerStart, pourcent, resultj2, null)
            }
          }

        } else {
          if (randomNumberBetweenSpeedPokemons > user1turn[0].speed) {
            let playerStart = usersRoom[1]
            let pourcent = Math.round(((user2turn[0].speed) / ((user1turn[0].speed) + (user2turn[0].speed))) * 100)
            console.log('**** '+playerStart+' commence avec ' + pourcent + '% de chance de commencer')

            resultj2 = j2played();
            if (!resultj2[0]) { // result[0] vérifie le booléen qui check si il a tué le pokémon adverse ou non
              resultj1 = j1played();
              return this.io.to(currentRoom).emit('display round', user1turn, user2turn,playerStart, pourcent, resultj2, resultj1)
            } else {
              return this.io.to(currentRoom).emit('display round', user1turn, user2turn,playerStart, pourcent, resultj2, null)
            }

          } else {
            let playerStart = usersRoom[0]
            let pourcent = Math.round(((user1turn[0].speed)/((user1turn[0].speed)+(user2turn[0].speed)))*100)
            console.log('***** '+playerStart+' commence avec '+ pourcent +'% de chance de commencer')

            resultj1 = j1played();
            if (!resultj1[0]) { // result[0] vérifie le booléen qui check si il a tué le pokémon adverse ou non
              resultj2 = j2played();
              return this.io.to(currentRoom).emit('display round', user1turn, user2turn,playerStart, pourcent, resultj1, resultj2)
            } else {
              return this.io.to(currentRoom).emit('display round', user1turn, user2turn,playerStart, pourcent, resultj1, null)
            }
          }
        }
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