import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader';
import CaseCard from '../components/CaseCard';
import { caseAPI } from '../api/axiosConfig';
import './Dashboard.css';

const PatientDashboard = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await caseAPI.getPatientCases();
      setCases(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load cases');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (formData) => {
    try {
      setUploadLoading(true);
      const response = await caseAPI.uploadCase(formData);
      
      // Automatically process the case
      await caseAPI.processCase(response.data.case._id);
      
      // Refresh cases
      fetchCases();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
      console.error(err);
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My Medical Cases</h1>
        <p>Upload, manage, and track your medical screening cases</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-layout">
        <div className="upload-section">
          <ImageUploader onUpload={handleUpload} loading={uploadLoading} />
        </div>

        <div className="cases-section">
          <div className="cases-header">
            <h2>My Cases ({cases.length})</h2>
          </div>

          {loading ? (
            <div className="loading">Loading your cases...</div>
          ) : cases.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">◻</div>
              <h3>No cases yet</h3>
              <p>Upload your first medical image to get started</p>
            </div>
          ) : (
            <div className="cases-grid">
              {cases.map((caseData) => (
                <CaseCard
                  key={caseData._id}
                  caseData={caseData}
                  onViewDetails={() => navigate(`/patient/case/${caseData._id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
