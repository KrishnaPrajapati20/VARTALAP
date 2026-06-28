import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import EmojiPicker from "emoji-picker-react";

const socket = io("https://vartalap-backend-hz3z.onrender.com");

function ChatRoom() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [typingUser, setTypingUser] = useState("");

  const room = "vartalap";
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    socket.emit("join_room", { room, user });

    socket.on("receive_message", (data) => {
      setMessages((prev) => {
        const exists = prev.find(
          (msg) =>
            msg.time === data.time &&
            msg.sender === data.sender &&
            msg.message === data.message &&
            msg.fileName === data.fileName &&
            msg.audio === data.audio
        );

        if (exists) return prev;

        return [...prev, data];
      });
    });

    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    socket.on("user_typing", (data) => {
      if (data.sender !== user.name) {
        setTypingUser(data.sender);
      }
    });

    socket.on("user_stop_typing", () => {
      setTypingUser("");
    });

    return () => {
      socket.off("receive_message");
      socket.off("online_users");
      socket.off("user_typing");
      socket.off("user_stop_typing");
    };
  }, []);

  const addOwnMessage = (data: any) => {
    setMessages((prev) => [...prev, data]);
  };

  const sendMessage = () => {
    if (message.trim() === "") return;

    const data = {
      room,
      type: "text",
      message,
      sender: user.name || "User",
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send_message", data);
    addOwnMessage(data);

    socket.emit("stop_typing", {
      room,
      sender: user.name || "User",
    });

    setMessage("");
    setShowEmoji(false);
    setTypingUser("");
  };

  const handleTyping = (value: string) => {
    setMessage(value);

    socket.emit("typing", {
      room,
      sender: user.name || "User",
    });

    setTimeout(() => {
      socket.emit("stop_typing", {
        room,
        sender: user.name || "User",
      });
    }, 1000);
  };

  const handleFileShare = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const data = {
        room,
        type: "file",
        fileName: file.name,
        fileType: file.type,
        fileUrl: reader.result,
        sender: user.name || "User",
        time: new Date().toLocaleTimeString(),
      };

      socket.emit("send_message", data);
      addOwnMessage(data);
    };

    reader.readAsDataURL(file);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, {
          type: "audio/webm",
        });

        const reader = new FileReader();

        reader.onload = () => {
          const data = {
            room,
            type: "audio",
            audio: reader.result,
            sender: user.name || "User",
            time: new Date().toLocaleTimeString(),
          };

          socket.emit("send_message", data);
          addOwnMessage(data);
        };

        reader.readAsDataURL(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      alert("Microphone permission denied or not available");
    }
  };

  const stopRecording = () => {
    if (!mediaRecorder) return;

    mediaRecorder.stop();
    setIsRecording(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #020617, #111827, #1e1b4b)",
        color: "white",
        padding: "30px",
        fontFamily: "Poppins, Arial, sans-serif",
      }}
    >
      <h1>💬 Vartalap Chat</h1>

      <div
        style={{
          marginBottom: "15px",
          padding: "12px",
          borderRadius: "14px",
          background: "rgba(255,255,255,0.08)",
        }}
      >
        <strong>🟢 Online Users: {onlineUsers.length}</strong>

        <div
          style={{
            marginTop: "8px",
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {onlineUsers.map((u, index) => (
            <span
              key={index}
              style={{
                background: "#22c55e",
                padding: "6px 10px",
                borderRadius: "20px",
                fontSize: "13px",
              }}
            >
              {u.name}
            </span>
          ))}
        </div>
      </div>

      {typingUser && (
        <p style={{ color: "#93c5fd" }}>✍️ {typingUser} is typing...</p>
      )}

      <div
        style={{
          height: "430px",
          overflowY: "auto",
          background: "rgba(255,255,255,0.08)",
          padding: "18px",
          borderRadius: "18px",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: "14px",
              padding: "12px",
              borderRadius: "14px",
              background:
                msg.sender === user.name
                  ? "linear-gradient(135deg, #7c3aed, #06b6d4)"
                  : "#1f2937",
            }}
          >
            <strong>{msg.sender}</strong>

            {msg.type === "file" ? (
              <div style={{ marginTop: "10px" }}>
                {msg.fileType?.startsWith("image/") && (
                  <img
                    src={msg.fileUrl}
                    alt={msg.fileName}
                    style={{
                      maxWidth: "220px",
                      borderRadius: "12px",
                      display: "block",
                      marginBottom: "10px",
                    }}
                  />
                )}

                <p>📎 {msg.fileName}</p>

                <a
                  href={msg.fileUrl}
                  download={msg.fileName}
                  style={{
                    color: "white",
                    background: "#22c55e",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  Download
                </a>
              </div>
            ) : msg.type === "audio" ? (
              <div style={{ marginTop: "10px" }}>
                <p>🎤 Voice Note</p>
                <audio controls>
                  <source src={msg.audio} type="audio/webm" />
                </audio>
              </div>
            ) : (
              <p style={{ margin: "8px 0", fontSize: "17px" }}>
                {msg.message}
              </p>
            )}

            <small>{msg.time}</small>
          </div>
        ))}
      </div>

      <div
        style={{
          position: "relative",
          marginTop: "15px",
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          onClick={() => setShowEmoji(!showEmoji)}
          style={{
            padding: "12px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            fontSize: "20px",
          }}
        >
          😊
        </button>

        {showEmoji && (
          <div
            style={{
              position: "absolute",
              bottom: "60px",
              left: "0",
              zIndex: 10,
            }}
          >
            <EmojiPicker
              onEmojiClick={(emojiData) =>
                setMessage((prev) => prev + emojiData.emoji)
              }
            />
          </div>
        )}

        <button
          onClick={isRecording ? stopRecording : startRecording}
          style={{
            padding: "12px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            background: isRecording ? "#ef4444" : "white",
            color: isRecording ? "white" : "#111827",
            fontSize: "20px",
          }}
        >
          {isRecording ? "⏹" : "🎤"}
        </button>

        <label
          style={{
            padding: "12px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            background: "white",
            color: "#111827",
            fontSize: "20px",
          }}
        >
          📎
          <input
            type="file"
            accept="image/*,.pdf,.doc,.docx,.ppt,.pptx"
            onChange={handleFileShare}
            style={{ display: "none" }}
          />
        </label>

        <input
          value={message}
          onChange={(e) => handleTyping(e.target.value)}
          placeholder="Type message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            outline: "none",
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "14px 22px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            background: "#22c55e",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;