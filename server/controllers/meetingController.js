const meeting = require("../models/meeting");

const createMeeting = async (req, res) => {
  try {
    const { roomId, createdBy, creatorEmail } = req.body;

    const meeting = await Meeting.create({
      roomId,
      createdBy,
      creatorEmail,
    });

    res.status(201).json({
      success: true,
      meeting,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      meetings,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createMeeting,
  getMeetings,
};