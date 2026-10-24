'use strict';
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const jobRoutes = require('./routes/jobRoutes');
const workerRoutes = require('./routes/workerRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const hiringRoutes = require('./routes/hiringRoutes');
// Keep old userRoutes for backward compatibility but don't use mongoose
// const userRoutes = require('./routes/userRoutes');

const app = express();

// --- CORS ---
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:4173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json());

// --- Request Logger ---
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} → ${res.statusCode} (${ms}ms)`);
  });
  next();
});

// --- Health Check ---
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Rojgar Mitra API',
    timestamp: new Date().toISOString(),
    googleSheets: !!(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && process.env.SPREADSHEET_ID),
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'Rojgar Mitra API Running', version: '2.0.0' });
});

// --- API Routes ---
app.use('/api/jobs', jobRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/hiring-requests', hiringRoutes);

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(500).json({ success: false, error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Rojgar Mitra API running on port ${PORT}`);
  console.log(`Google Sheets configured: ${!!(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.SPREADSHEET_ID)}`);
});
