import React from 'react';
import './ReportViewer.css';

const ReportViewer = ({ report, caseData, onDownload }) => {
  if (!report) {
    return <div className="report-viewer">No report available yet.</div>;
  }

  return (
    <div className="report-viewer">
      <div className="report-header">
        <h2>Medical Report</h2>
        <button onClick={onDownload} className="download-button">
          📥 Download Report
        </button>
      </div>

      <div className="report-section">
        <h3>Case Information</h3>
        <div className="report-info">
          <div className="info-item">
            <span className="info-label">Case ID:</span>
            <span className="info-value">
              {report.caseId?._id?.slice(-6).toUpperCase() || 
               (typeof report.caseId === 'string' ? report.caseId.slice(-6).toUpperCase() : 'N/A')}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Doctor:</span>
            <span className="info-value">
              {report.doctorId?.name || 'N/A'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Report Date:</span>
            <span className="info-value">{new Date(report.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {caseData?.aiOutput && (
        <div className="report-section">
          <h3>AI Analysis Results</h3>

          <div className="disease-findings">
            <h4>Disease Detection</h4>
            {Object.entries(caseData.aiOutput.disease || {}).map(([disease, result]) => (
              <div key={disease} className="finding-item">
                <span className="disease-name">{disease.charAt(0).toUpperCase() + disease.slice(1)}:</span>
                <span className="disease-result">{result}</span>
              </div>
            ))}
          </div>

          <div className="confidence-score">
            <h4>Overall Confidence</h4>
            <div className="confidence-bar">
              <div
                className="confidence-fill"
                style={{
                  width: `${caseData.aiOutput.confidenceScore * 100}%`,
                }}
              />
            </div>
            <span className="confidence-percent">{(caseData.aiOutput.confidenceScore * 100).toFixed(1)}%</span>
          </div>

          {caseData.aiOutput.explainability && (
            <div className="explainability">
              <h4>AI Explanation</h4>
              <p>{caseData.aiOutput.explainability}</p>
            </div>
          )}
        </div>
      )}

      <div className="report-section">
        <h3>Doctor's Assessment</h3>
        <div className="assessment-box">
          <h4>Notes</h4>
          <p className="report-text">{report.notes || 'No additional notes provided.'}</p>
        </div>

        <div className="assessment-box">
          <h4>Final Diagnosis</h4>
          <p className="report-text diagnosis">{report.finalDiagnosis || 'Pending finalization.'}</p>
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;
