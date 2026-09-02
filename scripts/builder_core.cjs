const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../src/data/players');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function calculatePotential(age, overallRating, category) {
  if (category === 'LEGENDARY') return overallRating;
  if (age <= 22) return Math.min(95, overallRating + 8);
  if (age <= 26) return Math.min(92, overallRating + 5);
  if (age <= 30) return Math.min(90, overallRating + 3);
  return overallRating;
}

function calculateMarketValue(overallRating, category, age) {
  let baseValue = 100000;
  if (category === 'LEGENDARY') {
    baseValue = 15000000 + (overallRating - 81) * 1500000;
  } else if (category === 'SUPERSTAR') {
    baseValue = 6000000 + (overallRating - 71) * 800000;
  } else {
    baseValue = 1500000 + (overallRating - 61) * 400000;
  }
  if (age < 24) baseValue = Math.round(baseValue * 1.25);
  else if (age > 34) baseValue = Math.round(baseValue * 0.8);
  return baseValue;
}

function p(id, name, shortName, country, countryCode, age, dob, status, category, overallRating, role, playingRole, batStyle, bowlStyle, batting, bowling, fielding, wk, club, league, tValue, dValue, stats, bio) {
  const pot = calculatePotential(age, overallRating, category);
  const mVal = calculateMarketValue(overallRating, category, age);
  const form = 82 + (overallRating % 12);
  const wage = Math.round(mVal / 100);

  return {
    id,
    player_id: id,
    name,
    short_name: shortName,
    country,
    country_code: countryCode,
    nationality: country,
    age,
    date_of_birth: dob,
    player_status: status,
    category,
    overall_rating: overallRating,
    rating: overallRating,
    potential: pot,
    form,
    morale: 88,
    primary_role: role,
    role: role,
    playing_role: playingRole,
    batting_style: batStyle,
    bowling_style: bowlStyle,
    attributes: {
      batting: {
        batting_ability: batting.battingAbility,
        technique: batting.technique,
        timing: batting.timing,
        power: batting.power,
        shot_selection: batting.shotSelection,
        strike_rotation: batting.strikeRotation,
        running_between_wickets: batting.runningBetweenWickets,
      },
      bowling: {
        bowling_ability: bowling.bowlingAbility,
        pace: bowling.pace,
        accuracy: bowling.accuracy,
        swing: bowling.swing,
        seam: bowling.seam,
        spin: bowling.spin,
        variation: bowling.variation,
        control: bowling.control,
      },
      fielding: {
        fielding: fielding.fielding,
        catching: fielding.catching,
        throwing: fielding.throwing,
        ground_fielding: fielding.groundFielding,
        reaction: fielding.reaction,
      },
      wicketkeeping: wk ? {
        wicketkeeping: wk.wicketkeeping,
        catching: wk.catching,
        stumping: wk.stumping,
        reflexes: wk.reflexes,
      } : undefined,
    },
    club_team: club,
    league,
    contract_status: 'Contracted',
    contract_years_left: 3,
    transfer_market_value: tValue * 1000,
    market_value: mVal,
    wage: wage,
    dream_team_value: dValue,
    career_stats: {
      matches: stats.matches,
      runs: stats.runs,
      highest_score: stats.highestScore,
      batting_average: stats.battingAverage,
      strike_rate: stats.strikeRate,
      hundreds: stats.hundreds,
      fifties: stats.fifties,
      wickets: stats.wickets,
      bowling_average: stats.bowlingAverage,
      economy_rate: stats.economyRate,
      best_bowling: stats.bestBowling,
      catches: stats.catches,
      stumpings: stats.stumpings || 0,
    },
    player_bio: bio,
  };
}

function writeCountry(fileName, exportName, players) {
  const content = `import { GlobalCricketPlayer } from '../../types';

export const ${exportName}: GlobalCricketPlayer[] = ${JSON.stringify(players, null, 2)};
`;
  fs.writeFileSync(path.join(targetDir, fileName), content, 'utf8');
  console.log(`Wrote ${players.length} players to ${fileName}`);
}

module.exports = { p, writeCountry, targetDir };
