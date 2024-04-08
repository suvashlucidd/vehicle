const express = require("express");
const router = express.Router();
const Anothers = require("../models/anothers"); // Import the Anothers model
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

// Route to handle image upload for "anothers" model
router.post("/verify", upload.array("images"), async (req, res) => {
  try {
    const { anotherId } = req.body; // Assuming you're passing the "anothers" ID along with the request
    const imageUrls = req.files.map((file) => file.path);

    // Find the "anothers" by ID
    const anothers = await Anothers.findById(anotherId);

    if (!anothers) {
      // If "anothers" is not found, return a 404 Not Found response
      return res.status(404).json({ message: "Anothers not found" });
    }

    // Check if "anothers" already have 3 images
    if (anothers.imageUrls.length + imageUrls.length > 3) {
      return res.status(400).json({ message: "Only 3 images are allowed" });
    }

    // Add the new image URLs to the existing "anothers" data
    anothers.imageUrls.push(...imageUrls);

    // Save the updated "anothers" data
    await anothers.save();

    res.status(200).json({ message: "Images uploaded successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to retrieve uploaded images for a specific "anothers"
router.get("/images/:anotherId", async (req, res) => {
  try {
    // Extract the "anothers" ID from the request parameters
    const anotherId = req.params.anotherId;

    // Find the "anothers" by ID
    const anothers = await Anothers.findById(anotherId);

    if (!anothers) {
      // If "anothers" is not found, return a 404 Not Found response
      return res.status(404).json({ message: "Anothers not found" });
    }

    // Extract the image URLs from the "anothers" object
    const imageUrls = anothers.imageUrls;

    // Send the image URLs as a responsea
    res.status(200).json({ imageUrls });
  } catch (error) {
    // If an error occurs, return a 500 Internal Server Error response
    console.error("Error retrieving images:", error);
    res.status(500).json({ message: "Failed to retrieve images" });
  }
});

// Route to remove all uploaded images for a specific "anothers"
router.delete("/images/:anotherId", async (req, res) => {
  try {
    // Extract the "anothers" ID from the request parameters
    const anotherId = req.params.anotherId;

    // Find the "anothers" by ID
    const anothers = await Anothers.findById(anotherId);

    if (!anothers) {
      // If "anothers" is not found, return a 404 Not Found response
      return res.status(404).json({ message: "Anothers not found" });
    }

    // Remove all uploaded image URLs from the "anothers" data
    anothers.imageUrls = [];

    // Save the updated "anothers" data
    await anothers.save();

    // Send a success response
    res.status(200).json({ message: "All images deleted successfully" });
  } catch (error) {
    // If an error occurs, return a 500 Internal Server Error response
    console.error("Error deleting images:", error);
    res.status(500).json({ message: "Failed to delete images" });
  }
});

router.put("/updateiskyc/:anotherId", async (req, res) => {
  try {
    // Extract the anotherId from the request parameters
    const anotherId = req.params.anotherId;

    // Find the user by anotherId
    const anothers = await Anothers.findById(anotherId);

    if (!anothers) {
      // If user is not found, return a 404 Not Found response
      return res.status(404).json({ message: "Anothers not found" });
    }

    // Update the isKYC status of the user
    const{iskyc}=req.body
    anothers.iskyc=iskyc;
    

    // Save the updated user data
    await anothers.save();

    // Send a success response
    res.status(200).json({ message: "isKYC updated successfully" });
  } catch (error) {
    // If an error occurs, return a 500 Internal Server Error response
    console.error("Error updating isKYC:", error);
    res.status(500).json({ message: "Failed to update isKYC" });
  }
});

// Route to check isKYC status of a specific user
router.get("/iskyc/:anotherId", async (req, res) => {
  try {
    // Extract the anotherId from the request parameters
    const anotherId = req.params.anotherId;

    // Find the user by anotherId
    const anothers = await Anothers.findById(anotherId);

    if (!anothers) {
      // If user is not found, return a 404 Not Found response
      return res.status(404).json({ message: "Anothers not found" });
    }

    // Extract the isKYC status from the user data
    const iskyc = anothers.iskyc;

    // Send the isKYC status as a response
    res.status(200).json({ iskyc });
  } catch (error) {
    // If an error occurs, return a 500 Internal Server Error response
    console.error("Error fetching isKYC status:", error);
    res.status(500).json({ message: "Failed to fetch isKYC status" });
  }
});

module.exports = router;
