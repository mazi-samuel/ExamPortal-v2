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

// GET all results
app.get('/api/results', (req, res) => {
  const results = readResults();
  res.json(results);
});

// POST a new result (pushes to JSON)
app.post('/api/results', (req, res) => {
  const result = req.body;
  if (!result || !result.name) return res.status(400).json({ error: 'Invalid result payload' });

  const results = readResults();
  results.push(result);
  writeResults(results);

  return res.status(201).json({ ok: true, saved: result });
});

// DELETE all results (for teacher clear) — optional convenience route
app.delete('/api/results', (req, res) => {
  writeResults([]);
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Exam server running — open http://localhost:${PORT}/index-exam.html`));