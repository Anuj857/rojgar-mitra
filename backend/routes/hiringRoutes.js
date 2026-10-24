const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const sheetsService = require('../services/sheetsService');

const SHEET = 'HiringRequests';

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// GET /api/hiring-requests?workerId=&employerId=
router.get('/', async (req, res) => {
  try {
    let reqs = await sheetsService.getSheetData(SHEET);
    if (req.query.workerId) reqs = reqs.filter(r => r.workerId === req.query.workerId);
    if (req.query.employerId) reqs = reqs.filter(r => r.employerId === req.query.employerId);
    res.json({ success: true, data: reqs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/hiring-requests
router.post('/',
  body('workerId').notEmpty(),
  body('employerId').notEmpty(),
  body('jobRole').notEmpty(),
  handleValidation,
  async (req, res) => {
    try {
      const req_obj = {
        id: `hire-req-${Date.now()}`,
        workerId: req.body.workerId,
        workerName: req.body.workerName || '',
        employerId: req.body.employerId,
        employerName: req.body.employerName || '',
        employerPhone: req.body.employerPhone || '',
        jobRole: req.body.jobRole,
        proposedDailyWage: req.body.proposedDailyWage || 0,
        location: req.body.location || '',
        workDuration: req.body.workDuration || '',
        message: req.body.message || '',
        status: 'sent',
        sentAt: new Date().toISOString(),
      };
      await sheetsService.appendRow(SHEET, req_obj);
      res.status(201).json({ success: true, data: req_obj });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

module.exports = router;
