import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReportViewer from '../components/ReportViewer';
import { caseAPI, reportAPI } from '../api/axiosConfig';
import './DoctorCaseDetail.css';

const DoctorCaseDetail = () => {
  const { id: caseId } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [report, setReport] = useState(null);
  const [notes, setNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCaseDetails();
  }, [caseId]);

  const fetchCaseDetails = async () => {
    try {
      setLoading(true);
      const caseResponse = await caseAPI.getCaseById(caseId);
      setCaseData(caseResponse.data);

      // Try to fetch existing report
      try {
        const reportResponse = await reportAPI.getReportByCase(caseId);
        setReport(reportResponse.data);
        setNotes(reportResponse.data.notes);
        setDiagnosis(reportResponse.data.finalDiagnosis);
      } catch (err) {
        // No report yet, that's fine
      }

      setError('');
    } catch (err) {
      setError('Failed to load case details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReport = async () => {
    if (!diagnosis.trim()) {
      setError('Final diagnosis is required');
      return;
    }

    try {
      setSubmitting(true);
      await reportAPI.createReport({
        caseId,
        notes,
        finalDiagnosis: diagnosis,
      });

      fetchCaseDetails();
      setError('');
      alert('Report published successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create report');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading case details...</div>;
  }

  if (!caseData) {
    return <div className="error-message">Case not found</div>;
  }

  return (
    <div className="doctor-case-detail">
      <button onClick={() => navigate('/doctor/dashboard')} className="back-button">
        ← Back to Dashboard
      </button>

      <div className="case-header">
        <h1>Case #{caseData._id.slice(-6).toUpperCase()}</h1>
        <p>Patient: {caseData.patientId?.name || 'N/A'}</p>
        <p style={{ fontSize: '12px', color: '#999' }}>Created on {new Date(caseData.createdAt).toLocaleDateString()}</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="doctor-case-layout">
        <div className="case-analysis-section">
          <h2>Medical Image & AI Results</h2>

          <div className="image-container">
            <img src={caseData.imageUrl} alt="Medical scan" className="medical-image" />
          </div>

          {caseData.aiOutput && (
            <div className="ai-summary">
              <h3>AI Analysis Summary</h3>

              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Confidence</span>
                  <span className="summary-value">{(caseData.aiOutput.confidenceScore * 100).toFixed(1)}%</span>
                </div>
              </div>

              <div className="diseases-list">
                <h4>Disease Detection</h4>
                {Object.entries(caseData.aiOutput.disease || {}).map(([disease, result]) => (
                  <div key={disease} className="disease-item">
                    <span className="disease-name">{disease.charAt(0).toUpperCase() + disease.slice(1)}:</span>
                    <span className="disease-result">{result}</span>
                  </div>
                ))}
              </div>

              {caseData.aiOutput.explainability && (
                <div className="explanation">
                  <h4>AI Interpretation</h4>
                  <p>{caseData.aiOutput.explainability}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="report-form-section">
          {!report ? (
            <div className="report-form">
              <h2>Create Medical Report</h2>

              <div className="form-group">
                <label htmlFor="notes">Medical Notes</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your clinical observations and findings..."
                  className="notes-input"
                  rows="8"
                />
              </div>

              <div className="form-group">
                <label htmlFor="diagnosis">Final Diagnosis *</label>
                <textarea
                  id="diagnosis"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Provide your final clinical diagnosis..."
                  className="diagnosis-input"
                  rows="6"
                  required
                />
              </div>

              <button
                onClick={handleSubmitReport}
                disabled={submitting || !diagnosis.trim()}
                className="submit-button"
              >
                {submitting ? 'Publishing Report...' : 'Publish Report'}
              </button>
            </div>
          ) : (
            <div className="existing-report">
              <h2>Report Published</h2>
              <div className="report-preview">
                <ReportViewer
                  report={report}
                  caseData={caseData}
                  onDownload={() => {
                    const content = JSON.stringify(report, null, 2);
                    const element = document.createElement('a');
                    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
                    element.setAttribute('download', `report-${caseId}.json`);
                    element.style.display = 'none';
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorCaseDetail;
