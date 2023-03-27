const express = require('express');
const router = express.Router();
require('dotenv').config()

const fs = require('fs');
const path = require('path');

const gameHistoryRepository = require('../models/repostories/game-history-repository');
const gameRepository = require('../models/repostories/game-repository');
const userRepository = require('../models/repostories/user-repository');
const trophyRepository = require('../models/repostories/trophy-repository');
const userTrophyRepository = require("../models/repostories/user-trophy-repository");


router.get('/seeder', async (req, res) => {
   try{
       const hoenn1filePath = path.join(__dirname, '../../public/trophy_svg/Hoenn/hoenn1.svg');
       const hoenn1fileContent = fs.readFileSync(hoenn1filePath, 'utf-8');
       await trophyRepository.createTrophy(hoenn1fileContent, 'hoenn-1', 'Acheter votre premier pokémon');

       const hoenn2filePath = path.join(__dirname, '../../public/trophy_svg/Hoenn/hoenn2.svg');
       const hoenn2fileContent = fs.readFileSync(hoenn2filePath, 'utf-8');
       await trophyRepository.createTrophy(hoenn2fileContent, 'hoenn-2', 'Jouer votre premier combat');

       const hoenn3filePath = path.join(__dirname, '../../public/trophy_svg/Hoenn/hoenn3.svg');
       const hoenn3fileContent = fs.readFileSync(hoenn3filePath, 'utf-8');
       await trophyRepository.createTrophy(hoenn3fileContent, 'hoenn-3', 'Gagner votre premier combat');

       const hoenn4filePath = path.join(__dirname, '../../public/trophy_svg/Hoenn/hoenn4.svg');
       const hoenn4fileContent = fs.readFileSync(hoenn4filePath, 'utf-8');
       await trophyRepository.createTrophy(hoenn4fileContent, 'hoenn-4', 'Gagner 10 combats');

       const hoenn5filePath = path.join(__dirname, '../../public/trophy_svg/Hoenn/hoenn5.svg');
       const hoenn5fileContent = fs.readFileSync(hoenn5filePath, 'utf-8');
       await trophyRepository.createTrophy(hoenn5fileContent, 'hoenn-5', 'Acheter 50 pokemons');

       const hoenn6filePath = path.join(__dirname, '../../public/trophy_svg/Hoenn/hoenn6.svg');
       const hoenn6fileContent = fs.readFileSync(hoenn6filePath, 'utf-8');
       await trophyRepository.createTrophy(hoenn6fileContent, 'hoenn-6', 'Gagner 50 combats');

       const hoenn7filePath = path.join(__dirname, '../../public/trophy_svg/Hoenn/hoenn7.svg');
       const hoenn7fileContent = fs.readFileSync(hoenn7filePath, 'utf-8');
       await trophyRepository.createTrophy(hoenn7fileContent, 'hoenn-7', 'Acheter 100 pokemons');

       const hoenn8filePath = path.join(__dirname, '../../public/trophy_svg/Hoenn/hoenn8.svg');
       const hoenn8fileContent = fs.readFileSync(hoenn8filePath, 'utf-8');
       await trophyRepository.createTrophy(hoenn8fileContent, 'hoenn-8', 'Gagner 100 combats');

       return res.status(200)
    } catch (e) {
       return res.status(500).send(e)
    }
});

router.get('/find/:id_trophy', async (req, res) => {
    try{
        const id_trophy = req.params.id_trophy

        const trophy = await trophyRepository.getTrophyById(id_trophy)
        trophy.svg = trophy.svg.toString("utf8")

        return res.status(200).send(trophy)
    } catch (e) {
        console.log(e)
        return res.status(500).send(e)
    }
});

router.get('/findAll', async (req, res) => {
    let Trophies = await trophyRepository.findAll()

    return res.status(200).send(Trophies)
});

exports.initializeRoutes = () => router;