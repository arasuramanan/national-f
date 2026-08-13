import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_URL}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      setIsMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="app-navbar">
      <div className="navbar-container">

        {/* Logo */}
        <a
          href="https://www.nationalfitting.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="navbar-logo"
        >
          <img
            src="https://www.nationalfitting.com/wp-content/uploads/2016/11/logo.png"
            alt="National Fittings"
          />
        </a>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className={`navbar-toggler ${
            isMenuOpen ? "active" : ""
          }`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation */}
        <div
          className={`navbar-menu ${
            isMenuOpen ? "open" : ""
          }`}
        >
          <div className="navbar-nav">

            {/* UPSI */}
            <Link
              className="nav-link"
              to="/list"
              onClick={closeMenu}
            >
              UPSI
            </Link>

            {/* Audit Trail */}
            <a
              className="nav-link"
              href="/audit-trail"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
            >
              Audit Trail
            </a>

            {/* Logout */}
            <button
              type="button"
              className="nav-link logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>
        </div>

      </div>
    </nav>
  );
};

export default Header;