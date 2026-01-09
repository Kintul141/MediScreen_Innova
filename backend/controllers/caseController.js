const Case = require('../models/Case');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

exports.uploadCase = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const caseData = new Case({
      patientId: req.user.id,
      imageUrl: `/storage/${req.file.filename}`,
      imageFilename: req.file.filename,
      patientNotes: req.body.notes || '',
      status: 'uploaded',
    });

    await caseData.save();

    res.status(201).json({
      message: 'Case created successfully',
      case: caseData,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload case', error: error.message });
  }
};

exports.processCase = async (req, res) => {
  try {
    const { caseId } = req.params;
    const caseData = await Case.findById(caseId);

    if (!caseData) {
      return res.status(404).json({ message: 'Case not found' });
    }

    // Call AI service stub
    try {
      const aiResponse = await axios.post('http://localhost:3001/api/process', {
        imagePath: caseData.imageUrl,
      });

      caseData.aiOutput = aiResponse.data;
      caseData.status = 'processed';
      caseData.processedAt = new Date();
      await caseData.save();

      res.json({
        message: 'Case processed successfully',
        case: caseData,
      });
    } catch (aiError) {
      console.error('AI service error:', aiError.message);
      res.status(500).json({ message: 'AI processing failed', error: aiError.message });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to process case', error: error.message });
  }
};

exports.getPatientCases = async (req, res) => {
  try {
    const cases = await Case.find({ patientId: req.user.id }).sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cases', error: error.message });
  }
};

exports.getCaseById = async (req, res) => {
  try {
    const { caseId } = req.params;
    const caseData = await Case.findById(caseId).populate('doctorId', 'name email licenseId doctorType');

    if (!caseData) {
      return res.status(404).json({ message: 'Case not found' });
    }

    // Check authorization
    if (caseData.patientId.toString() !== req.user.id && caseData.doctorId?.toString() !== req.user.id) {
      if (req.user.role !== 'doctor') {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json(caseData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch case', error: error.message });
  }
};

exports.assignCase = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { doctorId } = req.body;

    const caseData = await Case.findById(caseId);

    if (!caseData) {
      return res.status(404).json({ message: 'Case not found' });
    }

    if (caseData.patientId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(400).json({ message: 'Invalid doctor ID' });
    }

    caseData.doctorId = doctorId;
    caseData.status = 'doctor_review';
    caseData.assignedAt = new Date();
    await caseData.save();

    res.json({
      message: 'Case assigned successfully',
      case: caseData,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign case', error: error.message });
  }
};

exports.getDoctorCases = async (req, res) => {
  try {
    const cases = await Case.find({ doctorId: req.user.id }).populate('patientId', 'name email').sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cases', error: error.message });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('_id name email licenseId doctorType');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch doctors', error: error.message });
  }
};
