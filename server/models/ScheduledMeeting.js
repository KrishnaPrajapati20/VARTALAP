const mongoose = require("mongoose");

const scheduledMeetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    createdBy: {
      type: String,
      required: true,
    },

    creatorEmail: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "Upcoming",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ScheduledMeeting",
  scheduledMeetingSchema
);