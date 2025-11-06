#!/usr/bin/env node

const https = require('https');

const SENTRY_ORG = process.env.SENTRY_ORG;
const SENTRY_PROJECT = process.env.SENTRY_PROJECT;
const SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN;

if (!SENTRY_ORG || !SENTRY_PROJECT || !SENTRY_AUTH_TOKEN) {
  console.error('❌ Missing Sentry configuration');
  console.error('Required: SENTRY_ORG, SENTRY_PROJECT, SENTRY_AUTH_TOKEN');
  process.exit(1);
}

const CRITICAL_LEVELS = ['fatal', 'error'];
const THRESHOLD_COUNT = 10; // Número de erros para considerar crítico
const TIME_WINDOW = 15; // minutos

const options = {
  hostname: 'sentry.io',
  path: `/api/0/projects/${SENTRY_ORG}/${SENTRY_PROJECT}/issues/?statsPeriod=15m&query=level:${CRITICAL_LEVELS.join(' level:')}`,
  headers: {
    'Authorization': `Bearer ${SENTRY_AUTH_TOKEN}`,
    'Content-Type': 'application/json'
  }
};

https.get(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const issues = JSON.parse(data);
      const criticalIssues = issues.filter(issue => {
        const count = issue.count || 0;
        return count >= THRESHOLD_COUNT;
      });

      if (criticalIssues.length > 0) {
        console.error(`❌ Found ${criticalIssues.length} critical issues:`);
        criticalIssues.forEach(issue => {
          console.error(`  - ${issue.title}: ${issue.count} occurrences`);
        });
        process.exit(1);
      } else {
        console.log('✅ No critical errors detected');
      }
    } catch (error) {
      console.error('Error parsing Sentry response:', error);
      process.exit(1);
    }
  });
}).on('error', (error) => {
  console.error('Error checking Sentry:', error);
  process.exit(1);
});
