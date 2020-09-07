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
      return res.status(400).json({error: "User not created"});
    }
  })

module.exports = router;
