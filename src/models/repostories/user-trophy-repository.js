const {Trophy} = require("../models/trophy.model");
const uuid = require("uuid");
const {User_card} = require("../models/user_card.model");
const {User_trophy} = require("../models/user_trophy.model");
const userRepository = require("./user-repository");
const trophyRepository = require("./trophy-repository");

 exports.createUserTrophy = async (body) => {
     const userTrophy = body;
     userTrophy.id_user_trophy = uuid.v4();

     await User_trophy.create(userTrophy)
 };

exports.createUserTrophyIntoWebSocket = async (id_user, name_trophy) => {
    const userTrophy = {id_user_trophy: uuid.v4(),id_user : id_user, id_trophy : '' };

    userTrophy.id_trophy = (await trophyRepository.getTrophyByName(name_trophy)).id_trophy;

    await User_trophy.create(userTrophy)

    await userRepository.updateCoins(id_user, 200)
};

exports.findAllByIdUser = async (id_user) => {
    return await User_trophy.findAll({where : {id_user}});
};