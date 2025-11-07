#!/usr/bin/env node

// Script to update dependencies to versions compatible with Node.js 20.x
const fs = require('fs');
const path = require('path');

// Path to package.json
const packagePath = path.join(__dirname, '..', 'package.json');
const packageLockPath = path.join(__dirname, '..', 'package-lock.json');

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Update dependencies to versions known to work with Node.js 20.x
const updatedDependencies = {
  ...packageJson.dependencies,
  "jsonwebtoken": "^9.0.3",
  "jwa": "^2.0.1",  // Update jwa to a version compatible with newer Node.js
  "buffer-equal-constant-time": "^1.0.1"
};

// Update package.json
packageJson.dependencies = updatedDependencies;

// Write updated package.json
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');

console.log('Updated package.json with compatible dependency versions');

// Note: In a real scenario, you would also want to delete package-lock.json
// and node_modules, then run npm install to regenerate them with compatible versions.
// However, for deployment purposes, we're just updating the package.json here.