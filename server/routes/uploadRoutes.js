const express = require("express");
const router = express.Router();
const cloudinary = require("../config/cloudinary");

router.post("/", async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const result = await cloudinary.uploader.upload(image, {
      folder: "vartalap_profiles",
    });

    res.status(200).json({
      success: true,
      url: result.secure_url,
    });
  } catch (error) {
    console.log("Cloudinary Upload Error:", error.message);

    res.status(500).json({
      message: "Image upload failed",
      error: error.message,
    });
  }
});

module.exports = router;