const ScheduledMeeting = require("../models/ScheduledMeeting");

exports.createSchedule = async (req, res) => {
  try {
    const meeting = await ScheduledMeeting.create(req.body);

    res.status(201).json({
      success: true,
      meeting,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getSchedules = async (req, res) => {
  try {
    const meetings = await ScheduledMeeting.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      meetings,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    await ScheduledMeeting.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Meeting Deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};