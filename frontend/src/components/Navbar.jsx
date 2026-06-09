import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-eco sticky-top py-3">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/" onClick={closeMenu}>
          <i className="bi bi-leaf-fill text-success fs-3"></i>
          <span className="brand-font fs-4 tracking-tight">EcoTrack</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-center">
            <li className="nav-item">
              <NavLink className="nav-link nav-link-eco" to="/" onClick={closeMenu}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-link-eco" to="/about" onClick={closeMenu}>
                About
              </NavLink>
            </li>
            {token && (
              <>
                {/* User-specific links (hidden for Admins) */}
                {user && user.role !== 'admin' && (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link nav-link-eco" to="/dashboard" onClick={closeMenu}>
                        Dashboard
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link nav-link-eco" to="/calculator" onClick={closeMenu}>
                        Calculator
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link nav-link-eco" to="/goals" onClick={closeMenu}>
                        Goals
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link nav-link-eco" to="/rewards" onClick={closeMenu}>
                        Rewards
                      </NavLink>
                    </li>
                  </>
                )}
                {/* Education and Admin links */}
                <li className="nav-item">
                  <NavLink className="nav-link nav-link-eco" to="/education" onClick={closeMenu}>
                    Education
                  </NavLink>
                </li>
                {user && user.role === 'admin' && (
                  <li className="nav-item">
                    <NavLink className="nav-link nav-link-eco bg-danger bg-opacity-25 border border-danger border-opacity-20 text-danger rounded px-2" to="/admin" onClick={closeMenu}>
                      Admin Panel
                    </NavLink>
                  </li>
                )}
              </>
            )}
          </ul>
          <div className="d-flex align-items-center gap-3">
            {token ? (
              <>
                <Link to="/profile" className="text-decoration-none d-flex align-items-center gap-2 text-white" onClick={closeMenu}>
                  <i className="bi bi-person-circle fs-4 text-light"></i>
                  <span className="d-none d-md-inline">{user?.name || 'Profile'}</span>
                </Link>
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light btn-sm px-3" onClick={closeMenu}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-eco btn-sm px-3 bg-white text-success hover-shadow" onClick={closeMenu}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
const hoverStyle = `
.hover-shadow:hover {
  background-color: var(--primary-light) !important;
  color: white !important;
  box-shadow: 0 4px 15px rgba(82, 183, 136, 0.4);
}
`;
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(hoverStyle));
  document.head.appendChild(style);
}
