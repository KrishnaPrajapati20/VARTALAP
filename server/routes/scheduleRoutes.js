const express = require("express");

const router = express.Router();

const {
  createSchedule,
  getSchedules,
  deleteSchedule,
} = require("../controllers/scheduleController");

router.post("/", createSchedule);

router.get("/", getSchedules);

router.delete("/:id", deleteSchedule);

module.exports = router;