const fs = require('fs');
const path = require('path');
const { p, writeCountry } = require('./player_builder_base.cjs');

console.log('Running Master Country Builders for all 20 Countries...');

// 1. Part 1 (India, Bangladesh, Pakistan)
require('./generate_part1.cjs');

// Helper to execute any js generator file safely
function runScript(fileName) {
  const filePath = path.join(__dirname, fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf-8');
  // Strip duplicate require of player_builder_base at top
  content = content.replace(/const\s+\{\s*p\s*,\s*writeCountry\s*\}\s*=\s*require\([^)]+\);?/g, '');
  const fn = new Function('require', 'p', 'writeCountry', content);
  fn((mod) => {
    if (mod.includes('player_builder_base')) return { p, writeCountry };
    return require(mod);
  }, p, writeCountry);
  console.log(`Executed: ${fileName}`);
}

runScript('generate_australia.js');
runScript('generate_england.js');
runScript('generate_southafrica.js');
runScript('generate_westindies.js');
runScript('generate_newzealand.js');
runScript('generate_srilanka.js');
runScript('generate_afg_zim.js');
runScript('generate_ire_sco_ned.js');
runScript('generate_final_6.js');

console.log('All 20 country dataset files have been generated in src/data/players!');
