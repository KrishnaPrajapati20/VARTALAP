import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiEdit3,
  FiFileText,
  FiGlobe,
  FiLogOut,
  FiMail,
  FiMessageCircle,
  FiSettings,
  FiShield,
  FiStar,
  FiTrendingUp,
  FiUploadCloud,
  FiVideo,
} from "react-icons/fi";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const joinedDate = useMemo(() => {
    return new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="profile-page">
      <div className="profile-glow one"></div>
      <div className="profile-glow two"></div>

      <header className="profile-header">
        <button onClick={() => navigate("/dashboard")}>
          <FiArrowLeft /> Dashboard
        </button>

        <div>
          <p>User Workspace</p>
          <h1>Profile</h1>
        </div>
      </header>

      <section className="profile-hero">
        <div className="cover-pattern"></div>

        <div className="profile-avatar">
          {user.image ? (
            <img src={user.image} alt="profile" />
          ) : (
            user.name?.charAt(0)?.toUpperCase() || "U"
          )}
        </div>

        <div className="profile-info">
          <span className="verified"><FiShield /> Verified User</span>
          <h2>{user.name || "Vartalap User"}</h2>
          <p><FiMail /> {user.email || "user@vartalap.com"}</p>
          <p><FiCalendar /> Joined {joinedDate}</p>
        </div>

        <div className="profile-actions">
          <button onClick={() => navigate("/settings")}><FiSettings /> Settings</button>
          <button><FiEdit3 /> Edit Profile</button>
        </div>
      </section>

      <section className="profile-stats">
        <div><FiVideo /><h3>12</h3><p>Meetings</p></div>
        <div><FiMessageCircle /><h3>48</h3><p>Messages</p></div>
        <div><FiGlobe /><h3>9</h3><p>Translations</p></div>
        <div><FiFileText /><h3>5</h3><p>Files</p></div>
      </section>

      <main className="profile-grid">
        <section className="profile-card">
          <h3>About</h3>
          <p>
            {user.name || "User"} is using Vartalap to manage meetings, chat,
            translations and collaboration tools from one secure workspace.
          </p>

          <div className="info-row">
            <span>Name</span>
            <strong>{user.name || "Vartalap User"}</strong>
          </div>

          <div className="info-row">
            <span>Email</span>
            <strong>{user.email || "user@vartalap.com"}</strong>
          </div>

          <div className="info-row">
            <span>Status</span>
            <strong className="online">Online</strong>
          </div>
        </section>

        <section className="profile-card">
          <h3>Achievements</h3>

          <div className="badge-list">
            <div><FiStar /> Early User</div>
            <div><FiVideo /> Meeting Ready</div>
            <div><FiShield /> Secure Account</div>
            <div><FiTrendingUp /> Active Member</div>
          </div>
        </section>

        <section className="profile-card wide">
          <h3>Recent Activity</h3>

          <div className="timeline">
            <div><span></span><p>Profile page opened successfully</p></div>
            <div><span></span><p>LiveKit meeting system enabled</p></div>
            <div><span></span><p>Cloudinary profile upload connected</p></div>
            <div><span></span><p>Dashboard upgraded to premium layout</p></div>
          </div>
        </section>

        <section className="profile-card quick">
          <h3>Quick Actions</h3>

          <button onClick={() => navigate("/history")}><FiFileText /> Meeting History</button>
          <button onClick={() => navigate("/chat")}><FiMessageCircle /> Open Chat</button>
          <button onClick={() => navigate("/translator")}><FiGlobe /> Translator</button>
          <button onClick={logout} className="danger"><FiLogOut /> Logout</button>
        </section>
      </main>
    </div>
  );
}

export default Profile;