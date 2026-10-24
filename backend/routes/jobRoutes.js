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

// GET /api/jobs - List all jobs with optional filters
router.get('/', async (req, res) => {
  try {
    const jobs = await supabaseService.getJobs(req.query);
    res.json({ success: true, data: jobs });
  } catch (err) {
    console.error('[GET /api/jobs]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/jobs/:id
router.get('/:id', async (req, res) => {
  try {
    const job = await supabaseService.getJobById(req.params.id);
    if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
    res.json({ success: true, data: job });
  } catch (err) {
    console.error('[GET /api/jobs/:id]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/jobs - Create job
router.post('/',
  body('title').notEmpty().trim(),
  body('category').notEmpty().trim(),
  body('salary').isNumeric(),
  body('location').notEmpty().trim(),
  handleValidation,
  async (req, res) => {
    try {
      const id = req.body.id || `job-${Date.now()}`;
      const job = {
        id,
        title: req.body.title,
        category: req.body.category,
        categoryHi: req.body.categoryHi || '',
        description: req.body.description || '',
        salary: Number(req.body.salary) || 0,
        salaryPeriod: req.body.salaryPeriod || 'per_day',
        location: req.body.location,
        distanceKm: Number(req.body.distanceKm) || 0,
        workersRequired: Number(req.body.workersRequired) || 1,
        workersHired: 0,
        requiredExperience: req.body.requiredExperience || '',
        workDuration: req.body.workDuration || '',
        workingHours: req.body.workingHours || '',
        startDate: req.body.startDate || '',
        isUrgent: Boolean(req.body.isUrgent),
        employerId: req.body.employerId || 'emp-demo',
        employerName: req.body.employerName || '',
        employerRating: Number(req.body.employerRating) || 5.0,
        employerPhone: req.body.employerPhone || '',
        status: 'active',
        createdAt: new Date().toISOString(),
        applicationsCount: 0,
        requiredSkills: Array.isArray(req.body.requiredSkills)
          ? req.body.requiredSkills
          : (typeof req.body.requiredSkills === 'string' && req.body.requiredSkills
              ? req.body.requiredSkills.split(',').map(s => s.trim()).filter(Boolean)
              : []),
      };

      const created = await supabaseService.createJob(job);
      res.status(201).json({ success: true, data: created });
    } catch (err) {
      console.error('[POST /api/jobs]', err.message);
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// PUT /api/jobs/:id - Update job fields
router.put('/:id', async (req, res) => {
  try {
    const existing = await supabaseService.getJobById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, error: 'Job not found' });

    const updated = await supabaseService.updateJob(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('[PUT /api/jobs/:id]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/jobs/:id/status
router.patch('/:id/status',
  body('status').isIn(['active', 'closed', 'paused']),
  handleValidation,
  async (req, res) => {
    try {
      const existing = await supabaseService.getJobById(req.params.id);
      if (!existing) return res.status(404).json({ success: false, error: 'Job not found' });

      const updated = await supabaseService.updateJobStatus(req.params.id, req.body.status);
      res.json({ success: true, data: updated });
    } catch (err) {
      console.error('[PATCH /api/jobs/:id/status]', err.message);
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// DELETE /api/jobs/:id
router.delete('/:id', async (req, res) => {
  try {
    const existing = await supabaseService.getJobById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, error: 'Job not found' });

    await supabaseService.deleteJob(req.params.id);
    res.json({ success: true, message: 'Job deleted' });
  } catch (err) {
    console.error('[DELETE /api/jobs/:id]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
