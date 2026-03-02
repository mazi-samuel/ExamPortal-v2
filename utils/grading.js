// =============================================
// Grading Helpers
// =============================================
const config = require('../config');

function getGradeLetter(percentage, scale) {
  const gradeScale = scale || config.grading.defaultScale;
  for (const entry of gradeScale) {
    if (percentage >= entry.min && percentage <= entry.max) {
      return entry;
    }
  }
  return gradeScale[gradeScale.length - 1]; // fallback to lowest
}

function computeGPA(subjectResults) {
  if (!subjectResults || subjectResults.length === 0) return 0;
  const totalPoints = subjectResults.reduce((sum, r) => sum + (r.gpa || 0), 0);
  return Math.round((totalPoints / subjectResults.length) * 100) / 100;
}

function computeClassPositions(studentResults) {
  // studentResults = [{ student_id, total_percentage }]
  const sorted = [...studentResults].sort((a, b) => b.total_percentage - a.total_percentage);
  let position = 0;
  let lastPct = null;
  return sorted.map((s, idx) => {
    if (s.total_percentage !== lastPct) {
      position = idx + 1;
      lastPct = s.total_percentage;
    }
    return { ...s, position, out_of: sorted.length };
  });
}

function getOrdinalSuffix(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

module.exports = {
  getGradeLetter,
  computeGPA,
  computeClassPositions,
  getOrdinalSuffix
};
