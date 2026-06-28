import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

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

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/analytics");
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

      await axios.post("http://localhost:5000/api/meetings", {
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
        const res = await axios.post("http://localhost:5000/api/upload", {
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

  return (
    <div className={darkMode ? "dashboard-shell" : "dashboard-shell light-mode"}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">V</div>
          <div>
            <h2>Vartalap</h2>
            <span>Connect Better</span>
          </div>
        </div>

        <nav className="menu">
          <button className="active">🏠 Dashboard</button>
          <button onClick={createMeeting}>🎥 Create Meeting</button>
          <button onClick={joinMeeting}>📹 Join Meeting</button>
          <button onClick={() => navigate("/schedule")}>📅 Schedule Meeting</button>
          <button onClick={() => navigate("/chat")}>💬 Chat Room</button>
          <button onClick={() => navigate("/translator")}>🌐 Translator</button>
          <button onClick={() => navigate("/history")}>📁 Meeting History</button>
          <button>👤 Profile</button>

          <button onClick={toggleTheme}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          <button>⚙️ Settings</button>
        </nav>

        <button className="logout-side" onClick={logout}>
          🚪 Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <section className="top-card">
          <div>
            <p className="small-title">Welcome back</p>
            <h1>Hi, {user.name || "User"} 👋</h1>
            <p className="subtitle">
              Start meetings, chat instantly and translate conversations in real time.
            </p>
          </div>

          <div className="user-card">
            <div className="avatar">
              {user.image ? (
                <img src={user.image} alt="profile" className="profile-image" />
              ) : (
                user.name?.charAt(0)?.toUpperCase() || "U"
              )}
            </div>

            <div>
              <h3>{user.name || "Vartalap User"}</h3>
              <p>{user.email || "user@vartalap.com"}</p>

              <label className="upload-label">
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileUpload}
                />
              </label>
            </div>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card purple">
            <span>🎥</span>
            <h3>Meetings</h3>
            <p>{analytics.meetings} Meetings</p>
          </div>

          <div className="stat-card blue">
            <span>💬</span>
            <h3>Messages</h3>
            <p>{analytics.messages} Messages</p>
          </div>

          <div className="stat-card green">
            <span>🌐</span>
            <h3>Translator</h3>
            <p>{analytics.translations} Uses</p>
          </div>

          <div className="stat-card orange">
            <span>📎</span>
            <h3>Files</h3>
            <p>{analytics.files} Shared</p>
          </div>

          <div className="stat-card purple">
            <span>🎤</span>
            <h3>Voice Notes</h3>
            <p>{analytics.voiceNotes} Notes</p>
          </div>
        </section>

        <section className="actions-grid">
          <button className="action-card meeting" onClick={createMeeting}>
            <span>🎥</span>
            <h3>Create Meeting</h3>
            <p>Start a new video room instantly.</p>
          </button>

          <button className="action-card join" onClick={joinMeeting}>
            <span>📹</span>
            <h3>Join Meeting</h3>
            <p>Enter meeting ID and connect.</p>
          </button>

          <button className="action-card meeting" onClick={() => navigate("/schedule")}>
            <span>📅</span>
            <h3>Schedule Meeting</h3>
            <p>Plan meetings for later.</p>
          </button>

          <button className="action-card chat" onClick={() => navigate("/chat")}>
            <span>💬</span>
            <h3>Chat Room</h3>
            <p>Message users in real time.</p>
          </button>

          <button
            className="action-card translate"
            onClick={() => navigate("/translator")}
          >
            <span>🌐</span>
            <h3>Translator</h3>
            <p>Translate text quickly.</p>
          </button>

          <button className="action-card history" onClick={() => navigate("/history")}>
            <span>📁</span>
            <h3>Meeting History</h3>
            <p>View your previous meetings.</p>
          </button>

          <button className="action-card settings" onClick={toggleTheme}>
            <span>{darkMode ? "☀️" : "🌙"}</span>
            <h3>{darkMode ? "Light Mode" : "Dark Mode"}</h3>
            <p>Switch your dashboard theme.</p>
          </button>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;