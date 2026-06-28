import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

const API_URL = "https://vartalap-backend-hz3z.onrender.com";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") !== "light"
  );

  const [analytics, setAnalytics] = useState({
    meetings: 0,
    messages: 0,
    files: 0,
    voiceNotes: 0,
    translations: 0,
  });

  const today = useMemo(() => {
    return new Date().toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/analytics`);
      setAnalytics(res.data);
    } catch (error) {
      console.log("Analytics fetch failed", error);
    }
  };

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const createMeeting = async () => {
    try {
      const roomId = "vartalap-" + Date.now();

      await axios.post(`${API_URL}/api/meetings`, {
        roomId,
        createdBy: user.name || "Vartalap User",
        creatorEmail: user.email || "user@vartalap.com",
      });

      fetchAnalytics();
      navigate(`/meeting/${roomId}`);
    } catch (error) {
      alert("Meeting create nahi ho payi");
      console.log(error);
    }
  };

  const joinMeeting = () => {
    const roomId = prompt("Enter Meeting ID");
    if (roomId) navigate(`/meeting/${roomId}`);
  };

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const res = await axios.post(`${API_URL}/api/upload`, {
          image: reader.result,
        });

        const updatedUser = {
          ...user,
          image: res.data.url,
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.location.reload();
      } catch (error) {
        alert("Cloudinary Upload Failed");
        console.log(error);
      }
    };

    reader.readAsDataURL(file);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const stats = [
    { icon: "🎥", label: "Meetings", value: analytics.meetings, hint: "Created rooms" },
    { icon: "💬", label: "Messages", value: analytics.messages, hint: "Chat activity" },
    { icon: "🌐", label: "Translator", value: analytics.translations, hint: "Text translated" },
    { icon: "📎", label: "Files", value: analytics.files, hint: "Shared files" },
    { icon: "🎤", label: "Voice Notes", value: analytics.voiceNotes, hint: "Audio notes" },
  ];

  const actions = [
    {
      icon: "🎥",
      title: "Create Meeting",
      text: "Start a secure LiveKit video room.",
      className: "meeting",
      onClick: createMeeting,
    },
    {
      icon: "📹",
      title: "Join Meeting",
      text: "Enter an existing meeting ID.",
      className: "join",
      onClick: joinMeeting,
    },
    {
      icon: "📅",
      title: "Schedule Meeting",
      text: "Plan a meeting for later.",
      className: "schedule",
      onClick: () => navigate("/schedule"),
    },
    {
      icon: "💬",
      title: "Chat Room",
      text: "Open real-time conversation.",
      className: "chat",
      onClick: () => navigate("/chat"),
    },
    {
      icon: "🌐",
      title: "Translator",
      text: "Translate text quickly.",
      className: "translate",
      onClick: () => navigate("/translator"),
    },
    {
      icon: "📁",
      title: "Meeting History",
      text: "View previous meeting records.",
      className: "history",
      onClick: () => navigate("/history"),
    },
  ];

  return (
    <div className={darkMode ? "dashboard-shell" : "dashboard-shell light-mode"}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">V</div>
          <div>
            <h2>Vartalap</h2>
            <span>Workspace</span>
          </div>
        </div>

        <nav className="menu">
          <button className="active">🏠 Dashboard</button>
          <button onClick={createMeeting}>🎥 Create Meeting</button>
          <button onClick={joinMeeting}>📹 Join Meeting</button>
          <button onClick={() => navigate("/schedule")}>📅 Schedule</button>
          <button onClick={() => navigate("/chat")}>💬 Chat Room</button>
          <button onClick={() => navigate("/translator")}>🌐 Translator</button>
          <button onClick={() => navigate("/history")}>📁 History</button>
          <button onClick={toggleTheme}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </nav>

        <div className="sidebar-user">
          <div className="mini-avatar">
            {user.image ? (
              <img src={user.image} alt="profile" />
            ) : (
              user.name?.charAt(0)?.toUpperCase() || "U"
            )}
          </div>
          <div>
            <strong>{user.name || "User"}</strong>
            <small>Online</small>
          </div>
        </div>

        <button className="logout-side" onClick={logout}>
          🚪 Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <section className="dashboard-topbar">
          <div>
            <p>Overview</p>
            <h1>Dashboard</h1>
          </div>

          <div className="topbar-meta">
            <span>{today}</span>
            <button onClick={toggleTheme}>
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </section>

        <section className="hero-card">
          <div>
            <p className="small-title">Welcome back</p>
            <h2>Hi, {user.name || "User"} 👋</h2>
            <p>
              Manage meetings, chat, translations and collaboration tools from one clean workspace.
            </p>

            <div className="hero-actions">
              <button onClick={createMeeting}>Start Meeting</button>
              <button onClick={joinMeeting}>Join by ID</button>
            </div>
          </div>

          <div className="profile-panel">
            <div className="avatar">
              {user.image ? (
                <img src={user.image} alt="profile" className="profile-image" />
              ) : (
                user.name?.charAt(0)?.toUpperCase() || "U"
              )}
            </div>

            <h3>{user.name || "Vartalap User"}</h3>
            <p>{user.email || "user@vartalap.com"}</p>

            <label className="upload-label">
              Upload Photo
              <input type="file" accept="image/*" onChange={handleProfileUpload} />
            </label>
          </div>
        </section>

        <section className="stats-grid">
          {stats.map((item, index) => (
            <div className="stat-card" key={item.label} style={{ animationDelay: `${index * 0.05}s` }}>
              <span>{item.icon}</span>
              <div>
                <h3>{item.value}</h3>
                <p>{item.label}</p>
                <small>{item.hint}</small>
              </div>
            </div>
          ))}
        </section>

        <section className="section-head">
          <div>
            <h2>Quick Actions</h2>
            <p>Choose what you want to do next.</p>
          </div>
        </section>

        <section className="actions-grid">
          {actions.map((action, index) => (
            <button
              key={action.title}
              className={`action-card ${action.className}`}
              onClick={action.onClick}
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <span>{action.icon}</span>
              <div>
                <h3>{action.title}</h3>
                <p>{action.text}</p>
              </div>
              <b>→</b>
            </button>
          ))}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;