import { useMemo, useState } from "react";
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
  FiVideo,
} from "react-icons/fi";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState(user.name || "");
  const [editEmail, setEditEmail] = useState(user.email || "");
  const [editBio, setEditBio] = useState(
    user.bio ||
      "Using Vartalap to manage meetings, chat, translations and collaboration tools."
  );
  const [editLanguage, setEditLanguage] = useState(
    user.language || "English"
  );

  const joinedDate = useMemo(() => {
    return new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, []);

  const saveProfile = () => {
    const updatedUser = {
      ...user,
      name: editName,
      email: editEmail,
      bio: editBio,
      language: editLanguage,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setIsEditOpen(false);
    window.location.reload();
  };

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
          <span className="verified">
            <FiShield /> Verified User
          </span>
          <h2>{user.name || "Vartalap User"}</h2>
          <p>
            <FiMail /> {user.email || "user@vartalap.com"}
          </p>
          <p>
            <FiCalendar /> Joined {joinedDate}
          </p>
        </div>

        <div className="profile-actions">
          <button onClick={() => navigate("/settings")}>
            <FiSettings /> Settings
          </button>
          <button onClick={() => setIsEditOpen(true)}>
            <FiEdit3 /> Edit Profile
          </button>
        </div>
      </section>

      <section className="profile-stats">
        <div>
          <FiVideo />
          <h3>12</h3>
          <p>Meetings</p>
        </div>
        <div>
          <FiMessageCircle />
          <h3>48</h3>
          <p>Messages</p>
        </div>
        <div>
          <FiGlobe />
          <h3>9</h3>
          <p>Translations</p>
        </div>
        <div>
          <FiFileText />
          <h3>5</h3>
          <p>Files</p>
        </div>
      </section>

      <main className="profile-grid">
        <section className="profile-card">
          <h3>About</h3>
          <p>
            {user.bio ||
              `${user.name || "User"} is using Vartalap to manage meetings, chat, translations and collaboration tools from one secure workspace.`}
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
            <span>Language</span>
            <strong>{user.language || "English"}</strong>
          </div>

          <div className="info-row">
            <span>Status</span>
            <strong className="online">Online</strong>
          </div>
        </section>

        <section className="profile-card">
          <h3>Achievements</h3>

          <div className="badge-list">
            <div>
              <FiStar /> Early User
            </div>
            <div>
              <FiVideo /> Meeting Ready
            </div>
            <div>
              <FiShield /> Secure Account
            </div>
            <div>
              <FiTrendingUp /> Active Member
            </div>
          </div>
        </section>

        <section className="profile-card wide">
          <h3>Recent Activity</h3>

          <div className="timeline">
            <div>
              <span></span>
              <p>Profile page opened successfully</p>
            </div>
            <div>
              <span></span>
              <p>LiveKit meeting system enabled</p>
            </div>
            <div>
              <span></span>
              <p>Cloudinary profile upload connected</p>
            </div>
            <div>
              <span></span>
              <p>Dashboard upgraded to premium layout</p>
            </div>
          </div>
        </section>

        <section className="profile-card quick">
          <h3>Quick Actions</h3>

          <button onClick={() => navigate("/history")}>
            <FiFileText /> Meeting History
          </button>
          <button onClick={() => navigate("/chat")}>
            <FiMessageCircle /> Open Chat
          </button>
          <button onClick={() => navigate("/translator")}>
            <FiGlobe /> Translator
          </button>
          <button onClick={logout} className="danger">
            <FiLogOut /> Logout
          </button>
        </section>
      </main>

      {isEditOpen && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <h2>Edit Profile</h2>
            <p>Update your basic Vartalap profile details.</p>

            <label>Full Name</label>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Enter your name"
            />

            <label>Email</label>
            <input
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              placeholder="Enter your email"
            />

            <label>Bio</label>
            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              placeholder="Write something about yourself"
              rows={4}
            />

            <label>Preferred Language</label>
            <select
              value={editLanguage}
              onChange={(e) => setEditLanguage(e.target.value)}
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Hinglish</option>
              <option>Bengali</option>
              <option>Marathi</option>
            </select>

            <div className="edit-modal-actions">
              <button onClick={() => setIsEditOpen(false)}>Cancel</button>
              <button onClick={saveProfile}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;