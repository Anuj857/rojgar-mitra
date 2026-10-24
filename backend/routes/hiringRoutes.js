'use strict';
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const supabaseService = require('../services/supabaseService');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  next();
};

// GET /api/hiring-requests?workerId=&employerId=
router.get('/', async (req, res) => {
  try {
    const reqs = await supabaseService.getHiringRequests(req.query);
    res.json({ success: true, data: reqs });
  } catch (err) {
    console.error('[GET /api/hiring-requests]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/hiring-requests
router.post('/',
  body('workerId').notEmpty().trim(),
  body('employerId').notEmpty().trim(),
  body('jobRole').notEmpty().trim(),
  handleValidation,
  async (req, res) => {
    try {
      const id = req.body.id || `hire-req-${Date.now()}`;
      const reqObj = {
        id,
        workerId: req.body.workerId,
        workerName: req.body.workerName || '',
        employerId: req.body.employerId,
        employerName: req.body.employerName || '',
        employerPhone: req.body.employerPhone || '',
        jobRole: req.body.jobRole,
        proposedDailyWage: Number(req.body.proposedDailyWage) || 0,
        location: req.body.location || '',
        workDuration: req.body.workDuration || '',
        message: req.body.message || '',
        status: 'sent',
        sentAt: new Date().toISOString(),
      };

      const created = await supabaseService.createHiringRequest(reqObj);
      res.status(201).json({ success: true, data: created });
    } catch (err) {
      console.error('[POST /api/hiring-requests]', err.message);
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

module.exports = router;
