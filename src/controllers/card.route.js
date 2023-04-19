const express = require('express');
const router = express.Router();
const cardRepository = require('../models/repostories/card-repository');
require('dotenv').config()

// const { body, validationResult } = require('express-validator');
const { Card } = require("../models/models/card.model");

router.get('/seeder', async (req, res) => {
    try {
        fetch('https://pokebuildapi.fr/api/v1/pokemon')
            .then((response) => response.json())
            .then(async (data) => {
                for (const pokemon of data) {
                    let coins = 100;
                    // let apiEvol = null;
                    let apiEvol = pokemon.apiEvolutions[0] ? pokemon.apiEvolutions[0].pokedexId : null;
                    let apiPreEvol = null;

                    if (!pokemon.apiPreEvolution[0]){
                        coins = 350
                        apiPreEvol = pokemon.apiPreEvolution.pokedexIdd

                        if (!pokemon.apiEvolutions[0]){
                            coins = 800
                        }
                    }

                    if (apiEvol === null && apiPreEvol === null) {
                        coins = 1000
                    }

                    await cardRepository.createCard({
                        name: pokemon.name,
                        image : pokemon.image,
                        sprite : pokemon.sprite,
                        HP: pokemon.stats.HP,
                        attack: pokemon.stats.attack,
                        defense: pokemon.stats.defense,
                        special_attack: pokemon.stats.special_attack,
                        special_defense: pokemon.stats.special_defense,
                        speed: pokemon.stats.speed,
                        type_1: ((pokemon.apiTypes[0].name).toString().toLowerCase()).normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
                        type_2: pokemon.apiTypes[1]? (pokemon.apiTypes[1].name.toString().toLowerCase()).normalize("NFD").replace(/[\u0300-\u036f]/g, "") :null,
                        apiEvolutions_id: apiEvol,
                        apiPreEvolution_id: apiPreEvol,
                        price: coins
                    });
                }
            });
        const cards = await Card.findAll();

        res.status(200).send(cards)
    } catch (e) {
        res.status(500).send("Ces cartes sont déjà créées");
    }
});

router.get('/', async (req, res) => {
    res.send(await cardRepository.getCards());
});

router.get('/:id', async (req, res) => {
  const foundCard = await cardRepository.getCardById(req.params.id);

  if (!foundCard) {
    res.status(500).send('Card not found');
    return;
  }

  res.status(200).send(foundCard);
});

router.get('/find-all-user-cards/:id', async (req, res) => {
    const foundCard = await cardRepository.getCardsUserByUserId(req.params.id);

    if (!foundCard) {
        res.status(500).send('User not found or dont having cards');
        return;
    }

    res.status(200).send(foundCard);
});

exports.initializeRoutes = () => router;