import { useEffect, useState } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function MeetingRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [summary, setSummary] = useState("");
  const [notes, setNotes] = useState("");
  const [participants, setParticipants] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<string[]>([
    "Meeting room opened successfully",
  ]);

  useEffect(() => {
    socket.emit("join_meeting_room", {
      roomId,
      user,
    });

    socket.on("meeting_participants", (data) => {
      setParticipants(data);
    });

    socket.on("meeting_notification", (data) => {
      setNotifications((prev) => [data.message, ...prev]);
    });

    return () => {
      socket.emit("leave_meeting_room", {
        roomId,
        user,
      });

      socket.off("meeting_participants");
      socket.off("meeting_notification");
    };
  }, [roomId]);

  const generateSummary = () => {
    if (!notes.trim()) {
      alert("Please write meeting notes first");
      return;
    }

    const generated = `
Meeting Summary:
• ${notes}

Action Items:
• Review discussion points
• Share meeting notes with team
• Plan next meeting

Key Decision:
• Vartalap meeting discussion completed successfully
`;

    setSummary(generated);
    setNotifications((prev) => ["AI meeting summary generated", ...prev]);
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      <div style={{ flex: 3 }}>
        <JitsiMeeting
          domain="meet.jit.si"
          roomName={roomId || "vartalap-room"}
          userInfo={{
            displayName: user.name || "Vartalap User",
            email: user.email || "",
          }}
          configOverwrite={{
            startWithAudioMuted: false,
            startWithVideoMuted: false,
          }}
          interfaceConfigOverwrite={{
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = "100vh";
            iframeRef.style.width = "100%";
          }}
        />
      </div>

      <div
        style={{
          flex: 1,
          padding: "20px",
          background: "#0f172a",
          color: "white",
          overflowY: "auto",
          fontFamily: "Poppins, Arial, sans-serif",
        }}
      >
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            background: "#334155",
            color: "white",
            marginBottom: "15px",
          }}
        >
          ← Back to Dashboard
        </button>

        <h2>🎥 Meeting Room</h2>

        <div
          style={{
            padding: "12px",
            borderRadius: "12px",
            background: "#1e293b",
            marginBottom: "18px",
          }}
        >
          <p style={{ margin: 0, color: "#cbd5e1" }}>Meeting ID</p>
          <strong>{roomId}</strong>
        </div>

        <div
          style={{
            padding: "15px",
            borderRadius: "14px",
            background: "#1e293b",
            marginBottom: "18px",
          }}
        >
          <h3>👥 Participants</h3>

          {participants.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>No participants yet</p>
          ) : (
            participants.map((person, index) => (
              <div
                key={index}
                style={{
                  padding: "10px",
                  borderRadius: "10px",
                  background: "#0f172a",
                  marginBottom: "10px",
                }}
              >
                <strong>🟢 {person.name}</strong>
                <p style={{ margin: "5px 0", color: "#94a3b8" }}>
                  {person.email || "No email"}
                </p>
                <small>
                  {index === 0 ? "Host" : person.status || "Participant"}
                </small>
              </div>
            ))
          )}

          <p style={{ color: "#cbd5e1" }}>
            Total Participants: {participants.length}
          </p>
        </div>

        <div
          style={{
            padding: "15px",
            borderRadius: "14px",
            background: "#1e293b",
            marginBottom: "18px",
          }}
        >
          <h3>🔔 Notifications</h3>

          {notifications.map((note, index) => (
            <div
              key={index}
              style={{
                padding: "9px",
                borderRadius: "10px",
                background: "#0f172a",
                marginBottom: "8px",
                color: "#cbd5e1",
              }}
            >
              ✅ {note}
            </div>
          ))}
        </div>

        <div
          style={{
            padding: "15px",
            borderRadius: "14px",
            background: "#1e293b",
          }}
        >
          <h3>🤖 AI Meeting Summary</h3>

          <p style={{ color: "#cbd5e1", fontSize: "14px" }}>
            Write meeting notes here, then generate a clean summary.
          </p>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Example: We discussed deployment, chat features, meeting history..."
            rows={7}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              outline: "none",
              marginTop: "10px",
              resize: "vertical",
            }}
          />

          <button
            onClick={generateSummary}
            style={{
              width: "100%",
              marginTop: "15px",
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              background: "#22c55e",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Generate Summary
          </button>

          {summary && (
            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                borderRadius: "12px",
                background: "#0f172a",
                whiteSpace: "pre-line",
                lineHeight: "1.6",
              }}
            >
              {summary}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MeetingRoom;