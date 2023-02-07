const express = require('express');
const router = express.Router();
const userCardRepository = require('../models/repostories/user-card-repository');
const userRepository = require('../models/repostories/user-repository');
require('dotenv').config()
// const { body, validationResult } = require('express-validator');
const {User_card} = require("../models/models/user_card.model");
const cardRepository = require('../models/repostories/card-repository');
const tempGameRepository = require('../models/repostories/temp-game-repository');
const {body, validationResult} = require("express-validator");

router.post('/', async (req, res) => {
        try {
            if (await tempGameRepository.findTempGame(req.body.id_user)) {
                return res.status(500).send('Ce joueur est déjà en attente de partie');
            }
            await tempGameRepository.createTempGame(req.body.id_user)
            res.status(201).end()
        } catch (e) {
            console.log(e.errors)

            res.status(500).send(e.errors);
        }
    });

router.get('/', async (req, res) => {
    try {

        let tempGames = await tempGameRepository.findAllTempGame()
        console.log()
        if(!(tempGames.length > 0)) {
            return res.status(500).send('Temp Game is empty');
        }
        res.status(200).send(tempGames)
    } catch (e) {
        console.log(e.errors)

        res.status(500).send(e.errors);
    }
});
router.delete('/delete/:id_user', async (req, res) => {
    try {
        if (!await tempGameRepository.findTempGame(req.body.id_user)) {
            return res.status(500);
        }
        await tempGameRepository.deleteTempGameByUserId(req.params.id_user)
        res.status(200).end()
    } catch (e) {
        res.status(500).send(e.errors);
    }
});

exports.initializeRoutes = () => router;