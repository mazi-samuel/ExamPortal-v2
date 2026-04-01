const express = require('express');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');

// Load .env if present (won't fail if file missing)
try { require('dotenv').config(); } catch (_) { /* dotenv not installed yet */ }

const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5510;
const DATA_DIR = path.join(__dirname, 'data');
const RESULTS_FILE = path.join(DATA_DIR, 'results.json');

// ---------- Global Middleware ----------
app.use(morgan('dev'));
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// ---------- Landing page redirect ----------
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// ---------- Serve static files ----------
app.use('/', express.static(path.join(__dirname)));

// ============================================================
//  V2 API Routes (new modular endpoints)
// ============================================================
app.use('/api/v2/assessments',           require('./routes/assessments'));
app.use('/api/v2/term-results',          require('./routes/termResults'));
app.use('/api/v2/assignments',           require('./routes/assignments'));
app.use('/api/v2/attendance',            require('./routes/attendance'));
app.use('/api/v2/notifications',         require('./routes/notifications'));
app.use('/api/v2/question-bank',         require('./routes/questionBank'));
app.use('/api/v2/analytics',             require('./routes/analytics'));
app.use('/api/v2/messages',              require('./routes/messaging'));
app.use('/api/v2/gamification',          require('./routes/gamification'));
app.use('/api/v2/behavioral',            require('./routes/behavioralPerformance'));
app.use('/api/v2/results-management',    require('./routes/resultsManagement'));

// ============================================================
//  Legacy API (kept for backward compatibility)
// ============================================================
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(RESULTS_FILE)) fs.writeFileSync(RESULTS_FILE, '[]', 'utf8');

function readResults() {
  try { return JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8') || '[]'); }
  catch (e) { return []; }
}
function writeResults(arr) { fs.writeFileSync(RESULTS_FILE, JSON.stringify(arr, null, 2), 'utf8'); }

app.get('/api/results', (req, res) => res.json(readResults()));

app.post('/api/results', (req, res) => {
  const result = req.body;
  if (!result || !result.name) return res.status(400).json({ error: 'Invalid payload' });
  const results = readResults();
  results.push(result);
  writeResults(results);
  res.status(201).json({ ok: true });
});

app.delete('/api/results', (req, res) => {
  writeResults([]);
  res.json({ ok: true });
});

// ---------- Error Handling ----------
app.use('/api', notFoundHandler);
app.use(errorHandler);

// ---------- Start ----------
app.listen(PORT, () => {
  logger.info(`ExamPortal running at http://localhost:${PORT}`);
  console.log(`\n  ExamPortal running at http://localhost:${PORT}\n`);
  console.log(`  Login:        http://localhost:${PORT}/login.html`);
  console.log(`  Portal:       http://localhost:${PORT}/`);
  console.log(`  Legacy Exam:  http://localhost:${PORT}/index-exam.html`);
  console.log(`  Teacher CMS:  http://localhost:${PORT}/teacher-dashboard.html`);
  console.log(`  Student:      http://localhost:${PORT}/student-dashboard.html`);
  console.log(`  Parent:       http://localhost:${PORT}/parent-dashboard.html`);
  console.log(`  Materials:    http://localhost:${PORT}/class-materials.html`);
  console.log(`  Forum:        http://localhost:${PORT}/discussion-forum.html`);
  console.log(`  Broadcasts:   http://localhost:${PORT}/teacher-broadcasts.html`);
  console.log(`  API v2:       http://localhost:${PORT}/api/v2\n`);
});