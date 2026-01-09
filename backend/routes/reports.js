const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const {
  createReport,
  getReportByCase,
  getPatientReports,
  getDoctorReports,
} = require('../controllers/reportController');

router.post('/', authMiddleware, roleMiddleware(['doctor']), createReport);
router.get('/case/:caseId', authMiddleware, getReportByCase);
router.get('/patient/reports', authMiddleware, roleMiddleware(['patient']), getPatientReports);
router.get('/doctor/reports', authMiddleware, roleMiddleware(['doctor']), getDoctorReports);

module.exports = router;
