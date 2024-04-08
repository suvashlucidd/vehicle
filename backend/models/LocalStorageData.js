const mongoose = require('mongoose');

const storageSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: [ ],
});

const Storage = mongoose.model('Storage', storageSchema);

module.exports = Storage;
