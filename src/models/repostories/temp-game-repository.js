const { Temp_Game } = require('../models/temp_game.model.js');
const {User} = require("../models/user.model");

exports.findAllTempGame = async () => {
    return await Temp_Game.findAll();
};

exports.findTempGame = async (id_user) => {
    return await Temp_Game.findOne({ where: { id_user } });
};

exports.createTempGame = async (id_user) => {
    let data = {'id_user' : id_user}
    await Temp_Game.create(data);
};

exports.deleteTempGameByUserId = async (id_user) => {
    await Temp_Game.destroy({ where: { id_user } });
};