const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const translateRoutes = require("./routes/translateRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const livekitRoutes = require("./routes/livekitRoutes");
const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/api/schedule", scheduleRoutes);
app.use("/api/livekit", livekitRoutes);
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  maxHttpBufferSize: 1e8,
});

let onlineUsers = [];
let meetingParticipants = [];

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log(err));

mongoose.connection.on("error", (err) => {
  console.log("Mongo Error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongo Disconnected");
});

app.use("/api/auth", authRoutes);
app.use("/api/translate", translateRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.send("Vartalap Backend Running");
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", (data) => {
    const { room, user } = data;

    socket.join(room);

    const exists = onlineUsers.find((u) => u.socketId === socket.id);

    if (!exists) {
      onlineUsers.push({
        socketId: socket.id,
        name: user?.name || "User",
        email: user?.email || "",
        room,
      });
    }

    io.to(room).emit(
      "online_users",
      onlineUsers.filter((u) => u.room === room)
    );
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("typing", (data) => {
    socket.to(data.room).emit("user_typing", data);
  });

  socket.on("stop_typing", (data) => {
    socket.to(data.room).emit("user_stop_typing", data);
  });

  socket.on("join_meeting_room", (data) => {
    const { roomId, user } = data;

    socket.join(roomId);

    const alreadyJoined = meetingParticipants.find(
      (p) => p.socketId === socket.id
    );

    if (!alreadyJoined) {
      meetingParticipants.push({
        socketId: socket.id,
        roomId,
        name: user?.name || "Vartalap User",
        email: user?.email || "",
        status: "Participant",
      });
    }

    io.to(roomId).emit(
      "meeting_participants",
      meetingParticipants.filter((p) => p.roomId === roomId)
    );

    io.to(roomId).emit("meeting_notification", {
      message: `${user?.name || "User"} joined the meeting`,
    });
  });

  socket.on("leave_meeting_room", (data) => {
    const { roomId, user } = data;

    meetingParticipants = meetingParticipants.filter(
      (p) => p.socketId !== socket.id
    );

    io.to(roomId).emit(
      "meeting_participants",
      meetingParticipants.filter((p) => p.roomId === roomId)
    );

    io.to(roomId).emit("meeting_notification", {
      message: `${user?.name || "User"} left the meeting`,
    });
  });

  socket.on("disconnect", () => {
    const userRoom = onlineUsers.find((u) => u.socketId === socket.id)?.room;

    onlineUsers = onlineUsers.filter((u) => u.socketId !== socket.id);

    if (userRoom) {
      io.to(userRoom).emit(
        "online_users",
        onlineUsers.filter((u) => u.room === userRoom)
      );
    }

    const meetingUser = meetingParticipants.find(
      (p) => p.socketId === socket.id
    );

    if (meetingUser) {
      const roomId = meetingUser.roomId;

      meetingParticipants = meetingParticipants.filter(
        (p) => p.socketId !== socket.id
      );

      io.to(roomId).emit(
        "meeting_participants",
        meetingParticipants.filter((p) => p.roomId === roomId)
      );

      io.to(roomId).emit("meeting_notification", {
        message: `${meetingUser.name} left the meeting`,
      });
    }

    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});