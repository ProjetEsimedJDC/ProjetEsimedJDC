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
  let number_unique = 0

    let is_unique_pseudo = await this.getUserByPseudo(body.pseudo)
    if (is_unique_pseudo){
      number_unique += 1
    }

    let is_unique_email = await this.getUserByEmail(body.email)
    if (is_unique_email) {
      number_unique += 2
    }

    if (number_unique !== 0) {
      return number_unique
    }

  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(body.password, salt);

  const user = body;
  user.id_user = uuid.v4();

  user.password = hash;

  user.coins = 1900
  await User.create(user);

  return 4;
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
  let user_info = this.getUserById(id_user)
  let email = data.email
  let pseudo = data.pseudo
  let users_same_email = User.findAll({where : {email}})
  let users_same_pseudo =  User.findAll({where : {pseudo}})
  let number_unique = 0

  if((await users_same_email).length !== 0){
    if ((await users_same_email).length === 1) {
      if ((await users_same_email)[0].email !== (await user_info).email){
        number_unique += 2
      }
    } else {
      number_unique += 2
    }
  }

  if((await users_same_pseudo).length !== 0){
    if ((await users_same_pseudo).length === 1) {
      if ((await users_same_pseudo)[0].pseudo !== (await user_info).pseudo){
        number_unique += 1
      }
    } else {
      number_unique += 1
    }
  }

  if (number_unique !== 0){
    return number_unique
  }


  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(data.password, salt);

  await User.update({
    pseudo: data.pseudo || user_info.pseudo,
    email: data.email || user_info.email,
    password: hash,
  }, {where: {id_user}})

  return 4
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
//S
exports.deleteUser = async (id_user) => {
  await User.destroy({ where: { id_user } });
}