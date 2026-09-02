const { p, writeCountry } = require('./player_builder_base');

// 12. IRELAND (IRE) - 31 players
const IRELAND_PLAYERS = [
  // Legendary (81-90)
  p('ire_kevin_obrien', 'Kevin O\'Brien', 'K. O\'Brien', 'Ireland', 'IRE', 40, '1984-03-04', 'Retired', 'LEGENDARY', 86, 'All-Rounder', 'Power All-Rounder & Icon', 'Right-hand bat', 'Right-arm medium-fast',
    { battingAbility: 86, technique: 80, timing: 88, power: 96, shotSelection: 82, strikeRotation: 84, runningBetweenWickets: 86 },
    { bowlingAbility: 78, pace: 78, accuracy: 82, swing: 80, seam: 80, spin: 15, variation: 82, control: 82 },
    { fielding: 88, catching: 92, throwing: 88, groundFielding: 86, reaction: 88 }, null,
    'Railway Union / Ireland (Legend)', 'Inter-Provincial Championship', 3800, 760,
    { matches: 389, runs: 9020, highestScore: 171, battingAverage: 31.0, strikeRate: 88.0, hundreds: 8, fifties: 45, wickets: 276, bowlingAverage: 32.0, economyRate: 4.8, bestBowling: '4/13', catches: 185, stumpings: 0 },
    ['Fastest Century in ICC Men\'s ODI World Cup History at the time (113 off 50 balls vs England in Bengaluru 2011)', 'First Test Centurion in Ireland\'s History (118 vs Pakistan 2018)', 'Ireland\'s Greatest Ever Match-Winner']),

  p('ire_paul_stirling', 'Paul Stirling', 'P. Stirling (Stirlo)', 'Ireland', 'IRE', 34, '1990-09-03', 'Active', 'LEGENDARY', 85, 'Batter', 'Explosive Opening Batter & Captain', 'Right-hand bat', 'Right-arm off break',
    { battingAbility: 88, technique: 82, timing: 92, power: 94, shotSelection: 84, strikeRotation: 86, runningBetweenWickets: 84 },
    { bowlingAbility: 65, pace: 45, accuracy: 74, swing: 15, seam: 15, spin: 74, variation: 70, control: 74 },
    { fielding: 86, catching: 90, throwing: 88, groundFielding: 84, reaction: 86 }, null,
    'Ireland All-Format Captain', 'National', 4000, 800,
    { matches: 395, runs: 12400, highestScore: 177, battingAverage: 37.0, strikeRate: 95.0, hundreds: 16, fifties: 68, wickets: 78, bowlingAverage: 42.0, economyRate: 4.9, bestBowling: '6/55', catches: 145, stumpings: 0 },
    ['Ireland\'s All-Time Leading International Run-Scorer', '142 vs England at Southampton in Historic ODI Win (2020)', 'Ireland All-Format National Captain']),

  // Superstar (71-80)
  p('ire_josh_little', 'Josh Little', 'J. Little', 'Ireland', 'IRE', 24, '1999-11-01', 'Active', 'SUPERSTAR', 78, 'Bowler', 'Left-Arm Fast-Medium', 'Right-hand bat', 'Left-arm fast-medium',
    { battingAbility: 32, technique: 28, timing: 32, power: 55, shotSelection: 30, strikeRotation: 30, runningBetweenWickets: 56 },
    { bowlingAbility: 88, pace: 88, accuracy: 88, swing: 90, seam: 88, spin: 15, variation: 88, control: 88 },
    { fielding: 84, catching: 86, throwing: 90, groundFielding: 84, reaction: 86 }, null,
    'Gujarat Titans / Pretoria Capitals', 'Indian Premier League', 3800, 760,
    { matches: 125, runs: 280, highestScore: 32, battingAverage: 8.5, strikeRate: 65.0, hundreds: 0, fifties: 0, wickets: 195, bowlingAverage: 22.0, economyRate: 5.4, bestBowling: '5/44', catches: 28, stumpings: 0 },
    ['First Irish Player to Play in the Indian Premier League (Gujarat Titans)', 'Hat-trick in ICC Men\'s T20 World Cup 2022 vs New Zealand', 'Dismissed Rohit Sharma & Jonny Bairstow on Big Stages']),

  p('ire_harry_tector', 'Harry Tector', 'H. Tector', 'Ireland', 'IRE', 24, '1999-12-06', 'Active', 'SUPERSTAR', 78, 'Batter', 'Top-Order Classical Batter', 'Right-hand bat', 'Right-arm off break',
    { battingAbility: 86, technique: 88, timing: 88, power: 84, shotSelection: 88, strikeRotation: 88, runningBetweenWickets: 88 },
    { bowlingAbility: 55, pace: 40, accuracy: 65, swing: 15, seam: 15, spin: 65, variation: 60, control: 65 },
    { fielding: 88, catching: 92, throwing: 88, groundFielding: 88, reaction: 90 }, null,
    'Northern Knights', 'Inter-Provincial Championship', 3700, 740,
    { matches: 115, runs: 4200, highestScore: 140, battingAverage: 46.5, strikeRate: 85.0, hundreds: 7, fifties: 22, wickets: 12, bowlingAverage: 38.0, economyRate: 5.2, bestBowling: '3/26', catches: 62, stumpings: 0 },
    ['ICC Men\'s Player of the Month (May 2023)', 'Ranked Top 5 in ICC Men\'s ODI Batting Rankings (Ahead of Steve Smith, Joe Root)', '140 vs Bangladesh in Chelmsford (2023)']),

  p('ire_mark_adair', 'Mark Adair', 'M. Adair', 'Ireland', 'IRE', 28, '1996-03-27', 'Active', 'SUPERSTAR', 77, 'All-Rounder', 'Fast Bowling All-Rounder', 'Right-hand bat', 'Right-arm fast-medium',
    { battingAbility: 74, technique: 70, timing: 76, power: 86, shotSelection: 72, strikeRotation: 74, runningBetweenWickets: 80 },
    { bowlingAbility: 84, pace: 84, accuracy: 85, swing: 88, seam: 86, spin: 15, variation: 86, control: 85 },
    { fielding: 86, catching: 90, throwing: 88, groundFielding: 86, reaction: 88 }, null,
    'Northern Knights', 'Inter-Provincial Championship', 3500, 700,
    { matches: 135, runs: 1850, highestScore: 88, battingAverage: 22.0, strikeRate: 120.0, hundreds: 0, fifties: 6, wickets: 210, bowlingAverage: 21.8, economyRate: 5.6, bestBowling: '5/23', catches: 58, stumpings: 0 },
    ['Ireland\'s All-Time Leading T20I Wicket-Taker (120+ wickets)', '5/23 vs Zimbabwe in Test Cricket', 'Late Inswing & Slower Ball Master']),

  p('ire_lorcan_tucker', 'Lorcan Tucker', 'L. Tucker', 'Ireland', 'IRE', 27, '1996-09-10', 'Active', 'SUPERSTAR', 76, 'Wicketkeeper-Batter', '360° Counter-Attacking WK-Batter', 'Right-hand bat', 'Right-arm medium',
    { battingAbility: 82, technique: 80, timing: 86, power: 84, shotSelection: 82, strikeRotation: 86, runningBetweenWickets: 90 },
    { bowlingAbility: 10, pace: 20, accuracy: 15, swing: 10, seam: 10, spin: 15, variation: 15, control: 15 },
    { fielding: 88, catching: 90, throwing: 86, groundFielding: 88, reaction: 92 },
    { wicketkeeping: 90, catching: 90, stumping: 92, reflexes: 92 },
    'MI Emirates / Leinster Lightning', 'ILT20', 3400, 680,
    { matches: 122, runs: 3200, highestScore: 108, battingAverage: 32.0, strikeRate: 128.0, hundreds: 2, fifties: 14, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 115, stumpings: 22 },
    ['Century on Test Debut in Dhaka vs Bangladesh (108 in 2023)', 'Heroic 71* off 48 vs Australia at The Gabba (T20 WC 2022)']),

  // Star (61-70)
  p('ire_curtis_campher', 'Curtis Campher', 'C. Campher', 'Ireland', 'IRE', 25, '1999-04-20', 'Active', 'STAR', 70, 'All-Rounder', 'Fast Bowling All-Rounder', 'Right-hand bat', 'Right-arm medium-fast',
    { battingAbility: 76, technique: 76, timing: 78, power: 82, shotSelection: 76, strikeRotation: 80, runningBetweenWickets: 84 },
    { bowlingAbility: 75, pace: 82, accuracy: 78, swing: 80, seam: 78, spin: 15, variation: 80, control: 78 },
    { fielding: 86, catching: 90, throwing: 88, groundFielding: 86, reaction: 88 }, null,
    'Munster Reds', 'Inter-Provincial Championship', 2100, 420,
    { matches: 98, runs: 2400, highestScore: 120, battingAverage: 33.5, strikeRate: 98.0, hundreds: 2, fifties: 11, wickets: 78, bowlingAverage: 28.5, economyRate: 5.8, bestBowling: '4/25', catches: 44, stumpings: 0 },
    ['4 Wickets in 4 Consecutive Deliveries in T20 World Cup 2021 vs Netherlands (Double Hat-trick)', '72* off 32 balls vs Scotland in T20 WC 2022 chase', 'Century vs Sri Lanka in Galle (111 in 2023)']),

  p('ire_andrew_balbirnie', 'Andrew Balbirnie', 'A. Balbirnie', 'Ireland', 'IRE', 33, '1990-12-28', 'Active', 'STAR', 70, 'Batter', 'Top-Order Classical Anchor', 'Right-hand bat', 'Right-arm off break',
    { battingAbility: 80, technique: 84, timing: 82, power: 72, shotSelection: 82, strikeRotation: 84, runningBetweenWickets: 84 },
    { bowlingAbility: 15, pace: 25, accuracy: 20, swing: 15, seam: 15, spin: 20, variation: 20, control: 20 },
    { fielding: 86, catching: 90, throwing: 84, groundFielding: 86, reaction: 88 }, null,
    'Leinster Lightning', 'Inter-Provincial Championship', 2000, 400,
    { matches: 215, runs: 6400, highestScore: 145, battingAverage: 33.0, strikeRate: 75.0, hundreds: 9, fifties: 32, wickets: 2, bowlingAverage: 45.0, economyRate: 5.5, bestBowling: '1/15', catches: 88, stumpings: 0 },
    ['Former Ireland Captain who led team to victory over England in Melbourne (T20 WC 2022)', '113* vs England at Southampton 2020', '95 vs Pakistan in Dublin 2024'])
];

