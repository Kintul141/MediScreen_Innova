const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const {
  uploadCase,
  processCase,
  getPatientCases,
  getCaseById,
  assignCase,
  getDoctorCases,
  getAllDoctors,
} = require('../controllers/caseController');

// Multer configuration
const storage = multer.diskStorage({
  destination: 'backend/storage/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Routes
router.post('/upload', authMiddleware, roleMiddleware(['patient']), upload.single('image'), uploadCase);
router.post('/:caseId/process', authMiddleware, processCase);
router.get('/patient/cases', authMiddleware, roleMiddleware(['patient']), getPatientCases);
router.get('/doctor/cases', authMiddleware, roleMiddleware(['doctor']), getDoctorCases);
router.get('/:caseId', authMiddleware, getCaseById);
router.post('/:caseId/assign', authMiddleware, roleMiddleware(['patient']), assignCase);
router.get('/doctors/all', authMiddleware, getAllDoctors);

module.exports = router;
