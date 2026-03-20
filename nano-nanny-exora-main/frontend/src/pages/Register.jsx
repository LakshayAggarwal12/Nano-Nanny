import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [form,    setForm]    = useState({ name: "", email: "", password: "", confirm: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm)
      return setError("Passwords do not match");
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters");

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          <div className="logo-icon">🫀</div>
          <span className="logo-text">Medi<span>Track</span></span>
        </div>

        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">Start monitoring your post-surgery recovery</p>

        {error && <div className="auth-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Jane Doe"
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </div>

          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="auth-field">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirm"
              placeholder="Repeat password"
              value={form.confirm}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn-primary auth-btn" disabled={loading}>
            {loading ? (
              <><span className="loader-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Creating account…</>
            ) : (
              "✅ Create Account"
            )}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">Sign in →</Link>
        </p>

        <p className="auth-note">
          🔒 Your data is stored securely and never shared.
          Future integration with your doctor's patient records is planned.
        </p>
      </div>
    </div>
  );
};

export default Register;
