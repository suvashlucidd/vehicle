// userRoutes.js

const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/register", async (req, res) => {
  const { name, email, password, socketId } = req.body; // Extract socketId from the request body

  try {
    const newUser = new User({ name, email, password, socketId }); // Include socketId in the user creation
    const user = await newUser.save();
    res.status(200).json({ message: "Successfully registered", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });
    if (user) {
      const temp = {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        _id: user._id,
        socketId: user.socketId // Include socketId in the response
      };
      res.send(temp);
    } else {
      res.status(400).json({ message: "Login failed" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/getallusers", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get("/receiverIds", async (req, res) => {
  try {
    const receivers = await User.find({}, '_id'); // Fetch only the _id field of all receivers
    const receiverIds = receivers.map(receiver => receiver._id); // Extract receiver IDs
    res.send(receiverIds);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/allsocketids", async (req, res) => {
  try {
    const socketIds = await User.find({}, 'socketId'); // Fetch all socket IDs
    res.send(socketIds.map(user => user.socketId));
  } catch (error) {
    res.status(400).json({ error });
  }
});


module.exports = router;
