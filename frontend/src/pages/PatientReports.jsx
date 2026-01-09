import React, { useState, useEffect } from 'react';
import { reportAPI } from '../api/axiosConfig';
import ReportViewer from '../components/ReportViewer';
import './Reports.css';

const PatientReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await reportAPI.getPatientReports();
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
        <h1>My Medical Reports</h1>
        <p>View all finalized medical reports from your doctors</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="reports-layout">
        <div className="reports-list-section">
          <h2>Reports ({reports.length})</h2>

          {loading ? (
            <div className="loading">Loading reports...</div>
          ) : reports.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📄</div>
              <h3>No reports yet</h3>
              <p>Your finalized reports will appear here</p>
            </div>
          ) : (
            <div className="reports-list">
              {reports.map((report) => (
                <div
                  key={report._id}
                  className={`report-item ${selectedReport?._id === report._id ? 'active' : ''}`}
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="report-item-header">
                    <span className="report-case-id">Case #{report.caseId._id.slice(-6).toUpperCase()}</span>
                    <span className="report-date">{new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="report-doctor">Dr. {report.doctorId.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="report-detail-section">
          {selectedReport ? (
            <ReportViewer
              report={selectedReport}
              caseData={selectedReport.caseId}
              onDownload={() => {
                const content = JSON.stringify(selectedReport, null, 2);
                const element = document.createElement('a');
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
                element.setAttribute('download', `report-${selectedReport._id}.json`);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }}
            />
          ) : (
            <div className="no-selection">
              <div className="selection-icon">←</div>
              <p>Select a report to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientReports;
