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

  const today = useMemo(
    () =>
      new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "2-digit",
        month: "short",
      }),
    []
  );

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
    { icon: "🎥", label: "Meetings", value: analytics.meetings },
    { icon: "💬", label: "Messages", value: analytics.messages },
    { icon: "🌐", label: "Translations", value: analytics.translations },
    { icon: "📎", label: "Files", value: analytics.files },
    { icon: "🎤", label: "Voice Notes", value: analytics.voiceNotes },
  ];

  const actions = [
    { icon: "🎥", title: "Create Meeting", text: "Start a LiveKit video room", onClick: createMeeting },
    { icon: "📹", title: "Join Meeting", text: "Join using meeting ID", onClick: joinMeeting },
    { icon: "📅", title: "Schedule", text: "Plan meetings for later", onClick: () => navigate("/schedule") },
    { icon: "💬", title: "Chat Room", text: "Open real-time chat", onClick: () => navigate("/chat") },
    { icon: "🌐", title: "Translator", text: "Translate conversations", onClick: () => navigate("/translator") },
    { icon: "📁", title: "History", text: "View meeting records", onClick: () => navigate("/history") },
  ];

  return (
    <div className={darkMode ? "dashboard-page" : "dashboard-page light-mode"}>
      <aside className="dash-sidebar">
        <div className="dash-logo">
          <div className="dash-logo-icon">V</div>
          <div>
            <h2>Vartalap</h2>
            <p>Connect Better</p>
          </div>
        </div>

        <nav className="dash-nav">
          <button className="nav-active">🏠 Dashboard</button>
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

        <div className="dash-mini-profile">
          <div className="mini-profile-img">
            {user.image ? <img src={user.image} alt="profile" /> : user.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <strong>{user.name || "User"}</strong>
            <span>Online</span>
          </div>
        </div>

        <button className="dash-logout" onClick={logout}>Logout</button>
      </aside>

      <main className="dash-main">
        <header className="dash-header">
          <div>
            <p>{today}</p>
            <h1>Welcome back, {user.name || "User"}</h1>
          </div>

          <div className="dash-header-actions">
            <button onClick={toggleTheme}>{darkMode ? "☀️" : "🌙"}</button>
            <button onClick={logout}>Logout</button>
          </div>
        </header>

        <section className="dash-hero">
          <div className="hero-content">
            <span className="hero-tag">Live collaboration workspace</span>
            <h2>Meet, chat and translate from one clean dashboard.</h2>
            <p>
              Start meetings, invite people, manage conversations and keep your work organized.
            </p>

            <div className="hero-buttons">
              <button onClick={createMeeting}>Start Meeting</button>
              <button onClick={joinMeeting}>Join Meeting</button>
            </div>
          </div>

          <div className="dash-profile-card">
            <div className="profile-img-box">
              {user.image ? (
                <img src={user.image} alt="profile" />
              ) : (
                user.name?.charAt(0)?.toUpperCase() || "U"
              )}
            </div>

            <h3>{user.name || "Vartalap User"}</h3>
            <p>{user.email || "user@vartalap.com"}</p>

            <label className="photo-upload-btn">
              Change Photo
              <input type="file" accept="image/*" onChange={handleProfileUpload} />
            </label>
          </div>
        </section>

        <section className="dash-stats">
          {stats.map((stat, index) => (
            <div className="dash-stat-card" key={stat.label} style={{ animationDelay: `${index * 0.06}s` }}>
              <div className="stat-icon">{stat.icon}</div>
              <div>
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="dash-section-title">
          <h2>Quick Actions</h2>
          <p>Fast access to your main Vartalap tools</p>
        </section>

        <section className="dash-actions">
          {actions.map((action, index) => (
            <button
              className="dash-action-card"
              key={action.title}
              onClick={action.onClick}
              style={{ animationDelay: `${index * 0.05}s` }}
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