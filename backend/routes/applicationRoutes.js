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

// GET /api/applications?workerId=&jobId=
router.get('/', async (req, res) => {
  try {
    const apps = await supabaseService.getApplications(req.query);
    res.json({ success: true, data: apps });
  } catch (err) {
    console.error('[GET /api/applications]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/applications - Apply for a job
router.post('/',
  body('jobId').notEmpty().trim(),
  body('workerId').notEmpty().trim(),
  body('workerName').notEmpty().trim(),
  handleValidation,
  async (req, res) => {
    try {
      // Check for duplicate application
      const existing = await supabaseService.findApplication(req.body.jobId, req.body.workerId);
      if (existing) {
        return res.status(409).json({ success: false, error: 'Already applied for this job', data: existing });
      }

      const id = req.body.id || `app-${Date.now()}`;
      const app = {
        id,
        jobId: req.body.jobId,
        jobTitle: req.body.jobTitle || '',
        category: req.body.category || '',
        employerName: req.body.employerName || '',
        location: req.body.location || '',
        salary: Number(req.body.salary) || 0,
        salaryPeriod: req.body.salaryPeriod || 'per_day',
        workerId: req.body.workerId,
        workerName: req.body.workerName,
        workerMobile: req.body.workerMobile || '',
        workerSkill: req.body.workerSkill || '',
        appliedAt: new Date().toISOString(),
        status: 'pending',
        expectedSalary: req.body.expectedSalary ? Number(req.body.expectedSalary) : undefined,
        notes: req.body.notes || '',
      };

      const created = await supabaseService.createApplication(app);
      res.status(201).json({ success: true, data: created });
    } catch (err) {
      console.error('[POST /api/applications]', err.message);
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
      const updated = await supabaseService.updateApplicationStatus(req.params.id, req.body.status);
      res.json({ success: true, data: updated });
    } catch (err) {
      console.error('[PATCH /api/applications/:id/status]', err.message);
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

module.exports = router;
