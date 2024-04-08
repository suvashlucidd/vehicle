const express = require('express');
const router = express.Router();
const Message = require("../routes/messageModell");

// Route to fetch all messages where senderId or receiverId matches the current user's socket ID
router.get('/allmessages', async (req, res) => {
  const { socketId } = req.query;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: socketId },
        { receiverId: socketId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to fetch all messages where senderId matches the current user's socket ID
router.get('/sentmessages', async (req, res) => {
  const { socketId } = req.query;

  try {
    const sentMessages = await Message.find({ senderId: socketId }).sort({ createdAt: 1 });
    res.json(sentMessages);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to fetch all messages where receiverId matches the current user's socket ID
router.get('/receivedmessages', async (req, res) => {
  const { socketId } = req.query;

  try {
    const receivedMessages = await Message.find({ receiverId: socketId }).sort({ createdAt: 1 });
    res.json(receivedMessages);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
