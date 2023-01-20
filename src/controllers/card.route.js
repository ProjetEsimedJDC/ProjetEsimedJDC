const express = require('express');
const router = express.Router();
const cardRepository = require('../models/card-repository');
require('dotenv').config()

// const { body, validationResult } = require('express-validator');
const {Card} = require("../models/card.model");

router.get('/seeder', async (req, res) => {
    try {
        await cardRepository.createCard({
            name: "pika",
            power : 50,
            type : "foudre",
            price : 50
        });
        await cardRepository.createCard({
            name: "cara",
            power : 40,
            type : "eau",
            price : 50
        });
        await cardRepository.createCard({
            name: "draco",
            power : 60,
            type : "feu",
            price : 50
        });

        const cards = await Card.findAll();

        res.status(200).send(cards)
    } catch (e) {
        res.status(500).send("Ces cartes sont déjà créées");
    }
});

router.get('/', async (req, res) => {
    res.send(await cardRepository.getCard());
});

exports.initializeRoutes = () => router;