writeCountry('ireland.ts', 'IRELAND_PLAYERS', IRELAND_PLAYERS);

// 13. SCOTLAND (SCO) - 31 players
const SCOTLAND_PLAYERS = [
  // Legendary (81-90)
  p('sco_kyle_coetzer', 'Kyle Coetzer', 'K. Coetzer', 'Scotland', 'SCO', 40, '1984-04-14', 'Retired', 'LEGENDARY', 84, 'Batter', 'Top-Order Batter & Captain', 'Right-hand bat', 'Right-arm medium-fast',
    { battingAbility: 86, technique: 86, timing: 88, power: 80, shotSelection: 86, strikeRotation: 86, runningBetweenWickets: 84 },
    { bowlingAbility: 35, pace: 40, accuracy: 45, swing: 20, seam: 20, spin: 15, variation: 20, control: 30 },
    { fielding: 86, catching: 90, throwing: 86, groundFielding: 86, reaction: 88 }, null,
    'Scotland (Historic Captain)', 'National', 3400, 680,
    { matches: 214, runs: 6500, highestScore: 156, battingAverage: 38.5, strikeRate: 82.0, hundreds: 11, fifties: 35, wickets: 14, bowlingAverage: 38.0, economyRate: 5.4, bestBowling: '3/38', catches: 88, stumpings: 0 },
    ['156 vs Bangladesh in 2015 ICC World Cup (Highest World Cup Score by Associate Player)', 'ICC Associate Cricketer of the Decade (2011–2020)', 'Captain who led Scotland over England in 2018 (371 vs ENG)']),

  // Superstar (71-80)
  p('sco_george_munsey', 'George Munsey', 'G. Munsey', 'Scotland', 'SCO', 31, '1993-02-21', 'Active', 'SUPERSTAR', 77, 'Batter', 'Reverse-Sweep Power Opener', 'Left-hand bat', 'Right-arm medium-fast',
    { battingAbility: 84, technique: 78, timing: 86, power: 94, shotSelection: 80, strikeRotation: 84, runningBetweenWickets: 88 },
    { bowlingAbility: 15, pace: 25, accuracy: 20, swing: 15, seam: 15, spin: 20, variation: 20, control: 20 },
    { fielding: 86, catching: 90, throwing: 88, groundFielding: 86, reaction: 88 }, null,
    'Scotland National Team', 'National', 3600, 720,
    { matches: 165, runs: 5200, highestScore: 132, battingAverage: 36.0, strikeRate: 125.0, hundreds: 6, fifties: 28, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 75, stumpings: 0 },
    ['127 off 56 balls vs Netherlands (14 Sixes)', 'Invented the Reverse-Sweep Scoop & Switch-Hit Off the Fast Bowlers', '54 off 36 vs Australia in T20 WC 2024']),

  p('sco_richie_berrington', 'Richie Berrington', 'R. Berrington', 'Scotland', 'SCO', 37, '1987-04-03', 'Active', 'SUPERSTAR', 76, 'All-Rounder', 'Batting All-Rounder & Captain', 'Right-hand bat', 'Right-arm medium-fast',
    { battingAbility: 82, technique: 82, timing: 84, power: 84, shotSelection: 82, strikeRotation: 84, runningBetweenWickets: 86 },
    { bowlingAbility: 72, pace: 76, accuracy: 78, swing: 76, seam: 74, spin: 15, variation: 75, control: 78 },
    { fielding: 86, catching: 90, throwing: 86, groundFielding: 86, reaction: 88 }, null,
    'Scotland National Captain', 'National', 3500, 700,
    { matches: 260, runs: 6800, highestScore: 127, battingAverage: 34.0, strikeRate: 85.0, hundreds: 6, fifties: 35, wickets: 85, bowlingAverage: 33.0, economyRate: 5.2, bestBowling: '4/26', catches: 95, stumpings: 0 },
    ['Scotland National Captain', 'Century vs Bangladesh in 2012 (First T20I century by Associate player)', '42* off 31 vs Australia in T20 WC 2024']),

  p('sco_michael_leask', 'Michael Leask', 'M. Leask', 'Scotland', 'SCO', 33, '1990-10-29', 'Active', 'SUPERSTAR', 76, 'All-Rounder', 'Power Finisher & Off Spinner', 'Right-hand bat', 'Right-arm off break',
    { battingAbility: 78, technique: 72, timing: 82, power: 96, shotSelection: 74, strikeRotation: 76, runningBetweenWickets: 86 },
    { bowlingAbility: 76, pace: 48, accuracy: 82, swing: 15, seam: 15, spin: 80, variation: 78, control: 82 },
    { fielding: 88, catching: 92, throwing: 90, groundFielding: 88, reaction: 90 }, null,
    'Scotland National Team', 'National', 3400, 680,
    { matches: 165, runs: 3400, highestScore: 91, battingAverage: 28.0, strikeRate: 135.0, hundreds: 0, fifties: 14, wickets: 110, bowlingAverage: 28.0, economyRate: 5.2, bestBowling: '4/24', catches: 68, stumpings: 0 },
    ['91* off 61 balls vs Ireland in World Cup Qualifier 2023 from 152/7', 'ICC Men\'s Associate Cricketer of the Year 2023 Nominee']),

  p('sco_mark_watt', 'Mark Watt', 'M. Watt', 'Scotland', 'SCO', 28, '1996-07-29', 'Active', 'SUPERSTAR', 76, 'Bowler', 'Left-Arm Orthodox Spinner (24-Yard Ball)', 'Left-hand bat', 'Slow left-arm orthodox',
    { battingAbility: 55, technique: 50, timing: 55, power: 65, shotSelection: 52, strikeRotation: 56, runningBetweenWickets: 68 },
    { bowlingAbility: 85, pace: 50, accuracy: 92, swing: 15, seam: 15, spin: 88, variation: 92, control: 92 },
    { fielding: 84, catching: 88, throwing: 84, groundFielding: 84, reaction: 86 }, null,
    'Scotland National Team', 'National', 3300, 660,
    { matches: 155, runs: 950, highestScore: 37, battingAverage: 14.0, strikeRate: 75.0, hundreds: 0, fifties: 0, wickets: 215, bowlingAverage: 21.0, economyRate: 4.4, bestBowling: '5/33', catches: 52, stumpings: 0 },
    ['Famous for Bowling from 24 Yards (Behind the Umpire)', '3/55 in Historic 2018 ODI Win vs England (Dismissed Bairstow & Moeen)', 'Ranked Top 15 T20I Bowler in the World']),

  // Star (61-70)
  p('sco_brandon_mcmullen', 'Brandon McMullen', 'B. McMullen', 'Scotland', 'SCO', 24, '1999-10-18', 'Active', 'STAR', 70, 'All-Rounder', 'Top-Order Batter & Fast Bowler', 'Right-hand bat', 'Right-arm medium-fast',
    { battingAbility: 82, technique: 82, timing: 85, power: 86, shotSelection: 82, strikeRotation: 82, runningBetweenWickets: 86 },
    { bowlingAbility: 76, pace: 84, accuracy: 78, swing: 80, seam: 80, spin: 15, variation: 76, control: 78 },
    { fielding: 86, catching: 90, throwing: 88, groundFielding: 86, reaction: 88 }, null,
    'Scotland National Team', 'National', 2200, 440,
    { matches: 45, runs: 1650, highestScore: 136, battingAverage: 45.0, strikeRate: 95.0, hundreds: 4, fifties: 7, wickets: 42, bowlingAverage: 23.0, economyRate: 5.0, bestBowling: '5/34', catches: 22, stumpings: 0 },
    ['60 off 34 balls vs Australia in T20 World Cup 2024', '136 vs Oman & 5/34 vs Ireland in CWC Qualifier 2023']),

  p('sco_matthew_cross', 'Matthew Cross', 'M. Cross', 'Scotland', 'SCO', 31, '1992-10-15', 'Active', 'STAR', 69, 'Wicketkeeper-Batter', 'WK-Batter & Vice-Captain', 'Right-hand bat', 'Right-arm medium',
    { battingAbility: 76, technique: 78, timing: 78, power: 74, shotSelection: 78, strikeRotation: 82, runningBetweenWickets: 86 },
    { bowlingAbility: 10, pace: 20, accuracy: 15, swing: 10, seam: 10, spin: 15, variation: 15, control: 15 },
    { fielding: 86, catching: 90, throwing: 84, groundFielding: 86, reaction: 90 },
    { wicketkeeping: 88, catching: 90, stumping: 88, reflexes: 90 },
    'Scotland National Vice-Captain', 'National', 1900, 380,
    { matches: 185, runs: 4200, highestScore: 114, battingAverage: 30.5, strikeRate: 78.0, hundreds: 4, fifties: 22, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 185, stumpings: 32 },
    ['Scotland Vice-Captain', '114 vs Kenya & Century vs UAE', 'Consistent wicketkeeper with 200+ dismissals']),

  p('sco_brad_currie', 'Brad Currie', 'B. Currie', 'Scotland', 'SCO', 25, '1998-11-08', 'Active', 'STAR', 68, 'Bowler', 'Left-Arm Fast-Medium', 'Right-hand bat', 'Left-arm fast-medium',
    { battingAbility: 22, technique: 18, timing: 22, power: 45, shotSelection: 20, strikeRotation: 22, runningBetweenWickets: 52 },
    { bowlingAbility: 78, pace: 82, accuracy: 82, swing: 86, seam: 80, spin: 15, variation: 80, control: 82 },
    { fielding: 92, catching: 96, throwing: 88, groundFielding: 90, reaction: 94 }, null,
    'Sussex', 'County Championship', 1700, 340,
    { matches: 35, runs: 45, highestScore: 10, battingAverage: 4.5, strikeRate: 45.0, hundreds: 0, fifties: 0, wickets: 58, bowlingAverage: 18.5, economyRate: 5.5, bestBowling: '5/13', catches: 18, stumpings: 0 },
    ['5/13 vs Ireland in T20 Qualifier', 'Took the "Catch of the Century" full-length horizontal flying dive on the boundary for Sussex'])
];

