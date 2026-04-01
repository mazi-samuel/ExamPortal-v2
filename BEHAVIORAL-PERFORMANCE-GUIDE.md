# 📊 Student Behavioral Performance Tracking System
## Complete Implementation Guide

---

## 🎯 Overview

This comprehensive behavioral performance tracking system allows:
- **Teachers** to log daily student behavioral metrics
- **Students** to track their own progress
- **Parents** to receive daily notifications about their child's performance
- **Administrators** to analyze class-wide trends and patterns
- **System** to generate insights and alerts automatically

---

## 📦 What's Included

### 1. **Database Schema** (`sql/behavioral-performance-schema.sql`)
- `performance_metrics` - Defines all behavior categories and metrics
- `student_performance` - Stores daily performance records
- `performance_insights` - Auto-generated insights
- `parent_notifications` - Notifications sent to parents
- `performance_alerts` - Alerts for teachers
- `performance_reports` - Weekly/termly summaries

### 2. **Backend Services** 
- **`services/behavioralPerformanceService.js`** - Core business logic
- **`routes/behavioralPerformance.js`** - API endpoints
- **`utils/alertsInsightsHelper.js`** - Insights & alerts generation

### 3. **Frontend Components**
- **`teacher-performance-log.html`** - Daily performance entry form  
- **`parent-performance-dashboard.html`** - Parent view with notifications
- **`teacher-performance-analytics.html`** - Analytics & reports dashboard

### 4. **Behavioral Metrics** (Pre-configured)

#### 📚 Academic Engagement (3 metrics)
- Class Participation
- Assignment Completion
- Attention During Lessons

#### 🤝 Social Skills (3 metrics)
- Teamwork
- Respect for Others
- Communication

#### 🧠 Learning Behavior (3 metrics)
- Listening Skills
- Following Instructions
- Asking Questions

#### 🧍 Classroom Conduct (3 metrics)
- Discipline
- Punctuality
- Rule Adherence

#### 🌟 Personal Development (3 metrics)
- Leadership
- Creativity
- Initiative

---

## 🚀 Setup Instructions

### Step 1: Run Database Schema
```bash
# In Supabase SQL Editor:
# 1. Go to Supabase Dashboard → SQL Editor
# 2. Create a new query
# 3. Copy entire content of `sql/behavioral-performance-schema.sql`
# 4. Click "Run"
```

### Step 2: Verify Routes are Registered
The routes are already registered in `server.js`:
```javascript
app.use('/api/v2/behavioral', require('./routes/behavioralPerformance'));
```

### Step 3: Test the API
```bash
# Test if metrics are loading
curl http://localhost:5510/api/v2/behavioral/metrics

# Expected response:
{
  "success": true,
  "data": [
    { "id": "uuid", "name": "Class Participation", "category": "academic_engagement", ... },
    ...
  ]
}
```

### Step 4: Access the Interfaces

#### **For Teachers - Performance Entry**
- URL: `http://localhost:5510/teacher-performance-log.html`
- Features:
  - Select school, class, and student
  - Rate each metric on 1-5 scale
  - Add comments
  - Automatic score calculation
  - Real-time validation

#### **For Parents - Performance Dashboard**
- URL: `http://localhost:5510/parent-performance-dashboard.html`
- Features:
  - Daily performance summary
  - Notification center
  - Detailed metrics breakdown
  - Trends and insights

#### **For Teachers/Admin - Analytics**
- URL: `http://localhost:5510/teacher-performance-analytics.html`
- Features:
  - Class-wide analytics
  - Top performers leaderboard
  - Performance trends
  - Exportable reports

---

## 📡 API Endpoints

### Performance Recording
```
POST /api/v2/behavioral/record
Body: {
  student_id: "uuid",
  teacher_id: "uuid",
  school_id: "uuid",
  class: "grade5",
  date: "2024-03-24",
  metric_scores: {
    "metric-uuid-1": 4,
    "metric-uuid-2": 5,
    ...
  },
  teacher_comment: "Optional comment"
}
```

### Get Student Performance
```
GET /api/v2/behavioral/student/:studentId
Query: ?dateFrom=2024-01-01&dateTo=2024-03-24&schoolId=uuid
```

### Get Class Performance
```
GET /api/v2/behavioral/class/:schoolId/:classLevel/:date
Example: /api/v2/behavioral/class/school1/grade5/2024-03-24
```

### Get Metrics
```
GET /api/v2/behavioral/metrics
GET /api/v2/behavioral/metrics/grouped  (grouped by category)
```

