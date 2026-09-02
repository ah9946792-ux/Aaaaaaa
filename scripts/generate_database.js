const fs = require('fs');
const path = require('path');

// Helper to format player object as typescript code
function playerToTs(p) {
  return `  {
    player_id: ${JSON.stringify(p.player_id)},
    name: ${JSON.stringify(p.name)},
    short_name: ${JSON.stringify(p.short_name)},
    country: ${JSON.stringify(p.country)},
    country_code: ${JSON.stringify(p.country_code)},
    age: ${p.age},
    date_of_birth: ${JSON.stringify(p.date_of_birth)},
    gender: ${JSON.stringify(p.gender || 'Male')},
    career_status: ${JSON.stringify(p.career_status)},
    category: ${JSON.stringify(p.category)},
    overall_rating: ${p.overall_rating},
    base_rating: ${p.base_rating || p.overall_rating},
    max_upgrade: 10,
    upgrade_level: 0,
    potential: ${p.potential || Math.min(90, p.overall_rating + (p.age < 25 ? 6 : p.age < 30 ? 3 : 0))},
    form: ${p.form || (p.overall_rating >= 80 ? 86 : p.overall_rating >= 72 ? 80 : 75)},
    form_status: ${JSON.stringify(p.form_status || (p.overall_rating >= 80 ? 'Excellent' : 'Good'))},
    primary_role: ${JSON.stringify(p.primary_role)},
    secondary_role: ${JSON.stringify(p.secondary_role || p.primary_role)},
    batting_style: ${JSON.stringify(p.batting_style || 'Right-hand bat')},
    bowling_style: ${JSON.stringify(p.bowling_style || 'Right-arm medium')},
    batting_attributes: ${JSON.stringify(p.batting_attributes)},
    bowling_attributes: ${JSON.stringify(p.bowling_attributes)},
    fielding_attributes: ${JSON.stringify(p.fielding_attributes)},
    ${p.wicketkeeping_attributes ? `wicketkeeping_attributes: ${JSON.stringify(p.wicketkeeping_attributes)},` : ''}
    retired: ${p.career_status === 'Retired'},
    current_team: ${JSON.stringify(p.current_team)},
    current_league: ${JSON.stringify(p.current_league)},
    market_value: ${p.market_value || Math.round(p.overall_rating * p.overall_rating * 0.55)},
    salary_expectation: ${p.salary_expectation || Math.round((p.market_value || (p.overall_rating * p.overall_rating * 0.55)) * 0.2)},
    ownership_status: 'AVAILABLE',
    owner_manager_club_id: null,
    career_statistics: ${JSON.stringify(p.career_statistics)},
    achievements: ${JSON.stringify(p.achievements || [])},
  }`;
}

function generateCountryFile(countryVarName, players) {
  return `import { GlobalCricketPlayer } from '../../types';

export const ${countryVarName}: GlobalCricketPlayer[] = [
${players.map(playerToTs).join(',\n')}
];
`;
}

// Ensure data/players exists
const outDir = path.join(__dirname, '../src/data/players');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log('Target output directory:', outDir);
