// =============================================
// Centralized Configuration
// =============================================
require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT, 10) || 5510,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Supabase (server-side service-role key for backend operations)
  supabase: {
    url: process.env.SUPABASE_URL || 'https://znqavwjsrdblhfswktxw.supabase.co',
    serviceKey: process.env.SUPABASE_SERVICE_KEY || '',
    anonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpucWF2d2pzcmRibGhmc3drdHh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5NjEyOTYsImV4cCI6MjA4NjUzNzI5Nn0.jWj6FotryDM0CJqK2WK6bGPBPbAndyJbiCH7NH5Pxx8'
  },

  // JWT secret for server-side token verification
  jwtSecret: process.env.JWT_SECRET || 'super-secret-change-me',

  // File upload limits
  upload: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedMimeTypes: [
      'image/png', 'image/jpeg', 'image/webp', 'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'audio/mpeg', 'audio/wav', 'audio/ogg',
      'video/mp4', 'video/webm',
      'text/csv', 'text/plain'
    ]
  },

  // Grading thresholds (configurable per school, defaults here)
  grading: {
    defaultScale: [
      { min: 90, max: 100, letter: 'A+', remark: 'Outstanding', gpa: 4.0 },
      { min: 80, max: 89,  letter: 'A',  remark: 'Excellent',   gpa: 3.7 },
      { min: 70, max: 79,  letter: 'B',  remark: 'Very Good',   gpa: 3.3 },
      { min: 60, max: 69,  letter: 'C',  remark: 'Good',        gpa: 2.7 },
      { min: 50, max: 59,  letter: 'D',  remark: 'Fair',        gpa: 2.0 },
      { min: 0,  max: 49,  letter: 'F',  remark: 'Needs Improvement', gpa: 0.0 }
    ]
  },

  // Continuous Assessment default weights
  caWeights: {
    test: 20,
    assignment: 10,
    project: 10,
    exam: 60
  },

  // Term configuration
  terms: ['first', 'second', 'third'],

  // Notification channels
  notifications: {
    email: {
      enabled: !!process.env.EMAIL_API_KEY,
      provider: process.env.EMAIL_PROVIDER || 'sendgrid',
      apiKey: process.env.EMAIL_API_KEY || '',
      fromEmail: process.env.EMAIL_FROM || 'noreply@examportal.local'
    },
    sms: {
      enabled: !!process.env.SMS_API_KEY,
      provider: process.env.SMS_PROVIDER || 'twilio',
      apiKey: process.env.SMS_API_KEY || '',
      fromNumber: process.env.SMS_FROM || ''
    },
    push: {
      enabled: !!process.env.VAPID_PUBLIC_KEY,
      vapidPublic: process.env.VAPID_PUBLIC_KEY || '',
      vapidPrivate: process.env.VAPID_PRIVATE_KEY || ''
    }
  }
};

module.exports = config;
