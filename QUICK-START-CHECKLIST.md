# 🚀 Quick Start Checklist - Behavioral Performance System

## Phase 1: Database Setup (10 minutes)
- [ ] Open Supabase Dashboard
- [ ] Navigate to SQL Editor
- [ ] Create a new query
- [ ] Copy entire content from `sql/behavioral-performance-schema.sql`
- [ ] Click "Run" to execute the schema
- [ ] Verify all tables are created:
  ```sql
  SELECT * FROM performance_metrics;  -- Should show 15 default metrics
  ```

## Phase 2: API Verification (5 minutes)
- [ ] Restart your Node.js server (if running)
  ```bash
  npm start
  # or
  node server.js
  ```
- [ ] Test metrics endpoint:
  ```bash
  curl http://localhost:5510/api/v2/behavioral/metrics
  ```
- [ ] Verify response contains metrics array with 15 items

## Phase 3: Teacher Setup (Next Day)
- [ ] Navigate to: `http://localhost:5510/teacher-performance-log.html`
- [ ] Verify the form loads correctly
- [ ] Test with a sample entry:
  - Select a school
  - Select a class
  - Select a student
  - Rate each metric (1-5)
  - Add a comment
  - Click "Save Performance"

## Phase 4: Parent Dashboard (Once Data Exists)
- [ ] Navigate to: `http://localhost:5510/parent-performance-dashboard.html`
- [ ] Log in as parent user (ensure userId and studentId in localStorage)
- [ ] Verify you see:
  - Daily performance card
  - Score percentage
  - Metrics breakdown
  - Performance bars

## Phase 5: Teacher Analytics (Week 1)
- [ ] Navigate to: `http://localhost:5510/teacher-performance-analytics.html`
- [ ] Set filters:
  - School
  - Class
  - Date range
- [ ] Click "Load Data"
- [ ] Verify you see:
  - Class overview stats
  - Top performers section
  - Needs improvement section
  - Analytics charts

## Phase 6: Notifications (Optional - Advanced)
- [ ] Test manual notification trigger:
  ```javascript
  // In browser console:
  fetch('/api/v2/behavioral/notifications/daily-summary/STUDENT_UUID/2024-03-24', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
  }).then(r => r.json()).then(console.log);
  ```
- [ ] Verify notification appears in parent dashboard

## Phase 7: Daily Usage (Ongoing)
- [ ] Each afternoon, teacher logs in to performance form
- [ ] Selects class and rates each metric
- [ ] System auto-calculates scores
- [ ] Parents see notifications in dashboard
- [ ] Teacher reviews analytics weekly

---

## 📋 File Checklist

Verify all new files exist in your workspace:

### Database
- [ ] `sql/behavioral-performance-schema.sql`

### Backend
- [ ] `services/behavioralPerformanceService.js`
- [ ] `routes/behavioralPerformance.js`
- [ ] `utils/alertsInsightsHelper.js`

### Frontend
- [ ] `teacher-performance-log.html`
- [ ] `parent-performance-dashboard.html`
- [ ] `teacher-performance-analytics.html`

### Documentation
- [ ] `BEHAVIORAL-PERFORMANCE-GUIDE.md`
- [ ] `IMPLEMENTATION-SUMMARY.md`
- [ ] `QUICK-START-CHECKLIST.md` (this file)

### Updated Files
- [ ] `server.js` (check line with `/api/v2/behavioral`)

---

## 🧪 Test Data (Optional)

If you want to test with sample data:

```javascript
// Add this to your database (or use SQL directly):
INSERT INTO student_performance (
  student_id, teacher_id, school_id, class, date, 
  metric_scores, overall_score, average_score, teacher_comment
) VALUES (
  'REPLACE_WITH_STUDENT_UUID',
  'REPLACE_WITH_TEACHER_UUID',
  'REPLACE_WITH_SCHOOL_UUID',
  'grade5',
  '2024-03-24',
  '{"metric1": 4, "metric2": 5, "metric3": 3, "metric4": 4, "metric5": 5, "metric6": 3, "metric7": 4, "metric8": 5, "metric9": 4, "metric10": 3, "metric11": 4, "metric12": 5, "metric13": 4, "metric14": 5, "metric15": 4}',
  62,
  4.1,
  'Great participation and excellent teamwork!'
);
```

---

## 🔧 Customization Checklist

If you want to customize the system:

### Rename Metrics
- [ ] Go to Supabase → performance_metrics table
- [ ] Edit metric names directly
- [ ] Teachers will see new names on form

### Change Rating Scale (1-5 to something else)
- [ ] Edit `teacher-performance-log.html` line with `[1, 2, 3, 4, 5]`
- [ ] Update all Score/5 references

### Add New Metric Category
- [ ] Add new category to `performance_metrics` table
- [ ] Create new `<div>` section in teacher form
- [ ] Update CSS styling for new category

### Adjust Alert Thresholds
- [ ] Edit `services/behavioralPerformanceService.js`
- [ ] Find `checkAndCreateAlerts()` method
- [ ] Change score comparison values (if (score <= 1), etc.)

---

## 🐛 Troubleshooting Quick Tips

### Problem: Metrics not loading
```
Solution: Run SQL query to check:
SELECT COUNT(*) FROM performance_metrics;
Should return 15
```

### Problem: Form won't save performance
```
Solution: Check browser console for errors
Verify all required fields are filled:
- Student ID must be selected
- All metrics should have ratings
- Date should be valid
```

### Problem: Parent dashboard shows no data
```
Solution: Ensure:
1. Parent is logged in (userId in localStorage)
2. Student has performance records (check database)
3. Performance date is recent (check filter)
```

### Problem: Analytics page loads but shows no charts
```
Solution:
1. Verify Chart.js is loaded (check HTML script tags)
2. Check that class has performance data
3. Make sure date range includes data dates
```

---

## 📞 Support Resources

For detailed help, refer to:
- `BEHAVIORAL-PERFORMANCE-GUIDE.md` - Full 400+ line guide
- `IMPLEMENTATION-SUMMARY.md` - Current state overview

---

## 🎯 Success Metrics

After first week, you should see:

✅ Daily performance logs (minimum 5 entries)  
✅ Parent notifications appearing in dashboard  
✅ Analytics showing class averages  
✅ No errors in server console logs  
✅ Mobile forms working on phones/tablets  

---

## 📅 Recommended Timeline

**Week 1:**
- Monday: Database setup + verification
- Tuesday: Train teachers on form
- Wednesday-Friday: Teachers start logging

**Week 2:**
- Send parents link to dashboard
- Parents start reviewing data
- Gather feedback

**Week 3:**
- Review analytics
- Identify patterns
- Plan interventions

**Week 4+:**
- Sustained daily logging
- Regular parent notifications
- Weekly analytics reviews

---

## ✅ Ready to Launch!

Once you've completed all checkboxes above, you're ready to deploy the behavioral tracking system to your school. 

**Start with Phase 1 (Database Setup) and work through each phase sequentially.**

Good luck! 🚀

---

**Status:** Ready to Deploy  
**Last Updated:** March 24, 2024  
**Questions?** Check BEHAVIORAL-PERFORMANCE-GUIDE.md for troubleshooting
