const mongoose = require("mongoose");

const interactionSchema = mongoose.Schema({
  userId: { type: String   },
  vid: { type: String  },
  buserId: { type: String  },
  bvid: { type: String   },
}, { timestamps: true });

const Interaction = mongoose.model("Interaction", interactionSchema);

module.exports = Interaction;
