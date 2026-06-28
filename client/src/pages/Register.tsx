import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  FiArrowRight,
  FiLock,
  FiMail,
  FiMessageCircle,
  FiShield,
  FiUserPlus,
  FiVideo,
  FiZap,
} from "react-icons/fi";
import "./Register.css";

const API_URL = "https://vartalap-backend-hz3z.onrender.com";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-glow auth-glow-one"></div>
      <div className="auth-glow auth-glow-two"></div>

      <section className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-icon">V</div>
          <div>
            <h2>Vartalap</h2>
            <p>Connect Better</p>
          </div>
        </div>

        <div className="auth-hero">
          <span>Start your collaboration journey</span>
          <h1>Create your Vartalap workspace account.</h1>
          <p>
            Join meetings, chat in real time, translate conversations and manage
            your communication from one professional dashboard.
          </p>
        </div>

        <div className="auth-feature-grid">
          <div><FiVideo /><strong>Video Meetings</strong><small>LiveKit powered</small></div>
          <div><FiMessageCircle /><strong>Team Chat</strong><small>Real-time messaging</small></div>
          <div><FiShield /><strong>Secure Access</strong><small>JWT authentication</small></div>
          <div><FiZap /><strong>Fast Tools</strong><small>Clean workflow</small></div>
        </div>
      </section>

      <section className="auth-right">
        <form className="auth-card" onSubmit={handleRegister}>
          <div className="auth-card-icon">
            <FiUserPlus />
          </div>

          <p className="auth-label">Create Account</p>
          <h2>Join Vartalap</h2>
          <p className="auth-subtitle">
            Fill in your details to create a secure account.
          </p>

          <div className="auth-input-group">
            <label>Full Name</label>
            <div className="auth-input">
              <FiUserPlus />
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label>Email Address</label>
            <div className="auth-input">
              <FiMail />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label>Password</label>
            <div className="auth-input">
              <FiLock />
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button className="auth-submit" type="submit">
            Create Account <FiArrowRight />
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </section>
    </div>
  );
}

export default Register;