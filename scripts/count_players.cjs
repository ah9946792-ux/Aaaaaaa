const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/data/players');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

console.log(`Found ${files.length} country files in ${dir}:`);
let total = 0;
for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf-8');
  // Match player_id occurrences
  const matches = content.match(/"?player_id"?\s*:\s*['"][^'"]+['"]/g) || [];
  console.log(`- ${file}: ${matches.length} players`);
  total += matches.length;
}
console.log(`TOTAL PLAYERS ACROSS ALL COUNTRIES: ${total}`);
