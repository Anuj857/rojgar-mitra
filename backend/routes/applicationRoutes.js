const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const sheetsService = require('../services/sheetsService');

const SHEET = 'Applications';

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// GET /api/applications?workerId=&jobId=
router.get('/', async (req, res) => {
  try {
    let apps = await sheetsService.getSheetData(SHEET);
    if (req.query.workerId) apps = apps.filter(a => a.workerId === req.query.workerId);
    if (req.query.jobId) apps = apps.filter(a => a.jobId === req.query.jobId);
    res.json({ success: true, data: apps });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/applications - Apply for a job
router.post('/',
  body('jobId').notEmpty(),
  body('workerId').notEmpty(),
  body('workerName').notEmpty(),
  handleValidation,
  async (req, res) => {
    try {
      // Check duplicate
      const existing = await sheetsService.getSheetData(SHEET);
      const dup = existing.find(a => a.jobId === req.body.jobId && a.workerId === req.body.workerId);
      if (dup) return res.status(409).json({ success: false, error: 'Already applied', data: dup });

      const app = {
        id: `app-${Date.now()}`,
        jobId: req.body.jobId,
        jobTitle: req.body.jobTitle || '',
        category: req.body.category || '',
        employerName: req.body.employerName || '',
        location: req.body.location || '',
        salary: req.body.salary || 0,
        salaryPeriod: req.body.salaryPeriod || 'per_day',
        workerId: req.body.workerId,
        workerName: req.body.workerName,
        workerMobile: req.body.workerMobile || '',
        workerSkill: req.body.workerSkill || '',
        appliedAt: new Date().toISOString(),
        status: 'pending',
        expectedSalary: req.body.expectedSalary || '',
        notes: req.body.notes || '',
      };
      await sheetsService.appendRow(SHEET, app);
      res.status(201).json({ success: true, data: app });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// PATCH /api/applications/:id/status
router.patch('/:id/status',
  body('status').isIn(['pending', 'accepted', 'rejected']),
  handleValidation,
  async (req, res) => {
    try {
      const apps = await sheetsService.getSheetData(SHEET);
      const idx = apps.findIndex(a => a.id === req.params.id);
      if (idx === -1) return res.status(404).json({ success: false, error: 'Application not found' });
      apps[idx].status = req.body.status;
      await sheetsService.updateRow(SHEET, idx + 1, apps[idx]);
      res.json({ success: true, data: apps[idx] });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

module.exports = router;
