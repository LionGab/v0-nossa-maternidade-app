#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const requiredVars = [
  'EXPO_PUBLIC_SUPABASE_URL',
  'EXPO_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'EXPO_PUBLIC_API_URL',
];

const envFile = process.argv[2] || '.env.example';

if (!fs.existsSync(envFile)) {
  console.error(`❌ File not found: ${envFile}`);
  process.exit(1);
}

const envContent = fs.readFileSync(envFile, 'utf-8');
const envVars = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));

const missing = requiredVars.filter(varName => {
  const found = envVars.some(line => line.startsWith(varName + '='));
  return !found;
});

if (missing.length > 0) {
  console.error(`❌ Missing required variables: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('✅ All required environment variables are present');
