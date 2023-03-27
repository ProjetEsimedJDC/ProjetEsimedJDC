const express = require('express');
const router = express.Router();
require('dotenv').config()

const gameHistoryRepository = require('../models/repostories/game-history-repository');
const gameRepository = require('../models/repostories/game-repository');
const userRepository = require('../models/repostories/user-repository');


router.get('/findAll/size', async (req, res) => {
    try{
        let allGameSize = (await gameRepository.getAllGame).length

        return res.status(200).send(allGameSize)
    } catch (e) {
        return res.status(500).send(e)
    }
});

exports.initializeRoutes = () => router;