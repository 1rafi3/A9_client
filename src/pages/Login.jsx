import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import toast from "react-hot-toast";
import { Dumbbell } from "lucide-react";

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);
      toast.success("Successfully logged in!");
      navigate(fromPath, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle(`${window.location.origin}/my-bookings`);
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(error.message || "Google login failed");
    }
  };

  return (
    <div className="login-page container">
      <div className="form-card">
        <div className="form-header">
          <Link to="/" className="navbar-logo" style={{ justifyContent: "center", marginBottom: "16px" }}>
            <Dumbbell className="logo-icon" />
            <span className="logo-text">SportNest</span>
          </Link>
          <h2>Welcome Back</h2>
          <p>Login to book courts and manage your bookings.</p>
        </div>

        <form onSubmit={handleSubmit} className="custom-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-input-control"
              placeholder="e.g. anik@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-input-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary form-submit-btn"
            disabled={submitting}
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="form-divider">OR</div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="btn btn-google"
          aria-label="Login with Google"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: "10px" }}>
            <path
              fill="#EA4335"
              d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.37 14.97.75 12 .75 7.4.75 3.44 3.39 1.51 7.23l3.83 2.97C6.26 6.86 8.92 5.04 12 5.04z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.51h6.47c-.28 1.48-1.12 2.73-2.38 3.58l3.69 2.87c2.16-1.99 3.41-4.91 3.41-8.61z"
            />
            <path
              fill="#FBBC05"
              d="M5.34 14.76c-.24-.72-.38-1.49-.38-2.29c0-.79.14-1.57.38-2.29L1.51 7.21C.55 9.15 0 11.31 0 12.47c0 1.16.55 3.32 1.51 5.26l3.83-2.97z"
            />
            <path
              fill="#34A853"
              d="M12 23.25c3.24 0 5.97-1.07 7.96-2.92l-3.69-2.87c-1.02.68-2.33 1.09-4.27 1.09c-3.08 0-5.74-1.82-6.66-5.16L1.51 16.36c1.93 3.84 5.89 6.89 10.49 6.89z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <p className="form-footer-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
