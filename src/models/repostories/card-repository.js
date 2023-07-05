const { Card } = require('../models/card.model.js');
const userRepository  = require('../repostories/user-repository.js');
const {User} = require("../models/user.model");

exports.getCards = async () => await Card.findAll();

exports.getCardById = async (id_card) => {
    return await Card.findOne({ where: { id_card } });
};
/**
 *
 * @param id_user
 * @returns {Promise<*[]>}
 */
exports.getCardsUserByUserId = async (id_user) => {
    let user = await userRepository.getUserById(id_user)

    let userCard1 = await this.getCardById(user.id_card_1)
    let userCard2 = await this.getCardById(user.id_card_2)
    let userCard3 = await this.getCardById(user.id_card_3)

    let UserCards = []

    UserCards.push(userCard1,userCard2,userCard3)

    return UserCards
};

exports.createCard = async (body) => {
    await Card.create(body);
};