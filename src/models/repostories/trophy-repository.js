const uuid = require("uuid");
const {Trophy} = require("../models/trophy.model");


exports.createTrophy = async (fileContent, name, description) => {
    let id_trophy = uuid.v4()
    console.log(fileContent)
    try {
        await Trophy.create({
            id_trophy: id_trophy,
            name: name,
            svg : fileContent,
            description : description
        });
    } catch (e) {
        console.log(e)
    }
};

exports.getTrophyByName = async (name) => {
    return await Trophy.findOne({where: { name }})
};

exports.getTrophyById = async (id_trophy) => {
    return await Trophy.findOne({where: { id_trophy }})
};

exports.findAll = async () => {
    return await Trophy.findAll()
};
