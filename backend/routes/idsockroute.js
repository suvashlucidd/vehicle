const express = require("express");
const router = express.Router();
const AnotherModel = require("../models/anothers"); // Replace User with the name of your "anothers" model
const User = require("../models/user");

// Endpoint to fetch all socket IDs from both models
router.get("/allsocketids", async (req, res) => {
  try {
    // Fetch socket IDs from the User model
    const userSocketIds = await User.find({}, 'socketId');
    // Fetch socket IDs from the AnotherModel model
    const anotherModelSocketIds = await AnotherModel.find({}, 'socketId');
    
    // Combine the socket IDs from both models
    const allSocketIds = [
      ...userSocketIds.map(user => user.socketId),
      ...anotherModelSocketIds.map(record => record.socketId)
    ];

    res.send(allSocketIds);
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
