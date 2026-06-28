import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://vartalap-backend-hz3z.onrender.com/api/auth/register",
        {
          name,
          email,
          password,
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Registration Successful!");
      navigate("/dashboard");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="register-page">
      <div className="bird bird-one">🕊️</div>
      <div className="bird bird-two">🕊️</div>
      <div className="bird bird-three">🕊️</div>

      <div className="petal petal-one">✦</div>
      <div className="petal petal-two">✦</div>
      <div className="petal petal-three">✦</div>

      <section className="register-left">
        <div className="brand-box">
          <div className="brand-bubble">💬</div>
          <h1>VARTALAP</h1>
          <p>Connect. Chat. Collaborate.</p>
          <span></span>
        </div>

        <div className="welcome-card">
          <div className="heart">💜</div>
          <h2>
            Welcome to <b>Vartalap</b>
          </h2>
          <p>
            A peaceful space to connect, share ideas, and build meaningful
            conversations.
          </p>
          <div className="mini-users">👨‍💻 👩‍💻 👩‍🎓</div>
          <small>Let's start your journey together ✨</small>
        </div>
      </section>

      <section className="register-right">
        <form className="register-card" onSubmit={handleRegister}>
          <div className="register-icon">👤＋</div>

          <h2>
            Create <span>Your</span> Account
          </h2>
          <p className="register-subtitle">
            Join <b>Vartalap</b> and start connecting.
          </p>

          <div className="input-group">
            <span>👤</span>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <span>✉️</span>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <span>🔒</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="register-btn" type="submit">
            Register Now →
          </button>

          <p className="login-link">
            Already have an account?{" "}
            <button type="button" onClick={() => navigate("/login")}>
              Login
            </button>
          </p>
        </form>
      </section>
    </div>
  );
}

export default Register;