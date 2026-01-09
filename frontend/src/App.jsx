import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import RoleBasedRoute from './components/RoleBasedRoute';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Patient Pages
import PatientDashboard from './pages/PatientDashboard';
import PatientCaseDetail from './pages/PatientCaseDetail';
import PatientReports from './pages/PatientReports';

// Doctor Pages
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorCaseDetail from './pages/DoctorCaseDetail';
import DoctorReports from './pages/DoctorReports';

// Home page
const Home = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '48px', color: '#1e3a5f', marginBottom: '20px' }}>⚕ MediScreen</h1>
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '40px' }}>
        Early Medical Disease Screening Platform
      </p>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <a
          href="/register"
          style={{
            padding: '12px 30px',
            backgroundColor: '#2196f3',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#1565c0')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#2196f3')}
        >
          Get Started
        </a>
        <a
          href="/login"
          style={{
            padding: '12px 30px',
            border: '2px solid #2196f3',
            color: '#2196f3',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#2196f3';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#2196f3';
          }}
        >
          Sign In
        </a>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Patient Routes */}
          <Route
            path="/patient/dashboard"
            element={
              <RoleBasedRoute requiredRole="patient">
                <PatientDashboard />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/patient/case/:id"
            element={
              <RoleBasedRoute requiredRole="patient">
                <PatientCaseDetail />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/patient/reports"
            element={
              <RoleBasedRoute requiredRole="patient">
                <PatientReports />
              </RoleBasedRoute>
            }
          />

          {/* Doctor Routes */}
          <Route
            path="/doctor/dashboard"
            element={
              <RoleBasedRoute requiredRole="doctor">
                <DoctorDashboard />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/doctor/case/:id"
            element={
              <RoleBasedRoute requiredRole="doctor">
                <DoctorCaseDetail />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/doctor/reports"
            element={
              <RoleBasedRoute requiredRole="doctor">
                <DoctorReports />
              </RoleBasedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
