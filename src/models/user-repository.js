// const { users } = require('./db');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const { User } = require('../models/user.model.js');

exports.getUsers = async () => await User.findAll();

exports.getUserByFirstName = async (firstName) => {
  return await User.findOne({ where: { firstName } });
};

exports.createUser = async (body) => {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(body.password, salt);

  const user = body;
  user.id = uuid.v4();

  user.password = hash;

  await User.create(user);
};

exports.updateUser = async (id, data) => {
  const foundUser = await User.findOne({ where: { id } });
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(data.password, salt);
  
  if (!foundUser) {
    throw new Error('User not found');
  }

  await User.update({
    firstName: data.firstName || foundUser.firstName,
    lastName: data.lastName || foundUser.lastName,
    isAdmin: data.isAdmin || foundUser.isAdmin,
    password: data.password ? hash : foundUser.password,
  }, { where: { id } });
};

exports.deleteUser = async (id) => {
  await User.destroy({ where: { id } });
}