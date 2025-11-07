#!/usr/bin/env node

// Test script to verify buffer compatibility fix
console.log('Testing buffer compatibility...');

try {
  // Test Buffer availability
  if (typeof Buffer === 'undefined') {
    console.error('❌ Buffer is not defined');
    process.exit(1);
  }
  
  console.log('✅ Buffer is available');
  
  // Test Buffer methods
  const testBuffer = Buffer.from('test');
  if (!(testBuffer instanceof Buffer)) {
    console.error('❌ Buffer instance check failed');
    process.exit(1);
  }
  
  console.log('✅ Buffer instance check passed');
  
  // Test buffer-equal-constant-time indirectly
  try {
    require('buffer-equal-constant-time');
    console.log('✅ buffer-equal-constant-time loaded successfully');
  } catch (e) {
    console.error('❌ buffer-equal-constant-time failed to load:', e.message);
    process.exit(1);
  }
  
  // Test jsonwebtoken which depends on buffer-equal-constant-time
  try {
    require('jsonwebtoken');
    console.log('✅ jsonwebtoken loaded successfully');
  } catch (e) {
    console.error('❌ jsonwebtoken failed to load:', e.message);
    process.exit(1);
  }
  
  console.log('✅ All buffer compatibility tests passed');
  process.exit(0);
  
} catch (error) {
  console.error('❌ Buffer compatibility test failed:', error.message);
  process.exit(1);
}