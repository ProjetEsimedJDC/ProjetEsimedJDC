const { User_card } = require('../models/user_card.model.js');
const { Card } = require('../models/card.model');
const uuid = require("uuid");

exports.getAllUserCardById = async (id_user) => {
    return await User_card.findAll({ where: { id_user } });
};

exports.createUserCard = async (body) => {
    const userCard = body;
    userCard.id_user_card = uuid.v4();

    await User_card.create(userCard);
};