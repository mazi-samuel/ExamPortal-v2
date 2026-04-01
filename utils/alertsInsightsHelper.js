// =============================================
// Alerts & Insights Helper Utility
// =============================================
const logger = require('../utils/logger');

class AlertsInsightsHelper {
  /**
   * Generate performance insights based on metric scores
   */
  static generateInsights(metricScores, metrics) {
    const insights = {
      strengths: [],
      improvements: [],
      opportunities: [],
      warnings: [],
      summary: ''
    };

    // Identify strengths and weaknesses
    metrics.forEach(metric => {
      const score = metricScores[metric.id];
      if (!score) return;

      if (score >= 4) {
        insights.strengths.push({
          name: metric.name,
          category: metric.category,
          score
        });
      } else if (score <= 2) {
        insights.improvements.push({
          name: metric.name,
          category: metric.category,
          score
        });
      } else if (score === 3) {
        insights.opportunities.push({
          name: metric.name,
          category: metric.category,
          score
        });
      }
    });

    // Generate performance level
    const avgScore = Object.values(metricScores).reduce((a, b) => a + b, 0) / Object.keys(metricScores).length;

    if (avgScore >= 4.5) {
      insights.summary = '🌟 Excellent - Outstanding performance across all areas';
      insights.performanceLevel = 'excellent';
    } else if (avgScore >= 3.5) {
      insights.summary = '✅ Good - Solid performance with minor areas for improvement';
      insights.performanceLevel = 'good';
    } else if (avgScore >= 2.5) {
      insights.summary = '⚠️ Satisfactory - Mixed performance, needs focused improvement';
      insights.performanceLevel = 'satisfactory';
    } else {
      insights.summary = '🔴 Needs Improvement - Significant improvement required';
      insights.performanceLevel = 'needs_improvement';
    }

    return insights;
  }

  /**
   * Generate alerts based on performance patterns
   */
  static generateAlerts(studentPerformances, currentMetrics) {
    const alerts = [];

    if (!studentPerformances || studentPerformances.length === 0) {
      return alerts;
    }

    const recentPerformances = studentPerformances.slice(0, 5); // Last 5 days

    // Check for declining trends
    if (recentPerformances.length >= 3) {
      const scores = recentPerformances.map(p => p.average_score);
      const isDeclining = scores[0] < scores[1] && scores[1] < scores[2];

      if (isDeclining) {
        alerts.push({
          type: 'warning',
          severity: 'high',
          message: `Performance Declining: Student's scores have been dropping over the last 3 days`,
          metricType: 'trend',
          action: 'Please consider a discussion with the student'
        });
      }
    }

    // Check for consistently low scores in a metric
    currentMetrics.forEach(metric => {
      const metricScores = recentPerformances
        .map(p => p.metric_scores[metric.id])
        .filter(s => s !== undefined);

      const avgMetricScore = metricScores.reduce((a, b) => a + b, 0) / metricScores.length;

      if (avgMetricScore <= 1.5) {
        alerts.push({
          type: 'critical',
          severity: 'critical',
          message: `Critical Issue: ${metric.name} consistently low (avg: ${avgMetricScore.toFixed(1)}/5)`,
          metric: metric.name,
          metricType: 'critical_metric',
          action: 'Immediate intervention recommended'
        });
      } else if (avgMetricScore === 2) {
        alerts.push({
          type: 'warning',
          severity: 'medium',
          message: `${metric.name} needs improvement (avg: ${avgMetricScore.toFixed(1)}/5)`,
          metric: metric.name,
          metricType: 'improvement_needed',
          action: 'Support and encouragement recommended'
        });
      }
    });

    return alerts;
  }

  /**
   * Generate AI-powered narrative insights
   */
  static generateNarrativeInsight(insights, metricsData) {
    let narrative = '';

    const strengthCount = insights.strengths.length;
    const improvementCount = insights.improvements.length;

    // Build narrative
    if (strengthCount > 0) {
      const strengthNames = insights.strengths.slice(0, 3).map(s => s.name).join(', ');
      narrative += `The student demonstrates strong abilities in ${strengthNames}. `;
    }

    if (improvementCount > 0) {
      const improvementNames = insights.improvements.slice(0, 3).map(i => i.name).join(', ');
      narrative += `Focus areas for development include ${improvementNames}. `;
    }

    if (insights.opportunities.length > 0) {
      narrative += `With targeted effort on areas needing improvement, the student can achieve excellent results. `;
    }

    // Add encouragement
    if (insights.performanceLevel === 'excellent') {
      narrative += 'Continue to encourage and maintain this stellar performance!';
    } else if (insights.performanceLevel === 'good') {
      narrative += 'Keep up the good work and focus on strengthening weak areas.';
    } else if (insights.performanceLevel === 'satisfactory') {
      narrative += 'Regular support and encouragement will help improve overall performance.';
    } else {
      narrative += 'Intensive support and close monitoring are recommended.';
    }

    return narrative;
  }

