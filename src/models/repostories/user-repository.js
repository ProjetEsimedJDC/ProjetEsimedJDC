const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const { User } = require('../models/user.model.js');

exports.getUsers = async () => await User.findAll();

exports.getUserByPseudo = async (pseudo) => {
  return await User.findOne({ where: { pseudo } });
};

exports.getUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

exports.getUserById = async (id_user) => {
  return await User.findOne({ where: { id_user } });
};

exports.getIdUserByEmail = async (email) => {
  let user = await User.findOne({ where: { email } });
  return `${user.id_user}`
};

exports.createUser = async (body) => {
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(body.password, salt);

  const user = body;
  user.id_user = uuid.v4();

  user.password = hash;

  await User.create(user);
};

exports.updateUserChoseCard1 = async (id_user,id_card_user ,id_card) => {
  const foundUser = await User.findOne({ where: { id_user } });

  if (!foundUser) {
    throw new Error('User not found');
  }

  if (id_card_user === '1') {
    await User.update({
      id_card_1 : id_card === '0' ? null : id_card
    }, { where: { id_user } });
  }
  if (id_card_user === '2') {
    await User.update({
      id_card_2 : id_card === '0' ? null : id_card
    }, { where: { id_user } });
  }
  if (id_card_user === '3') {
    await User.update({
      id_card_3 : id_card === '0' ? null : id_card
    }, { where: { id_user } });
  }

};

exports.updateUser = async (id_user,data) => {
  const foundUser = await User.findOne({ where: { id_user } });

  if (!foundUser) {
    throw new Error('User not found');
  }

  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(data.password, salt);

  await User.update({
    pseudo :  data.pseudo || foundUser.pseudo,
    email : data.email || foundUser.email,
    password : hash || foundUser.password,
  }, { where: { id_user } });
};

exports.updateCoins = async (id_user, coins) => {
  let user = await User.findOne({where : {id_user}})

  await user.update({
    coins : user.coins + coins
  })
};

// exports.updateUser = async (id_user, data) => {
//   const foundUser = await User.findOne({ where: { id_user } });
//   let salt = bcrypt.genSaltSync(10);
//   let hash = bcrypt.hashSync(data.password, salt);
//
//   if (!foundUser) {
//     throw new Error('User not found');
//   }
//
//   await User.update({
//     // firstName: data.firstName || foundUser.firstName,
//     // lastName: data.lastName || foundUser.lastName,
//     // isAdmin: data.isAdmin || foundUser.isAdmin,
//     // password: data.password ? hash : foundUser.password,
//   }, { where: { id_user } });
// };
//
// exports.deleteUser = async (id_user) => {
//   await User.destroy({ where: { id_user } });
// }