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

// GET /api/workers
router.get('/', async (req, res) => {
  try {
    const workers = await supabaseService.getWorkers(req.query);
    res.json({ success: true, data: workers });
  } catch (err) {
    console.error('[GET /api/workers]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/workers/:id
router.get('/:id', async (req, res) => {
  try {
    const worker = await supabaseService.getWorkerById(req.params.id);
    if (!worker) return res.status(404).json({ success: false, error: 'Worker not found' });
    res.json({ success: true, data: worker });
  } catch (err) {
    console.error('[GET /api/workers/:id]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/workers - Create/register worker profile
router.post('/',
  body('name').notEmpty().trim(),
  body('mobile').notEmpty().trim(),
  body('category').notEmpty().trim(),
  handleValidation,
  async (req, res) => {
    try {
      const id = req.body.id || `w-${Date.now()}`;
      const worker = {
        id,
        name: req.body.name,
        mobile: req.body.mobile,
        category: req.body.category,
        categoryHi: req.body.categoryHi || '',
        skills: Array.isArray(req.body.skills)
          ? req.body.skills
          : (typeof req.body.skills === 'string' && req.body.skills
              ? req.body.skills.split(',').map(s => s.trim()).filter(Boolean)
              : []),
        experienceYears: Number(req.body.experienceYears) || 0,
        preferredSalary: Number(req.body.preferredSalary) || 0,
        salaryPeriod: req.body.salaryPeriod || 'per_day',
        location: req.body.location || '',
        distanceKm: Number(req.body.distanceKm) || 0,
        preferredDistanceKm: Number(req.body.preferredDistanceKm) || 10,
        availabilityStatus: req.body.availabilityStatus || 'available_now',
        profilePhotoUrl: req.body.profilePhotoUrl || '',
        rating: Number(req.body.rating) || 5.0,
        reviewsCount: 0,
        completedJobsCount: 0,
        verified: false,
        languages: Array.isArray(req.body.languages)
          ? req.body.languages
          : (typeof req.body.languages === 'string' && req.body.languages
              ? req.body.languages.split(',').map(s => s.trim()).filter(Boolean)
              : ['Hindi']),
        about: req.body.about || '',
        workHistory: Array.isArray(req.body.workHistory) ? req.body.workHistory : [],
      };

      const created = await supabaseService.createWorker(worker);
      res.status(201).json({ success: true, data: created });
    } catch (err) {
      console.error('[POST /api/workers]', err.message);
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// PUT /api/workers/:id - Update worker profile
router.put('/:id', async (req, res) => {
  try {
    const existing = await supabaseService.getWorkerById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, error: 'Worker not found' });

    const updated = await supabaseService.updateWorker(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('[PUT /api/workers/:id]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
