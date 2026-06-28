import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiCopy,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiVideo,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./History.css";

const API_URL = "https://vartalap-backend-hz3z.onrender.com";

function History() {
  const navigate = useNavigate();

  const [meetings, setMeetings] = useState<any[]>([]);
  const [scheduledMeetings, setScheduledMeetings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("history");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMeetings();
    fetchScheduledMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/meetings`);
      setMeetings(res.data.meetings || []);
    } catch (error) {
      console.log("Meeting history fetch failed", error);
    }
  };

  const fetchScheduledMeetings = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/schedule`);
      setScheduledMeetings(res.data.meetings || []);
    } catch (error) {
      console.log("Schedule fetch failed", error);
    }
  };

  const deleteSchedule = async (id: string) => {
    if (!confirm("Delete this scheduled meeting?")) return;

    try {
      await axios.delete(`${API_URL}/api/schedule/${id}`);
      fetchScheduledMeetings();
    } catch (error) {
      alert("Schedule delete nahi ho paya");
    }
  };

  const copyText = async (value: string) => {
    await navigator.clipboard.writeText(value);
    alert("Copied!");
  };

  const filteredHistory = useMemo(() => {
    return meetings.filter((m) =>
      `${m.roomId} ${m.createdBy} ${m.creatorEmail}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [meetings, search]);

  const filteredScheduled = useMemo(() => {
    return scheduledMeetings.filter((m) =>
      `${m.title} ${m.date} ${m.time} ${m.createdBy} ${m.creatorEmail}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [scheduledMeetings, search]);

  return (
    <div className="history-page">
      <div className="history-glow one"></div>
      <div className="history-glow two"></div>

      <header className="history-header">
        <button onClick={() => navigate("/dashboard")} className="history-back">
          <FiArrowLeft /> Dashboard
        </button>

        <div>
          <p>Meeting Workspace</p>
          <h1>Meeting Center</h1>
        </div>

        <button
          className="history-refresh"
          onClick={() => {
            fetchMeetings();
            fetchScheduledMeetings();
          }}
        >
          <FiRefreshCw /> Refresh
        </button>
      </header>

      <section className="history-hero">
        <div>
          <span>Professional Meeting Records</span>
          <h2>Manage your previous and scheduled meetings in one place.</h2>
          <p>
            Track meeting activity, copy room IDs, rejoin rooms and manage scheduled sessions.
          </p>
        </div>
      </section>

      <section className="history-stats">
        <div>
          <FiVideo />
          <h3>{meetings.length}</h3>
          <p>Total Meetings</p>
        </div>

        <div>
          <FiCalendar />
          <h3>{scheduledMeetings.length}</h3>
          <p>Scheduled</p>
        </div>

        <div>
          <FiClock />
          <h3>{filteredHistory.length}</h3>
          <p>Visible History</p>
        </div>

        <div>
          <FiSearch />
          <h3>{filteredScheduled.length}</h3>
          <p>Visible Schedules</p>
        </div>
      </section>

      <section className="history-tools">
        <div className="history-search">
          <FiSearch />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search meeting ID, title, host or email..."
          />
        </div>

        <div className="history-tabs">
          <button
            className={activeTab === "history" ? "active" : ""}
            onClick={() => setActiveTab("history")}
          >
            Previous Meetings
          </button>

          <button
            className={activeTab === "scheduled" ? "active" : ""}
            onClick={() => setActiveTab("scheduled")}
          >
            Scheduled Meetings
          </button>
        </div>
      </section>

      {activeTab === "history" && (
        <section className="history-grid">
          {filteredHistory.length === 0 ? (
            <div className="empty-box">No previous meetings found.</div>
          ) : (
            filteredHistory.map((meeting) => (
              <div className="meeting-card" key={meeting._id}>
                <div className="card-top">
                  <div className="card-icon">
                    <FiVideo />
                  </div>
                  <span className="status completed">Completed</span>
                </div>

                <h3>{meeting.roomId}</h3>

                <div className="info-list">
                  <p><b>Created By:</b> {meeting.createdBy || "Unknown"}</p>
                  <p><b>Email:</b> {meeting.creatorEmail || "No email"}</p>
                  <p>
                    <b>Date:</b>{" "}
                    {meeting.createdAt
                      ? new Date(meeting.createdAt).toLocaleString()
                      : "Not available"}
                  </p>
                </div>

                <div className="card-actions">
                  <button onClick={() => navigate(`/meeting/${meeting.roomId}`)}>
                    Join Again
                  </button>
                  <button onClick={() => copyText(meeting.roomId)}>
                    <FiCopy /> Copy ID
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {activeTab === "scheduled" && (
        <section className="history-grid">
          {filteredScheduled.length === 0 ? (
            <div className="empty-box">No scheduled meetings found.</div>
          ) : (
            filteredScheduled.map((meeting) => (
              <div className="meeting-card" key={meeting._id}>
                <div className="card-top">
                  <div className="card-icon schedule">
                    <FiCalendar />
                  </div>
                  <span className="status scheduled">
                    {meeting.status || "Scheduled"}
                  </span>
                </div>

                <h3>{meeting.title}</h3>

                <div className="info-list">
                  <p><b>Date:</b> {meeting.date}</p>
                  <p><b>Time:</b> {meeting.time}</p>
                  <p><b>Description:</b> {meeting.description || "No description"}</p>
                  <p><b>Created By:</b> {meeting.createdBy}</p>
                  <p><b>Email:</b> {meeting.creatorEmail}</p>
                </div>

                <div className="card-actions">
                  <button onClick={() => navigate(`/meeting/${meeting.roomId || "vartalap-" + meeting._id}`)}>
                    Join
                  </button>
                  <button className="danger" onClick={() => deleteSchedule(meeting._id)}>
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      )}
    </div>
  );
}

export default History;