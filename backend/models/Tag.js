const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  }
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
