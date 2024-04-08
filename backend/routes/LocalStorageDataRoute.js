const express = require('express');
const router = express.Router();
const Storage = require('../models/LocalStorageData');

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    await Storage.insertMany(data);
    res.status(200).json({ message: 'Data stored successfully.' });
  } catch (error) {
    console.error('Error storing data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/getting', async (req, res) => {
  try {
    const data = await Storage.find({});
    const formattedData = data.map(item => ({
      value: item.value // Assuming `value` contains the JSON data you need
    }));
    res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/clear', async (req, res) => {
  try {
    // Delete all documents from the Storage collection
    await Storage.deleteMany({});
    res.status(200).json({ message: 'All data cleared successfully.' });
  } catch (error) {
    console.error('Error clearing data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



module.exports = router;
