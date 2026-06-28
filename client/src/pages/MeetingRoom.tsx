import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  LiveKitRoom,
  VideoConference,
} from "@livekit/components-react";

import "@livekit/components-styles";

function MeetingRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const savedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [token, setToken] = useState("");
  const [serverUrl, setServerUrl] = useState("");
  const [participantName, setParticipantName] = useState(
    savedUser.name || ""
  );

  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState("");
  const [notes, setNotes] = useState("");

  const meetingId = roomId || "vartalap-room";

  useEffect(() => {
    if (savedUser.name) {
      joinMeeting(savedUser.name);
    }
  }, []);

  const joinMeeting = async (name?: string) => {
    const finalName = name || participantName;

    if (!finalName.trim()) {
      alert("Please enter your name");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "https://vartalap-backend-hz3z.onrender.com/api/livekit/token",
        {
          roomName: meetingId,
          participantName: finalName,
        }
      );

      setToken(res.data.token);
      setServerUrl(res.data.url);
      setJoined(true);
    } catch (error) {
      alert("Meeting join nahi ho payi");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = () => {
    if (!notes.trim()) {
      alert("Please write meeting notes first");
      return;
    }

    setSummary(`
Meeting Summary:
• ${notes}

Action Items:
• Review discussion points
• Share meeting notes with team
• Plan next meeting

Key Decision:
• Vartalap meeting discussion completed successfully
`);
  };

  const copyMeetingLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    alert("Meeting link copied!");
  };

  if (!joined) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #020617, #111827, #1e1b4b)",
          color: "white",
          display: "grid",
          placeItems: "center",
          fontFamily: "Poppins, Arial, sans-serif",
          padding: "25px",
        }}
      >
        <div
          style={{
            width: "420px",
            maxWidth: "95%",
            padding: "35px",
            borderRadius: "28px",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow: "0 25px 80px rgba(0,0,0,0.35)",
            backdropFilter: "blur(18px)",
            textAlign: "center",
          }}
        >
          <h1 style={{ marginBottom: "10px" }}>🎥 Join Meeting</h1>

          <p style={{ color: "#cbd5e1", marginBottom: "22px" }}>
            Meeting ID: <b>{meetingId}</b>
          </p>

          <input
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            placeholder="Enter your name"
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "14px",
              border: "none",
              outline: "none",
              marginBottom: "15px",
              fontSize: "16px",
            }}
          />

          <button
            onClick={() => joinMeeting()}
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "14px",
              border: "none",
              cursor: "pointer",
              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            {loading ? "Joining..." : "Join Meeting"}
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "14px",
              border: "none",
              cursor: "pointer",
              background: "#334155",
              color: "white",
              marginTop: "12px",
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      <div style={{ flex: 3, background: "#020617" }}>
        <LiveKitRoom
          token={token}
          serverUrl={serverUrl}
          connect={true}
          video={true}
          audio={true}
          data-lk-theme="default"
          style={{ height: "100vh" }}
          onDisconnected={() => navigate("/dashboard")}
        >
          <VideoConference />
        </LiveKitRoom>
      </div>

      <div
        style={{
          flex: 1,
          minWidth: "320px",
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

        <button
          onClick={copyMeetingLink}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            background: "#2563eb",
            color: "white",
            marginBottom: "15px",
            fontWeight: "bold",
          }}
        >
          🔗 Copy Meeting Link
        </button>

        <h2>🎥 Vartalap Meeting</h2>

        <div
          style={{
            padding: "12px",
            borderRadius: "12px",
            background: "#1e293b",
            marginBottom: "18px",
          }}
        >
          <p style={{ margin: 0, color: "#cbd5e1" }}>Meeting ID</p>
          <strong>{meetingId}</strong>
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