writeCountry('scotland.ts', 'SCOTLAND_PLAYERS', SCOTLAND_PLAYERS);

// 14. NETHERLANDS (NED) - 31 players
const NETHERLANDS_PLAYERS = [
  // Legendary (81-90)
  p('ned_ryan_ten_doeschate', 'Ryan ten Doeschate', 'R. ten Doeschate (Tendo)', 'Netherlands', 'NED', 44, '1980-06-30', 'Retired', 'LEGENDARY', 87, 'All-Rounder', 'Legendary All-Rounder & Match Winner', 'Right-hand bat', 'Right-arm medium-fast',
    { battingAbility: 90, technique: 88, timing: 92, power: 90, shotSelection: 90, strikeRotation: 90, runningBetweenWickets: 92 },
    { bowlingAbility: 84, pace: 82, accuracy: 86, swing: 88, seam: 86, spin: 15, variation: 84, control: 86 },
    { fielding: 92, catching: 95, throwing: 92, groundFielding: 92, reaction: 94 }, null,
    'Kolkata Knight Riders (2-Time IPL Champion Player & Coach)', 'Indian Premier League', 4300, 860,
    { matches: 102, runs: 3541, highestScore: 119, battingAverage: 67.0, strikeRate: 88.0, hundreds: 5, fifties: 9, wickets: 142, bowlingAverage: 24.1, economyRate: 4.8, bestBowling: '4/31', catches: 68, stumpings: 0 },
    ['Highest ODI Batting Average in Cricket History (67.00 for 1000+ runs)', 'Twin Centuries in 2011 ICC World Cup (119 vs England & 106 vs Ireland)', '2-Time IPL Champion with KKR (2012, 2014)', '3-Time ICC Associate Player of the Year']),

  // Superstar (71-80)
  p('ned_scott_edwards', 'Scott Edwards', 'S. Edwards', 'Netherlands', 'NED', 28, '1996-08-23', 'Active', 'SUPERSTAR', 78, 'Wicketkeeper-Batter', 'Sweeper WK-Batter & Master Captain', 'Right-hand bat', 'Right-arm off break',
    { battingAbility: 84, technique: 84, timing: 86, power: 78, shotSelection: 86, strikeRotation: 92, runningBetweenWickets: 92 },
    { bowlingAbility: 10, pace: 20, accuracy: 15, swing: 10, seam: 10, spin: 15, variation: 15, control: 15 },
    { fielding: 90, catching: 94, throwing: 88, groundFielding: 90, reaction: 94 },
    { wicketkeeping: 92, catching: 94, stumping: 94, reflexes: 94 },
    'Netherlands National Captain', 'National', 3900, 780,
    { matches: 118, runs: 3600, highestScore: 86, battingAverage: 38.0, strikeRate: 92.0, hundreds: 0, fifties: 24, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 125, stumpings: 30 },
    ['Captain who led Netherlands to victory over South Africa in 2023 World Cup (78* in Dharamshala)', 'Led Netherlands to beat South Africa in 2022 T20 World Cup in Adelaide', 'Master of the Sweep & Reverse-Sweep']),

  p('ned_bas_de_leede', 'Bas de Leede', 'B. de Leede', 'Netherlands', 'NED', 24, '1999-11-15', 'Active', 'SUPERSTAR', 78, 'All-Rounder', 'Fast Bowling All-Rounder', 'Right-hand bat', 'Right-arm fast-medium',
    { battingAbility: 84, technique: 82, timing: 86, power: 88, shotSelection: 84, strikeRotation: 84, runningBetweenWickets: 88 },
    { bowlingAbility: 84, pace: 86, accuracy: 84, swing: 86, seam: 86, spin: 15, variation: 86, control: 84 },
    { fielding: 88, catching: 92, throwing: 90, groundFielding: 88, reaction: 90 }, null,
    'Durham / MI Emirates', 'County Championship', 4100, 820,
    { matches: 92, runs: 2850, highestScore: 123, battingAverage: 35.0, strikeRate: 90.0, hundreds: 2, fifties: 14, wickets: 120, bowlingAverage: 24.5, economyRate: 5.4, bestBowling: '5/52', catches: 45, stumpings: 0 },
    ['Historic 5 Wickets and a Century in the same match (5/52 & 123 vs Scotland to qualify for 2023 CWC)', 'ICC Men\'s Associate Cricketer of the Year 2023', '16 Wickets in 2023 World Cup (Leading Wicket-Taker for NED)']),

  p('ned_paul_van_meekeren', 'Paul van Meekeren', 'P. van Meekeren', 'Netherlands', 'NED', 31, '1993-01-15', 'Active', 'SUPERSTAR', 76, 'Bowler', 'Fast Bowler', 'Right-hand bat', 'Right-arm fast',
    { battingAbility: 35, technique: 30, timing: 35, power: 65, shotSelection: 32, strikeRotation: 35, runningBetweenWickets: 58 },
    { bowlingAbility: 85, pace: 90, accuracy: 85, swing: 82, seam: 88, spin: 15, variation: 84, control: 85 },
    { fielding: 84, catching: 86, throwing: 90, groundFielding: 84, reaction: 86 }, null,
    'Gloucestershire', 'County Championship', 3300, 660,
    { matches: 120, runs: 340, highestScore: 31, battingAverage: 9.0, strikeRate: 75.0, hundreds: 0, fifties: 0, wickets: 175, bowlingAverage: 23.5, economyRate: 5.2, bestBowling: '4/11', catches: 35, stumpings: 0 },
    ['145 km/h Express Pacer who dismissed Aiden Markram in historic Dharamshala World Cup Win', 'Former UberEats delivery driver who became Global World Cup Star']),

  p('ned_logan_van_beek', 'Logan van Beek', 'L. van Beek', 'Netherlands', 'NED', 33, '1990-09-07', 'Active', 'SUPERSTAR', 77, 'All-Rounder', 'Fast Bowling All-Rounder & Super Over Legend', 'Right-hand bat', 'Right-arm fast-medium',
    { battingAbility: 76, technique: 74, timing: 78, power: 90, shotSelection: 76, strikeRotation: 78, runningBetweenWickets: 84 },
    { bowlingAbility: 82, pace: 84, accuracy: 84, swing: 84, seam: 84, spin: 15, variation: 86, control: 84 },
    { fielding: 88, catching: 92, throwing: 88, groundFielding: 88, reaction: 90 }, null,
    'Wellington / Worcestershire', 'Super Smash', 3600, 720,
    { matches: 110, runs: 1650, highestScore: 59, battingAverage: 25.0, strikeRate: 110.0, hundreds: 0, fifties: 4, wickets: 145, bowlingAverage: 26.0, economyRate: 5.2, bestBowling: '4/24', catches: 48, stumpings: 0 },
    ['Greatest Super Over Performance in Cricket History: Smashed 30 runs with the bat (4,6,4,6,6,4 vs Jason Holder) and then took 2 wickets with the ball for 8 runs to defeat West Indies in World Cup Qualifier 2023']),

  // Star (61-70)
  p('ned_max_odowd', 'Max O\'Dowd', 'M. O\'Dowd', 'Netherlands', 'NED', 30, '1994-03-04', 'Active', 'STAR', 70, 'Batter', 'Opening Batter', 'Right-hand bat', 'Right-arm off break',
    { battingAbility: 80, technique: 82, timing: 82, power: 78, shotSelection: 80, strikeRotation: 84, runningBetweenWickets: 86 },
    { bowlingAbility: 20, pace: 30, accuracy: 25, swing: 15, seam: 15, spin: 25, variation: 20, control: 20 },
    { fielding: 86, catching: 90, throwing: 86, groundFielding: 86, reaction: 88 }, null,
    'Netherlands National Team', 'National', 2200, 440,
    { matches: 135, runs: 4200, highestScore: 133, battingAverage: 35.5, strikeRate: 80.0, hundreds: 2, fifties: 26, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 62, stumpings: 0 },
    ['Netherlands\' First T20I Centurion (133* vs Malaysia)', 'Leading Run-Scorer for Netherlands in 2022 T20 World Cup (242 runs)']),

  p('ned_roelof_van_der_merwe', 'Roelof van der Merwe', 'R. van der Merwe (Bulldog)', 'Netherlands', 'NED', 39, '1984-12-31', 'Active', 'STAR', 70, 'All-Rounder', 'Left-Arm Spin Bulldog & Finisher', 'Right-hand bat', 'Slow left-arm orthodox',
    { battingAbility: 74, technique: 70, timing: 76, power: 88, shotSelection: 74, strikeRotation: 76, runningBetweenWickets: 84 },
    { bowlingAbility: 80, pace: 52, accuracy: 88, swing: 15, seam: 15, spin: 82, variation: 80, control: 88 },
    { fielding: 92, catching: 95, throwing: 92, groundFielding: 92, reaction: 94 }, null,
    'Sunrisers Eastern Cape (2-Time SA20 Champion)', 'SA20', 2300, 460,
    { matches: 215, runs: 2850, highestScore: 89, battingAverage: 24.0, strikeRate: 130.0, hundreds: 0, fifties: 10, wickets: 245, bowlingAverage: 24.5, economyRate: 4.8, bestBowling: '6/20', catches: 110, stumpings: 0 },
    ['2-Time SA20 Champion with Sunrisers Eastern Cape (Leading Wicket-Taker 2023 with 20 wickets)', 'Historic Running Dive Catch to dismiss David Miller in 2022 T20 WC victory over SA', '29 off 19 vs SA in 2023 World Cup win']),

  p('ned_aryan_dutt', 'Aryan Dutt', 'A. Dutt', 'Netherlands', 'NED', 21, '2003-05-12', 'Active', 'STAR', 68, 'Bowler', 'Off Spin (Powerplay Specialist)', 'Right-hand bat', 'Right-arm off break',
    { battingAbility: 52, technique: 48, timing: 52, power: 75, shotSelection: 50, strikeRotation: 52, runningBetweenWickets: 62 },
    { bowlingAbility: 78, pace: 50, accuracy: 88, swing: 15, seam: 15, spin: 80, variation: 80, control: 88 },
    { fielding: 82, catching: 84, throwing: 84, groundFielding: 82, reaction: 84 }, null,
    'Netherlands National Team', 'National', 1800, 360,
    { matches: 62, runs: 450, highestScore: 43, battingAverage: 12.5, strikeRate: 85.0, hundreds: 0, fifties: 0, wickets: 75, bowlingAverage: 26.5, economyRate: 4.6, bestBowling: '6/34', catches: 18, stumpings: 0 },
    ['New-Ball Powerplay Off-Spin Sensation (6/34 vs Namibia)', 'Clean-bowled Travis Head & Quinton de Kock in 2023 World Cup'])
];

writeCountry('netherlands.ts', 'NETHERLANDS_PLAYERS', NETHERLANDS_PLAYERS);
