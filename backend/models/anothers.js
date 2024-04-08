const mongoose = require("mongoose");

// Create another schema with the same details as userSchema
const anotherSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    socketId: {
      type: String, // Store the socket ID as a string
    },
    isAdmin: {
      type: Boolean,
   
    },
    iskyc: {
      type: Boolean,
    },
    imageUrls: {
      type: [String],
      default: [],
    }
  },
  {
    timestamps: true,
  }
);

const anotherModel = mongoose.model("anothers", anotherSchema); // Change 'anothers' to the desired collection name
module.exports = anotherModel;
