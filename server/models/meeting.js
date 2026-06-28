const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
    },
    createdBy: { },
    creatorEmail: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meeting", meetingSchema);