import React from 'react';
import './CaseCard.css';

const CaseCard = ({ caseData, onViewDetails, isDoctor = false }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'uploaded':
        return '#ff9800';
      case 'processed':
        return '#2196f3';
      case 'doctor_review':
        return '#9c27b0';
      case 'published':
        return '#4caf50';
      default:
        return '#666';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'uploaded':
        return 'Uploaded';
      case 'processed':
        return 'AI Processed';
      case 'doctor_review':
        return 'Doctor Review';
      case 'published':
        return 'Published';
      default:
        return status;
    }
  };

  return (
    <div className="case-card">
      <div className="case-card-header">
        <h3>Case #{caseData._id.slice(-6).toUpperCase()}</h3>
        <div className="case-status" style={{ backgroundColor: getStatusColor(caseData.status) }}>
          {getStatusLabel(caseData.status)}
        </div>
      </div>

      <div className="case-card-content">
        <div className="case-info-row">
          <span className="label">Created:</span>
          <span className="value">{new Date(caseData.createdAt).toLocaleDateString()}</span>
        </div>

        {caseData.aiOutput && (
          <div className="case-info-row">
            <span className="label">Confidence:</span>
            <span className="value">{(caseData.aiOutput.confidenceScore * 100).toFixed(1)}%</span>
          </div>
        )}

        {isDoctor && caseData.patientId && (
          <div className="case-info-row">
            <span className="label">Patient:</span>
            <span className="value">{caseData.patientId.name}</span>
          </div>
        )}
      </div>

      <button onClick={onViewDetails} className="case-card-button">
        View Details →
      </button>
    </div>
  );
};

export default CaseCard;