  /**
   * Get performance trend analysis
   */
  static analyzeTrend(recentPerformances) {
    if (!recentPerformances || recentPerformances.length < 2) {
      return { trend: 'insufficient_data', direction: null, percentage_change: 0 };
    }

    const sortedPerf = recentPerformances.sort((a, b) => new Date(a.date) - new Date(b.date));
    const oldest = sortedPerf[0].average_score;
    const newest = sortedPerf[sortedPerf.length - 1].average_score;

    const percentChange = ((newest - oldest) / oldest) * 100;

    let trend, direction;

    if (percentChange > 10) {
      trend = 'significant_improvement';
      direction = 'up';
    } else if (percentChange > 0) {
      trend = 'slight_improvement';
      direction = 'up';
    } else if (percentChange < -10) {
      trend = 'significant_decline';
      direction = 'down';
    } else if (percentChange < 0) {
      trend = 'slight_decline';
      direction = 'down';
    } else {
      trend = 'stable';
      direction = 'stable';
    }

    return {
      trend,
      direction,
      percentage_change: percentChange.toFixed(2),
      startScore: oldest,
      endScore: newest,
      daysAnalyzed: sortedPerf.length
    };
  }

  /**
   * Determine if parent notification should be sent
   */
  static shouldNotifyParent(performanceInsights, performanceTrend) {
    const reasons = [];

    // Notify if excellent performance
    if (performanceInsights.performanceLevel === 'excellent') {
      reasons.push('excellent_performance');
    }

    // Notify if significant decline
    if (performanceTrend.trend === 'significant_decline') {
      reasons.push('performance_decline');
    }

    // Notify if critical issues
    if (performanceInsights.improvements.length > 3) {
      reasons.push('multiple_issues');
    }

    return {
      shouldNotify: reasons.length > 0,
      reasons,
      notificationType: reasons.includes('excellent_performance') ? 'positive' : 'needs_attention'
    };
  }

  /**
   * Generate parent notification content
   */
  static generateParentNotification(studentName, insights, trend, performanceDate) {
    const performanceLevel = insights.performanceLevel;
    const trendEmoji = trend.direction === 'up' ? '📈' : trend.direction === 'down' ? '📉' : '➡️';

    let title, message, icon;

    if (performanceLevel === 'excellent') {
      icon = '⭐';
      title = `Excellent Performance - ${studentName}`;
      message = `${studentName} is doing wonderfully! Their behavioral performance today reflects excellent engagement and positive conduct.`;
    } else if (performanceLevel === 'good') {
      icon = '✅';
      title = `Good Performance - ${studentName}`;
      message = `${studentName} showed good performance today. They're doing well with a few minor areas for improvement.`;
    } else if (performanceLevel === 'needs_improvement') {
      icon = '⚠️';
      title = `Performance Needs Attention - ${studentName}`;
      message = `${studentName}'s performance today shows areas that need focused attention. We recommend discussing their progress.`;
    }

    return {
      icon,
      title,
      message,
      trend: `${trendEmoji} ${trend.trend.replace(/_/g, ' ')} (${trend.percentage_change}%)`,
      strengths: insights.strengths.slice(0, 2).map(s => s.name),
      improvements: insights.improvements.map(i => i.name),
      performanceDate
    };
  }

  /**
   * Get recommendation actions based on performance
   */
  static getRecommendedActions(insights, alerts) {
    const actions = [];

    // Based on performance level
    if (insights.performanceLevel === 'excellent') {
      actions.push({
        priority: 'low',
        action: 'Recognize and celebrate achievements',
        target: 'teacher'
      });
      actions.push({
        priority: 'low',
        action: 'Consider for peer mentor role',
        target: 'teacher'
      });
    } else if (insights.performanceLevel === 'good') {
      actions.push({
        priority: 'medium',
        action: 'Encourage in strong areas',
        target: 'teacher'
      });
      actions.push({
        priority: 'medium',
        action: 'Provide support for improvement areas',
        target: 'teacher'
      });
    } else if (insights.performanceLevel === 'satisfactory') {
      actions.push({
        priority: 'high',
        action: 'Schedule one-on-one discussion',
        target: 'teacher'
      });
      actions.push({
        priority: 'high',
        action: 'Identify root causes of challenges',
        target: 'teacher'
      });
      actions.push({
        priority: 'high',
        action: 'Set clear improvement goals',
        target: 'teacher'
      });
    } else {
      actions.push({
        priority: 'critical',
        action: 'Immediate intervention meeting',
        target: 'teacher'
      });
      actions.push({
        priority: 'critical',
        action: 'Contact parent/guardian',
        target: 'teacher'
      });
      actions.push({
        priority: 'critical',
        action: 'Create support plan',
        target: 'teacher'
      });
    }

    // Based on specific alerts
    alerts.forEach(alert => {
      if (alert.severity === 'critical') {
        actions.push({
          priority: 'critical',
          action: alert.action,
          target: 'teacher',
          relatedAlert: alert.message
        });
      }
    });

    // Sort by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    actions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return actions;
  }
}

module.exports = AlertsInsightsHelper;
