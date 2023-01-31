const express = require('express');
const router = express.Router();
const userCardRepository = require('../models/repostories/user-card-repository');
const userRepository = require('../models/repostories/user-repository');
require('dotenv').config()
// const { body, validationResult } = require('express-validator');
const {User_card} = require("../models/models/user_card.model");
const cardRepository = require('../models/repostories/card-repository');

router.get('/seeder', async (req, res) => {
    try {
        let allCards = await cardRepository.getCard()
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

        // await userCardRepository.createUserCard({
        //     id_user: await userRepository.getIdUserByEmail('adriencompare@gmail.com'),
        //     id_card: '2',
        // });
        // await userCardRepository.createUserCard({
        //     id_user: await userRepository.getIdUserByEmail('adriencompare@gmail.com'),
        //     id_card: '3',
        // });

        await userCardRepository.getAllUserCardById(await userRepository.getIdUserByEmail('test@gmail.com'));

        res.status(200).end()
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
});

router.get('/load/:id', async (req, res) => {
    try {
        let id_user = req.params.id
        const user_cards = await userCardRepository.getAllUserCardById(id_user)

          if (!user_cards) {
            res.status(500).send('User not found');
            return;
          }

          res.send(user_cards);
    } catch (e) {
        res.status(500).send(e);
    }
});

// router.get('/:firstName', guard.check(['admin']), async (req, res) => {
// // router.get('/:firstName', async (req, res) => {
//   const foundUser = await userRepository.getUserByFirstName(req.params.firstName);
//
//   if (!foundUser) {
//     res.status(500).send('User not found');
//     return;
//   }
//
//   res.send(foundUser);
// });

exports.initializeRoutes = () => router;