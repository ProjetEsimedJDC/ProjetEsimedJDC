const express = require('express');
const router = express.Router();
const userRepository = require('../models/repostories/user-repository');
const { User } = require("../models/models/user.model");
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

    await userRepository.createUser({
      pseudo: 'test',
      email: 'test@gmail.com',
      password: 'password',
      coins: 30,
      id_card_1: null,
      id_card_2: null,
      id_card_3: null,
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

router.post('/',
  body('pseudo').isAlphanumeric()
                      .isLength({ min: 3 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('coins').isNumeric()
                    .isLength({ min: 1 })
                    .optional({ nullable: true }),
  body('id_card_1').isNumeric()
                        .isLength({ min: 1 })
                        .optional({ nullable: true }),
  body('id_card_2').isNumeric()
                        .isLength({ min: 1 })
                        .optional({ nullable: true }),
  body('id_card_3').isNumeric()
                        .isLength({ min: 1 })
                        .optional({ nullable: true }),

async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    await userRepository.createUser(req.body);

    res.status(201).end()
  } catch (e) {
    res.status(500).send(e);
  }
});

router.put('/update/:id_user', async (req, res) => {
  try {
    let userUpdate = await userRepository.updateUser(req.params.id_user,req.body);

    res.status(200).send(userUpdate);
  } catch (e) {
    console.log(e)
    res.send(e).end();
  }
});

router.put('/chose-card/:id_user/:id_card_user/:id_card', async (req, res) => {
  try {
    await userRepository.updateUserChoseCard1(req.params.id_user,req.params.id_card_user,req.params.id_card ).catch((err) => res.status(500).send(err.message));
    let foundUser = await userRepository.getUserById(req.params.id_user)

    res.status(200).send(foundUser);
  } catch (e) {
    res.send(e).end();
  }
});

// router.delete('/:id',guard.check(['admin']), async (req, res) => {
// // router.delete('/:id', async (req, res) => {
//   await userRepository.deleteUser(req.params.id);
//   res.status(204).end();
// });


// router.get('/:firstName', guard.check(['admin']), async (req, res) => {
router.get('/:id', async (req, res) => {
  const foundUser = await userRepository.getUserById(req.params.id);

  if (!foundUser) {
    res.status(500).send('User not found');
    return;
  }

  res.status(200).send(foundUser);
});

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