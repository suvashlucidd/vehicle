const express = require("express");
const router = express.Router();
const User = require("../models/user");
const multer = require("multer");
const path = require("path");

// Configure multer to store images permanently in the 'uploads' folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Specify the destination folder
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for each uploaded image
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Initialize multer with the configured storage
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10MB file size limit
  },
});

// Route to handle KYC verification and image upload
router.post("/verify", upload.array("images"), async (req, res) => {
  try {
    const { userId } = req.body; // Assuming you're passing the user ID along with the request
    const imageUrls = req.files.map((file) => file.path);

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      // If user is not found, return a 404 Not Found response
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user already has 3 images
    if (user.imageurls2.length + imageUrls.length > 3) {
      return res.status(400).json({ message: "Only 3 images will be sent" });
    }

    // Add the new image URLs to the existing user's data
    user.imageurls2.push(...imageUrls);
    
    // Save the updated user data
    await user.save();

    res.status(200).json({ message: "Images uploaded successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message+"only 3 images acceptable" });
  }
});

// Route to retrieve uploaded images for a specific user
router.get("/images/:userId", async (req, res) => {
  try {
    // Extract the userId from the request parameters
    const userId = req.params.userId;

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      // If user is not found, return a 404 Not Found response
      return res.status(404).json({ message: "User not found" });
    }

    // Extract the image URLs from the user object
    const imageUrls = user.imageurls2;

    // Send the image URLs as a response
    res.status(200).json({ imageUrls });
  } catch (error) {
    // If an error occurs, return a 500 Internal Server Error response
    console.error("Error retrieving images:", error);
    res.status(500).json({ message: "Failed to retrieve images" });
  }
});

// Route to remove all uploaded images for a specific user
router.delete("/images/:userId", async (req, res) => {
  try {
    // Extract the userId from the request parameters
    const userId = req.params.userId;

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      // If user is not found, return a 404 Not Found response
      return res.status(404).json({ message: "User not found" });
    }

    // Remove all uploaded image URLs from the user data
    user.imageurls2 = [];

    // Save the updated user data
    await user.save();

    // Send a success response
    res.status(200).json({ message: "All images deleted successfully" });
  } catch (error) {
    // If an error occurs, return a 500 Internal Server Error response
    console.error("Error deleting images:", error);
    res.status(500).json({ message: "Failed to delete images" });
  }
});

// Route to update the iskyc status of a user
router.put("/updateiskyc/:userId", async (req, res) => {
    try {
      // Extract the userId from the request parameters
      const userId = req.params.userId;
  
      // Find the user by userId
      const user = await User.findById(userId);
  
      if (!user) {
        // If user is not found, return a 404 Not Found response
        return res.status(404).json({ message: "User not found" });
      }
  
      // Extract the new iskyc status from the request body
      const { iskyc } = req.body;
  
      // Update the iskyc status of the user
      user.iskyc = iskyc;
  
      // Save the updated user data
      await user.save();
  
      // Send a success response
      res.status(200).json({ message: "ISKYC status updated successfully" });
    } catch (error) {
      // If an error occurs, return a 500 Internal Server Error response
      console.error("Error updating iskyc status:", error);
      res.status(500).json({ message: "Failed to update iskyc status" });
    }
  });
  router.get("/iskyc/:userId", async (req, res) => {
    try {
      // Extract the userId from the request parameters
      const userId = req.params.userId;
  
      // Find the user by userId
      const user = await User.findById(userId);
  
      if (!user) {
        // If user is not found, return a 404 Not Found response
        return res.status(404).json({ message: "User not found" });
      }
  
      // Extract the iskyc parameter from the user object
      const iskyc = user.iskyc;
  
      // Send the iskyc status as a response
      res.status(200).json({ iskyc });
    } catch (error) {
      // If an error occurs, return a 500 Internal Server Error response
      console.error("Error fetching iskyc status:", error);
      res.status(500).json({ message: "Failed to fetch iskyc status" });
    }
  });
  
module.exports = router;