### Parent Notifications
```
GET /api/v2/behavioral/notifications/parent/:parentId
GET /api/v2/behavioral/notifications/parent/:parentId?unreadOnly=true

PUT /api/v2/behavioral/notifications/:notificationId/read

POST /api/v2/behavioral/notifications/daily-summary/:studentId/:date
```

### Analytics & Reports
```
GET /api/v2/behavioral/trends/:studentId/:schoolId?days=30
GET /api/v2/behavioral/class-summary/:schoolId/:classLevel/:date
POST /api/v2/behavioral/report/weekly/:studentId/:schoolId/:weekStartDate
```

---

## 🧪 Testing the System

### Test Scenario 1: Record Daily Performance
```javascript
// In browser console or API client (Postman):
const response = await fetch('/api/v2/behavioral/record', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_AUTH_TOKEN'
  },
  body: JSON.stringify({
    student_id: '550e8400-e29b-41d4-a716-446655440000',
    teacher_id: '550e8400-e29b-41d4-a716-446655440001',
    school_id: '550e8400-e29b-41d4-a716-446655440002',
    class: 'grade5',
    date: '2024-03-24',
    metric_scores: {
      // Get metric IDs from GET /api/v2/behavioral/metrics
      'metric-id-1': 4,
      'metric-id-2': 5,
      'metric-id-3': 3
    },
    teacher_comment: 'Great participation today!'
  })
});

const result = await response.json();
console.log(result);
```

### Test Scenario 2: Send Daily Summary to Parent
```javascript
const response = await fetch(
  '/api/v2/behavioral/notifications/daily-summary/student-uuid/2024-03-24',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_AUTH_TOKEN'
    }
  }
);
```

### Test Scenario 3: Get Performance Trends
```javascript
const response = await fetch(
  '/api/v2/behavioral/trends/student-uuid/school-uuid?days=30'
);
const trends = await response.json();
```

---

## 🔧 Customization Guide

### Adding New Metrics
```javascript
// In SQL:
INSERT INTO performance_metrics (name, category, description, display_order)
VALUES ('New Metric', 'academic_engagement', 'Description', 16);
```

### Customizing Rating Scale
Currently using 1-5 scale. To change:

**Option 1: Use 10-point scale**
```javascript
// In teacher-performance-log.html, change line:
${[1, 2, 3, 4, 5].map(score => ...)}
// To:
${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => ...)}
```

**Option 2: Use emoji scale (non-numeric)**
```javascript
const emojiScale = {
  1: '😢',
  2: '😟', 
  3: '😐',
  4: '🙂',
  5: '😊'
};
```

### Changing Alert Thresholds
In `services/behavioralPerformanceService.js`, modify the `checkAndCreateAlerts()` method:

```javascript
if (score <= 1) {  // Change 1 to 0.5, etc.
  // Critical alert
}
```

---

## 📧 Email/SMS Integration

### For SMS Notifications (Twilio)
```javascript
// In behavioralPerformanceService.js, update sendNotificationToParent():

const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async sendNotificationToParent(phoneNumber, notification) {
  await client.messages.create({
    body: notification.message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber
  });
}
```

### For Email Notifications (Nodemailer)
```javascript
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({ ... });

async sendEmailNotification(parentEmail, notification) {
  await transporter.sendMail({
    to: parentEmail,
    subject: notification.title,
    html: notification.message
  });
}
```

---

## 📊 Data Analysis Examples

### Calculate Class Statistics
```javascript
const performances = await behavioralService.getClassPerformance(
  schoolId, classLevel, date
);

const averageScore = performances.reduce((sum, p) => sum + p.average_score, 0) / performances.length;
const topPerformer = Math.max(...performances.map(p => p.average_score));
const lowestPerformer = Math.min(...performances.map(p => p.average_score));
```

### Identify Trends
```javascript
const trends = await behavioralService.getPerformanceTrends(studentId, schoolId, 30);

const isImproving = trends[0].average_score > trends[trends.length-1].average_score;
const trend = isImproving ? 'Improving' : 'Declining';
```

---

## 🚨 Alerts Configuration

### Alert Types
- **Critical**: Score ≤ 1 on any metric
- **Warning**: Score = 2 on any metric  
- **Performance Decline**: Declining trend over 3+ days
- **Achievement**: Score ≥ 4.5 on all metrics

### Auto-Generated Alerts (in service)
```javascript
// Critical alerts sent when:
- Single metric drops to 1
- Multiple metrics consistently low
- Significant performance decline detected

// Parent notifications sent when:
- Excellent performance
- Critical decline
- Multiple issues identified
```

