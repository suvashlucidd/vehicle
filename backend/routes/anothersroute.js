const express = require("express");
const router = express.Router();
const AnotherModel = require("../models/anothers"); // Replace User with the name of your "anothers" model

router.post("/registerr", async (req, res) => {
  const { name, email, isAdmin,password, socketId } = req.body; // Extract socketId from the request body

  const newRecord = new AnotherModel({ name, email,isAdmin, password, socketId }); // Create a new document using "anothers" model

  try {
    const record = await newRecord.save();
    res.status(200).json({ message: "Successfully registered", record });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/loginn", async (req, res) => {
  const { email, password } = req.body;

  try {
    const record = await AnotherModel.findOne({ email, password }); // Find document using "anothers" model
    if (record) {
      const temp = {
        name: record.name,
        email: record.email,
        isAdmin: record.isAdmin,
        _id: record._id,
        socketId: record.socketId // Include socketId in the response
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
    const records = await AnotherModel.find(); // Find all documents using "anothers" model
    res.send(records);
  } catch (error) {
    return res.status(400).json({ error });
  }
});
router.get("/allsocketids", async (req, res) => {
  try {
    const socketIds = await AnotherModel.find({}, 'socketId'); // Fetch all socket IDs
    res.send(socketIds.map(record => record.socketId));
  } catch (error) {
    res.status(400).json({ error });
  }
});



module.exports = router;
