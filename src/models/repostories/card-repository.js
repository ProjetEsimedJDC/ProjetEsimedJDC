const { Card } = require('../models/card.model.js');

exports.getCard = async () => await Card.findAll();

exports.getCardById = async (id_card) => {
    return await Card.findOne({ where: { id_card } });
};

exports.createCard = async (body) => {
    await Card.create(body);
};

// exports.updateUser = async (id, data) => {
//     const foundUser = await User.findOne({ where: { id } });
//     var salt = bcrypt.genSaltSync(10);
//     var hash = bcrypt.hashSync(data.password, salt);
//
//     if (!foundUser) {
//         throw new Error('User not found');
//     }
//
//     await User.update({
//         firstName: data.firstName || foundUser.firstName,
//         lastName: data.lastName || foundUser.lastName,
//         isAdmin: data.isAdmin || foundUser.isAdmin,
//         password: data.password ? hash : foundUser.password,
//     }, { where: { id } });
// };
//
// exports.deleteUser = async (id) => {
//     await User.destroy({ where: { id } });
// }