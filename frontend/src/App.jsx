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
            color: '#1663a3',
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
  <div
    style={{
      minHeight: '100vh',
      width: '100%',
      backgroundImage: `url("https://media.istockphoto.com/id/1424369255/photo/man-with-a-healthy-heart.jpg?s=612x612&w=0&k=20&c=1rw3HVKnc9rNXbM9EUt8Cla9c9aVt4cFGw2qgupJzD4=")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'relative'
    }}
  >
    {/* Overlay for readability */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.55)',
        backdropFilter: 'blur(2px)'
      }}
    />

    <Navbar />

    {/* Content Wrapper so overlay doesn't block clicks */}
    <div style={{ position: 'relative', zIndex: 2, paddingBottom: '40px' }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  </div>
</AuthProvider>

    </Router>
  );
}

export default App;
