import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiCalendar,
  FiClock,
  FiFileText,
  FiLogOut,
  FiMessageCircle,
  FiMoon,
  FiPlus,
  FiSearch,
  FiSun,
  FiUploadCloud,
  FiUser,
  FiVideo,
  FiZap,
} from "react-icons/fi";
import "./Dashboard.css";

const API_URL = "https://vartalap-backend-hz3z.onrender.com";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") !== "light");

  const [analytics, setAnalytics] = useState({
    meetings: 0,
    messages: 0,
    files: 0,
    voiceNotes: 0,
    translations: 0,
  });

  const today = useMemo(() => {
    return new Date().toLocaleDateString("en-IN", {
      weekday: "long",
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

        const updatedUser = { ...user, image: res.data.url };
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
    { label: "Meetings", value: analytics.meetings, icon: <FiVideo /> },
    { label: "Messages", value: analytics.messages, icon: <FiMessageCircle /> },
    { label: "Translations", value: analytics.translations, icon: <FiZap /> },
    { label: "Files", value: analytics.files, icon: <FiFileText /> },
    { label: "Voice Notes", value: analytics.voiceNotes, icon: <FiClock /> },
  ];

  const actions = [
    { title: "Create Meeting", text: "Start a secure video room", icon: <FiVideo />, click: createMeeting },
    { title: "Join Meeting", text: "Join using meeting ID", icon: <FiPlus />, click: joinMeeting },
    { title: "Schedule", text: "Plan meetings for later", icon: <FiCalendar />, click: () => navigate("/schedule") },
    { title: "Chat Room", text: "Open real-time chat", icon: <FiMessageCircle />, click: () => navigate("/chat") },
    { title: "Translator", text: "Translate conversations", icon: <FiZap />, click: () => navigate("/translator") },
    { title: "History", text: "View meeting records", icon: <FiFileText />, click: () => navigate("/history") },
  ];

  return (
    <div className={darkMode ? "vd-page" : "vd-page vd-light"}>
      <div className="vd-bg-one"></div>
      <div className="vd-bg-two"></div>

      <aside className="vd-sidebar">
        <div className="vd-brand">
          <div className="vd-brand-icon">V</div>
          <div>
            <h2>Vartalap</h2>
            <p>Team Workspace</p>
          </div>
        </div>

        <nav className="vd-menu">
          <button onClick={() => navigate("/profile")}>👤 Profile</button>
          <button className="active"><FiUser /> Dashboard</button>
          <button onClick={createMeeting}><FiVideo /> Create Meeting</button>
          <button onClick={joinMeeting}><FiPlus /> Join Meeting</button>
          <button onClick={() => navigate("/schedule")}><FiCalendar /> Schedule</button>
          <button onClick={() => navigate("/chat")}><FiMessageCircle /> Chat Room</button>
          <button onClick={() => navigate("/translator")}><FiZap /> Translator</button>
          <button onClick={() => navigate("/history")}><FiFileText /> History</button>
          <button onClick={toggleTheme}>{darkMode ? <FiSun /> : <FiMoon />} Theme</button>
          <button onClick={() => navigate("/settings")}>⚙️ Settings</button>
        </nav>

        <div className="vd-side-profile">
          <div className="vd-side-avatar">
            {user.image ? <img src={user.image} alt="profile" /> : user.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <strong>{user.name || "User"}</strong>
            <span>Online</span>
          </div>
        </div>

        <button className="vd-logout" onClick={logout}>
          <FiLogOut /> Logout
        </button>
      </aside>

      <main className="vd-main">
        <header className="vd-header">
          <div>
            <p>{today}</p>
            <h1>Welcome back, {user.name || "User"}</h1>
          </div>

          <div className="vd-search">
            <FiSearch />
            <input placeholder="Search meetings, chats..." />
          </div>

          <button className="vd-theme" onClick={toggleTheme}>
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
        </header>

        <section className="vd-hero">
          <div className="vd-hero-text">
            <span>Live collaboration platform</span>
            <h2>Run meetings, chats and translations from one professional workspace.</h2>
            <p>
              Vartalap helps you create secure meetings, collaborate with users and manage your workflow smoothly.
            </p>

            <div className="vd-hero-actions">
              <button onClick={createMeeting}><FiVideo /> Start Meeting</button>
              <button onClick={joinMeeting}><FiPlus /> Join by ID</button>
            </div>
          </div>

          <div className="vd-profile-card">
            <div className="vd-profile-img">
              {user.image ? <img src={user.image} alt="profile" /> : user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <h3>{user.name || "Vartalap User"}</h3>
            <p>{user.email || "user@vartalap.com"}</p>

            <label className="vd-upload">
              <FiUploadCloud /> Upload Photo
              <input type="file" accept="image/*" onChange={handleProfileUpload} />
            </label>
          </div>
        </section>

        <section className="vd-stats">
          {stats.map((stat, index) => (
            <div className="vd-stat-card" key={stat.label} style={{ animationDelay: `${index * 0.06}s` }}>
              <div className="vd-stat-icon">{stat.icon}</div>
              <div>
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="vd-section-title">
          <h2>Quick Actions</h2>
          <p>Access your main tools quickly.</p>
        </section>

        <section className="vd-actions">
          {actions.map((action, index) => (
            <button
              key={action.title}
              className="vd-action-card"
              onClick={action.click}
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <div className="vd-action-icon">{action.icon}</div>
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