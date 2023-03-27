const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const { Game } = require('../models/game.model.js');
const gameHistoryRepository = require('../repostories/game-history-repository.js');
const {Game_history} = require("../models/game_history.model");

exports.getAllGame = async () => {
  return await Game.findAll();
};

exports.getAllGameIdByUserId = async (id_user) => {
  return await Game_history.findAll({ where: { id_user }, attributes: ['id_game'] });
};

exports.getGameByType = async (type) => {
  try {
    return await Game.findOne({ where: { type : type } });
  }catch (e) {
    console.log(e)
  }
};
//
// exports.getUserByEmail = async (email) => {
//   return await User.findOne({ where: { email } });
// };
//
// exports.getUserById = async (id_user) => {
//   return await User.findOne({ where: { id_user } });
// };
//
// exports.getIdUserByEmail = async (email) => {
//   let user = await User.findOne({ where: { email } });
//   return `${user.id_user}`
// };
//
exports.createGame = async (roomName, usersRoom) => {
  let id_game = uuid.v4()

  try {
    await Game.create({
      id_game: id_game,
      type: roomName,
      is_end : false
    });
    console.log(`*-*-*-* La ${roomName} a été inséré en BDD`)

    await gameHistoryRepository.createGameHistory(id_game, usersRoom);

  } catch (e) {
    console.log(e)
  }
};
//
// exports.updateUserChoseCard1 = async (id_user,id_card_user ,id_card) => {
//   const foundUser = await User.findOne({ where: { id_user } });
//
//   if (!foundUser) {
//     throw new Error('User not found');
//   }
//
//   if (id_card_user === '1') {
//     await User.update({
//       id_card_1 : id_card === '0' ? null : id_card
//     }, { where: { id_user } });
//   }
//   if (id_card_user === '2') {
//     await User.update({
//       id_card_2 : id_card === '0' ? null : id_card
//     }, { where: { id_user } });
//   }
//   if (id_card_user === '3') {
//     await User.update({
//       id_card_3 : id_card === '0' ? null : id_card
//     }, { where: { id_user } });
//   }
//
// };
//
// exports.updateUser = async (id_user,data) => {
//   const foundUser = await User.findOne({ where: { id_user } });
//   console.log(foundUser)
//
//   if (!foundUser) {
//     throw new Error('User not found');
//   }
//
//   let salt = bcrypt.genSaltSync(10);
//   let hash = bcrypt.hashSync(data.password, salt);
//
//   await User.update({
//     pseudo :  data.pseudo || foundUser.pseudo,
//     email : data.email || foundUser.email,
//     password : hash || foundUser.password,
//   }, { where: { id_user } });
// };