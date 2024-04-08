// Backend route handling (likeDislikeRoute.js)
const express = require('express');
const router = express.Router();
const LikeDislikeModel = require('../models/LikeDislikeModel');

// Increment like for a vehicle
router.post('/like/:vehicleId', async (req, res) => {
  const { vehicleId } = req.params;

  try {
    const likeDislike = await LikeDislikeModel.findOneAndUpdate(
      { vehicleId },
      { $inc: { likes: 1 } },
      { upsert: true, new: true }
    );

    res.status(200).json(likeDislike);
  } catch (error) {
    console.error('Error updating like:', error);
    res.status(500).json({ error: 'Failed to update like' });
  }
});

module.exports = router;
