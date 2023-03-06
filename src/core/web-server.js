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
const {set} = require("express/lib/application");

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
    const MAX_PLAYERS_PER_ROOM = 2;
    let current_room = 1;
    const ROOM = `room${current_room}`;
    const io = this.io

    const gameData = {
      users: [],
      rooms: {
        [ROOM]: {
          playerCount: 0,
          users: [], //2 joueurs
          userCards: [], //Cartes des 2 joueurs
          turns: [], // [obj: pokemon joué, string: action(attack ou defense)] x2
          results: [], // [bool: pokemon kill, obj: pokemon play, obj: pokemon adverse, joueur en face] x2
          readyToStart: false
        }
      }
    };

    function setResult (playerIndex, opponentIndex) {
      let actionTurnPlayer = gameData.rooms[ROOM].turns[playerIndex][1]
      let pokemonTurnPlayer = gameData.rooms[ROOM].turns[playerIndex][0]
      let opponentPokemonPlay = gameData.rooms[ROOM].turns[opponentIndex][0]
      let opponentCards = gameData.rooms[ROOM].userCards[opponentIndex]
      let opponentPokemonIndex;

        opponentCards.forEach((opponentCard, index) => {
          if (opponentCard.id_card === opponentPokemonPlay.id_card) {
            opponentPokemonIndex = index
          }
        })

        if (actionTurnPlayer === 'attack'){
          opponentCards[opponentPokemonIndex].HP = opponentCards[opponentPokemonIndex].HP - pokemonTurnPlayer.attack

          if (opponentCards[opponentPokemonIndex].HP <= 0){
            gameData.rooms[ROOM].results.push([true, pokemonTurnPlayer, opponentCards[opponentPokemonIndex], opponentIndex])
            return true
          }

          gameData.rooms[ROOM].results.push([false, pokemonTurnPlayer, opponentCards[opponentPokemonIndex], opponentIndex])
          return false
        }
      return 0
    }

    async function checkIfReadyToStart(roomName) {
      const room = gameData.rooms[roomName];
      if (room.users.length === MAX_PLAYERS_PER_ROOM) {
        room.readyToStart = true;

        for (const user of room.users) {
          let cards = await cardRepository.getCardsUserByUserId(user.id_user);
          room.userCards.push(cards)
        }

        io.to(roomName).emit('game-created', room.users);
        io.to(roomName).emit('turn-player', room.users[0], gameData.rooms[ROOM].userCards[0])
      }
    }

    function determinePlayerPlayFirst(randomNumberBetweenSpeedPokemons, playerMaxSpeed, playerMinSpeed, pokemonMaxSpeed, pokemonMinSpeed) {
      if (randomNumberBetweenSpeedPokemons <= pokemonMaxSpeed) {
        let playerStart = playerMaxSpeed
        let pourcent = Math.round(((pokemonMaxSpeed)/((pokemonMaxSpeed)+(pokemonMinSpeed)))*100)

        return [playerStart, pourcent]
      } else {
        let playerStart = playerMinSpeed
        let pourcent = Math.round(((pokemonMinSpeed)/((pokemonMaxSpeed)+(pokemonMinSpeed)))*100)

        return [playerStart, pourcent]
      }
    }

    function CompareSpeedPlayerAndDetermineWhoPlayFirst() {
      let pokemonPlayer1Speed = gameData.rooms[ROOM].turns[0][0].speed
      let pokemonPlayer2Speed = gameData.rooms[ROOM].turns[1][0].speed
      let randomNumberBetweenSpeedPokemons = Math.floor(Math.random() * pokemonPlayer1Speed + pokemonPlayer2Speed - 1 + 1) + 1;
      let playerMaxSpeed,playerMinSpeed, pokemonMaxSpeed, pokemonMinSpeed

      if (pokemonPlayer1Speed > pokemonPlayer2Speed) {
        playerMaxSpeed = gameData.rooms[ROOM].users[0]
        playerMinSpeed = gameData.rooms[ROOM].users[1]
        pokemonMaxSpeed = pokemonPlayer1Speed
        pokemonMinSpeed = pokemonPlayer2Speed
      } else {
        playerMaxSpeed = gameData.rooms[ROOM].users[1]
        playerMinSpeed = gameData.rooms[ROOM].users[0]
        pokemonMaxSpeed = pokemonPlayer2Speed
        pokemonMinSpeed = pokemonPlayer1Speed
      }

      return determinePlayerPlayFirst(randomNumberBetweenSpeedPokemons, playerMaxSpeed, playerMinSpeed, pokemonMaxSpeed, pokemonMinSpeed);

    }

    function checkIfEndGame() {
      let endgame = false
      let counter = 0
      gameData.rooms[ROOM].userCards[0].forEach((user1Card, index) => {
        if (user1Card.HP <= 0) {
          counter++
        }
      })

      if (counter === 3) {
        console.log(`${gameData.rooms[ROOM].users[1].pseudo} a gagné`)
        io.to(ROOM).emit('end-game',gameData.rooms[ROOM].users[1])
        endgame = true
      }

      counter = 0
      gameData.rooms[ROOM].userCards[1].forEach((user1Card, index) => {
        if (user1Card.HP <= 0) {
          counter++
        }
      })

      if (counter === 3) {
        console.log(`${gameData.rooms[ROOM].users[0].pseudo} a gagné`)
        io.to(ROOM).emit('end-game',gameData.rooms[ROOM].users[0])
        endgame = true
      }
      return endgame;
    }

    function playCard() {
      if (gameData.rooms[ROOM].turns.length < MAX_PLAYERS_PER_ROOM){
        io.to(ROOM).emit('turn-player', gameData.rooms[ROOM].users[1], gameData.rooms[ROOM].userCards[1])
      } else {
        let playerFirstAndPourcent = CompareSpeedPlayerAndDetermineWhoPlayFirst();
        let firstPlayerIndex;
        let secondPlayerIndex;

        gameData.rooms[ROOM].users.forEach((user, index) => {
          if (user.id_user === playerFirstAndPourcent[0].id_user) {
            firstPlayerIndex = index;
          }
        });

        secondPlayerIndex = firstPlayerIndex === 1 ? 0 : 1;

        let setResultFirstPlayer = setResult(firstPlayerIndex,secondPlayerIndex)

        if (!setResultFirstPlayer){
          setResult(secondPlayerIndex, firstPlayerIndex)
        }
        io.to(ROOM).emit('display round', gameData.rooms[ROOM].users[0],gameData.rooms[ROOM].users[1],playerFirstAndPourcent, gameData.rooms[ROOM].turns[0],gameData.rooms[ROOM].turns[1], gameData.rooms[ROOM].results[0], gameData.rooms[ROOM].results.length === 2 ? gameData.rooms[ROOM].results[1] : null)

        let endgame = checkIfEndGame();

        io.to(ROOM).emit('update-card', gameData.rooms[ROOM].users[0], gameData.rooms[ROOM].userCards[0],gameData.rooms[ROOM].users[1], gameData.rooms[ROOM].userCards[1])
        if (endgame) {

        } else {
          gameData.rooms[ROOM].turns = [];
          gameData.rooms[ROOM].results = [];

          io.to(ROOM).emit('turn-player', gameData.rooms[ROOM].users[0], gameData.rooms[ROOM].userCards[0])
        }
      }
    }

    io.on('connection', (socket) => {
      console.log(`***** Un joueur s'est connecté`);
      // Quand un joueur rejoint une salle, ajoutez-le à la liste des joueurs de la salle
      socket.on('join-room', async (user) => {
        socket.join(ROOM);

        // Ajouter le joueur à la liste des utilisateurs de la partie
        gameData.users.push(user);

        // Ajouter le joueur à la salle
        gameData.rooms[ROOM].users.push(user);
        gameData.rooms[ROOM].playerCount++;

        //Informe le joueur qu'il a rejoint une room
        socket.emit('joined-lobby', (ROOM))

        // Si la salle n'a pas atteint le nombre de joueurs maximal, attendez d'autres joueurs
        if (gameData.rooms[ROOM].playerCount < MAX_PLAYERS_PER_ROOM) {
          socket.emit('waiting-for-players');
        } else {
          // Si la salle est pleine, commencez la partie
          await checkIfReadyToStart(ROOM);
          // current_room++
        }
      });

      // Quand un joueur joue une carte, enregistrez-la et renvoyez les résultats
      socket.on('player-action', async (indexPokemonFront, action, userId) => {
        let indexPokemon = indexPokemonFront-1
        let playerIndex;
        gameData.rooms[ROOM].users.forEach((user, index) => {
            if (user.id_user === userId) {
              playerIndex = index;
            }
        });

        // Enregistrer la carte du joueur dans le tour actuel
        gameData.rooms[ROOM].turns[playerIndex] = [gameData.rooms[ROOM].userCards[playerIndex][indexPokemon], action];

        // Vérifiez si les deux joueurs ont joué leur tour, puis passez au tour suivant si c'est le cas
        playCard();
      });

      socket.on('disconnect', () => {
        console.log(`***** Un joueur s'est déconnecté`);
      });
    });
  }
}

module.exports = WebServer;