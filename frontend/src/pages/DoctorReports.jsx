import React, { useState, useEffect } from 'react';
import { reportAPI } from '../api/axiosConfig';
import './Reports.css';

const DoctorReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await reportAPI.getDoctorReports();
      setReports(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h1>My Reports</h1>
        <p>View all medical reports you have created</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="reports-grid-container">
        {loading ? (
          <div className="loading">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◻</div>
            <h3>No reports yet</h3>
            <p>Reports will appear here as you complete cases</p>
          </div>
        ) : (
          <div className="reports-grid">
            {reports.map((report) => (
              <div key={report._id} className="report-card">
                <div className="report-card-header">
                  <h3>Case #{report.caseId._id.slice(-6).toUpperCase()}</h3>
                  <span className="report-date">{new Date(report.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="report-card-content">
                  <div className="info-row">
                    <span className="label">Diagnosis:</span>
                    <span className="value">{report.finalDiagnosis.substring(0, 50)}...</span>
                  </div>

                  <div className="info-row">
                    <span className="label">Notes:</span>
                    <span className="value">{report.notes ? 'Yes' : 'No notes added'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorReports;
