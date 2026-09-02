const fs = require('fs');
const path = require('path');
const { p, writeCountry } = require('./player_builder_base.cjs');

// Helper to append/ensure full roster
function updateCountryRoster(fileName, varName, existingList, additionalList) {
  const map = new Map();
  for (const item of existingList) {
    map.set(item.player_id, item);
  }
  for (const item of additionalList) {
    if (!map.has(item.player_id)) {
      map.set(item.player_id, item);
    }
  }
  const combined = Array.from(map.values());
  writeCountry(fileName, varName, combined);
  console.log(`Updated ${fileName} -> Total: ${combined.length} players.`);
  return combined;
}

// 4. AUSTRALIA (AUS) - additions to 35
const AUS_EXTRA = [
  p('aus_allan_border', 'Allan Border', 'A. Border', 'Australia', 'AUS', 68, '1955-07-27', 'Retired', 'LEGENDARY', 88, 'Batter', 'Middle-Order Gritty Captain', 'Left-hand bat', 'Slow left-arm orthodox',
    { battingAbility: 92, technique: 94, timing: 88, power: 80, shotSelection: 94, strikeRotation: 88, runningBetweenWickets: 88 },
    { bowlingAbility: 65, pace: 45, accuracy: 75, swing: 15, seam: 15, spin: 75, variation: 70, control: 75 },
    { fielding: 90, catching: 92, throwing: 90, groundFielding: 88, reaction: 90 }, null,
    'Queensland (Legend)', 'Sheffield Shield', 4000, 800,
    { matches: 429, runs: 17698, highestScore: 205, battingAverage: 41.5, strikeRate: 65.0, hundreds: 30, fifties: 102, wickets: 112, bowlingAverage: 35.0, economyRate: 4.2, bestBowling: '7/46', catches: 283, stumpings: 0 },
    ['1987 World Cup Winning Captain', 'First Man to 11,000 Test Runs', 'Captained Australia in 93 consecutive Tests']),

  p('aus_matthew_hayden', 'Matthew Hayden', 'M. Hayden', 'Australia', 'AUS', 52, '1971-10-29', 'Retired', 'LEGENDARY', 88, 'Batter', 'Dominant Opening Batter', 'Left-hand bat', 'Right-arm medium',
    { battingAbility: 94, technique: 90, timing: 94, power: 99, shotSelection: 90, strikeRotation: 86, runningBetweenWickets: 86 },
    { bowlingAbility: 15, pace: 25, accuracy: 20, swing: 15, seam: 15, spin: 20, variation: 15, control: 20 },
    { fielding: 92, catching: 96, throwing: 90, groundFielding: 88, reaction: 92 }, null,
    'Chennai Super Kings (Legend)', 'Indian Premier League', 4200, 840,
    { matches: 273, runs: 15066, highestScore: 380, battingAverage: 47.5, strikeRate: 80.0, hundreds: 40, fifties: 65, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 196, stumpings: 0 },
    ['380 vs Zimbabwe (Former Test World Record)', '2-Time World Cup Winner (2003, 2007)', 'Mongoose Bat Innovator in IPL']),

  p('aus_michael_hussey', 'Michael Hussey', 'M. Hussey (Mr. Cricket)', 'Australia', 'AUS', 49, '1975-05-27', 'Retired', 'LEGENDARY', 87, 'Batter', 'Middle-Order Master Finisher', 'Left-hand bat', 'Right-arm medium',
    { battingAbility: 92, technique: 94, timing: 92, power: 86, shotSelection: 94, strikeRotation: 94, runningBetweenWickets: 96 },
    { bowlingAbility: 40, pace: 45, accuracy: 50, swing: 30, seam: 30, spin: 30, variation: 30, control: 40 },
    { fielding: 92, catching: 94, throwing: 92, groundFielding: 92, reaction: 94 }, null,
    'Chennai Super Kings (Batting Coach)', 'Indian Premier League', 3900, 780,
    { matches: 302, runs: 12398, highestScore: 195, battingAverage: 49.0, strikeRate: 85.0, hundreds: 22, fifties: 72, wickets: 9, bowlingAverage: 40.0, economyRate: 4.8, bestBowling: '1/0', catches: 190, stumpings: 0 },
    ['"Mr. Cricket" — Test Average 51.52 & ODI Average 48.15', 'Miracle 60* off 24 balls vs Pakistan in 2010 T20 WC Semi-Final', '2007 World Cup Winner']),

  p('aus_mitchell_johnson', 'Mitchell Johnson', 'M. Johnson', 'Australia', 'AUS', 42, '1981-11-02', 'Retired', 'LEGENDARY', 88, 'Bowler', 'Express Left-Arm Thunderbolts', 'Left-hand bat', 'Left-arm fast',
    { battingAbility: 65, technique: 58, timing: 65, power: 90, shotSelection: 58, strikeRotation: 58, runningBetweenWickets: 75 },
    { bowlingAbility: 95, pace: 99, accuracy: 88, swing: 92, seam: 94, spin: 10, variation: 88, control: 88 },
    { fielding: 88, catching: 90, throwing: 96, groundFielding: 88, reaction: 90 }, null,
    'Mumbai Indians (IPL Champion)', 'Indian Premier League', 4200, 840,
    { matches: 256, runs: 3000, highestScore: 123, battingAverage: 20.0, strikeRate: 88.0, hundreds: 1, fifties: 13, wickets: 590, bowlingAverage: 26.5, economyRate: 3.8, bestBowling: '8/61', catches: 75, stumpings: 0 },
    ['Terrifying 37 wickets in 2013-14 Ashes Series Whitewash (5-0)', '2015 ICC World Cup Champion', 'ICC Cricketer of the Year (2009 & 2014)']),

  p('aus_jason_gillespie', 'Jason Gillespie', 'J. Gillespie (Dizzy)', 'Australia', 'AUS', 49, '1975-04-19', 'Retired', 'LEGENDARY', 86, 'Bowler', 'Fast-Medium Seam Master', 'Right-hand bat', 'Right-arm fast-medium',
    { battingAbility: 55, technique: 65, timing: 55, power: 60, shotSelection: 68, strikeRotation: 55, runningBetweenWickets: 65 },
    { bowlingAbility: 92, pace: 88, accuracy: 96, swing: 90, seam: 96, spin: 10, variation: 86, control: 96 },
    { fielding: 86, catching: 90, throwing: 88, groundFielding: 86, reaction: 88 }, null,
    'South Australia (Legend)', 'Sheffield Shield', 3600, 720,
    { matches: 168, runs: 1500, highestScore: 201, battingAverage: 18.0, strikeRate: 50.0, hundreds: 1, fifties: 2, wickets: 401, bowlingAverage: 26.0, economyRate: 3.0, bestBowling: '7/37', catches: 45, stumpings: 0 },
    ['Unbeaten 201* vs Bangladesh in Chattogram (Only Nightwatchman Double Century in Test History)', '259 Test Wickets in Golden Era', '2003 World Cup Winner']),

  p('aus_jake_fraser_mcgurk', 'Jake Fraser-McGurk', 'J. Fraser-McGurk', 'Australia', 'AUS', 22, '2002-04-11', 'Active', 'STAR', 70, 'Batter', 'Ultra-Aggressive Opener', 'Right-hand bat', 'Right-arm leg break',
    { battingAbility: 88, technique: 78, timing: 96, power: 99, shotSelection: 80, strikeRotation: 78, runningBetweenWickets: 92 },
    { bowlingAbility: 25, pace: 35, accuracy: 30, swing: 15, seam: 15, spin: 35, variation: 25, control: 30 },
    { fielding: 92, catching: 96, throwing: 92, groundFielding: 92, reaction: 96 }, null,
    'Delhi Capitals (9 Crore Retention)', 'Indian Premier League', 3500, 700,
    { matches: 20, runs: 580, highestScore: 84, battingAverage: 32.0, strikeRate: 215.0, hundreds: 0, fifties: 4, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 15, stumpings: 0 },
    ['World Record 29-Ball List-A Century for South Australia', '330 Runs at Strike Rate 234 in IPL 2024 for Delhi Capitals', 'Fearless Powerplay Striker']),

  p('aus_spencer_johnson', 'Spencer Johnson', 'S. Johnson', 'Australia', 'AUS', 28, '1995-12-16', 'Active', 'STAR', 69, 'Bowler', '150 km/h Left-Arm Express Seamer', 'Left-hand bat', 'Left-arm fast',
    { battingAbility: 25, technique: 20, timing: 25, power: 55, shotSelection: 22, strikeRotation: 25, runningBetweenWickets: 60 },
    { bowlingAbility: 88, pace: 96, accuracy: 88, swing: 90, seam: 90, spin: 10, variation: 88, control: 88 },
    { fielding: 86, catching: 90, throwing: 92, groundFielding: 86, reaction: 88 }, null,
    'Gujarat Titans / Brisbane Heat (BBL Champion)', 'Indian Premier League', 3200, 640,
    { matches: 22, runs: 25, highestScore: 8, battingAverage: 4.0, strikeRate: 50.0, hundreds: 0, fifties: 0, wickets: 32, bowlingAverage: 18.0, economyRate: 6.8, bestBowling: '5/26', catches: 8, stumpings: 0 },
    ['5/26 vs Pakistan in Sydney T20I 2024', '10 Crore Auction Pick by Gujarat Titans', 'BBL 2023-24 Final Player of the Match (4/26)']),

  p('aus_xavier_bartlett', 'Xavier Bartlett', 'X. Bartlett', 'Australia', 'AUS', 25, '1998-12-17', 'Active', 'STAR', 69, 'Bowler', 'New-Ball Outswing Specialist', 'Right-hand bat', 'Right-arm fast-medium',
    { battingAbility: 45, technique: 38, timing: 45, power: 65, shotSelection: 40, strikeRotation: 40, runningBetweenWickets: 65 },
    { bowlingAbility: 86, pace: 88, accuracy: 92, swing: 96, seam: 90, spin: 10, variation: 86, control: 92 },
    { fielding: 88, catching: 92, throwing: 90, groundFielding: 88, reaction: 90 }, null,
    'Punjab Kings / Brisbane Heat', 'Indian Premier League', 2800, 560,
    { matches: 18, runs: 55, highestScore: 16, battingAverage: 11.0, strikeRate: 75.0, hundreds: 0, fifties: 0, wickets: 28, bowlingAverage: 16.5, economyRate: 5.2, bestBowling: '4/17', catches: 8, stumpings: 0 },
    ['4/17 on ODI Debut vs West Indies at MCG', 'Top Wicket-Taker in BBL 2023-24 (20 wickets)', 'Generates enormous late away swing']),

  p('aus_matthew_short', 'Matthew Short', 'M. Short', 'Australia', 'AUS', 28, '1995-11-08', 'Active', 'STAR', 69, 'All-Rounder', 'Power Opener & Off-Spinner', 'Right-hand bat', 'Right-arm off break',
    { battingAbility: 86, technique: 82, timing: 90, power: 94, shotSelection: 84, strikeRotation: 84, runningBetweenWickets: 90 },
    { bowlingAbility: 76, pace: 50, accuracy: 84, swing: 15, seam: 15, spin: 78, variation: 75, control: 84 },
    { fielding: 92, catching: 96, throwing: 92, groundFielding: 92, reaction: 94 }, null,
    'Adelaide Strikers (Back-to-Back BBL MVP)', 'Big Bash League', 2900, 580,
    { matches: 30, runs: 750, highestScore: 84, battingAverage: 32.0, strikeRate: 152.0, hundreds: 0, fifties: 4, wickets: 16, bowlingAverage: 24.0, economyRate: 7.0, bestBowling: '5/22', catches: 20, stumpings: 0 },
    ['Back-to-Back Player of the Tournament in BBL 2022-23 & 2023-24', '5/22 vs England in Leeds ODI 2024', 'Powerful Front-Foot Driver and Puller'])
];

// Load existing Australia and merge
const ausExisting = require('../src/data/players/australia.ts').AUSTRALIA_PLAYERS || [];
updateCountryRoster('australia.ts', 'AUSTRALIA_PLAYERS', ausExisting, AUS_EXTRA);

console.log('Australia roster expanded to 35.');
