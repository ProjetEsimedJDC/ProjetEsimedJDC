const express = require('express');
const { initializeConfigMiddlewares, initializeErrorMiddlwares } = require('./middlewares');
const userRoutes = require('../controllers/user.routes');
const authRoutes = require('../controllers/auth.route');
const cardRoutes = require('../controllers/card.route');
const userCardRoutes = require('../controllers/user-card.routes');
const gameHistoryRoutes = require('../controllers/game-history.route');
const gameRoutes = require('../controllers/games.route');
const trophyRoutes = require('../controllers/trophy.route');
const userTrophysRoutes = require('../controllers/user-trophy.route')

const { sequelize } = require('../models/postgres.db')

const { User } = require("../models/models/user.model");
const { Card } = require("../models/models/card.model");
const { User_card } = require("../models/models/user_card.model");
const { Game } = require("../models/models/game.model");
const { Game_history } = require("../models/models/game_history.model");
const { Trophy } = require("../models/models/trophy.model");
const { User_trophy } = require("../models/models/user_trophy.model");

const gameRepository = require('../models/repostories/game-repository');
const gameHistoryRepository = require('../models/repostories/game-history-repository');
const cardRepository = require('../models/repostories/card-repository');
const userRepository = require("../models/repostories/user-repository");


const http = require('http');
const socketIo = require('socket.io');
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

    User.belongsToMany(Trophy, { through: User_trophy, foreignKey: 'id_user' });
    Trophy.belongsToMany(User, { through: User_trophy, foreignKey: 'id_trophy' });

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
    this.app.use('/auth', authRoutes.initializeRoutes());
    this.app.use('/users', userRoutes.initializeRoutes());
    this.app.use('/cards', cardRoutes.initializeRoutes());
    this.app.use('/games', gameRoutes.initializeRoutes());
    this.app.use('/trophys', trophyRoutes.initializeRoutes());
    this.app.use('/user-trophys', userTrophysRoutes.initializeRoutes());
    this.app.use('/user-cards', userCardRoutes.initializeRoutes());
    this.app.use('/games-history', gameHistoryRoutes.initializeRoutes());
  }

  async _initializeWebSocket() {
    const MAX_PLAYERS_PER_ROOM = 2;
    let current_room

    try {
      current_room = (await gameRepository.getAllGame()).length +1;
    } catch (e) {
      current_room = 1
    }

    let ROOM = `room${current_room}`;
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

    async function checkIfReadyToStart(roomName) {
      let RoomFull = roomName;
      const room = gameData.rooms[roomName];
      if (room.users.length === MAX_PLAYERS_PER_ROOM) {
        room.readyToStart = true;

        for (const user of room.users) {
          let cards = await cardRepository.getCardsUserByUserId(user.id_user);
          room.userCards.push(cards)
        }

        await gameRepository.createGame(roomName, room.users)
        io.to(RoomFull).emit('game-created', room.users);
        io.to(RoomFull).emit('turn-player', room.users[0], gameData.rooms[ROOM].userCards[0], RoomFull)
      }
    }

    function setResult(playerIndex, opponentIndex, RoomFull) {
      let actionTurnPlayer = gameData.rooms[RoomFull].turns[playerIndex][1]
      let pokemonTurnPlayer = gameData.rooms[RoomFull].turns[playerIndex][0]
      let opponentPokemonPlay = gameData.rooms[RoomFull].turns[opponentIndex][0]
      let opponentCards = gameData.rooms[RoomFull].userCards[opponentIndex]
      let opponentPokemonIndex;

      opponentCards.forEach((opponentCard, index) => {
        if (opponentCard.id_card === opponentPokemonPlay.id_card) {
          opponentPokemonIndex = index
        }
      })

      if (actionTurnPlayer === 'attack') {
        opponentCards[opponentPokemonIndex].HP = opponentCards[opponentPokemonIndex].HP - pokemonTurnPlayer.attack

        if (opponentCards[opponentPokemonIndex].HP <= 0) {
          gameData.rooms[RoomFull].results.push([true, pokemonTurnPlayer, opponentCards[opponentPokemonIndex], opponentIndex])
          return true
        }

        gameData.rooms[RoomFull].results.push([false, pokemonTurnPlayer, opponentCards[opponentPokemonIndex], opponentIndex])
        return false
      }
      return 0
    }

    function determinePlayerPlayFirst(randomNumberBetweenSpeedPokemons, playerMaxSpeed, playerMinSpeed, pokemonMaxSpeed, pokemonMinSpeed) {
      if (randomNumberBetweenSpeedPokemons <= pokemonMaxSpeed) {
        let playerStart = playerMaxSpeed
        let pourcent = Math.round(((pokemonMaxSpeed) / ((pokemonMaxSpeed) + (pokemonMinSpeed))) * 100)

        return [playerStart, pourcent]
      } else {
        let playerStart = playerMinSpeed
        let pourcent = Math.round(((pokemonMinSpeed) / ((pokemonMaxSpeed) + (pokemonMinSpeed))) * 100)

        return [playerStart, pourcent]
      }
    }

    function CompareSpeedPlayerAndDetermineWhoPlayFirst(RoomFull) {
      let pokemonPlayer1Speed = gameData.rooms[RoomFull].turns[0][0].speed
      let pokemonPlayer2Speed = gameData.rooms[RoomFull].turns[1][0].speed
      let randomNumberBetweenSpeedPokemons = Math.floor(Math.random() * pokemonPlayer1Speed + pokemonPlayer2Speed - 1 + 1) + 1;
      let playerMaxSpeed, playerMinSpeed, pokemonMaxSpeed, pokemonMinSpeed

      if (pokemonPlayer1Speed > pokemonPlayer2Speed) {
        playerMaxSpeed = gameData.rooms[RoomFull].users[0]
        playerMinSpeed = gameData.rooms[RoomFull].users[1]
        pokemonMaxSpeed = pokemonPlayer1Speed
        pokemonMinSpeed = pokemonPlayer2Speed
      } else {
        playerMaxSpeed = gameData.rooms[RoomFull].users[1]
        playerMinSpeed = gameData.rooms[RoomFull].users[0]
        pokemonMaxSpeed = pokemonPlayer2Speed
        pokemonMinSpeed = pokemonPlayer1Speed
      }

      return determinePlayerPlayFirst(randomNumberBetweenSpeedPokemons, playerMaxSpeed, playerMinSpeed, pokemonMaxSpeed, pokemonMinSpeed);

    }

    async function checkIfEndGame(RoomFull) {
      let endgame = false
      let counter = 0
      gameData.rooms[RoomFull].userCards[0].forEach((user1Card, index) => {
        if (user1Card.HP <= 0) {
          counter++
        }
      })

      if (counter === 3) {
        io.to(RoomFull).emit('end-game', gameData.rooms[RoomFull].users[1])
        await gameHistoryRepository.setResult(RoomFull, gameData.rooms[RoomFull].users[1].id_user, gameData.rooms[RoomFull].users[0].id_user)

        endgame = true
      }

      counter = 0
      gameData.rooms[RoomFull].userCards[1].forEach((user1Card, index) => {
        if (user1Card.HP <= 0) {
          counter++
        }
      })

      if (counter === 3) {
        io.to(RoomFull).emit('end-game', gameData.rooms[RoomFull].users[0])
        await gameHistoryRepository.setResult(RoomFull, gameData.rooms[RoomFull].users[0].id_user, gameData.rooms[RoomFull].users[1].id_user)

        endgame = true
      }
      return endgame;
    }

    function createNewRoom() {
      current_room++;
      ROOM = `room${current_room}`;
      gameData.rooms[ROOM] = {
        playerCount: 0,
        users: [],
        userCards: [],
        turns: [],
        results: [],
        readyToStart: false
      };
    }

    async function playCard(RoomFull) {
      if (gameData.rooms[RoomFull].turns.length < MAX_PLAYERS_PER_ROOM) {
        io.to(RoomFull).emit('turn-player', gameData.rooms[RoomFull].users[1], gameData.rooms[RoomFull].userCards[1], RoomFull)
      } else {
        let playerFirstAndPourcent = CompareSpeedPlayerAndDetermineWhoPlayFirst(RoomFull);
        let firstPlayerIndex;
        let secondPlayerIndex;

        gameData.rooms[RoomFull].users.forEach((user, index) => {
          if (user.id_user === playerFirstAndPourcent[0].id_user) {
            firstPlayerIndex = index;
          }
        });

        secondPlayerIndex = firstPlayerIndex === 1 ? 0 : 1;

        let setResultFirstPlayer = setResult(firstPlayerIndex, secondPlayerIndex, RoomFull)

        if (!setResultFirstPlayer) {
          setResult(secondPlayerIndex, firstPlayerIndex, RoomFull)
        }
        io.to(RoomFull).emit('display round', gameData.rooms[RoomFull].users[0], gameData.rooms[RoomFull].users[1], playerFirstAndPourcent, gameData.rooms[RoomFull].turns[0], gameData.rooms[RoomFull].turns[1], gameData.rooms[RoomFull].results[0], gameData.rooms[RoomFull].results.length === 2 ? gameData.rooms[RoomFull].results[1] : null)

        let endgame = await checkIfEndGame(RoomFull);

        io.to(RoomFull).emit('update-card', gameData.rooms[RoomFull].users[0], gameData.rooms[RoomFull].userCards[0], gameData.rooms[RoomFull].users[1], gameData.rooms[RoomFull].userCards[1], RoomFull)
        if (endgame) {

        } else {
          gameData.rooms[RoomFull].turns = [];
          gameData.rooms[RoomFull].results = [];

          io.to(RoomFull).emit('turn-player', gameData.rooms[RoomFull].users[0], gameData.rooms[RoomFull].userCards[0], RoomFull)
        }
      }
    }

    io.on('connection', (socket) => {
      console.log(`***** Un joueur s'est connecté`);
      // Quand un joueur rejoint une salle, ajoutez-le à la liste des joueurs de la salle
      socket.on('join-room', async (user) => {
        socket.join(ROOM);

        // Ajouter le joueur à la liste des utilisateurs de la partie
        gameData.users.push({user : user , socket : socket});

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
          createNewRoom();
        }
      });

      // Quand un joueur joue une carte, enregistrez-la et renvoyez les résultats
      socket.on('player-action', async (indexPokemonFront, action, userId, RoomFull) => {
        let indexPokemon = indexPokemonFront - 1
        let playerIndex;
        gameData.rooms[RoomFull].users.forEach((user, index) => {
          if (user.id_user === userId) {
            playerIndex = index;
          }
        });

        // Enregistrer la carte du joueur dans le tour actuel
        gameData.rooms[RoomFull].turns[playerIndex] = [gameData.rooms[RoomFull].userCards[playerIndex][indexPokemon], action];

        // Vérifiez si les deux joueurs ont joué leur tour, puis passez au tour suivant si c'est le cas
        await playCard(RoomFull);
      });

      socket.on('disconnect', () => {
        console.log(`***** Un joueur s'est déconnecté`);
      });
    });
  }
}

module.exports = WebServer;