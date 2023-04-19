const express = require('express');
const router = express.Router();
require('dotenv').config()

const gameHistoryRepository = require('../models/repostories/game-history-repository');
const gameRepository = require('../models/repostories/game-repository');
const userRepository = require('../models/repostories/user-repository');
const userTrophyRepository = require('../models/repostories/user-trophy-repository');
const cardRepository = require("../models/repostories/card-repository");
const userCardRepository = require("../models/repostories/user-card-repository");
const trophyRepository = require("../models/repostories/trophy-repository");
const uuid = require("uuid");
const {User_trophy} = require("../models/models/user_trophy.model");


router.get('/findAll/:id_user', async (req, res) => {
    let id_user = req.params.id_user
    let userTrophies = await userTrophyRepository.findAllByIdUser(id_user)

    let array = []

    for (const userTrophy of userTrophies) {
        let trophy = await trophyRepository.getTrophyById(userTrophy.id_trophy)
        trophy.svg = trophy.svg.toString("utf8")

        array.push(trophy)
    }

    return res.status(200).send(array)
});

router.post('/create/:id_user/:name', async (req, res) => {
    try {
        let id_user = req.params.id_user
        let name_trophy = req.params.name
        let id_trophy = (await trophyRepository.getTrophyByName(name_trophy)).id_trophy

        await userTrophyRepository.createUserTrophy({
            id_user: id_user,
            id_trophy: id_trophy,
        });

        await userRepository.updateCoins(id_user, 200)

        res.status(200).end()
    } catch (e) {
        console.log(e)
        return res.status(500).end()
    }
});

router.get('/remaining-trophies/:id_user', async (req, res) => {
    let id_user = req.params.id_user

    let userTrophies = await userTrophyRepository.findAllByIdUser(id_user)

    let trophies = await trophyRepository.findAll()

    let remainingTrophies = []

    for (let i = 0; i < trophies.length; i++) {
        let trophy = trophies[i]
        let userHasTrophy = false

        for (let j = 0; j < userTrophies.length; j++) {
            let userTrophy = userTrophies[j]
            if (userTrophy.id_trophy === trophy.id_trophy) {
                userHasTrophy = true
                break
            }
        }

        if (!userHasTrophy) {
            remainingTrophies.push(trophy)
        }
    }

    // if (remainingTrophies.length === 0) {
    //     return res.status(404).send({ error: 'Aucun trophée restant trouvé pour cet utilisateur.' })
    // }

    return res.status(200).send(remainingTrophies)
});

router.get('/seeder', async (req, res) => {
    try {
        let allTrophies = await trophyRepository.findAll()
        let id_user = await userRepository.getIdUserByEmail('test@gmail.com')
        let i=1
        for (const Trophy of allTrophies) {
            if (i<5){
                await userTrophyRepository.createUserTrophy({
                    id_user: id_user,
                    id_trophy: Trophy.id_trophy,
                });
            }
            i++
        }

        res.status(200).end()
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
});
exports.initializeRoutes = () => router;