import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import SafeImage from "./SafeImage";
import { Dumbbell, Menu, X, User, LogOut, Calendar, PlusCircle, Settings, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
      setIsOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const activeClassName = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setIsOpen(false)}>
          <Dumbbell className="logo-icon" />
          <span className="logo-text">SportNest</span>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-menu desktop-menu">
          <NavLink to="/" className={activeClassName}>
            Home
          </NavLink>
          <NavLink to="/facilities" className={activeClassName}>
            All Facilities
          </NavLink>

          {user && (
            <>
              <NavLink to="/my-bookings" className={activeClassName}>
                My Bookings
              </NavLink>
              <NavLink to="/add-facility" className={activeClassName}>
                Add Facility
              </NavLink>
              <NavLink to="/manage-my-facilities" className={activeClassName}>
                Manage My Facilities
              </NavLink>
            </>
          )}
        </div>

        {/* User Auth Section */}
        <div className="auth-section">
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label="Toggle light/dark theme"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          {user ? (
            <div className="profile-container">
              <button
                className="profile-btn"
                onClick={() => setShowDropdown(!showDropdown)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                aria-label="User profile menu"
              >
                {user.image ? (
                  <SafeImage src={user.image} alt={user.name} className="profile-img" />
                ) : (
                  <div className="profile-placeholder">
                    <User size={18} />
                  </div>
                )}
                <span className="profile-name">{user.name.split(" ")[0]}</span>
              </button>

              {showDropdown && (
                <div className="profile-dropdown">
                  <div className="dropdown-info">
                    <p className="user-name">{user.name}</p>
                    <p className="user-email">{user.email}</p>
                  </div>
                  <hr className="dropdown-divider" />
                  <Link to="/my-bookings" className="dropdown-item">
                    <Calendar size={16} />
                    <span>My Bookings</span>
                  </Link>
                  <Link to="/add-facility" className="dropdown-item">
                    <PlusCircle size={16} />
                    <span>Add Facility</span>
                  </Link>
                  <Link to="/manage-my-facilities" className="dropdown-item">
                    <Settings size={16} />
                    <span>Manage Facilities</span>
                  </Link>
                  <hr className="dropdown-divider" />
                  <button onClick={handleLogout} className="dropdown-item logout-item">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary login-btn">
              Login
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-links">
            <NavLink
              to="/"
              className={activeClassName}
              onClick={() => setIsOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/facilities"
              className={activeClassName}
              onClick={() => setIsOpen(false)}
            >
              All Facilities
            </NavLink>

            {user && (
              <>
                <NavLink
                  to="/my-bookings"
                  className={activeClassName}
                  onClick={() => setIsOpen(false)}
                >
                  My Bookings
                </NavLink>
                <NavLink
                  to="/add-facility"
                  className={activeClassName}
                  onClick={() => setIsOpen(false)}
                >
                  Add Facility
                </NavLink>
                <NavLink
                  to="/manage-my-facilities"
                  className={activeClassName}
                  onClick={() => setIsOpen(false)}
                >
                  Manage My Facilities
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="nav-link mobile-logout-btn"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            )}
            {!user && (
              <Link
                to="/login"
                className="btn btn-primary mobile-login-btn"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
