const fs = require('fs');
const path = require('path');
const { p, writeCountry, outDir } = require('./player_builder_base.cjs');

// Run Bangladesh and India
require('./generate_complete_master_database.cjs');
require('./build_nations_1_to_5.cjs');

// Run the other generator scripts
function runScript(fileName) {
  const filePath = path.join(__dirname, fileName);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(/const\s+\{\s*p\s*,\s*writeCountry\s*\}\s*=\s*require\([^)]+\);?/g, '');
  const fn = new Function('require', 'p', 'writeCountry', content);
  fn((mod) => {
    if (mod.includes('player_builder_base')) return { p, writeCountry };
    return require(mod);
  }, p, writeCountry);
}

runScript('generate_pakistan.js');
runScript('generate_australia.js');
runScript('generate_england.js');
runScript('generate_southafrica.js');
runScript('generate_westindies.js');
runScript('generate_newzealand.js');
runScript('generate_srilanka.js');
runScript('generate_afg_zim.js');
runScript('generate_ire_sco_ned.js');
runScript('generate_final_6.js');

// Now let's inspect all files in src/data/players and ensure each has >= 32 players!
console.log('Inspecting created files in src/data/players...');
