const fs = require('fs');
const path = require('path');
const { p, writeCountry } = require('./player_builder_base.cjs');

// Run Australia
const ausContent = fs.readFileSync(path.join(__dirname, 'generate_australia.js'), 'utf-8');
const ausModule = {};
const ausFunc = new Function('require', 'p', 'writeCountry', ausContent);
ausFunc((mod) => require(path.join(__dirname, mod.endsWith('.cjs') ? mod : mod + '.cjs')), p, writeCountry);

// Run England
const engContent = fs.readFileSync(path.join(__dirname, 'generate_england.js'), 'utf-8');
const engFunc = new Function('require', 'p', 'writeCountry', engContent);
engFunc((mod) => require(path.join(__dirname, mod.endsWith('.cjs') ? mod : mod + '.cjs')), p, writeCountry);

console.log('Australia and England generated successfully.');
