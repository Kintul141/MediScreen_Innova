import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
};

// Case endpoints
export const caseAPI = {
  uploadCase: (formData) =>
    apiClient.post('/cases/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  processCase: (caseId) => apiClient.post(`/cases/${caseId}/process`),
  getPatientCases: () => apiClient.get('/cases/patient/cases'),
  getDoctorCases: () => apiClient.get('/cases/doctor/cases'),
  getCaseById: (caseId) => apiClient.get(`/cases/${caseId}`),
  assignCase: (caseId, doctorId) => apiClient.post(`/cases/${caseId}/assign`, { doctorId }),
  getAllDoctors: () => apiClient.get('/cases/doctors/all'),
};

// Report endpoints
export const reportAPI = {
  createReport: (data) => apiClient.post('/reports', data),
  getReportByCase: (caseId) => apiClient.get(`/reports/case/${caseId}`),
  getPatientReports: () => apiClient.get('/reports/patient/reports'),
  getDoctorReports: () => apiClient.get('/reports/doctor/reports'),
};
