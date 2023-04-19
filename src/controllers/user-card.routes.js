const express = require('express');
const router = express.Router();
const userCardRepository = require('../models/repostories/user-card-repository');
const userRepository = require('../models/repostories/user-repository');
require('dotenv').config()
// const { body, validationResult } = require('express-validator');
const {User_card} = require("../models/models/user_card.model");
const cardRepository = require('../models/repostories/card-repository');
const {body, validationResult} = require("express-validator");
const uuid = require('uuid');
const {User} = require("../models/models/user.model");


router.get('/seeder', async (req, res) => {
    try {
        let allCards = await cardRepository.getCards()
        for (const Card of allCards) {
            await userCardRepository.createUserCard({
                id_user: await userRepository.getIdUserByEmail('test@gmail.com'),
                id_card: Card.id_card,
            });
        }

        for (let i =1 ; i<25; i++) {
            await userCardRepository.createUserCard({
                id_user: await userRepository.getIdUserByEmail('adriencompare@gmail.com'),
                id_card: i,
            });
        }

        await userCardRepository.getAllUserCardById(await userRepository.getIdUserByEmail('test@gmail.com'));

        res.status(200).end()
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
});

router.get('/load/:id_user', async (req, res) => {
    try {
        let id_user = req.params.id_user
        const user_cards = await userCardRepository.getAllUserCardById(id_user)

        if (!user_cards) {
          res.status(500).send('User not found');
          return;
        }

        let array = []
        for (const user_card of user_cards) {
            array.push(await cardRepository.getCardById(user_card.id_card));
        }

          res.status(200).send(array);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/load/without-ones-he-has/:id', async (req, res) => {
    try {
        const user_cards = await userCardRepository.getAllUserCardById(req.params.id)

        let UserCards = []
        for (const user_card of user_cards) {
            let card = await cardRepository.getCardById(user_card.id_card)
            UserCards.push(card.id_card);
        }

        let array = []
        let allCards = await cardRepository.getCards()

        for (const Card of allCards) {
            if (!UserCards.includes(Card.id_card)){
                array.push(await cardRepository.getCardById(Card.id_card));
            }
        }

        res.status(200).send(array);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/load/without-deck/:id', async (req, res) => {
    try {
        const foundUser = await userRepository.getUserById(req.params.id);

        if (!foundUser) {
            res.status(500).send('User not found');
            return;
        }

        const user_cards = await userCardRepository.getAllUserCardById(req.params.id)
        let array = []
        for (const user_card of user_cards) {
            if(foundUser.id_card_1 === user_card.id_card  ){
            } else if (foundUser.id_card_2 === user_card.id_card ){
            } else if (foundUser.id_card_3 === user_card.id_card) {
            } else {
                array.push(await cardRepository.getCardById(user_card.id_card));
            }
        }

        if (!array) {
            res.status(500).send('User not having cards');
            return;
        }

        res.status(200).send(array);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post('/buyCard',async (req, res) => {
        try {
            const id_user = req.body.id_user
            const id_card = req.body.id_card

            const user = await userRepository.getUserById(id_user)
            const card = await cardRepository.getCardById(id_card)

            if (card.price > user.coins){
                return res.status(400).send('L\'utilisateur n`\'a pas assez de pièces pour acheter cette carte');
            }

            const foundUser = await User.findOne({ where: { id_user } });

            if (!foundUser) {
                return res.status(500).send('L\'utilisateur est introuvable');
            }

            let coinsAfterBuy = user.coins - card.price

            await User.update({
                coins :  coinsAfterBuy
            }, { where: { id_user } });

            await User_card.create({
                id_user_card :  uuid.v4(),
                id_user: id_user,
                id_card: id_card
            })

            res.status(200).end()
        } catch (e) {
            console.log(e.errors)

            res.status(500).send(e.errors);
        }
    });

exports.initializeRoutes = () => router;