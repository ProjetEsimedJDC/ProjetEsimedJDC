const { Game_history } = require('../models/game_history.model.js');
const gameRepository = require('../repostories/game-repository');
const uuid = require("uuid");
const userRepository = require("./user-repository");

exports.getAllGameHistoryByGameId = async (id_game) => {
    return await Game_history.findAll({ where: { id_game }});
};

exports.getAllGameHistoryByUserId = async (id_user) => {
    return await Game_history.findAll({ where: { id_user }});
};

exports.createGameHistory = async (id_game, usersRoom) => {
    try {
        for (const user of usersRoom) {
            await Game_history.create({
                id_game_history: uuid.v4(),
                id_game: id_game,
                id_user: user.id_user,
            });
        }
        console.log(`*-*-*-* Les joueurs ont été inséré en BDD`)
    } catch (e) {
        console.log(e)
    }
};

exports.setResult = async (room,userWinId, userLoseId ) => {
    try {
        let game = await gameRepository.getGameByType(room)

        console.log(game)

        let gameHistorys = await this.getGameHistoryByGameId(game.id_game)
        console.log(gameHistorys)

        for (const gameHistory of gameHistorys) {
            if (gameHistory.id_user === userWinId){
                await gameHistory.update({
                    result : "win"
                })
                await userRepository.updateCoins(gameHistory.id_user, 500)

            } else {
                await gameHistory.update({
                    result : "lose"
                })
                await userRepository.updateCoins(gameHistory.id_user, 250)
            }
        }

        await game.update({
            is_end : true
        })

        console.log(`*-*-*-* Les résultats ont été mis a jour`)
    } catch (e) {
        console.log(e)
    }
};

exports.getGameHistoryByGameId = async (id_game) => {
    try {
        return await Game_history.findAll({ where: { id_game : id_game } })
    } catch (e) {
        console.log(e)
    }
};
