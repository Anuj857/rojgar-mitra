const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const sheetsService = require('../services/sheetsService');

const SHEET = 'Workers';

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// GET /api/workers
router.get('/', async (req, res) => {
  try {
    let workers = await sheetsService.getSheetData(SHEET);
    const { keyword, category, location, availability } = req.query;
    if (keyword) {
      const q = keyword.toLowerCase();
      workers = workers.filter(w =>
        (w.name || '').toLowerCase().includes(q) ||
        (w.category || '').toLowerCase().includes(q) ||
        (w.skills || '').toLowerCase().includes(q)
      );
    }
    if (category && category !== 'all') workers = workers.filter(w => w.category === category);
    if (location) workers = workers.filter(w => (w.location || '').toLowerCase().includes(location.toLowerCase()));
    if (availability && availability !== 'all') workers = workers.filter(w => w.availabilityStatus === availability);
    res.json({ success: true, data: workers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/workers/:id
router.get('/:id', async (req, res) => {
  try {
    const workers = await sheetsService.getSheetData(SHEET);
    const worker = workers.find(w => w.id === req.params.id);
    if (!worker) return res.status(404).json({ success: false, error: 'Worker not found' });
    res.json({ success: true, data: worker });
  } catch (err) {
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
        skills: Array.isArray(req.body.skills) ? req.body.skills.join(',') : (req.body.skills || ''),
        experienceYears: req.body.experienceYears || 0,
        preferredSalary: req.body.preferredSalary || 0,
        salaryPeriod: req.body.salaryPeriod || 'per_day',
        location: req.body.location || '',
        distanceKm: req.body.distanceKm || 0,
        preferredDistanceKm: req.body.preferredDistanceKm || 10,
        availabilityStatus: req.body.availabilityStatus || 'available_now',
        profilePhotoUrl: req.body.profilePhotoUrl || '',
        rating: req.body.rating || 0,
        reviewsCount: 0,
        completedJobsCount: 0,
        verified: false,
        languages: Array.isArray(req.body.languages) ? req.body.languages.join(',') : (req.body.languages || ''),
        about: req.body.about || '',
      };
      await sheetsService.appendRow(SHEET, worker);
      res.status(201).json({ success: true, data: worker });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// PUT /api/workers/:id - Update worker profile
router.put('/:id', async (req, res) => {
  try {
    const workers = await sheetsService.getSheetData(SHEET);
    const idx = workers.findIndex(w => w.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Worker not found' });
    const updated = { ...workers[idx], ...req.body };
    if (Array.isArray(updated.skills)) updated.skills = updated.skills.join(',');
    if (Array.isArray(updated.languages)) updated.languages = updated.languages.join(',');
    await sheetsService.updateRow(SHEET, idx + 1, updated);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
