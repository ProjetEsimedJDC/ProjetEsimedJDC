// const { users } = require('./db');
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

exports.createUser = async (body) => {
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(body.password, salt);

  const user = body;
  user.id_user = uuid.v4();

  user.password = hash;

  await User.create(user);
};

exports.updateUser = async (id_user, data) => {
  const foundUser = await User.findOne({ where: { id_user } });
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(data.password, salt);

  if (!foundUser) {
    throw new Error('User not found');
  }

  await User.update({
    // firstName: data.firstName || foundUser.firstName,
    // lastName: data.lastName || foundUser.lastName,
    // isAdmin: data.isAdmin || foundUser.isAdmin,
    // password: data.password ? hash : foundUser.password,
  }, { where: { id_user } });
};

exports.deleteUser = async (id_user) => {
  await User.destroy({ where: { id_user } });
}