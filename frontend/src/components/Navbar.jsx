import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">✦</span> MediScreen
        </Link>

        <div className="nav-menu">
          {user ? (
            <>
              {user.role === 'patient' && (
                <>
                  <Link to="/patient/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                  <Link to="/patient/reports" className="nav-link">
                    Reports
                  </Link>
                </>
              )}

              {user.role === 'doctor' && (
                <>
                  <Link to="/doctor/dashboard" className="nav-link">
                    Cases
                  </Link>
                  <Link to="/doctor/reports" className="nav-link">
                    My Reports
                  </Link>
                </>
              )}

              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-role">
                  {user.role === 'doctor' && user.doctorType 
                    ? user.doctorType 
                    : user.role}
                </span>
              </div>

              <button onClick={handleLogout} className="nav-link logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link signup-btn">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
