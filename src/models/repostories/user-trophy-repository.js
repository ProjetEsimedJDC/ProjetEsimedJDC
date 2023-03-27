const {Trophy} = require("../models/trophy.model");
const uuid = require("uuid");
const {User_card} = require("../models/user_card.model");
const {User_trophy} = require("../models/user_trophy.model");

 exports.createUserTrophy = async (body) => {
     const userTrophy = body;
     userTrophy.id_user_trophy = uuid.v4();

     await User_trophy.create(userTrophy);
 };

exports.findAllByIdUser = async (id_user) => {
    return await User_trophy.findAll({where : {id_user}});
};