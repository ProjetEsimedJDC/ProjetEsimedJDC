const express = require('express');
const router = express.Router();
const userRepository = require('../models/user-repository');
const { User } = require('../models/user.model.js');
const { body, validationResult } = require('express-validator');
const guard = require('express-jwt-permissions')({
  requestProperty: 'auth',
});

router.get('/seeder', async (req, res) => {
  try {
    await userRepository.createUser({
      pseudo: 'adrien',
      email: 'adriencompare@gmail.com',
      password: 'password',
      coins: 30,
      id_card_1: 1,
      id_card_2: 2,
      id_card_3: 3,
    });
    const users = await User.findAll();

    res.status(200).send(users)
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/', async (req, res) => {
  res.send(await userRepository.getUsers());
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
//
// router.post('/',
//   body('firstName').isAlphanumeric(),
//   body('lastName').isAlphanumeric(),
//   body('isAdmin').isAlphanumeric(),
//   body('password').isLength({ min: 5 }),
// async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
//   await userRepository.createUser(req.body);
//   res.status(201).end();
// });
//
// router.put('/:id',guard.check(['admin']), async (req, res) => {
// // router.put('/:id', async (req, res) => {
//   await userRepository.updateUser(req.params.id, req.body).catch((err) => res.status(500).send(err.message));
//   res.status(204).end();
// });
//
// router.delete('/:id',guard.check(['admin']), async (req, res) => {
// // router.delete('/:id', async (req, res) => {
//   await userRepository.deleteUser(req.params.id);
//   res.status(204).end();
// });

exports.initializeRoutes = () => router;