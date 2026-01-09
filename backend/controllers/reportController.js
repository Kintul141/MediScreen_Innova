const Report = require('../models/Report');
const Case = require('../models/Case');

exports.createReport = async (req, res) => {
  try {
    const { caseId, notes, finalDiagnosis } = req.body;

    const caseData = await Case.findById(caseId);
    if (!caseData) {
      return res.status(404).json({ message: 'Case not found' });
    }

    if (caseData.doctorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const report = new Report({
      caseId,
      doctorId: req.user.id,
      notes,
      finalDiagnosis,
      diseaseFindings: caseData.aiOutput?.disease || {},
    });

    await report.save();

    caseData.status = 'published';
    caseData.publishedAt = new Date();
    await caseData.save();

    res.status(201).json({
      message: 'Report created successfully',
      report,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create report', error: error.message });
  }
};

exports.getReportByCase = async (req, res) => {
  try {
    const { caseId } = req.params;

    const report = await Report.findOne({ caseId }).populate('doctorId', 'name email');
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch report', error: error.message });
  }
};

exports.getPatientReports = async (req, res) => {
  try {
    const cases = await Case.find({ patientId: req.user.id });
    const caseIds = cases.map((c) => c._id);

    const reports = await Report.find({ caseId: { $in: caseIds } })
      .populate('caseId')
      .populate('doctorId', 'name email')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reports', error: error.message });
  }
};

exports.getDoctorReports = async (req, res) => {
  try {
    const reports = await Report.find({ doctorId: req.user.id })
      .populate('caseId')
      .populate('doctorId', 'name email')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reports', error: error.message });
  }
};
