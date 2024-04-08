const express = require("express");
const router = express.Router();
const Interaction = require("../models/Interaction");

// Route to handle interaction data posting
router.post("/", async (req, res) => {
  try {
    const { userId, vid, buserId, bvid } = req.body; // Extract userId from the request body

    // Save interaction data to the database
    const interaction = new Interaction({ userId, vid, buserId, bvid });
    await interaction.save();

    res.status(201).json({ message: "Interaction data saved successfully", data: interaction });
  } catch (error) {
    console.error("Error saving interaction data:", error);
    res.status(500).json({ message: "Failed to save interaction data" });
  }
});

// Backend code

router.post("/interaction", async (req, res) => {
  try {
    const { userId, vid, buserId, bvid } = req.body;
    const interaction = new Interaction({ userId, vid, buserId, bvid });
    await interaction.save();
    res.status(201).json(interaction);
  } catch (error) {
    console.error("Error saving interaction:", error);
    res.status(500).json({ message: "Failed to save interaction" });
  }
});

router.get('/fetchAllData', async (req, res) => {
  try {
    const allData = await Interaction.find();
    res.status(200).json(allData);
  } catch (error) {
    console.error('Error fetching all data:', error);
    res.status(500).json({ message: 'Failed to fetch all data' });
  }
});

// Route to fetch all interactions
router.get("/", async (req, res) => {
  try {
    // Fetch all interactions from the database
    const interactions = await Interaction.find();
    res.status(200).json(interactions);
  } catch (error) {
    console.error("Error fetching interactions:", error);
    res.status(500).json({ message: "Failed to fetch interactions" });
  }
});
router.get('/getMatchingInteractions', async (req, res) => {
  try {
    const matchingInteractions = await Interaction.find({
      $expr: {
        $eq: ['$bvid', '$vid']
      }
    });
    res.json(matchingInteractions);
  } catch (error) {
    console.error('Error fetching matching interactions:', error);
    res.status(500).json({ message: 'Failed to fetch matching interactions' });
  }
});



module.exports = router;
