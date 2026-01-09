import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReportViewer from '../components/ReportViewer';
import { caseAPI, reportAPI } from '../api/axiosConfig';
import './CaseDetail.css';

const PatientCaseDetail = () => {
  const { id: caseId } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [report, setReport] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCaseDetails();
    fetchDoctors();
  }, [caseId]);

  const fetchCaseDetails = async () => {
    try {
      setLoading(true);
      const caseResponse = await caseAPI.getCaseById(caseId);
      setCaseData(caseResponse.data);

      if (caseResponse.data.status === 'published') {
        const reportResponse = await reportAPI.getReportByCase(caseId);
        setReport(reportResponse.data);
      }
      setError('');
    } catch (err) {
      setError('Failed to load case details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await caseAPI.getAllDoctors();
      setDoctors(response.data);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    }
  };

  // Get recommended doctors based on detected disease
  const getRecommendedDoctors = () => {
    if (!caseData?.result?.predictions || doctors.length === 0) {
      return doctors;
    }

    const predictions = caseData.result.predictions;
    const topDisease = predictions[0]?.disease?.toLowerCase() || '';

    // Map diseases to specialist types
    const diseaseToSpecialist = {
      'fracture': 'Bones Specialist',
      'bone': 'Bones Specialist',
      'osteo': 'Bones Specialist',
      'pneumonia': 'Lung Specialist',
      'tuberculosis': 'Lung Specialist',
      'lung': 'Lung Specialist',
      'asthma': 'Lung Specialist',
      'copd': 'Lung Specialist',
      'heart': 'Heart Specialist',
      'cardiac': 'Heart Specialist',
      'stroke': 'Brain Specialist',
      'brain': 'Brain Specialist',
      'tumor': 'Brain Specialist',
      'skin': 'Skin Specialist',
      'melanoma': 'Skin Specialist',
      'derma': 'Skin Specialist',
    };

    // Find matching specialist type
    let recommendedType = 'General Physician';
    for (const [keyword, specialist] of Object.entries(diseaseToSpecialist)) {
      if (topDisease.includes(keyword)) {
        recommendedType = specialist;
        break;
      }
    }

    // Sort doctors: matching specialists first, then others
    const sortedDoctors = [...doctors].sort((a, b) => {
      if (a.doctorType === recommendedType && b.doctorType !== recommendedType) return -1;
      if (a.doctorType !== recommendedType && b.doctorType === recommendedType) return 1;
      return 0;
    });

    return sortedDoctors;
  };

  const handleAssignDoctor = async () => {
    if (!selectedDoctor) {
      setError('Please select a doctor');
      return;
    }

    try {
      setAssignLoading(true);
      await caseAPI.assignCase(caseId, selectedDoctor);
      fetchCaseDetails();
      setSelectedDoctor('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign doctor');
    } finally {
      setAssignLoading(false);
    }
  };

  const getStatusTimeline = () => {
    const statuses = ['uploaded', 'processed', 'doctor_review', 'published'];
    const currentIndex = statuses.indexOf(caseData.status);

    return statuses.map((status, index) => (
      <div key={status} className={`timeline-item ${index <= currentIndex ? 'active' : ''}`}>
        <div className="timeline-dot" />
        <div className="timeline-label">
          {status === 'uploaded' && 'Uploaded'}
          {status === 'processed' && 'AI Processed'}
          {status === 'doctor_review' && 'Doctor Review'}
          {status === 'published' && 'Published'}
        </div>
      </div>
    ));
  };

  if (loading) {
    return <div className="loading-container">Loading case details...</div>;
  }

  if (!caseData) {
    return <div className="error-message">Case not found</div>;
  }

  return (
    <div className="case-detail">
      <button onClick={() => navigate('/patient/dashboard')} className="back-button">
        ← Back to Dashboard
      </button>

      <div className="case-detail-header">
        <h1>Case #{caseData._id.slice(-6).toUpperCase()}</h1>
        <p>Created on {new Date(caseData.createdAt).toLocaleDateString()}</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="timeline-container">
        <h3>Case Progress</h3>
        <div className="timeline">{getStatusTimeline()}</div>
      </div>

      <div className="case-content">
        <div className="image-section">
          <h2>Medical Image</h2>
          <img src={caseData.imageUrl} alt="Medical scan" className="medical-image" />
        </div>

        {caseData.aiOutput && (
          <div className="ai-results">
            <h2>AI Analysis Results</h2>

            <div className="results-grid">
              <div className="result-card">
                <h3>Confidence Score</h3>
                <div className="confidence-display">
                  <span className="confidence-number">{(caseData.aiOutput.confidenceScore * 100).toFixed(1)}%</span>
                </div>
              </div>

              <div className="result-card">
                <h3>Analysis Time</h3>
                <span className="result-value">{caseData.aiOutput.processingTime || 'N/A'}</span>
              </div>
            </div>

            <div className="explanation-box">
              <h3>AI Explanation</h3>
              <p>{caseData.aiOutput.explainability}</p>
            </div>
          </div>
        )}

        {caseData.status === 'uploaded' && (
          <div className="action-section">
            <p>Processing your medical image...</p>
          </div>
        )}

        {caseData.status !== 'published' && caseData.status !== 'doctor_review' && (
          <div className="action-section">
            <h2>Assign to Doctor</h2>
            {caseData.result?.predictions && caseData.result.predictions.length > 0 && (
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                Recommended: {getRecommendedDoctors()[0]?.doctorType || 'General Physician'}
              </p>
            )}
            <div className="assign-doctor-form">
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="doctor-select"
              >
                <option value="">Select a doctor...</option>
                {getRecommendedDoctors().map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    Dr. {doctor.name} - {doctor.doctorType} {doctor.licenseId && `(${doctor.licenseId})`}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAssignDoctor}
                disabled={!selectedDoctor || assignLoading}
                className="assign-button"
              >
                {assignLoading ? 'Assigning...' : 'Assign to Doctor'}
              </button>
            </div>
          </div>
        )}

        {caseData.doctorId && (
          <div className="assigned-doctor">
            <h3>Assigned Doctor</h3>
            <p>Dr. {caseData.doctorId.name}</p>
            {caseData.doctorId.doctorType && (
              <p style={{ fontSize: '13px', color: '#2196f3', fontWeight: '600' }}>
                {caseData.doctorId.doctorType}
              </p>
            )}
            <p style={{ fontSize: '12px', color: '#666' }}>{caseData.doctorId.email}</p>
            {caseData.doctorId.licenseId && (
              <p style={{ fontSize: '12px', color: '#666' }}>License: {caseData.doctorId.licenseId}</p>
            )}
          </div>
        )}
      </div>

      {report && (
        <div className="report-section">
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
      )}
    </div>
  );
};

export default PatientCaseDetail;
