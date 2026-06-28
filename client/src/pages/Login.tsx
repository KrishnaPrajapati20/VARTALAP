import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  FiArrowRight,
  FiLock,
  FiMail,
  FiMessageCircle,
  FiShield,
  FiVideo,
  FiZap,
} from "react-icons/fi";
import "./Login.css";

const API_URL = "https://vartalap-backend-hz3z.onrender.com";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Login Failed");
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
          <span>Professional collaboration platform</span>
          <h1>Welcome back to your communication workspace.</h1>
          <p>
            Continue your meetings, real-time chats, translations and team
            collaboration from one secure dashboard.
          </p>
        </div>

        <div className="auth-feature-grid">
          <div>
            <FiVideo />
            <strong>Live Meetings</strong>
            <small>Powered by LiveKit</small>
          </div>

          <div>
            <FiMessageCircle />
            <strong>Real-time Chat</strong>
            <small>Instant conversations</small>
          </div>

          <div>
            <FiShield />
            <strong>Secure Login</strong>
            <small>JWT authentication</small>
          </div>

          <div>
            <FiZap />
            <strong>Fast Workflow</strong>
            <small>Simple and smooth</small>
          </div>
        </div>
      </section>

      <section className="auth-right">
        <form className="auth-card" onSubmit={handleLogin}>
          <div className="auth-card-icon">
            <FiLock />
          </div>

          <p className="auth-label">Account Login</p>
          <h2>Sign in to Vartalap</h2>
          <p className="auth-subtitle">
            Enter your credentials to access your dashboard.
          </p>

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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button className="auth-submit" type="submit">
            Login <FiArrowRight />
          </button>

          <p className="auth-switch">
            New to Vartalap? <Link to="/register">Create account</Link>
          </p>
        </form>
      </section>
    </div>
  );
}

export default Login;