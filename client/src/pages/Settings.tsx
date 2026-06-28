import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiBell,
  FiCamera,
  FiLock,
  FiLogOut,
  FiMic,
  FiMonitor,
  FiMoon,
  FiSave,
  FiShield,
  FiSun,
  FiUser,
  FiVolume2,
} from "react-icons/fi";
import "./Settings.css";

function Settings() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") !== "light"
  );

  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    meetingReminder: true,
    camera: true,
    microphone: true,
    speaker: true,
    profileVisible: true,
    language: "English",
  });

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const saveSettings = () => {
    localStorage.setItem("vartalap_settings", JSON.stringify(settings));
    alert("Settings saved successfully!");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className={darkMode ? "settings-page" : "settings-page settings-light"}>
      <div className="settings-glow one"></div>
      <div className="settings-glow two"></div>

      <header className="settings-header">
        <button onClick={() => navigate("/dashboard")}>
          <FiArrowLeft /> Dashboard
        </button>

        <div>
          <p>Account Control Center</p>
          <h1>Settings</h1>
        </div>

        <button onClick={saveSettings} className="save-top">
          <FiSave /> Save
        </button>
      </header>

      <section className="settings-hero">
        <div>
          <span><FiShield /> Secure Workspace</span>
          <h2>Manage your account, privacy and meeting preferences.</h2>
          <p>
            Personalize Vartalap according to your workflow, device setup and communication needs.
          </p>
        </div>

        <div className="settings-user-card">
          <div className="settings-avatar">
            {user.image ? (
              <img src={user.image} alt="profile" />
            ) : (
              user.name?.charAt(0)?.toUpperCase() || "U"
            )}
          </div>
          <h3>{user.name || "Vartalap User"}</h3>
          <p>{user.email || "user@vartalap.com"}</p>
        </div>
      </section>

      <main className="settings-grid">
        <section className="settings-card">
          <div className="card-title">
            <FiUser />
            <div>
              <h3>Account</h3>
              <p>Basic account information</p>
            </div>
          </div>

          <div className="settings-info-row">
            <span>Name</span>
            <strong>{user.name || "Vartalap User"}</strong>
          </div>

          <div className="settings-info-row">
            <span>Email</span>
            <strong>{user.email || "user@vartalap.com"}</strong>
          </div>

          <button className="settings-action" onClick={() => navigate("/profile")}>
            Open Profile
          </button>
        </section>

        <section className="settings-card">
          <div className="card-title">
            {darkMode ? <FiMoon /> : <FiSun />}
            <div>
              <h3>Appearance</h3>
              <p>Customize dashboard theme</p>
            </div>
          </div>

          <div className="settings-toggle-row">
            <div>
              <strong>{darkMode ? "Dark Mode" : "Light Mode"}</strong>
              <span>Switch application theme</span>
            </div>

            <button
              className={darkMode ? "switch active" : "switch"}
              onClick={toggleTheme}
            >
              <span></span>
            </button>
          </div>

          <div className="settings-select-row">
            <label>Language</label>
            <select
              value={settings.language}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, language: e.target.value }))
              }
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Hinglish</option>
              <option>Bengali</option>
              <option>Marathi</option>
            </select>
          </div>
        </section>

        <section className="settings-card">
          <div className="card-title">
            <FiBell />
            <div>
              <h3>Notifications</h3>
              <p>Control alerts and reminders</p>
            </div>
          </div>

          <SettingToggle
            title="Push Notifications"
            text="Receive app notifications"
            value={settings.notifications}
            onClick={() => toggleSetting("notifications")}
          />

          <SettingToggle
            title="Email Updates"
            text="Receive updates on email"
            value={settings.emailUpdates}
            onClick={() => toggleSetting("emailUpdates")}
          />

          <SettingToggle
            title="Meeting Reminder"
            text="Get alerts before meetings"
            value={settings.meetingReminder}
            onClick={() => toggleSetting("meetingReminder")}
          />
        </section>

        <section className="settings-card">
          <div className="card-title">
            <FiMonitor />
            <div>
              <h3>Meeting Devices</h3>
              <p>Camera, microphone and speaker</p>
            </div>
          </div>

          <SettingToggle
            title="Camera Access"
            text="Allow camera in meetings"
            value={settings.camera}
            onClick={() => toggleSetting("camera")}
            icon={<FiCamera />}
          />

          <SettingToggle
            title="Microphone Access"
            text="Allow microphone in meetings"
            value={settings.microphone}
            onClick={() => toggleSetting("microphone")}
            icon={<FiMic />}
          />

          <SettingToggle
            title="Speaker Output"
            text="Enable speaker output"
            value={settings.speaker}
            onClick={() => toggleSetting("speaker")}
            icon={<FiVolume2 />}
          />
        </section>

        <section className="settings-card">
          <div className="card-title">
            <FiLock />
            <div>
              <h3>Privacy & Security</h3>
              <p>Manage visibility and security</p>
            </div>
          </div>

          <SettingToggle
            title="Profile Visibility"
            text="Allow others to see your profile"
            value={settings.profileVisible}
            onClick={() => toggleSetting("profileVisible")}
          />

          <button className="settings-action">
            Change Password
          </button>

          <button className="settings-action secondary">
            Download Account Data
          </button>
        </section>

        <section className="settings-card danger-card">
          <div className="card-title">
            <FiLogOut />
            <div>
              <h3>Session</h3>
              <p>Manage login session</p>
            </div>
          </div>

          <p>
            You are currently logged in as <b>{user.email || "user@vartalap.com"}</b>.
          </p>

          <button className="logout-btn" onClick={logout}>
            <FiLogOut /> Logout
          </button>
        </section>
      </main>
    </div>
  );
}

function SettingToggle({
  title,
  text,
  value,
  onClick,
  icon,
}: {
  title: string;
  text: string;
  value: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <div className="settings-toggle-row">
      <div className="toggle-info">
        {icon && <span className="toggle-icon">{icon}</span>}
        <div>
          <strong>{title}</strong>
          <span>{text}</span>
        </div>
      </div>

      <button className={value ? "switch active" : "switch"} onClick={onClick}>
        <span></span>
      </button>
    </div>
  );
}

export default Settings;
