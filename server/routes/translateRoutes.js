const express = require("express");
const router = express.Router();

const { translate } = require("@vitalets/google-translate-api");

router.post("/", async (req, res) => {
  try {
    const { text, to } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        message: "Please enter text",
      });
    }

    const result = await translate(text.trim(), {
      to: to || "hi",
    });

    res.json({
      translated: result.text,
    });
  } catch (error) {
    res.status(500).json({
      message: "Translation failed",
      error: error.message,
    });
  }
});

module.exports = router;