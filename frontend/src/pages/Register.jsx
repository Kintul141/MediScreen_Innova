import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authAPI } from '../api/axiosConfig';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    licenseId: '',
    doctorType: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.register(formData);
      login(response.data.user, response.data.token);
      navigate(formData.role === 'patient' ? '/patient/dashboard' : '/doctor/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join MediScreen for early disease detection</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">I am a</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          {formData.role === 'doctor' && (
            <>
              <div className="form-group">
                <label htmlFor="licenseId">Medical License ID</label>
                <input
                  type="text"
                  id="licenseId"
                  name="licenseId"
                  value={formData.licenseId}
                  onChange={handleChange}
                  placeholder="MED-12345678"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="doctorType">Specialization</label>
                <select 
                  id="doctorType" 
                  name="doctorType" 
                  value={formData.doctorType} 
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Specialty</option>
                  <option value="Bones Specialist">Bones Specialist (Orthopedics)</option>
                  <option value="Lung Specialist">Lung Specialist (Pulmonology)</option>
                  <option value="Heart Specialist">Heart Specialist (Cardiology)</option>
                  <option value="Brain Specialist">Brain Specialist (Neurology)</option>
                  <option value="Skin Specialist">Skin Specialist (Dermatology)</option>
                  <option value="General Physician">General Physician</option>
                </select>
              </div>
            </>
          )}

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <a href="/login">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
