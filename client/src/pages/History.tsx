import { useEffect, useState } from "react";
import axios from "axios";

function History() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [scheduledMeetings, setScheduledMeetings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("history");

  useEffect(() => {
    fetchMeetings();
    fetchScheduledMeetings();
  }, []);

  const fetchMeetings = async () => {
    const res = await axios.get("http://localhost:5000/api/meetings");
    setMeetings(res.data.meetings);
  };

  const fetchScheduledMeetings = async () => {
    const res = await axios.get("http://localhost:5000/api/schedule");
    setScheduledMeetings(res.data.meetings);
  };

  const deleteSchedule = async (id: string) => {
    await axios.delete(`http://localhost:5000/api/schedule/${id}`);
    fetchScheduledMeetings();
  };

  return (
    <div
      style={{
        padding: "40px",
        color: "white",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #020617, #111827, #1e1b4b)",
        fontFamily: "Poppins, Arial, sans-serif",
      }}
    >
      <h1>📁 Meeting Center</h1>

      <div style={{ display: "flex", gap: "12px", margin: "25px 0" }}>
        <button
          onClick={() => setActiveTab("history")}
          style={{
            padding: "12px 18px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            background: activeTab === "history" ? "#22c55e" : "#334155",
            color: "white",
          }}
        >
          📁 Previous Meetings
        </button>

        <button
          onClick={() => setActiveTab("scheduled")}
          style={{
            padding: "12px 18px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            background: activeTab === "scheduled" ? "#22c55e" : "#334155",
            color: "white",
          }}
        >
          📅 Scheduled Meetings
        </button>
      </div>

      {activeTab === "history" && (
        <>
          {meetings.length === 0 ? (
            <p>No previous meetings found.</p>
          ) : (
            meetings.map((meeting: any) => (
              <div
                key={meeting._id}
                style={{
                  padding: "20px",
                  marginTop: "20px",
                  borderRadius: "18px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <h3>🎥 Meeting ID: {meeting.roomId}</h3>
                <p>Created By: {meeting.createdBy}</p>
                <p>Email: {meeting.creatorEmail}</p>
                <p>Date: {new Date(meeting.createdAt).toLocaleString()}</p>
              </div>
            ))
          )}
        </>
      )}

      {activeTab === "scheduled" && (
        <>
          {scheduledMeetings.length === 0 ? (
            <p>No scheduled meetings found.</p>
          ) : (
            scheduledMeetings.map((meeting: any) => (
              <div
                key={meeting._id}
                style={{
                  padding: "20px",
                  marginTop: "20px",
                  borderRadius: "18px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <h3>📅 {meeting.title}</h3>
                <p>Date: {meeting.date}</p>
                <p>Time: {meeting.time}</p>
                <p>Description: {meeting.description || "No description"}</p>
                <p>Created By: {meeting.createdBy}</p>
                <p>Email: {meeting.creatorEmail}</p>
                <p>Status: {meeting.status}</p>

                <button
                  onClick={() => deleteSchedule(meeting._id)}
                  style={{
                    marginTop: "10px",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "none",
                    cursor: "pointer",
                    background: "#ef4444",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Delete Schedule
                </button>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

export default History;