#!/usr/bin/env ts-node
/**
 * Configuration Checker
 * Run this script to verify your .env configuration
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('🔍 Checking FinXpert Configuration...\n');

let allGood = true;

// Check Database
console.log('📊 Database Configuration:');
if (process.env.DATABASE_URL) {
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1')) {
    console.log('  ✅ DATABASE_URL is set (local)');
  } else {
    console.log('  ✅ DATABASE_URL is set (remote)');
  }
} else {
  console.log('  ❌ DATABASE_URL is missing');
  allGood = false;
}

// Check JWT
console.log('\n🔐 JWT Configuration:');
if (process.env.JWT_SECRET) {
  if (process.env.JWT_SECRET.includes('your-super-secret') || process.env.JWT_SECRET.length < 20) {
    console.log('  ⚠️  JWT_SECRET is set but appears to be a placeholder');
    console.log('     Please change it to a secure random string');
  } else {
    console.log('  ✅ JWT_SECRET is set');
  }
} else {
  console.log('  ❌ JWT_SECRET is missing');
  allGood = false;
}

// Check Cloudinary
console.log('\n☁️  Cloudinary Configuration:');
const cloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (cloudinaryConfigured) {
  const isPlaceholder =
    process.env.CLOUDINARY_CLOUD_NAME?.includes('your-cloud-name') ||
    process.env.CLOUDINARY_API_KEY?.includes('your-api-key');

  if (isPlaceholder) {
    console.log('  ⚠️  Cloudinary credentials are set but appear to be placeholders');
    console.log('     Document uploads will fail. Please configure real credentials.');
  } else {
    console.log('  ✅ Cloudinary is fully configured');
    console.log(`     Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  }
} else {
  console.log('  ❌ Cloudinary is not configured');
  console.log('     Document uploads will not work.');
  console.log('     Get credentials from: https://cloudinary.com');
  allGood = false;
}

// Check BSE Star Broker
console.log('\n📈 BSE Star Broker Configuration:');
const bseStarConfigured =
  process.env.BSE_STAR_API_KEY && process.env.BSE_STAR_API_SECRET;

if (bseStarConfigured) {
  const isPlaceholder =
    process.env.BSE_STAR_API_KEY?.includes('your-api-key') ||
    process.env.BSE_STAR_API_SECRET?.includes('your-api-secret');

  if (isPlaceholder) {
    console.log('  ⚠️  BSE Star credentials are set but appear to be placeholders');
    console.log('     Will use Mock broker instead.');
  } else {
    console.log('  ✅ BSE Star broker is configured');
    console.log('     Real broker will be used for orders.');
  }
} else {
  console.log('  ℹ️  BSE Star broker not configured (using Mock broker)');
  console.log('     This is fine for development/testing.');
}

// Check Frontend URL
console.log('\n🌐 Frontend Configuration:');
if (process.env.FRONTEND_URL) {
  console.log(`  ✅ FRONTEND_URL: ${process.env.FRONTEND_URL}`);
} else {
  console.log('  ⚠️  FRONTEND_URL not set (defaults to http://localhost:3000)');
}

// Summary
console.log('\n' + '='.repeat(50));
if (allGood && cloudinaryConfigured) {
  console.log('✅ All required configurations are set!');
  console.log('   You can start the backend server.');
} else {
  console.log('⚠️  Some configurations are missing or incomplete.');
  console.log('   Please review the warnings above.');
  console.log('\n   See SETUP_GUIDE.md for detailed instructions.');
}
console.log('='.repeat(50));
