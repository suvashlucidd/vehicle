const mongoose = require("mongoose");

const vehicleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobilenumber: {
      type: Number,
      required: true,
    },
    postedBy: {
      type: String,
      required: true,
    },
    mileage: {
      type: Number,
      required: true,
    },
    rentperday: {
      type: Number,
      required: true,
    },
    imageurls: [],
    

    currentbookings: [],
 
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    socketid:{
      type:String,
    
    }
  },
  {
    timestamps: true,
  }
);

const vehicleModel = mongoose.model("vehicles", vehicleSchema);
module.exports = vehicleModel;
