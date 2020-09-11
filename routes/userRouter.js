const express = require('express');
const router = express.Router();
const Users = require('../models/user');

router.route('/')
  .get(async (req, res) => {
    try {
      const all_users = await Users.find();
      return res.json(all_users);
    } catch (e) {
      return res.json({ error: "Not possible to get users" });
    }
  })
  .post(async (req, res) => {
    try {
      const new_user = await Users.create(req.body);
      return res.json(new_user)
    } catch (e) {
      return res.status(400).json({ error: "User not created" });
    }
  })

router.post('/signup', (req, res, next) => {
  User.register(new User({ username: req.body.username }),
    req.body.password, (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err });
      }
      else {
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ success: true, status: 'Registration Successful!' });
        });
      }
    });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ success: true, status: 'You are successfully logged in!' });
});

module.exports = router;
