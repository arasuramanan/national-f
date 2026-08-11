import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_URL}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">

          {/* Logo */}
          <a
            href="https://www.nationalfitting.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://www.nationalfitting.com/wp-content/uploads/2016/11/logo.png"
              alt="National Fittings"
            />
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse"
            id="navbarNavAltMarkup"
          >
            <div className="navbar-nav">

              {/* UPSI */}
              <Link className="nav-link" to="/list">
                UPSI
              </Link>

              {/* Audit Trail - Opens in new tab */}
              <a
                className="nav-link"
                href="/audit-trail"
                target="_blank"
                rel="noopener noreferrer"
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
    </div>
  );
};

export default Header;