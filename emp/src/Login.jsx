import { useState } from "react";
import krgLogo from "./assets/krg_logo.webp";
import "./Login.css";

function Login({ onLogin }) {
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Login failed.");
        return;
      }
      onLogin(data.token);
    } catch (err) {
      setError("Could not connect to server.");
    }
  }

  return (
    <div className="login-page">
      <div className="login-logo">
        <img src={krgLogo} alt="KRG Logo" />
      </div>
      <h1 className="login-title">Employee Management System</h1>
      <p className="login-subtitle">Kurdistan Regional Government</p>
      <p className="login-tag">Department of Technology and Innovation</p>

      <div className="login-card">
        {!showRegister ? (
          <>
            <h2>Welcome back</h2>
            <p className="subtitle">Sign in to your account</p>
            <form onSubmit={handleSubmit}>
              <label className="login-label">Email Address</label>
              <input
                type="email"
                className="login-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label className="login-label">Password</label>
              <input
                type="password"
                className="login-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className="login-error">{error}</p>}
              <button type="submit" className="login-btn">
                Sign In
              </button>
            </form>
            <p className="login-switch">
              Don't have an account?{" "}
              <a onClick={() => setShowRegister(true)}>Register</a>
            </p>
          </>
        ) : (
          <RegisterForm onBack={() => setShowRegister(false)} />
        )}
      </div>
    </div>
  );
}

function RegisterForm({ onBack }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleNameChange(e) {
    // Strip anything that isn't a letter/space/hyphen/apostrophe so numbers
    // and symbols can't be typed into the name field.
    setName(e.target.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ' -]/g, ""));
  }

  async function handleRegister(e) {
    e.preventDefault();
    setMessage("");
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || "Registration failed.");
        return;
      }
      setMessage("Registered! You can log in now.");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setMessage("Could not connect to server.");
    }
  }

  return (
    <>
      <h2>Create account</h2>
      <p className="subtitle">Register a new account</p>
      <form onSubmit={handleRegister}>
        <label className="login-label">Full Name</label>
        <input
          type="text"
          className="login-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label className="login-label">Email Address</label>
        <input
          type="email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="login-label">Password</label>
        <input
          type="password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="login-btn">
          Register
        </button>
      </form>
      {message && <p className="register-message">{message}</p>}
      <p className="login-switch">
        <a onClick={onBack}>Back to login</a>
      </p>
    </>
  );
}

export default Login;
