const { Game_history } = require('../models/game_history.model.js');
const { Game } = require('../models/card.model');
const uuid = require("uuid");

// exports.getAllUserCardById = async (id_user) => {
//     return await Game_history.findAll({ where: { id_user } });
// };
//
exports.createGameHistory = async (id_game, usersRoom) => {
    try {
        usersRoom.forEach( user =>
            Game_history.create({
                id_game_history : uuid.v4(),
                id_game: id_game,
                id_user: user,
            })
        )
        console.log(`*-*-*-* Les joueurs ont été inséré en BDD`)
    } catch (e) {
        console.log(e)
    }

};