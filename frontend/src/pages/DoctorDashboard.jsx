import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CaseCard from '../components/CaseCard';
import { caseAPI } from '../api/axiosConfig';
import './Dashboard.css';

const DoctorDashboard = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await caseAPI.getDoctorCases();
      setCases(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load cases');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pendingCases = cases.filter((c) => c.status === 'doctor_review');
  const completedCases = cases.filter((c) => c.status === 'published');

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Doctor Dashboard</h1>
        <p>Review patient cases and provide medical reports</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="doctor-stats">
        <div className="stat-card">
          <div className="stat-number">{pendingCases.length}</div>
          <div className="stat-label">Pending Review</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{completedCases.length}</div>
          <div className="stat-label">Completed Reports</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{cases.length}</div>
          <div className="stat-label">Total Cases</div>
        </div>
      </div>

      <div className="cases-section">
        <div className="cases-header">
          <h2>Cases Requiring Review ({pendingCases.length})</h2>
        </div>

        {loading ? (
          <div className="loading">Loading cases...</div>
        ) : pendingCases.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✓</div>
            <h3>All caught up</h3>
            <p>No pending cases at the moment</p>
          </div>
        ) : (
          <div className="cases-grid">
            {pendingCases.map((caseData) => (
              <CaseCard
                key={caseData._id}
                caseData={caseData}
                isDoctor={true}
                onViewDetails={() => navigate(`/doctor/case/${caseData._id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {completedCases.length > 0 && (
        <div className="cases-section">
          <div className="cases-header">
            <h2>Completed Reports ({completedCases.length})</h2>
          </div>

          <div className="cases-grid">
            {completedCases.map((caseData) => (
              <CaseCard
                key={caseData._id}
                caseData={caseData}
                isDoctor={true}
                onViewDetails={() => navigate(`/doctor/case/${caseData._id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
