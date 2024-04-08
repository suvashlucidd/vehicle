// Import necessary modules and models
const express = require('express');
const router = express.Router();
const Vehicle = require("../models/vehicles");

// Route to get recommendations for a user
router.get('/recommendations/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Assume some test data for recommendations
        const recommendations = [
            { vehicleId: 'vehicle1', score: 0.8 },
            { vehicleId: 'vehicle2', score: 0.7 },
            { vehicleId: 'vehicle3', score: 0.6 }
        ];

        // Assume some test data for recommended vehicles
        const recommendedVehicles = recommendations.map(({ vehicleId }) => ({
            _id: vehicleId,
            name: `Vehicle ${vehicleId}`,
            mileage: Math.floor(Math.random() * 100) + 50,
            rentperday: Math.floor(Math.random() * 50) + 50
        }));

        res.status(200).json(recommendedVehicles);
    } catch (error) {
        console.error('Error getting recommendations:', error);
        res.status(500).json({ error: 'Failed to get recommendations' });
    }
});

router.get("/recommend", async (req, res) => {
    try {
      const vehicles = await Vehicle.find();
  
      // Calculate the likes-to-interactions ratio for each vehicle
      const recommendedVehicles = vehicles.map(vehicle => {
        const totalInteractions = (vehicle.likes || 0) + (vehicle.dislikes || 0);
        const ratio = totalInteractions === 0 ? 0 : vehicle.likes / totalInteractions;
        return {
          _id: vehicle._id,
          name: vehicle.name,
          type: vehicle.type,
          mileage: vehicle.mileage,
          rentperday: vehicle.rentperday,
          description: vehicle.description,
          imageurls:vehicle.imageurls,
          recommendationScore: ratio
        };
      });
  
      // Sort recommended vehicles by recommendation score in descending order
      recommendedVehicles.sort((a, b) => b.recommendationScore - a.recommendationScore);
  
      res.status(200).json(recommendedVehicles);
    } catch (error) {
      console.error('Error fetching and recommending vehicles:', error);
      res.status(500).json({ error: 'Failed to fetch and recommend vehicles' });
    }
  });

module.exports = router;
