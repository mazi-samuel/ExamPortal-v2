const express = require('express');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5510;
const DATA_DIR = path.join(__dirname, 'data');
const RESULTS_FILE = path.join(DATA_DIR, 'results.json');

// simple teacher credentials (override with env vars TEACHER_USER / TEACHER_PASS)
const TEACHER_USER = process.env.TEACHER_USER || 'teacher';
const TEACHER_PASS = process.env.TEACHER_PASS || 'password123';

function basicAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Teachers Only"');
    return res.status(401).send('Authentication required.');
  }

  const base64Credentials = auth.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
  const [user, pass] = credentials.split(':');

  if (user === TEACHER_USER && pass === TEACHER_PASS) return next();

  res.setHeader('WWW-Authenticate', 'Basic realm="Teachers Only"');
  return res.status(401).send('Invalid credentials.');
}

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Protect the teacher score-sheet file with basic auth before serving static files
app.use((req, res, next) => {
  if (req.path === '/scoresheet.html') return basicAuth(req, res, next);
  return next();
});

// Serve static site
app.use('/', express.static(path.join(__dirname)));

// ensure data folder & results file exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(RESULTS_FILE)) fs.writeFileSync(RESULTS_FILE, '[]', 'utf8');

function readResults() {
  try {
    const raw = fs.readFileSync(RESULTS_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('Failed to read results.json', err);
    return [];
  }
}

function writeResults(arr) {
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(arr, null, 2), 'utf8');
}

// GET all results (protected: teachers only)
app.get('/api/results', basicAuth, (req, res) => {
  const results = readResults();
  res.json(results);
});

// POST a new result (pushes to JSON) — public (students submit without auth)
app.post('/api/results', (req, res) => {
  const result = req.body;
  if (!result || !result.name) return res.status(400).json({ error: 'Invalid result payload' });

  const results = readResults();
  results.push(result);
  writeResults(results);

  return res.status(201).json({ ok: true, saved: result });
});

// DELETE all results (for teacher clear) — protected
app.delete('/api/results', basicAuth, (req, res) => {
  writeResults([]);
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Exam server running — open http://localhost:${PORT}/index-exam.html`));