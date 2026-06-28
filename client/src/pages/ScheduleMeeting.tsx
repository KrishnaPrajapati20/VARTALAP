import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ScheduleMeeting() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/schedule", {
        title,
        date,
        time,
        description,
        createdBy: user.name || "Vartalap User",
        creatorEmail: user.email || "user@vartalap.com",
      });

      alert("Meeting Scheduled Successfully!");
      navigate("/dashboard");
    } catch (error) {
      alert("Meeting schedule nahi ho payi");
      console.log(error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(135deg, #020617, #111827, #1e1b4b)",
        color: "white",
        fontFamily: "Poppins, Arial, sans-serif",
        padding: "30px",
      }}
    >
      <form
        onSubmit={handleSchedule}
        style={{
          width: "430px",
          maxWidth: "95%",
          padding: "35px",
          borderRadius: "28px",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.18)",
          backdropFilter: "blur(18px)",
        }}
      >
        <h1>📅 Schedule Meeting</h1>
        <p style={{ color: "#cbd5e1" }}>Plan your meeting in advance.</p>

        <input
          type="text"
          placeholder="Meeting Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          style={inputStyle}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          style={inputStyle}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "14px",
            border: "none",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "12px",
          }}
        >
          Schedule Meeting
        </button>

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          style={{
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "14px",
            background: "#334155",
            color: "white",
            cursor: "pointer",
            marginTop: "12px",
          }}
        >
          Back to Dashboard
        </button>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  marginTop: "14px",
  borderRadius: "14px",
  border: "none",
  outline: "none",
};

export default ScheduleMeeting;