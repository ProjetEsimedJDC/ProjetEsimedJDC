const express = require('express');
const router = express.Router();
const userRepository = require('../models/user-repository');
// const { User } = require('../models/user.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const { body, validationResult } = require('express-validator');


router.post('/login', 
    body('firstName').isAlphanumeric(),
    body('password').isLength({ min: 1 }),

    async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const foundUser = await userRepository.getUserByFirstName(req.body.firstName);

    // console.log(foundUser);
    const psw = bcrypt.compareSync(req.body.password, foundUser.password)
  
    if(psw === true)
    {
        const token = jwt.sign({userId: foundUser.id,  
                                firstName: foundUser.firstName, 
                                lastName : foundUser.lastName, 
                                permissions : [foundUser.isAdmin ? 'admin' : '']},  
                                process.env.SECRET_KEY , { expiresIn: process.env.JWT_EXPIRES_IN });
        res.status(200).send({token})
    } else {
        res.sendStatus(401)
    }

});

exports.initializeRoutes = () => router;