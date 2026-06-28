import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("https://vartalap-backend-hz3z.onrender.com", {
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
    <div className="login-page">
      <div className="circle circle-one"></div>
      <div className="circle circle-two"></div>
      <div className="circle circle-three"></div>

      <div className="login-card">
        <div className="logo-box">V</div>

        <h1>Welcome Back</h1>
        <p className="tagline">Login to continue your Vartalap journey</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="login-btn" type="submit">
            Login
          </button>
        </form>

        <p className="switch-text">
          New to Vartalap? <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;