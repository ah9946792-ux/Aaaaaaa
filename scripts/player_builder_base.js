const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../src/data/players');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function p(id, name, shortName, country, code, age, dob, status, cat, rating, role, subRole, batStyle, bowlStyle, batStats, bowlStats, fldStats, wkStats, team, league, val, sal, stats, achieve) {
  return {
    player_id: id,
    name: name,
    short_name: shortName,
    country: country,
    country_code: code,
    age: age,
    date_of_birth: dob,
    gender: 'Male',
    career_status: status,
    category: cat,
    overall_rating: rating,
    base_rating: rating,
    max_upgrade: 10,
    upgrade_level: 0,
    potential: Math.min(92, rating + (age < 24 ? 6 : age < 29 ? 3 : 0)),
    form: rating >= 80 ? 86 : rating >= 72 ? 82 : 76,
    form_status: rating >= 80 ? 'Excellent' : 'Good',
    primary_role: role,
    secondary_role: subRole || role,
    batting_style: batStyle || 'Right-hand bat',
    bowling_style: bowlStyle || 'Right-arm medium',
    batting_attributes: batStats,
    bowling_attributes: bowlStats,
    fielding_attributes: fldStats,
    ...(wkStats ? { wicketkeeping_attributes: wkStats } : {}),
    retired: status === 'Retired',
    current_team: team,
    current_league: league,
    market_value: val,
    salary_expectation: sal,
    ownership_status: 'AVAILABLE',
    owner_manager_club_id: null,
    career_statistics: stats,
    achievements: achieve || []
  };
}

function writeCountry(fileName, varName, playerList) {
  const fileContent = `import { GlobalCricketPlayer } from '../../types';

export const ${varName}: GlobalCricketPlayer[] = ${JSON.stringify(playerList, null, 2)};
`;
  fs.writeFileSync(path.join(outDir, fileName), fileContent, 'utf-8');
  console.log(`Wrote ${fileName} with ${playerList.length} players.`);
}

module.exports = { p, writeCountry, outDir };
