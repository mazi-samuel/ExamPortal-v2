const express = require('express');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5510;
const DATA_DIR = path.join(__dirname, 'data');
const RESULTS_FILE = path.join(DATA_DIR, 'results.json');

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// ---------- Landing page redirect ----------
// Serve login.html as the default landing page (send users straight to login)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// ---------- Serve static files ----------
app.use('/', express.static(path.join(__dirname)));

// ---------- Legacy API (kept for backward compatibility) ----------
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

app.listen(PORT, () => {
  console.log(`\n  ExamPortal running at http://localhost:${PORT}\n`);
  console.log(`  Login:        http://localhost:${PORT}/login.html`);
  console.log(`  Portal:       http://localhost:${PORT}/`);
  console.log(`  Legacy Exam:  http://localhost:${PORT}/index-exam.html`);
  console.log(`  Teacher CMS:  http://localhost:${PORT}/teacher-dashboard.html`);
  console.log(`  Student:      http://localhost:${PORT}/student-dashboard.html\n`);
});