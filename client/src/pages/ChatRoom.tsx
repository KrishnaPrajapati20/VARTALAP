import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import {
  FiArrowLeft,
  FiDownload,
  FiFile,
  FiMic,
  FiPaperclip,
  FiSend,
  FiSmile,
  FiSquare,
  FiUsers,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./ChatRoom.css";

const socket = io("https://vartalap-backend-hz3z.onrender.com");

function ChatRoom() {
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement | null>(null);

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

    socket.on("online_users", (users) => setOnlineUsers(users));

    socket.on("user_typing", (data) => {
      if (data.sender !== user.name) setTypingUser(data.sender);
    });

    socket.on("user_stop_typing", () => setTypingUser(""));

    return () => {
      socket.off("receive_message");
      socket.off("online_users");
      socket.off("user_typing");
      socket.off("user_stop_typing");
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
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
    <div className="chat-page">
      <aside className="chat-sidebar">
        <button className="chat-back" onClick={() => navigate("/dashboard")}>
          <FiArrowLeft /> Dashboard
        </button>

        <div className="chat-brand">
          <div className="chat-brand-icon">V</div>
          <div>
            <h2>Vartalap Chat</h2>
            <p>Team conversation room</p>
          </div>
        </div>

        <div className="online-card">
          <div className="online-head">
            <FiUsers />
            <strong>Online Users</strong>
            <span>{onlineUsers.length}</span>
          </div>

          <div className="online-list">
            {onlineUsers.length === 0 ? (
              <p>No users online</p>
            ) : (
              onlineUsers.map((u, index) => (
                <div className="online-user" key={index}>
                  <div>{u.name?.charAt(0)?.toUpperCase() || "U"}</div>
                  <span>{u.name || "User"}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>

      <main className="chat-main">
        <header className="chat-header">
          <div>
            <p>Workspace Room</p>
            <h1>General Chat</h1>
          </div>

          <div className="chat-status">
            <span></span>
            Live Room
          </div>
        </header>

        <section className="chat-window">
          {messages.length === 0 ? (
            <div className="empty-chat">
              <h2>Start the conversation</h2>
              <p>Send a message, file, image or voice note.</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMine = msg.sender === user.name;

              return (
                <div
                  key={index}
                  className={isMine ? "message-row mine" : "message-row"}
                >
                  <div className="message-avatar">
                    {msg.sender?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <div className="message-bubble">
                    <div className="message-meta">
                      <strong>{msg.sender}</strong>
                      <small>{msg.time}</small>
                    </div>

                    {msg.type === "file" ? (
                      <div className="file-message">
                        {msg.fileType?.startsWith("image/") && (
                          <img src={msg.fileUrl} alt={msg.fileName} />
                        )}

                        <div className="file-info">
                          <FiFile />
                          <span>{msg.fileName}</span>
                        </div>

                        <a href={msg.fileUrl} download={msg.fileName}>
                          <FiDownload /> Download
                        </a>
                      </div>
                    ) : msg.type === "audio" ? (
                      <div className="audio-message">
                        <p>Voice Note</p>
                        <audio controls>
                          <source src={msg.audio} type="audio/webm" />
                        </audio>
                      </div>
                    ) : (
                      <p>{msg.message}</p>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {typingUser && (
            <div className="typing-indicator">{typingUser} is typing...</div>
          )}

          <div ref={bottomRef}></div>
        </section>

        <footer className="chat-composer">
          {showEmoji && (
            <div className="emoji-panel">
              <EmojiPicker
                onEmojiClick={(emojiData) =>
                  setMessage((prev) => prev + emojiData.emoji)
                }
              />
            </div>
          )}

          <button onClick={() => setShowEmoji(!showEmoji)}>
            <FiSmile />
          </button>

          <label>
            <FiPaperclip />
            <input
              type="file"
              accept="image/*,.pdf,.doc,.docx,.ppt,.pptx"
              onChange={handleFileShare}
            />
          </label>

          <button
            className={isRecording ? "recording" : ""}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? <FiSquare /> : <FiMic />}
          </button>

          <input
            value={message}
            onChange={(e) => handleTyping(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />

          <button className="send-btn" onClick={sendMessage}>
            <FiSend />
          </button>
        </footer>
      </main>
    </div>
  );
}

export default ChatRoom;