// routes/resultsManagement.js
// API endpoints for managing exam results with project scores

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

const RESULTS_FILE = path.join(__dirname, '../data/results.json');

// Get all results
router.get('/results', async (req, res) => {
    try {
        const data = await fs.readFile(RESULTS_FILE, 'utf-8');
        const results = JSON.parse(data);
        res.json({ success: true, data: results });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get results by grade
router.get('/results/:grade', async (req, res) => {
    try {
        const data = await fs.readFile(RESULTS_FILE, 'utf-8');
        const results = JSON.parse(data);
        const filtered = results.filter(r => r.grade === req.params.grade);
        res.json({ success: true, data: filtered });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Save/Update results with project scores
router.post('/save-results', async (req, res) => {
    try {
        const { results } = req.body;

        if (!Array.isArray(results)) {
            return res.status(400).json({ success: false, error: 'Invalid results format' });
        }

        // Validate each result
        const validatedResults = results.map(result => ({
            ...result,
            projectScore: typeof result.projectScore === 'number' && result.projectScore >= 0 && result.projectScore <= 40
                ? result.projectScore
                : undefined,
            finalScore: result.finalOver60 + (typeof result.projectScore === 'number' ? result.projectScore : 0),
            percentage: Math.round(((result.finalOver60 + (typeof result.projectScore === 'number' ? result.projectScore : 0)) / 100) * 100)
        }));

        // Save to file
        await fs.writeFile(RESULTS_FILE, JSON.stringify(validatedResults, null, 2));

        // Create backup
        const backup = path.join(__dirname, '../data/results-backup.json');
        await fs.writeFile(backup, JSON.stringify(validatedResults, null, 2));

        res.json({ success: true, message: 'Results saved successfully', data: validatedResults });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update single student's project score
router.put('/results/:studentName', async (req, res) => {
    try {
        const { projectScore } = req.body;
        const { studentName } = req.params;

        if (typeof projectScore !== 'number' || projectScore < 0 || projectScore > 40) {
            return res.status(400).json({ success: false, error: 'Project score must be between 0 and 40' });
        }

        const data = await fs.readFile(RESULTS_FILE, 'utf-8');
        let results = JSON.parse(data);

        const studentIndex = results.findIndex(r => r.name.toLowerCase() === studentName.toLowerCase());
        if (studentIndex === -1) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }

        results[studentIndex].projectScore = projectScore;
        results[studentIndex].finalScore = results[studentIndex].finalOver60 + projectScore;
        results[studentIndex].percentage = Math.round((results[studentIndex].finalScore / 100) * 100);

        // Calculate letter grade
        const percentage = results[studentIndex].percentage;
        results[studentIndex].gradeLetter = percentage >= 90 ? 'A' : 
                                            percentage >= 80 ? 'B' : 
                                            percentage >= 70 ? 'C' : 
                                            percentage >= 60 ? 'D' : 'E';

        await fs.writeFile(RESULTS_FILE, JSON.stringify(results, null, 2));

        res.json({ success: true, message: 'Score updated successfully', data: results[studentIndex] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Clear student's project score
router.delete('/results/:studentName/project-score', async (req, res) => {
    try {
        const { studentName } = req.params;

        const data = await fs.readFile(RESULTS_FILE, 'utf-8');
        let results = JSON.parse(data);

        const studentIndex = results.findIndex(r => r.name.toLowerCase() === studentName.toLowerCase());
        if (studentIndex === -1) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }

        delete results[studentIndex].projectScore;
        results[studentIndex].finalScore = results[studentIndex].finalOver60;
        results[studentIndex].percentage = Math.round((results[studentIndex].finalOver60 / 100) * 100);

        await fs.writeFile(RESULTS_FILE, JSON.stringify(results, null, 2));

        res.json({ success: true, message: 'Project score cleared successfully', data: results[studentIndex] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get statistics
router.get('/statistics', async (req, res) => {
    try {
        const data = await fs.readFile(RESULTS_FILE, 'utf-8');
        const results = JSON.parse(data);

        const totalStudents = results.length;
        const scoresEntered = results.filter(r => r.projectScore !== undefined).length;
        const pendingScores = totalStudents - scoresEntered;

        const avgScore = scoresEntered > 0
            ? Math.round(results.filter(r => r.projectScore !== undefined)
                .reduce((sum, r) => sum + (r.finalScore || r.finalOver60), 0) / scoresEntered)
            : 0;

        const byGrade = {};
        results.forEach(r => {
            if (!byGrade[r.grade]) {
                byGrade[r.grade] = { total: 0, completed: 0 };
            }
            byGrade[r.grade].total++;
            if (r.projectScore !== undefined) {
                byGrade[r.grade].completed++;
            }
        });

        res.json({
            success: true,
            data: {
                totalStudents,
                scoresEntered,
                pendingScores,
                averageScore: avgScore,
                byGrade
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Export results to CSV
router.get('/export/csv', async (req, res) => {
    try {
        const data = await fs.readFile(RESULTS_FILE, 'utf-8');
        const results = JSON.parse(data);

        let csv = 'Student Name,Grade,Exam Score,Project Score,Final Score,Percentage,Letter Grade\n';
        results.forEach(r => {
            csv += `"${r.name}","${r.gradeLabel}",${r.finalOver60},${r.projectScore || 'N/A'},${r.finalScore || 'Pending'},${r.percentage || 'Pending'},"${r.gradeLetter || 'N/A'}"\n`;
        });

        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename="ict-results.csv"');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
