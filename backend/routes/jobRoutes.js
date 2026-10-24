const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const sheetsService = require('../services/sheetsService');

const SHEET = 'Jobs';

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// GET /api/jobs - List all jobs with optional filters
router.get('/', async (req, res) => {
  try {
    let jobs = await sheetsService.getSheetData(SHEET);
    const { keyword, location, category, urgentOnly, salaryPeriod } = req.query;
    if (keyword) {
      const q = keyword.toLowerCase();
      jobs = jobs.filter(j =>
        (j.title || '').toLowerCase().includes(q) ||
        (j.category || '').toLowerCase().includes(q) ||
        (j.description || '').toLowerCase().includes(q) ||
        (j.location || '').toLowerCase().includes(q)
      );
    }
    if (location) jobs = jobs.filter(j => (j.location || '').toLowerCase().includes(location.toLowerCase()));
    if (category && category !== 'all') jobs = jobs.filter(j => j.category === category);
    if (urgentOnly === 'true') jobs = jobs.filter(j => j.isUrgent === 'TRUE' || j.isUrgent === true);
    if (salaryPeriod && salaryPeriod !== 'all') jobs = jobs.filter(j => j.salaryPeriod === salaryPeriod);
    res.json({ success: true, data: jobs });
  } catch (err) {
    console.error('[GET /api/jobs]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/jobs/:id
router.get('/:id', async (req, res) => {
  try {
    const jobs = await sheetsService.getSheetData(SHEET);
    const job = jobs.find(j => j.id === req.params.id);
    if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
    res.json({ success: true, data: job });
  } catch (err) {
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
      const id = `job-${Date.now()}`;
      const job = {
        id,
        title: req.body.title,
        category: req.body.category,
        categoryHi: req.body.categoryHi || '',
        description: req.body.description || '',
        salary: req.body.salary,
        salaryPeriod: req.body.salaryPeriod || 'per_day',
        location: req.body.location,
        distanceKm: req.body.distanceKm || 0,
        workersRequired: req.body.workersRequired || 1,
        workersHired: 0,
        requiredExperience: req.body.requiredExperience || '',
        workDuration: req.body.workDuration || '',
        workingHours: req.body.workingHours || '',
        startDate: req.body.startDate || '',
        isUrgent: req.body.isUrgent || false,
        employerId: req.body.employerId || '',
        employerName: req.body.employerName || '',
        employerRating: req.body.employerRating || 0,
        employerPhone: req.body.employerPhone || '',
        status: 'active',
        createdAt: new Date().toISOString(),
        applicationsCount: 0,
        requiredSkills: Array.isArray(req.body.requiredSkills) ? req.body.requiredSkills.join(',') : (req.body.requiredSkills || ''),
      };
      await sheetsService.appendRow(SHEET, job);
      res.status(201).json({ success: true, data: job });
    } catch (err) {
      console.error('[POST /api/jobs]', err.message);
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// PUT /api/jobs/:id - Update job fields
router.put('/:id', async (req, res) => {
  try {
    const jobs = await sheetsService.getSheetData(SHEET);
    const idx = jobs.findIndex(j => j.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Job not found' });
    const updated = {
      ...jobs[idx],
      title: req.body.title ?? jobs[idx].title,
      description: req.body.description ?? jobs[idx].description,
      salary: req.body.salary ?? jobs[idx].salary,
      salaryPeriod: req.body.salaryPeriod ?? jobs[idx].salaryPeriod,
      location: req.body.location ?? jobs[idx].location,
      workersRequired: req.body.workersRequired ?? jobs[idx].workersRequired,
      requiredExperience: req.body.requiredExperience ?? jobs[idx].requiredExperience,
      workDuration: req.body.workDuration ?? jobs[idx].workDuration,
      workingHours: req.body.workingHours ?? jobs[idx].workingHours,
      status: req.body.status ?? jobs[idx].status,
      isUrgent: req.body.isUrgent !== undefined ? req.body.isUrgent : jobs[idx].isUrgent,
      requiredSkills: req.body.requiredSkills !== undefined
        ? (Array.isArray(req.body.requiredSkills) ? req.body.requiredSkills.join(',') : req.body.requiredSkills)
        : jobs[idx].requiredSkills,
    };
    await sheetsService.updateRow(SHEET, idx + 1, updated);
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
      const jobs = await sheetsService.getSheetData(SHEET);
      const idx = jobs.findIndex(j => j.id === req.params.id);
      if (idx === -1) return res.status(404).json({ success: false, error: 'Job not found' });
      jobs[idx].status = req.body.status;
      await sheetsService.updateRow(SHEET, idx + 1, jobs[idx]);
      res.json({ success: true, data: jobs[idx] });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// DELETE /api/jobs/:id
router.delete('/:id', async (req, res) => {
  try {
    const jobs = await sheetsService.getSheetData(SHEET);
    const idx = jobs.findIndex(j => j.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Job not found' });
    await sheetsService.deleteSheetRow(SHEET, idx + 2); // +2: header row + 1-based
    res.json({ success: true, message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
