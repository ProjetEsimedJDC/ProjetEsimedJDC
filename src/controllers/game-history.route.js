const express = require('express');
const router = express.Router();
require('dotenv').config()

const gameHistoryRepository = require('../models/repostories/game-history-repository');
const gameRepository = require('../models/repostories/game-repository');
const userRepository = require('../models/repostories/user-repository');


router.get('/:id_user', async (req, res) => {
    try{
        let id_user = req.params.id_user

        let allGameId = await gameRepository.getAllGameIdByUserId(id_user)

        let data = []
        let i = 0
        for (const gameId of allGameId) {
            i++
            let current_data = {id: i ,result : "", opponent : "", coins : "" , date : ""}
            let id_game = gameId["id_game"]

            let gameHistoryGames = await gameHistoryRepository.getGameHistoryByGameId(id_game)

            for (const gameHistoryGame of gameHistoryGames) {
                current_data.date = gameHistoryGame.createdAt

                if (gameHistoryGame.id_user === id_user) {
                    current_data.result = gameHistoryGame.result
                    if (current_data.result === 'win'){
                        current_data.coins = "500"
                    }
                    if (current_data.result === 'lose') {
                        current_data.coins = "250"
                    }
                    if (current_data.result === 'abandon') {
                        current_data.coins = "0"
                    }
                } else {
                    let opponentUser = await userRepository.getUserById(gameHistoryGame.id_user)
                    current_data.opponent = opponentUser.pseudo
                }
            }
            data.push(current_data)
        }


        return res.status(200).send(data)
    } catch (e) {
        console.log(e)
    }

});

exports.initializeRoutes = () => router;