---

## 📱 Mobile Responsiveness

All interfaces are mobile-responsive. Test on:
- Desktop (1200px+)
- Tablet (768px - 1200px)  
- Mobile (< 768px)

Responsive breakpoints are already configured in CSS.

---

## 🔐 Security Considerations

1. **Authentication**
   - All routes require `authenticateToken` middleware
   - Ensure tokens include user role (teacher, parent, student)

2. **Authorization**
   - Parents can only view their own child's data
   - Teachers can only view their assigned class data
   - Admins have full access

3. **Data Validation**
   - Input validation on all routes
   - Metric scores must be 1-5
   - Dates must be valid ISO format

### Add Role-Based Access Control
```javascript
// In routes/behavioralPerformance.js:
router.get('/student/:studentId', async (req, res) => {
  // Check if user is parent of student or teacher of class
  const userRole = req.user.role;
  const studentUserId = req.user.student_id;
  
  if (userRole === 'parent' && studentUserId !== req.params.studentId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
});
```

---

## 🐛 Troubleshooting

### Issue: Metrics Not Loading
**Solution:**
```sql
-- Check if metrics exist:
SELECT * FROM performance_metrics;

-- If empty, re-run schema file:
-- Copy INSERT statements from behavioral-performance-schema.sql
```

### Issue: Notifications Not Sending
**Check:**
1. Parent profile has phone number: `SELECT parent_phone FROM profiles WHERE id = 'uuid'`
2. SMS provider (Twilio) credentials are set in `.env`
3. Check server logs for errors

### Issue: Performance Data Not Appearing
**Debug:**
```javascript
// Check if data was inserted:
const perf = await db.from('student_performance').select('*');
console.log(perf);

// Verify metric_scores format (must be JSON):
// { "metric-uuid-1": 4, "metric-uuid-2": 5, ... }
```

### Issue: API Returns 401 Unauthorized
**Solution:**
- Ensure auth token is included in request headers
- Check token has not expired
- Verify `Authorization: Bearer <token>` format

---

## 📈 Performance Optimization

### Indexing
Indexes are automatically created by the schema file. No additional setup needed.

### Query Optimization
For large datasets, use filters:
```javascript
// Instead of:
const all = await db.from('student_performance').select('*');

// Use:
const filtered = await db
  .from('student_performance')
  .select('*')
  .eq('school_id', schoolId)
  .gte('date', fromDate)
  .order('date', { ascending: false })
  .limit(100);
```

### Caching
Implement client-side caching for notifications:
```javascript
// Cache notifications for 30 seconds
const notificationCache = {};
const cacheExpiry = 30000;

async function getNotificationsWithCache(parentId) {
  const cached = notificationCache[parentId];
  if (cached && Date.now() - cached.timestamp < cacheExpiry) {
    return cached.data;
  }
  
  const data = await fetch(`/api/v2/behavioral/notifications/parent/${parentId}`);
  notificationCache[parentId] = { data, timestamp: Date.now() };
  return data;
}
```

---

## 🎓 Use Cases & Workflows

### Morning Teacher Workflow
1. Open: `teacher-performance-log.html`
2. Select class and date
3. Rate each student as they observe throughout the day
4. Add brief comments
5. System automatically calculates scores and sends parent notifications

### Parent Evening Routine
1. Check: `parent-performance-dashboard.html`
2. View daily performance card
3. Read teacher comments
4. Review metrics breakdown
5. Receive notifications if anything needs attention

### Weekly Administrative Review
1. Open: `teacher-performance-analytics.html`
2. Filter by class and date range
3. Review trends and identify students needing support
4. Generate reports for parent-teacher conferences

---

## 📚 Additional Resources

- **Chart.js Documentation**: https://www.chartjs.org/
- **Supabase JS Client**: https://supabase.com/docs/reference/javascript
- **Express.js Routing**: https://expressjs.com/en/guide/routing.html
- **Responsive Design**: https://web.dev/responsive-web-design-basics/

---

## 🎉 You're All Set!

Your student behavioral performance tracking system is ready to use. Start by:

1. ✅ Running the database schema
2. ✅ Testing the API endpoints
3. ✅ Having teachers log performance
4. ✅ Monitoring parent notifications
5. ✅ Reviewing analytics and trends

For issues or improvements, check the troubleshooting section or expand the code based on your needs!

---

**Last Updated:** March 24, 2024  
**Version:** 1.0.0
