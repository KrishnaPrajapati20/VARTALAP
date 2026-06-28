const express = require("express");
const router = express.Router();

const Meeting = require("../models/meeting");

router.get("/", async (req, res) => {
  const meetings = await Meeting.countDocuments();

  res.json({
    meetings,
    messages: 0,
    files: 0,
    voiceNotes: 0,
    translations: 0,
  });
});

module.exports = router;