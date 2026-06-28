const express = require("express");
const { AccessToken } = require("livekit-server-sdk");

const router = express.Router();

router.post("/token", async (req, res) => {
  try {
    const { roomName, participantName } = req.body;

    if (!roomName || !participantName) {
      return res.status(400).json({
        message: "roomName and participantName are required",
      });
    }

    const token = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity: participantName + "-" + Date.now(),
        name: participantName,
      }
    );

    token.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const jwt = await token.toJwt();

    res.status(200).json({
      token: jwt,
      url: process.env.LIVEKIT_URL,
    });
  } catch (error) {
    console.log("LiveKit Token Error:", error);
    res.status(500).json({
      message: "LiveKit token generate failed",
      error: error.message,
    });
  }
});

module.exports = router;