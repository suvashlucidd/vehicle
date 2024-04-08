const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag'); // Import the Tag model

// Route to create a new tag
router.post('/tags', async (req, res) => {
  try {
    const { description } = req.body; // Extract the tag description from the request body
    const newTag = new Tag({ description }); // Create a new tag instance
    const savedTag = await newTag.save(); // Save the new tag to the database
    res.status(201).json(savedTag); // Send the saved tag as a JSON response with status code 201 (Created)
  } catch (error) {
    console.error('Error creating tag:', error);
    res.status(500).json({ error: 'Failed to create tag' }); // Send an error response if there's an error
  }
});

// Route to fetch all descriptions
router.get('/tags', async (req, res) => {
  try {
    const tags = await Tag.find({}, 'description'); // Find all tags and return only the 'description' field
    res.json(tags); // Send the list of descriptions as a JSON response
  } catch (error) {
    console.error('Error fetching descriptions:', error);
    res.status(500).json({ error: 'Failed to fetch descriptions' }); // Send an error response if there's an error
  }
});

module.exports = router;
