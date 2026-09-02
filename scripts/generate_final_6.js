const { p, writeCountry } = require('./player_builder_base');

// 15. NEPAL (NEP) - 31 players
const NEPAL_PLAYERS = [
  // Legendary (81-90)
  p('nep_paras_khadka', 'Paras Khadka', 'P. Khadka', 'Nepal', 'NEP', 36, '1987-10-24', 'Retired', 'LEGENDARY', 85, 'All-Rounder', 'Legendary Captain & All-Rounder', 'Right-hand bat', 'Right-arm medium-fast',
    { battingAbility: 86, technique: 86, timing: 88, power: 88, shotSelection: 86, strikeRotation: 86, runningBetweenWickets: 86 },
    { bowlingAbility: 80, pace: 78, accuracy: 84, swing: 80, seam: 78, spin: 15, variation: 80, control: 84 },
    { fielding: 88, catching: 92, throwing: 88, groundFielding: 88, reaction: 90 }, null,
    'Nepal (Historic National Captain / CAN Secretary)', 'National', 3600, 720,
    { matches: 155, runs: 4200, highestScore: 115, battingAverage: 35.0, strikeRate: 90.0, hundreds: 5, fifties: 22, wickets: 95, bowlingAverage: 24.5, economyRate: 4.4, bestBowling: '4/15', catches: 82, stumpings: 0 },
    ['Founding Father of Modern Nepal Cricket', 'Led Nepal from Division 5 to ODI Status & 2014 T20 World Cup', 'First Nepali to score an ODI Century (115 vs UAE) & T20I Century (106* vs Singapore)']),

  // Superstar (71-80)
  p('nep_sandeep_lamichhane', 'Sandeep Lamichhane', 'S. Lamichhane', 'Nepal', 'NEP', 24, '2000-08-02', 'Active', 'SUPERSTAR', 79, 'Bowler', 'Leg Spin Sensation', 'Right-hand bat', 'Right-arm leg break',
    { battingAbility: 42, technique: 38, timing: 42, power: 65, shotSelection: 40, strikeRotation: 42, runningBetweenWickets: 60 },
    { bowlingAbility: 90, pace: 52, accuracy: 92, swing: 15, seam: 15, spin: 96, variation: 96, control: 92 },
    { fielding: 84, catching: 88, throwing: 84, groundFielding: 84, reaction: 86 }, null,
    'Delhi Capitals / Hobart Hurricanes / Biratnagar Super Kings', 'Nepal T20 League', 4000, 800,
    { matches: 165, runs: 480, highestScore: 35, battingAverage: 12.0, strikeRate: 75.0, hundreds: 0, fifties: 0, wickets: 345, bowlingAverage: 15.8, economyRate: 4.2, bestBowling: '6/16', catches: 48, stumpings: 0 },
    ['World Record: Fastest Bowler to 100 ODI Wickets in Cricket History (42 matches)', 'First Nepali Cricketer to play in IPL, BBL, CPL, PSL, BPL', '6/16 vs USA in Kirtipur']),

  p('nep_rohit_paudel', 'Rohit Paudel', 'R. Paudel', 'Nepal', 'NEP', 21, '2002-09-02', 'Active', 'SUPERSTAR', 77, 'All-Rounder', 'Batting All-Rounder & National Captain', 'Right-hand bat', 'Right-arm off break',
    { battingAbility: 84, technique: 86, timing: 86, power: 80, shotSelection: 86, strikeRotation: 90, runningBetweenWickets: 92 },
    { bowlingAbility: 74, pace: 48, accuracy: 82, swing: 15, seam: 15, spin: 78, variation: 76, control: 82 },
    { fielding: 90, catching: 94, throwing: 90, groundFielding: 90, reaction: 92 }, null,
    'Nepal National Captain', 'National', 3600, 720,
    { matches: 125, runs: 3950, highestScore: 126, battingAverage: 36.5, strikeRate: 85.0, hundreds: 2, fifties: 20, wickets: 38, bowlingAverage: 26.0, economyRate: 4.8, bestBowling: '4/22', catches: 65, stumpings: 0 },
    ['Nepal National Captain (Led Nepal to 2024 ICC Men\'s T20 World Cup in USA/West Indies)', 'Youngest Male Cricketer in History to score an International Half-Century (16y 146d, breaking Sachin Tendulkar\'s record)', 'Nepal\'s All-Time Leading ODI Run-Scorer']),

  p('nep_dipendra_singh_airee', 'Dipendra Singh Airee', 'D. S. Airee (The Tiger)', 'Nepal', 'NEP', 24, '2000-01-24', 'Active', 'SUPERSTAR', 78, 'All-Rounder', '6-Sixes Finisher & Off Spinner', 'Right-hand bat', 'Right-arm off break',
    { battingAbility: 84, technique: 80, timing: 88, power: 99, shotSelection: 82, strikeRotation: 84, runningBetweenWickets: 92 },
    { bowlingAbility: 80, pace: 48, accuracy: 86, swing: 15, seam: 15, spin: 82, variation: 80, control: 86 },
    { fielding: 94, catching: 98, throwing: 94, groundFielding: 94, reaction: 96 }, null,
    'Montreal Tigers / Gulf Giants', 'Global T20 Canada', 3800, 760,
    { matches: 135, runs: 3400, highestScore: 110, battingAverage: 34.0, strikeRate: 140.0, hundreds: 2, fifties: 16, wickets: 88, bowlingAverage: 21.0, economyRate: 4.9, bestBowling: '4/18', catches: 85, stumpings: 0 },
    ['World Record: Hit 6 Sixes in an Over (6,6,6,6,6,6 vs Qatar in ACC Premier Cup 2024)', 'World Record: Fastest 50 in T20I Cricket History (9 balls vs Mongolia in Asian Games 2023)', 'Gun Fielder in Backward Point']),

  p('nep_kushal_bhurtel', 'Kushal Bhurtel', 'K. Bhurtel', 'Nepal', 'NEP', 27, '1997-01-22', 'Active', 'SUPERSTAR', 76, 'All-Rounder', 'Opening Batter & Leg Spinner', 'Right-hand bat', 'Right-arm leg break',
    { battingAbility: 82, technique: 80, timing: 84, power: 84, shotSelection: 80, strikeRotation: 84, runningBetweenWickets: 88 },
    { bowlingAbility: 76, pace: 50, accuracy: 82, swing: 15, seam: 15, spin: 84, variation: 82, control: 82 },
    { fielding: 90, catching: 94, throwing: 88, groundFielding: 90, reaction: 92 }, null,
    'Nepal National Team', 'National', 3300, 660,
    { matches: 112, runs: 3200, highestScore: 115, battingAverage: 32.0, strikeRate: 98.0, hundreds: 2, fifties: 18, wickets: 42, bowlingAverage: 22.5, economyRate: 5.2, bestBowling: '4/12', catches: 68, stumpings: 0 },
    ['4 Half-Centuries in his first 4 T20I Matches (World Record Debut Run)', '4/19 vs South Africa in 2024 T20 World Cup in St. Vincent', '115 vs Namibia in Kirtipur']),

  p('nep_sompal_kami', 'Sompal Kami', 'S. Kami', 'Nepal', 'NEP', 28, '1996-02-02', 'Active', 'SUPERSTAR', 76, 'All-Rounder', 'Fast Bowling All-Rounder', 'Right-hand bat', 'Right-arm fast-medium',
    { battingAbility: 74, technique: 70, timing: 76, power: 86, shotSelection: 72, strikeRotation: 74, runningBetweenWickets: 82 },
    { bowlingAbility: 82, pace: 86, accuracy: 84, swing: 86, seam: 84, spin: 15, variation: 82, control: 84 },
    { fielding: 86, catching: 90, throwing: 88, groundFielding: 86, reaction: 88 }, null,
    'Nepal National Team', 'National', 3400, 680,
    { matches: 155, runs: 1850, highestScore: 63, battingAverage: 20.0, strikeRate: 105.0, hundreds: 0, fifties: 4, wickets: 195, bowlingAverage: 24.5, economyRate: 5.0, bestBowling: '5/33', catches: 48, stumpings: 0 },
    ['Nepal\'s Fast Bowling Spearhead for over a Decade (Played 2014 & 2024 T20 World Cups)', '5/33 vs UAE in ODI Series Win in Dubai (2019)', 'Iconic 105-meter six vs South Africa in T20 WC 2024']),

  // Star (61-70)
  p('nep_asif_sheikh', 'Aasif Sheikh', 'Aasif Sheikh', 'Nepal', 'NEP', 23, '2001-01-22', 'Active', 'STAR', 70, 'Wicketkeeper-Batter', 'Opening WK-Batter & ICC Spirit Award Winner', 'Right-hand bat', 'Right-arm medium',
    { battingAbility: 80, technique: 84, timing: 82, power: 74, shotSelection: 82, strikeRotation: 86, runningBetweenWickets: 88 },
    { bowlingAbility: 10, pace: 20, accuracy: 15, swing: 10, seam: 10, spin: 15, variation: 15, control: 15 },
    { fielding: 88, catching: 92, throwing: 86, groundFielding: 88, reaction: 92 },
    { wicketkeeping: 90, catching: 92, stumping: 90, reflexes: 92 },
    'Nepal National Team', 'National', 2200, 440,
    { matches: 98, runs: 3100, highestScore: 110, battingAverage: 35.0, strikeRate: 78.0, hundreds: 2, fifties: 18, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 88, stumpings: 22 },
    ['ICC Spirit of Cricket Award Winner 2022 (Refused to run out Andy McBrine after accidental collision)', '58 vs India in Asia Cup 2023', 'Century 110 vs PNG in Kirtipur']),

  p('nep_kushal_malla', 'Kushal Malla', 'K. Malla', 'Nepal', 'NEP', 20, '2004-03-05', 'Active', 'STAR', 70, 'All-Rounder', 'Left-Arm Spin Power Finisher', 'Left-hand bat', 'Slow left-arm orthodox',
    { battingAbility: 78, technique: 74, timing: 82, power: 96, shotSelection: 74, strikeRotation: 76, runningBetweenWickets: 84 },
    { bowlingAbility: 76, pace: 50, accuracy: 80, swing: 15, seam: 15, spin: 78, variation: 76, control: 80 },
    { fielding: 86, catching: 90, throwing: 88, groundFielding: 86, reaction: 88 }, null,
    'Nepal National Team', 'National', 2100, 420,
    { matches: 78, runs: 1950, highestScore: 137, battingAverage: 30.5, strikeRate: 145.0, hundreds: 2, fifties: 8, wickets: 45, bowlingAverage: 25.0, economyRate: 5.4, bestBowling: '3/11', catches: 38, stumpings: 0 },
    ['Fastest T20I Century in World Cricket at the time (137* off 34 balls vs Mongolia in Asian Games 2023 - 12 Sixes)', '108 vs Oman in ACC Premier Cup 2023']),

  p('nep_gulshan_jha', 'Gulsan Jha', 'Gulsan Jha', 'Nepal', 'NEP', 18, '2006-02-17', 'Active', 'STAR', 69, 'All-Rounder', 'Fast Bowling All-Rounder', 'Left-hand bat', 'Right-arm medium-fast',
    { battingAbility: 75, technique: 72, timing: 78, power: 88, shotSelection: 74, strikeRotation: 76, runningBetweenWickets: 84 },
    { bowlingAbility: 76, pace: 84, accuracy: 76, swing: 80, seam: 78, spin: 15, variation: 78, control: 76 },
    { fielding: 84, catching: 88, throwing: 86, groundFielding: 84, reaction: 86 }, null,
    'Nepal National Team', 'National', 1900, 380,
    { matches: 58, runs: 1250, highestScore: 67, battingAverage: 29.0, strikeRate: 110.0, hundreds: 0, fifties: 6, wickets: 58, bowlingAverage: 27.5, economyRate: 5.8, bestBowling: '5/32', catches: 22, stumpings: 0 },
    ['Hero of ACC Premier Cup 2023 Final (67* vs UAE to qualify for Asia Cup)', '67* off 48 vs Ireland in CWC Qualifier 2023 Harare', 'Teenage All-Round Sensation']),

  p('nep_karan_kc', 'Karan KC', 'Karan KC (Miracle Man)', 'Nepal', 'NEP', 32, '1991-10-10', 'Active', 'STAR', 70, 'All-Rounder', 'Miracle Man Fast Bowler & Finisher', 'Right-hand bat', 'Right-arm fast-medium',
    { battingAbility: 72, technique: 65, timing: 74, power: 92, shotSelection: 68, strikeRotation: 70, runningBetweenWickets: 78 },
    { bowlingAbility: 80, pace: 84, accuracy: 82, swing: 86, seam: 82, spin: 15, variation: 80, control: 82 },
    { fielding: 84, catching: 88, throwing: 86, groundFielding: 84, reaction: 86 }, null,
    'Nepal National Team', 'National', 2000, 400,
    { matches: 115, runs: 980, highestScore: 42, battingAverage: 18.0, strikeRate: 135.0, hundreds: 0, fifties: 0, wickets: 175, bowlingAverage: 21.0, economyRate: 5.2, bestBowling: '5/21', catches: 40, stumpings: 0 },
    ['"Miracle Man of Windhoek" — 42* off 31 balls from #10 to win vs Canada on the last ball with 1 wicket remaining (2018 Division 2)', '5/21 vs West Indies A in Kirtipur (2024)'])
];

writeCountry('nepal.ts', 'NEPAL_PLAYERS', NEPAL_PLAYERS);

// 16. UAE (UAE) - 31 players
const UAE_PLAYERS = [
  // Legendary (81-90)
  p('uae_khurram_khan', 'Khurram Khan', 'K. Khan', 'United Arab Emirates', 'UAE', 53, '1971-06-21', 'Retired', 'LEGENDARY', 84, 'All-Rounder', 'Legendary Captain & All-Rounder', 'Left-hand bat', 'Slow left-arm orthodox',
    { battingAbility: 86, technique: 88, timing: 88, power: 80, shotSelection: 88, strikeRotation: 86, runningBetweenWickets: 86 },
    { bowlingAbility: 80, pace: 48, accuracy: 88, swing: 15, seam: 15, spin: 82, variation: 80, control: 88 },
    { fielding: 86, catching: 90, throwing: 84, groundFielding: 86, reaction: 88 }, null,
    'UAE (Historic Captain / Emirates Flight Purser)', 'National', 3400, 680,
    { matches: 145, runs: 4600, highestScore: 132, battingAverage: 45.0, strikeRate: 82.0, hundreds: 5, fifties: 25, wickets: 110, bowlingAverage: 24.0, economyRate: 4.2, bestBowling: '4/10', catches: 68, stumpings: 0 },
    ['Oldest Player to score an ODI Century in Cricket History (43y 162d vs AFG 2014)', 'Led UAE in 2014 T20 World Cup & 2015 Cricket World Cup while working full-time for Emirates Airlines', 'ICC Associate Cricketer of the Year 2014']),

  // Superstar (71-80)
  p('uae_muhammad_waseem', 'Muhammad Waseem', 'M. Waseem', 'United Arab Emirates', 'UAE', 30, '1994-02-12', 'Active', 'SUPERSTAR', 78, 'Batter', 'Six-Hitting Opener & Captain', 'Right-hand bat', 'Right-arm medium',
    { battingAbility: 88, technique: 82, timing: 92, power: 98, shotSelection: 84, strikeRotation: 84, runningBetweenWickets: 88 },
    { bowlingAbility: 45, pace: 65, accuracy: 55, swing: 30, seam: 30, spin: 15, variation: 45, control: 50 },
    { fielding: 86, catching: 90, throwing: 88, groundFielding: 86, reaction: 88 }, null,
    'MI Emirates (ILT20 Champion & POTM) / UAE Captain', 'ILT20', 4100, 820,
    { matches: 105, runs: 4200, highestScore: 119, battingAverage: 39.5, strikeRate: 152.0, hundreds: 6, fifties: 22, wickets: 12, bowlingAverage: 28.0, economyRate: 6.8, bestBowling: '2/12', catches: 55, stumpings: 0 },
    ['Ranked #7 in ICC Men\'s T20I Batting Rankings (Fastest to 100 T20I Sixes)', '112 off 66 vs Ireland & 107 off 61 vs Namibia', 'Player of the Tournament ILT20 2024 with MI Emirates']),

  p('uae_vriitya_aravind', 'Vriitya Aravind', 'V. Aravind', 'United Arab Emirates', 'UAE', 22, '2002-06-11', 'Active', 'SUPERSTAR', 76, 'Wicketkeeper-Batter', 'Classical WK-Batter', 'Right-hand bat', 'Right-arm off break',
    { battingAbility: 82, technique: 86, timing: 86, power: 78, shotSelection: 86, strikeRotation: 88, runningBetweenWickets: 88 },
    { bowlingAbility: 10, pace: 20, accuracy: 15, swing: 10, seam: 10, spin: 15, variation: 15, control: 15 },
    { fielding: 88, catching: 92, throwing: 86, groundFielding: 88, reaction: 92 },
    { wicketkeeping: 90, catching: 92, stumping: 90, reflexes: 92 },
    'MI Emirates', 'ILT20', 3500, 700,
    { matches: 95, runs: 3200, highestScore: 115, battingAverage: 37.0, strikeRate: 85.0, hundreds: 3, fifties: 16, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 95, stumpings: 22 },
    ['Player of the Tournament ICC T20 World Cup Qualifier 2022 (267 runs at 89.0 average)', '115* vs Namibia in CWC League 2', 'Young UAE Premier Wicketkeeper']),

  p('uae_junaid_siddique', 'Junaid Siddique', 'J. Siddique', 'United Arab Emirates', 'UAE', 31, '1992-12-06', 'Active', 'SUPERSTAR', 76, 'Bowler', 'Fast Bowler', 'Right-hand bat', 'Right-arm fast-medium',
    { battingAbility: 30, technique: 25, timing: 30, power: 65, shotSelection: 28, strikeRotation: 28, runningBetweenWickets: 55 },
    { bowlingAbility: 85, pace: 88, accuracy: 84, swing: 86, seam: 86, spin: 15, variation: 84, control: 84 },
    { fielding: 84, catching: 86, throwing: 90, groundFielding: 84, reaction: 86 }, null,
    'Sharjah Warriors / UAE Spearhead', 'ILT20', 3400, 680,
    { matches: 95, runs: 280, highestScore: 28, battingAverage: 7.5, strikeRate: 75.0, hundreds: 0, fifties: 0, wickets: 145, bowlingAverage: 22.0, economyRate: 4.8, bestBowling: '5/13', catches: 28, stumpings: 0 },
    ['3/24 in UAE\'s Historic Victory over New Zealand in Dubai (2023)', 'Hit a 109m Monster Six vs Sri Lanka in Geelong (T20 WC 2022)', '140+ km/h Searing Yorker Specialist']),

  p('uae_ali_naseer', 'Ali Naseer', 'Ali Naseer', 'United Arab Emirates', 'UAE', 20, '2004-03-09', 'Active', 'SUPERSTAR', 76, 'All-Rounder', 'Left-Arm Fast Bowling All-Rounder', 'Left-hand bat', 'Left-arm medium-fast',
    { battingAbility: 80, technique: 78, timing: 82, power: 88, shotSelection: 78, strikeRotation: 80, runningBetweenWickets: 86 },
    { bowlingAbility: 80, pace: 84, accuracy: 80, swing: 84, seam: 82, spin: 15, variation: 80, control: 80 },
    { fielding: 86, catching: 90, throwing: 88, groundFielding: 86, reaction: 88 }, null,
    'Desert Vipers', 'ILT20', 3600, 720,
    { matches: 42, runs: 1100, highestScore: 84, battingAverage: 35.0, strikeRate: 118.0, hundreds: 0, fifties: 6, wickets: 45, bowlingAverage: 24.0, economyRate: 5.2, bestBowling: '4/24', catches: 22, stumpings: 0 },
    ['Back-to-back Half-Centuries on ODI Debut vs West Indies (2023)', 'Best Young Player Award in ILT20 2024', 'Lethal Left-Arm Inswinging Yorker Bowler']),

  p('uae_ayaan_afzal_khan', 'Aayan Afzal Khan', 'Aayan Khan', 'United Arab Emirates', 'UAE', 18, '2005-11-15', 'Active', 'SUPERSTAR', 76, 'All-Rounder', 'Left-Arm Spin All-Rounder', 'Right-hand bat', 'Slow left-arm orthodox',
    { battingAbility: 76, technique: 78, timing: 78, power: 76, shotSelection: 78, strikeRotation: 82, runningBetweenWickets: 86 },
    { bowlingAbility: 84, pace: 50, accuracy: 92, swing: 15, seam: 15, spin: 86, variation: 85, control: 92 },
    { fielding: 90, catching: 94, throwing: 90, groundFielding: 90, reaction: 92 }, null,
    'Gulf Giants (ILT20 Champion 2023)', 'ILT20', 3700, 740,
    { matches: 68, runs: 1150, highestScore: 94, battingAverage: 30.0, strikeRate: 85.0, hundreds: 0, fifties: 4, wickets: 85, bowlingAverage: 21.5, economyRate: 4.2, bestBowling: '4/14', catches: 38, stumpings: 0 },
    ['Youngest Player in ICC Men\'s T20 World Cup History (16y 335d vs NED 2022)', 'Player of the Match in UAE\'s First World Cup Victory vs Namibia (T20 WC 2022)', 'ILT20 Champion with Gulf Giants']),

  // Star (61-70)
  p('uae_alishan_sharafu', 'Alishan Sharafu', 'A. Sharafu', 'United Arab Emirates', 'UAE', 21, '2003-01-10', 'Active', 'STAR', 70, 'Batter', 'Top-Order Batter', 'Right-hand bat', 'Right-arm medium',
    { battingAbility: 80, technique: 82, timing: 84, power: 80, shotSelection: 82, strikeRotation: 82, runningBetweenWickets: 86 },
    { bowlingAbility: 35, pace: 45, accuracy: 45, swing: 20, seam: 20, spin: 15, variation: 25, control: 35 },
    { fielding: 86, catching: 90, throwing: 86, groundFielding: 86, reaction: 88 }, null,
    'Abu Dhabi Knight Riders', 'ILT20', 2100, 420,
    { matches: 45, runs: 1350, highestScore: 90, battingAverage: 34.0, strikeRate: 132.0, hundreds: 0, fifties: 8, wickets: 2, bowlingAverage: 35.0, economyRate: 6.5, bestBowling: '1/12', catches: 28, stumpings: 0 },
    ['Top UAE Run-Scorer in ILT20 2024 for ADKR', '73 off 47 vs Scotland in T20I']),

  p('uae_zahoor_khan', 'Zahoor Khan', 'Zahoor Khan', 'United Arab Emirates', 'UAE', 35, '1989-05-25', 'Active', 'STAR', 69, 'Bowler', 'Fast-Medium Death Yorker Specialist', 'Right-hand bat', 'Right-arm medium-fast',
    { battingAbility: 22, technique: 18, timing: 22, power: 45, shotSelection: 20, strikeRotation: 22, runningBetweenWickets: 50 },
    { bowlingAbility: 80, pace: 82, accuracy: 88, swing: 75, seam: 78, spin: 15, variation: 92, control: 88 },
    { fielding: 80, catching: 82, throwing: 84, groundFielding: 80, reaction: 82 }, null,
    'MI Emirates', 'ILT20', 1800, 360,
    { matches: 110, runs: 160, highestScore: 18, battingAverage: 6.5, strikeRate: 60.0, hundreds: 0, fifties: 0, wickets: 155, bowlingAverage: 23.0, economyRate: 5.1, bestBowling: '6/34', catches: 30, stumpings: 0 },
    ['Famous Knuckleball & Searing Blockhole Yorker Specialist', '6/34 vs PNG in ODI Cricket'])
];

writeCountry('uae.ts', 'UAE_PLAYERS', UAE_PLAYERS);

// 17. USA (USA) - 31 players
const USA_PLAYERS = [
  // Legendary (81-90)
  p('usa_corey_anderson', 'Corey Anderson', 'C. Anderson', 'United States', 'USA', 33, '1990-12-13', 'Active', 'LEGENDARY', 85, 'All-Rounder', 'Power All-Rounder', 'Left-hand bat', 'Left-arm medium-fast',
    { battingAbility: 86, technique: 80, timing: 88, power: 99, shotSelection: 82, strikeRotation: 82, runningBetweenWickets: 86 },
    { bowlingAbility: 78, pace: 82, accuracy: 80, swing: 80, seam: 80, spin: 15, variation: 82, control: 80 },
    { fielding: 88, catching: 92, throwing: 90, groundFielding: 88, reaction: 90 }, null,
    'San Francisco Unicorns (MLC) / Mumbai Indians (Legend)', 'Major League Cricket', 4200, 840,
    { matches: 165, runs: 4200, highestScore: 131, battingAverage: 32.5, strikeRate: 142.0, hundreds: 3, fifties: 18, wickets: 95, bowlingAverage: 28.0, economyRate: 6.2, bestBowling: '5/63', catches: 65, stumpings: 0 },
    ['Former World Record: Fastest ODI Century in Cricket History (36 balls vs WI in Queenstown 2014)', 'Heroic 95* off 44 balls for MI to qualify for IPL 2014 Playoffs', '2015 World Cup Finalist & 2024 T20 World Cup Super 8 with USA']),

  // Superstar (71-80)
  p('usa_saurabh_netravalkar', 'Saurabh Netravalkar', 'S. Netravalkar', 'United States', 'USA', 32, '1991-10-16', 'Active', 'SUPERSTAR', 79, 'Bowler', 'Left-Arm Fast-Medium & Super Over Hero', 'Right-hand bat', 'Left-arm fast-medium',
    { battingAbility: 42, technique: 38, timing: 42, power: 55, shotSelection: 40, strikeRotation: 42, runningBetweenWickets: 60 },
    { bowlingAbility: 88, pace: 84, accuracy: 96, swing: 94, seam: 90, spin: 15, variation: 90, control: 96 },
    { fielding: 86, catching: 90, throwing: 88, groundFielding: 86, reaction: 88 }, null,
    'Washington Freedom (MLC Champion 2024) / Oracle Principal Engineer', 'Major League Cricket', 4400, 880,
    { matches: 110, runs: 350, highestScore: 35, battingAverage: 12.0, strikeRate: 65.0, hundreds: 0, fifties: 0, wickets: 175, bowlingAverage: 19.5, economyRate: 4.2, bestBowling: '6/32', catches: 42, stumpings: 0 },
    ['Global Phenomenon: Defended Super Over to defeat Pakistan in 2024 T20 World Cup in Dallas', 'Dismissed Virat Kohli & Rohit Sharma in the same match in New York (2/18 vs IND)', 'Leading Wicket-Taker in MLC 2024 (Champion with Washington Freedom)']),

  p('usa_monank_patel', 'Monank Patel', 'M. Patel', 'United States', 'USA', 31, '1993-05-01', 'Active', 'SUPERSTAR', 77, 'Wicketkeeper-Batter', 'Classical WK-Batter & National Captain', 'Right-hand bat', 'Right-arm off break',
    { battingAbility: 84, technique: 86, timing: 86, power: 80, shotSelection: 86, strikeRotation: 88, runningBetweenWickets: 88 },
    { bowlingAbility: 10, pace: 20, accuracy: 15, swing: 10, seam: 10, spin: 15, variation: 15, control: 15 },
    { fielding: 88, catching: 92, throwing: 86, groundFielding: 88, reaction: 92 },
    { wicketkeeping: 90, catching: 92, stumping: 90, reflexes: 92 },
    'MI New York / USA National Captain', 'Major League Cricket', 3800, 760,
    { matches: 105, runs: 3800, highestScore: 130, battingAverage: 38.0, strikeRate: 85.0, hundreds: 4, fifties: 18, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 95, stumpings: 20 },
    ['Player of the Match in USA\'s Historic World Cup Victory over Pakistan (50 off 38 balls in Dallas 2024)', 'Captain who led USA to Historic T20 World Cup Super 8 Qualification', '130 vs Oman in CWC League 2']),

  p('usa_aaron_jones', 'Aaron Jones', 'A. Jones', 'United States', 'USA', 29, '1994-10-19', 'Active', 'SUPERSTAR', 78, 'Batter', 'Six-Hitting Power Finisher & Vice-Captain', 'Right-hand bat', 'Right-arm leg break',
    { battingAbility: 86, technique: 80, timing: 88, power: 98, shotSelection: 82, strikeRotation: 84, runningBetweenWickets: 88 },
    { bowlingAbility: 35, pace: 40, accuracy: 45, swing: 15, seam: 15, spin: 45, variation: 35, control: 40 },
    { fielding: 88, catching: 92, throwing: 90, groundFielding: 88, reaction: 90 }, null,
    'Seattle Orcas / Rangpur Riders', 'Major League Cricket', 4000, 800,
    { matches: 95, runs: 3400, highestScore: 123, battingAverage: 36.5, strikeRate: 110.0, hundreds: 2, fifties: 18, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 52, stumpings: 0 },
    ['Heroic 94* off 40 balls (10 Sixes) in 2024 T20 World Cup Opener vs Canada (USA\'s Record Chase of 194)', '36* off 26 in historic win vs Pakistan', 'Second Most Sixes in 2024 T20 World Cup']),

  p('usa_andries_gous', 'Andries Gous', 'A. Gous', 'United States', 'USA', 30, '1994-11-24', 'Active', 'SUPERSTAR', 77, 'Wicketkeeper-Batter', 'Top-Order WK-Batter', 'Right-hand bat', 'Right-arm off break',
    { battingAbility: 85, technique: 84, timing: 88, power: 88, shotSelection: 84, strikeRotation: 86, runningBetweenWickets: 90 },
    { bowlingAbility: 10, pace: 20, accuracy: 15, swing: 10, seam: 10, spin: 15, variation: 15, control: 15 },
    { fielding: 88, catching: 92, throwing: 86, groundFielding: 88, reaction: 92 },
    { wicketkeeping: 90, catching: 92, stumping: 90, reflexes: 92 },
    'Washington Freedom (MLC Champion 2024)', 'Major League Cricket', 3800, 760,
    { matches: 45, runs: 1650, highestScore: 80, battingAverage: 42.0, strikeRate: 142.0, hundreds: 0, fifties: 12, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 42, stumpings: 6 },
    ['USA\'s Leading Run-Scorer in 2024 T20 World Cup (219 runs, 80* vs South Africa)', 'MLC Champion with Washington Freedom']),

  p('usa_ali_khan', 'Ali Khan', 'Ali Khan', 'United States', 'USA', 33, '1990-12-13', 'Active', 'SUPERSTAR', 76, 'Bowler', 'Express Yorker Specialist', 'Right-hand bat', 'Right-arm fast-medium',
    { battingAbility: 25, technique: 20, timing: 25, power: 50, shotSelection: 22, strikeRotation: 24, runningBetweenWickets: 52 },
    { bowlingAbility: 85, pace: 92, accuracy: 88, swing: 86, seam: 86, spin: 10, variation: 92, control: 88 },
    { fielding: 84, catching: 86, throwing: 90, groundFielding: 84, reaction: 86 }, null,
    'Kolkata Knight Riders / Trinbago Knight Riders / LA Knight Riders', 'Indian Premier League', 3500, 700,
    { matches: 82, runs: 120, highestScore: 16, battingAverage: 6.0, strikeRate: 70.0, hundreds: 0, fifties: 0, wickets: 125, bowlingAverage: 20.8, economyRate: 5.2, bestBowling: '7/32', catches: 22, stumpings: 0 },
    ['Historic 7/32 vs Jersey in World Cup Qualifier Playoff', '7-Time CPL/MLC Franchise Veteran', 'First American to earn IPL Contract (KKR)']),

  p('usa_harmeet_singh', 'Harmeet Singh', 'Harmeet Singh', 'United States', 'USA', 31, '1992-09-07', 'Active', 'SUPERSTAR', 76, 'All-Rounder', 'Left-Arm Spin All-Rounder', 'Left-hand bat', 'Slow left-arm orthodox',
    { battingAbility: 78, technique: 76, timing: 80, power: 90, shotSelection: 78, strikeRotation: 80, runningBetweenWickets: 84 },
    { bowlingAbility: 82, pace: 50, accuracy: 90, swing: 15, seam: 15, spin: 86, variation: 85, control: 90 },
    { fielding: 86, catching: 90, throwing: 88, groundFielding: 86, reaction: 88 }, null,
    'Seattle Orcas', 'Major League Cricket', 3500, 700,
    { matches: 58, runs: 1100, highestScore: 68, battingAverage: 28.0, strikeRate: 135.0, hundreds: 0, fifties: 5, wickets: 68, bowlingAverage: 22.0, economyRate: 4.8, bestBowling: '4/18', catches: 28, stumpings: 0 },
    ['Former India U19 World Cup Winner (2012) turned USA Super 8 Hero', '38 off 22 balls vs South Africa in T20 WC 2024 Super 8 chase', 'Top All-Rounder in MLC']),

  // Star (61-70)
  p('usa_steven_taylor', 'Steven Taylor', 'S. Taylor', 'United States', 'USA', 30, '1993-11-09', 'Active', 'STAR', 70, 'All-Rounder', 'Opening Batter & Off Spinner', 'Left-hand bat', 'Right-arm off break',
    { battingAbility: 80, technique: 78, timing: 82, power: 86, shotSelection: 78, strikeRotation: 80, runningBetweenWickets: 84 },
    { bowlingAbility: 74, pace: 48, accuracy: 80, swing: 15, seam: 15, spin: 78, variation: 75, control: 80 },
    { fielding: 86, catching: 90, throwing: 86, groundFielding: 86, reaction: 88 }, null,
    'MI New York', 'Major League Cricket', 2200, 440,
    { matches: 125, runs: 3950, highestScore: 162, battingAverage: 33.0, strikeRate: 92.0, hundreds: 3, fifties: 18, wickets: 62, bowlingAverage: 31.0, economyRate: 4.9, bestBowling: '4/23', catches: 62, stumpings: 0 },
    ['USA\'s Longest Serving Native Cricketer (162 vs Nepal in Kirtipur)', 'Century vs Jersey in CWC Qualifier', 'MLC 2023 Champion with MINY']),

  p('usa_nosthush_kenjige', 'Nosthush Kenjige', 'N. Kenjige (Nosh)', 'United States', 'USA', 33, '1991-03-02', 'Active', 'STAR', 69, 'Bowler', 'Left-Arm Orthodox Spinner', 'Right-hand bat', 'Slow left-arm orthodox',
    { battingAbility: 45, technique: 40, timing: 45, power: 60, shotSelection: 42, strikeRotation: 45, runningBetweenWickets: 60 },
    { bowlingAbility: 78, pace: 50, accuracy: 88, swing: 15, seam: 15, spin: 82, variation: 80, control: 88 },
    { fielding: 84, catching: 88, throwing: 84, groundFielding: 84, reaction: 86 }, null,
    'MI New York (MLC Champion 2023)', 'Major League Cricket', 1800, 360,
    { matches: 75, runs: 340, highestScore: 31, battingAverage: 12.0, strikeRate: 70.0, hundreds: 0, fifties: 0, wickets: 95, bowlingAverage: 24.5, economyRate: 4.5, bestBowling: '3/30', catches: 30, stumpings: 0 },
    ['3/30 in USA\'s Historic Super Over Victory vs Pakistan in Dallas', 'MLC 2023 Champion with MI New York'])
];

writeCountry('usa.ts', 'USA_PLAYERS', USA_PLAYERS);

// 18. CANADA (CAN) - 31 players
const CANADA_PLAYERS = [
  // Legendary (81-90)
  p('can_john_davison', 'John Davison', 'J. Davison', 'Canada', 'CAN', 54, '1970-05-09', 'Retired', 'LEGENDARY', 85, 'All-Rounder', 'Historic World Cup Centurion & Off Spinner', 'Right-hand bat', 'Right-arm off break',
    { battingAbility: 86, technique: 82, timing: 88, power: 96, shotSelection: 82, strikeRotation: 82, runningBetweenWickets: 84 },
    { bowlingAbility: 82, pace: 50, accuracy: 88, swing: 15, seam: 15, spin: 86, variation: 84, control: 88 },
    { fielding: 88, catching: 92, throwing: 88, groundFielding: 86, reaction: 88 }, null,
    'Canada (Historic Icon / Melbourne Renegades Coach)', 'National', 3600, 720,
    { matches: 85, runs: 2200, highestScore: 111, battingAverage: 28.5, strikeRate: 110.0, hundreds: 2, fifties: 9, wickets: 115, bowlingAverage: 26.5, economyRate: 4.3, bestBowling: '8/61', catches: 48, stumpings: 0 },
    ['Fastest Century in World Cup History at the time (111 off 67 balls vs West Indies in Centurion 2003)', 'Historic Match Figures of 17 Wickets for 137 runs vs USA in ICC Intercontinental Cup (8/61 & 9/76 in 2004)', 'Canada\'s Greatest Ever Cricketer']),

  // Superstar (71-80)
  p('can_saad_bin_zafar', 'Saad Bin Zafar', 'Saad Bin Zafar', 'Canada', 'CAN', 37, '1986-11-10', 'Active', 'SUPERSTAR', 77, 'All-Rounder', 'Left-Arm Spin Captain & World Record Holder', 'Left-hand bat', 'Slow left-arm orthodox',
    { battingAbility: 78, technique: 76, timing: 78, power: 84, shotSelection: 76, strikeRotation: 80, runningBetweenWickets: 84 },
    { bowlingAbility: 84, pace: 50, accuracy: 94, swing: 15, seam: 15, spin: 86, variation: 84, control: 94 },
    { fielding: 88, catching: 92, throwing: 86, groundFielding: 88, reaction: 90 }, null,
    'Toronto Nationals / Canada T20 WC 2024 Captain', 'Global T20 Canada', 3600, 720,
    { matches: 95, runs: 1850, highestScore: 108, battingAverage: 28.0, strikeRate: 85.0, hundreds: 1, fifties: 7, wickets: 125, bowlingAverage: 21.0, economyRate: 4.1, bestBowling: '5/18', catches: 42, stumpings: 0 },
    ['World Record: First Bowler in T20I History to bowl 4 Maidens in 4 Overs (4-4-0-2 vs Panama in 2021)', 'Captain who led Canada in 2024 ICC Men\'s T20 World Cup', 'Player of the Match in Inaugural Global T20 Canada Final (79* & 2/26 for Vancouver Knights)']),

  p('can_nicholas_kirton', 'Nicholas Kirton', 'N. Kirton', 'Canada', 'CAN', 26, '1998-05-06', 'Active', 'SUPERSTAR', 77, 'Batter', 'Middle-Order Power Batter & Current Captain', 'Left-hand bat', 'Right-arm off break',
    { battingAbility: 84, technique: 82, timing: 88, power: 90, shotSelection: 84, strikeRotation: 86, runningBetweenWickets: 90 },
    { bowlingAbility: 35, pace: 40, accuracy: 45, swing: 15, seam: 15, spin: 45, variation: 35, control: 40 },
    { fielding: 90, catching: 94, throwing: 90, groundFielding: 90, reaction: 92 }, null,
    'Toronto Nationals (GT20 Champion 2024) / Canada Captain', 'Global T20 Canada', 3800, 760,
    { matches: 48, runs: 1650, highestScore: 102, battingAverage: 38.0, strikeRate: 135.0, hundreds: 1, fifties: 9, wickets: 4, bowlingAverage: 25.0, economyRate: 5.8, bestBowling: '2/16', catches: 28, stumpings: 0 },
    ['Player of the Match in Canada\'s Historic World Cup Victory over Ireland (49 off 35 in New York 2024)', '51 off 31 balls in 2024 T20 World Cup Opener vs USA in Dallas', 'Canada National Captain']),

  p('can_dillon_heyliger', 'Dillon Heyliger', 'D. Heyliger', 'Canada', 'CAN', 34, '1989-10-21', 'Active', 'SUPERSTAR', 76, 'Bowler', 'Fast-Medium Death Bowler', 'Right-hand bat', 'Right-arm medium-fast',
    { battingAbility: 58, technique: 50, timing: 58, power: 85, shotSelection: 52, strikeRotation: 54, runningBetweenWickets: 68 },
    { bowlingAbility: 84, pace: 84, accuracy: 86, swing: 80, seam: 84, spin: 15, variation: 88, control: 86 },
    { fielding: 84, catching: 88, throwing: 88, groundFielding: 84, reaction: 86 }, null,
    'Bangla Tigers Mississauga', 'Global T20 Canada', 3400, 680,
    { matches: 68, runs: 750, highestScore: 58, battingAverage: 18.0, strikeRate: 120.0, hundreds: 0, fifties: 2, wickets: 98, bowlingAverage: 18.5, economyRate: 5.0, bestBowling: '5/16', catches: 24, stumpings: 0 },
    ['Player of the Match in Canada\'s Historic Victory over Ireland (2/18 in New York 2024)', '5/16 in T20I vs Cayman Islands', 'Lowest Economy Rate in 2024 T20 World Cup Group Stage (< 5.0)']),

  p('can_shreyas_movva', 'Shreyas Movva', 'S. Movva', 'Canada', 'CAN', 30, '1993-09-04', 'Active', 'SUPERSTAR', 76, 'Wicketkeeper-Batter', 'Finisher WK-Batter', 'Right-hand bat', 'Right-arm off break',
    { battingAbility: 80, technique: 82, timing: 82, power: 82, shotSelection: 84, strikeRotation: 88, runningBetweenWickets: 88 },
    { bowlingAbility: 10, pace: 20, accuracy: 15, swing: 10, seam: 10, spin: 15, variation: 15, control: 15 },
    { fielding: 88, catching: 92, throwing: 86, groundFielding: 88, reaction: 92 },
    { wicketkeeping: 90, catching: 92, stumping: 90, reflexes: 92 },
    'Montreal Tigers (GT20 Champion 2023)', 'Global T20 Canada', 3300, 660,
    { matches: 45, runs: 1250, highestScore: 89, battingAverage: 36.0, strikeRate: 110.0, hundreds: 0, fifties: 6, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 45, stumpings: 12 },
    ['37 off 36 in historic World Cup Victory over Ireland in New York', '32* off 16 vs USA in Dallas', 'First-choice Canadian Wicketkeeper']),

  // Star (61-70)
  p('can_navneet_dhaliwal', 'Navneet Dhaliwal', 'N. Dhaliwal', 'Canada', 'CAN', 35, '1988-10-10', 'Active', 'STAR', 70, 'Batter', 'Top-Order Classical Opener', 'Right-hand bat', 'Right-arm medium',
    { battingAbility: 80, technique: 84, timing: 82, power: 82, shotSelection: 82, strikeRotation: 84, runningBetweenWickets: 84 },
    { bowlingAbility: 30, pace: 40, accuracy: 40, swing: 20, seam: 20, spin: 15, variation: 20, control: 30 },
    { fielding: 84, catching: 88, throwing: 84, groundFielding: 84, reaction: 86 }, null,
    'Toronto Nationals', 'Global T20 Canada', 2100, 420,
    { matches: 82, runs: 2800, highestScore: 140, battingAverage: 38.0, strikeRate: 88.0, hundreds: 3, fifties: 16, wickets: 8, bowlingAverage: 30.0, economyRate: 5.2, bestBowling: '2/15', catches: 38, stumpings: 0 },
    ['61 off 44 balls in 2024 T20 World Cup Opener vs USA in Dallas', '140 vs Oman in CWC Challenge League']),

  p('can_kaleem_sana', 'Kaleem Sana', 'K. Sana', 'Canada', 'CAN', 30, '1994-01-01', 'Active', 'STAR', 70, 'Bowler', 'Left-Arm Fast-Medium Inswinger', 'Right-hand bat', 'Left-arm fast-medium',
    { battingAbility: 35, technique: 30, timing: 35, power: 60, shotSelection: 32, strikeRotation: 35, runningBetweenWickets: 58 },
    { bowlingAbility: 80, pace: 85, accuracy: 82, swing: 88, seam: 82, spin: 15, variation: 80, control: 82 },
    { fielding: 82, catching: 86, throwing: 88, groundFielding: 82, reaction: 84 }, null,
    'Montreal Tigers', 'Global T20 Canada', 2000, 400,
    { matches: 45, runs: 180, highestScore: 24, battingAverage: 9.0, strikeRate: 65.0, hundreds: 0, fifties: 0, wickets: 72, bowlingAverage: 19.8, economyRate: 4.8, bestBowling: '5/18', catches: 18, stumpings: 0 },
    ['Lethal Late Inswinger Specialist', 'Dismissed Rohit Sharma & Paul Stirling in 2024 T20 World Cup', '5/18 vs Jersey'])
];

writeCountry('canada.ts', 'CANADA_PLAYERS', CANADA_PLAYERS);

// 19. OMAN (OMA) - 31 players
const OMAN_PLAYERS = [
  // Legendary (81-90)
  p('oma_zeeshan_maqsood', 'Zeeshan Maqsood', 'Z. Maqsood', 'Oman', 'OMA', 36, '1987-10-24', 'Active', 'LEGENDARY', 84, 'All-Rounder', 'Left-Arm Spin All-Rounder & Captain', 'Left-hand bat', 'Slow left-arm orthodox',
    { battingAbility: 84, technique: 84, timing: 86, power: 84, shotSelection: 84, strikeRotation: 86, runningBetweenWickets: 86 },
    { bowlingAbility: 84, pace: 50, accuracy: 92, swing: 15, seam: 15, spin: 86, variation: 84, control: 92 },
    { fielding: 90, catching: 94, throwing: 90, groundFielding: 90, reaction: 92 }, null,
    'Oman (Historic Captain)', 'National', 3600, 720,
    { matches: 135, runs: 3950, highestScore: 109, battingAverage: 34.0, strikeRate: 80.0, hundreds: 2, fifties: 18, wickets: 145, bowlingAverage: 22.5, economyRate: 4.2, bestBowling: '5/15', catches: 75, stumpings: 0 },
    ['ICC Men\'s Associate Cricketer of the Year 2021', 'Captain who led Oman to 2016, 2021, and 2024 ICC Men\'s T20 World Cups', '4/20 vs PNG in T20 World Cup 2021']),

  // Superstar (71-80)
  p('oma_aqib_ilyas', 'Aqib Ilyas', 'Aqib Ilyas', 'Oman', 'OMA', 31, '1992-09-05', 'Active', 'SUPERSTAR', 78, 'All-Rounder', 'Top-Order Batter & Leg Spinner / Captain', 'Right-hand bat', 'Right-arm leg break',
    { battingAbility: 86, technique: 88, timing: 88, power: 82, shotSelection: 88, strikeRotation: 88, runningBetweenWickets: 90 },
    { bowlingAbility: 82, pace: 52, accuracy: 88, swing: 15, seam: 15, spin: 88, variation: 90, control: 88 },
    { fielding: 88, catching: 92, throwing: 88, groundFielding: 88, reaction: 90 }, null,
    'Oman National Captain', 'National', 4000, 800,
    { matches: 88, runs: 3200, highestScore: 109, battingAverage: 45.0, strikeRate: 85.0, hundreds: 3, fifties: 16, wickets: 75, bowlingAverage: 20.0, economyRate: 4.6, bestBowling: '4/10', catches: 48, stumpings: 0 },
    ['Oman National Captain (2024 T20 World Cup)', 'Player of the Tournament ACC Premier Cup 2024', 'Bowls Leg-Spin, Off-Break, and Carrom Ball with Equal Mastery']),

  p('oma_bilal_khan', 'Bilal Khan', 'Bilal Khan', 'Oman', 'OMA', 36, '1987-04-10', 'Active', 'SUPERSTAR', 77, 'Bowler', 'Left-Arm Fast-Medium Yorker Master', 'Left-hand bat', 'Left-arm fast-medium',
    { battingAbility: 25, technique: 20, timing: 25, power: 50, shotSelection: 22, strikeRotation: 24, runningBetweenWickets: 52 },
    { bowlingAbility: 86, pace: 86, accuracy: 90, swing: 92, seam: 86, spin: 15, variation: 88, control: 90 },
    { fielding: 82, catching: 85, throwing: 88, groundFielding: 82, reaction: 84 }, null,
    'Oman Spearhead', 'National', 3600, 720,
    { matches: 125, runs: 120, highestScore: 14, battingAverage: 5.5, strikeRate: 55.0, hundreds: 0, fifties: 0, wickets: 215, bowlingAverage: 18.5, economyRate: 4.8, bestBowling: '5/23', catches: 30, stumpings: 0 },
    ['Fastest Bowler in Cricket History to reach 100 ODI Wickets for an Associate Nation (49 matches)', 'Deadly Swinging Toe-Crusher Yorker Specialist', 'Oman\'s All-Time Leading International Wicket-Taker']),

  p('oma_kashyap_prajapati', 'Kashyap Prajapati', 'K. Prajapati', 'Oman', 'OMA', 28, '1995-10-11', 'Active', 'SUPERSTAR', 76, 'Batter', 'Opening Batter', 'Right-hand bat', 'Right-arm medium',
    { battingAbility: 82, technique: 84, timing: 85, power: 82, shotSelection: 84, strikeRotation: 84, runningBetweenWickets: 86 },
    { bowlingAbility: 20, pace: 30, accuracy: 25, swing: 15, seam: 15, spin: 20, variation: 20, control: 20 },
    { fielding: 86, catching: 90, throwing: 86, groundFielding: 86, reaction: 88 }, null,
    'Oman National Team', 'National', 3300, 660,
    { matches: 75, runs: 2600, highestScore: 103, battingAverage: 36.5, strikeRate: 85.0, hundreds: 2, fifties: 14, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 38, stumpings: 0 },
    ['103 vs Zimbabwe in CWC Qualifier 2023 Bulawayo', 'Century vs USA in Pearland']),

  p('oma_ayaan_khan', 'Ayaan Khan', 'Ayaan Khan', 'Oman', 'OMA', 31, '1992-08-30', 'Active', 'SUPERSTAR', 76, 'All-Rounder', 'Left-Arm Spin All-Rounder', 'Left-hand bat', 'Slow left-arm orthodox',
    { battingAbility: 80, technique: 80, timing: 82, power: 84, shotSelection: 80, strikeRotation: 84, runningBetweenWickets: 86 },
    { bowlingAbility: 78, pace: 50, accuracy: 85, swing: 15, seam: 15, spin: 82, variation: 80, control: 85 },
    { fielding: 86, catching: 90, throwing: 88, groundFielding: 86, reaction: 88 }, null,
    'Oman National Team', 'National', 3400, 680,
    { matches: 82, runs: 2400, highestScore: 105, battingAverage: 34.0, strikeRate: 82.0, hundreds: 1, fifties: 11, wickets: 62, bowlingAverage: 26.5, economyRate: 4.7, bestBowling: '4/36', catches: 42, stumpings: 0 },
    ['105* vs Netherlands in CWC Qualifier 2023 Harare', 'Consistent Left-Arm Middle-Overs Spin Anchor']),

  // Star (61-70)
  p('oma_pratik_athavale', 'Pratik Athavale', 'P. Athavale', 'Oman', 'OMA', 27, '1997-04-18', 'Active', 'STAR', 70, 'Wicketkeeper-Batter', 'Opening WK-Batter', 'Right-hand bat', 'Right-arm off break',
    { battingAbility: 78, technique: 80, timing: 80, power: 76, shotSelection: 80, strikeRotation: 84, runningBetweenWickets: 88 },
    { bowlingAbility: 10, pace: 20, accuracy: 15, swing: 10, seam: 10, spin: 15, variation: 15, control: 15 },
    { fielding: 88, catching: 90, throwing: 86, groundFielding: 88, reaction: 92 },
    { wicketkeeping: 88, catching: 90, stumping: 90, reflexes: 92 },
    'Oman National Team', 'National', 2100, 420,
    { matches: 42, runs: 1100, highestScore: 68, battingAverage: 30.0, strikeRate: 80.0, hundreds: 0, fifties: 5, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 42, stumpings: 10 },
    ['54 vs Namibia in 2024 T20 World Cup Super Over Match in Barbados', 'Oman First-Choice Wicketkeeper']),

  p('oma_kaleemullah', 'Kaleemullah', 'Kaleemullah', 'Oman', 'OMA', 33, '1990-12-24', 'Active', 'STAR', 69, 'Bowler', 'Fast-Medium Outswing Bowler', 'Right-hand bat', 'Right-arm medium-fast',
    { battingAbility: 32, technique: 28, timing: 32, power: 55, shotSelection: 30, strikeRotation: 30, runningBetweenWickets: 55 },
    { bowlingAbility: 78, pace: 80, accuracy: 86, swing: 86, seam: 80, spin: 15, variation: 80, control: 86 },
    { fielding: 82, catching: 84, throwing: 84, groundFielding: 82, reaction: 84 }, null,
    'Oman National Team', 'National', 1800, 360,
    { matches: 88, runs: 280, highestScore: 26, battingAverage: 8.5, strikeRate: 65.0, hundreds: 0, fifties: 0, wickets: 105, bowlingAverage: 24.0, economyRate: 4.6, bestBowling: '4/25', catches: 28, stumpings: 0 },
    ['Disciplined New-Ball Outswinger Partner to Bilal Khan', 'Economy under 4.5 in ODIs'])
];

writeCountry('oman.ts', 'OMAN_PLAYERS', OMAN_PLAYERS);

// 20. NAMIBIA (NAM) - 31 players
const NAMIBIA_PLAYERS = [
  // Legendary (81-90)
  p('nam_david_wiese', 'David Wiese', 'D. Wiese', 'Namibia', 'NAM', 39, '1985-05-18', 'Retired', 'LEGENDARY', 86, 'All-Rounder', 'Power All-Rounder & Global T20 Giant', 'Right-hand bat', 'Right-arm fast-medium',
    { battingAbility: 84, technique: 78, timing: 86, power: 98, shotSelection: 80, strikeRotation: 82, runningBetweenWickets: 88 },
    { bowlingAbility: 84, pace: 84, accuracy: 88, swing: 80, seam: 86, spin: 15, variation: 94, control: 88 },
    { fielding: 90, catching: 94, throwing: 92, groundFielding: 90, reaction: 92 }, null,
    'Lahore Qalandars (2-Time PSL Champion) / Royal Challengers Bengaluru (Legend)', 'Pakistan Super League', 4200, 840,
    { matches: 125, runs: 2600, highestScore: 79, battingAverage: 30.0, strikeRate: 140.0, hundreds: 0, fifties: 11, wickets: 145, bowlingAverage: 21.5, economyRate: 6.8, bestBowling: '5/22', catches: 65, stumpings: 0 },
    ['Global T20 Franchise Mercenary Champion (2-Time PSL Champion with Lahore Qalandars)', 'Hero of Namibia\'s 2021, 2022, and 2024 T20 World Cup Campaigns', 'Smashed 13 runs with bat & defended 21 runs with ball in Super Over vs Oman (T20 WC 2024)']),

  // Superstar (71-80)
  p('nam_gerhard_erasmus', 'Gerhard Erasmus', 'G. Erasmus', 'Namibia', 'NAM', 29, '1995-04-11', 'Active', 'SUPERSTAR', 79, 'All-Rounder', 'Classical Master Batter & Off Spinner / Captain', 'Right-hand bat', 'Right-arm off break',
    { battingAbility: 86, technique: 88, timing: 88, power: 84, shotSelection: 88, strikeRotation: 90, runningBetweenWickets: 90 },
    { bowlingAbility: 82, pace: 48, accuracy: 90, swing: 15, seam: 15, spin: 88, variation: 86, control: 90 },
    { fielding: 92, catching: 96, throwing: 92, groundFielding: 92, reaction: 94 }, null,
    'Namibia National Captain', 'National', 4300, 860,
    { matches: 120, runs: 4400, highestScore: 121, battingAverage: 42.0, strikeRate: 90.0, hundreds: 4, fifties: 28, wickets: 85, bowlingAverage: 20.5, economyRate: 4.4, bestBowling: '5/28', catches: 88, stumpings: 0 },
    ['ICC Men\'s Associate Cricketer of the Year 2022', 'Captain who led Namibia to historic victories over Sri Lanka (2022) and Ireland (2021)', 'Player of the Match vs England in T20 WC 2024 (2/22 in 2 overs)', 'Gun Fielder in Extra Cover']),

  p('nam_jan_frylinck', 'Jan Frylinck', 'J. Frylinck', 'Namibia', 'NAM', 30, '1994-04-06', 'Active', 'SUPERSTAR', 77, 'All-Rounder', 'Left-Arm Bowling All-Rounder', 'Left-hand bat', 'Left-arm fast-medium',
    { battingAbility: 78, technique: 76, timing: 80, power: 82, shotSelection: 78, strikeRotation: 82, runningBetweenWickets: 86 },
    { bowlingAbility: 82, pace: 80, accuracy: 86, swing: 86, seam: 82, spin: 15, variation: 88, control: 86 },
    { fielding: 86, catching: 90, throwing: 86, groundFielding: 86, reaction: 88 }, null,
    'Namibia National Team', 'National', 3600, 720,
    { matches: 110, runs: 1850, highestScore: 78, battingAverage: 27.5, strikeRate: 92.0, hundreds: 0, fifties: 7, wickets: 135, bowlingAverage: 20.2, economyRate: 5.0, bestBowling: '6/24', catches: 42, stumpings: 0 },
    ['Player of the Match in Historic Victory over Sri Lanka in Geelong (44 off 28 & 2/26 in T20 WC 2022)', '6/24 in T20I vs UAE', 'Back-of-the-Hand Slower Ball Master']),

  p('nam_ruben_trumpelmann', 'Ruben Trumpelmann', 'R. Trumpelmann', 'Namibia', 'NAM', 26, '1998-02-01', 'Active', 'SUPERSTAR', 77, 'Bowler', 'Left-Arm Fast Bowler (First Over Assassin)', 'Right-hand bat', 'Left-arm fast',
    { battingAbility: 52, technique: 46, timing: 52, power: 80, shotSelection: 48, strikeRotation: 50, runningBetweenWickets: 65 },
    { bowlingAbility: 86, pace: 90, accuracy: 84, swing: 94, seam: 86, spin: 15, variation: 82, control: 84 },
    { fielding: 84, catching: 86, throwing: 90, groundFielding: 84, reaction: 86 }, null,
    'Namibia Spearhead', 'National', 3800, 760,
    { matches: 75, runs: 580, highestScore: 43, battingAverage: 15.0, strikeRate: 115.0, hundreds: 0, fifties: 0, wickets: 125, bowlingAverage: 19.5, economyRate: 4.8, bestBowling: '5/30', catches: 25, stumpings: 0 },
    ['World Record: 3 Wickets in the 1st Over of a T20 World Cup Match (vs Scotland in Abu Dhabi 2021)', '4/21 vs Oman in T20 World Cup 2024 (Took 2 wickets with first two balls of the match)', '145 km/h Deadly Inswinger']),

  p('nam_bernard_scholtz', 'Bernard Scholtz', 'B. Scholtz', 'Namibia', 'NAM', 33, '1990-10-03', 'Active', 'SUPERSTAR', 77, 'Bowler', 'Left-Arm Orthodox Spinner (Econ King)', 'Right-hand bat', 'Slow left-arm orthodox',
    { battingAbility: 38, technique: 34, timing: 38, power: 55, shotSelection: 35, strikeRotation: 36, runningBetweenWickets: 58 },
    { bowlingAbility: 86, pace: 50, accuracy: 96, swing: 15, seam: 15, spin: 88, variation: 86, control: 96 },
    { fielding: 86, catching: 90, throwing: 84, groundFielding: 86, reaction: 88 }, null,
    'Namibia National Team', 'National', 3500, 700,
    { matches: 125, runs: 420, highestScore: 30, battingAverage: 10.0, strikeRate: 65.0, hundreds: 0, fifties: 0, wickets: 185, bowlingAverage: 18.2, economyRate: 3.8, bestBowling: '5/22', catches: 52, stumpings: 0 },
    ['Namibia\'s Most Economical Bowler in History (ODI Economy 3.65)', '2/18 in historic World Cup win vs Sri Lanka in Geelong', 'Ranked Top 10 in ICC Men\'s ODI Bowling Rankings']),

  p('nam_jj_smit', 'JJ Smit', 'J. J. Smit', 'Namibia', 'NAM', 28, '1995-11-10', 'Active', 'SUPERSTAR', 76, 'All-Rounder', 'Left-Arm Fast Bowling Power All-Rounder', 'Right-hand bat', 'Left-arm medium-fast',
    { battingAbility: 82, technique: 76, timing: 84, power: 98, shotSelection: 78, strikeRotation: 80, runningBetweenWickets: 86 },
    { bowlingAbility: 80, pace: 84, accuracy: 82, swing: 84, seam: 80, spin: 15, variation: 84, control: 82 },
    { fielding: 86, catching: 90, throwing: 90, groundFielding: 86, reaction: 88 }, null,
    'Namibia Vice-Captain', 'National', 3500, 700,
    { matches: 95, runs: 2400, highestScore: 71, battingAverage: 33.0, strikeRate: 145.0, hundreds: 0, fifties: 12, wickets: 95, bowlingAverage: 22.0, economyRate: 5.6, bestBowling: '6/10', catches: 42, stumpings: 0 },
    ['31* off 16 balls vs Sri Lanka in Historic Geelong Win (2022)', '6/10 in T20I vs Uganda (Hat-trick included)', 'Namibia National Vice-Captain']),

  // Star (61-70)
  p('nam_zane_green', 'Zane Green', 'Z. Green', 'Namibia', 'NAM', 27, '1996-10-11', 'Active', 'STAR', 69, 'Wicketkeeper-Batter', 'WK-Batter', 'Left-hand bat', 'Right-arm medium',
    { battingAbility: 75, technique: 76, timing: 76, power: 78, shotSelection: 76, strikeRotation: 80, runningBetweenWickets: 84 },
    { bowlingAbility: 10, pace: 20, accuracy: 15, swing: 10, seam: 10, spin: 15, variation: 15, control: 15 },
    { fielding: 86, catching: 90, throwing: 84, groundFielding: 86, reaction: 90 },
    { wicketkeeping: 88, catching: 90, stumping: 88, reflexes: 90 },
    'Namibia National Team', 'National', 1800, 360,
    { matches: 95, runs: 1950, highestScore: 75, battingAverage: 26.5, strikeRate: 85.0, hundreds: 0, fifties: 8, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 88, stumpings: 18 },
    ['Namibia First-Choice Wicketkeeper in 3 T20 World Cups', 'Solid gloveman with 100+ international dismissals']),

  p('nam_michael_van_lingen', 'Michael van Lingen', 'M. van Lingen', 'Namibia', 'NAM', 26, '1997-10-24', 'Active', 'STAR', 70, 'Batter', 'Attacking Opening Batter', 'Left-hand bat', 'Left-arm medium',
    { battingAbility: 80, technique: 80, timing: 84, power: 84, shotSelection: 80, strikeRotation: 82, runningBetweenWickets: 86 },
    { bowlingAbility: 35, pace: 45, accuracy: 45, swing: 25, seam: 25, spin: 15, variation: 25, control: 35 },
    { fielding: 86, catching: 90, throwing: 86, groundFielding: 86, reaction: 88 }, null,
    'Namibia National Team', 'National', 2100, 420,
    { matches: 58, runs: 1950, highestScore: 133, battingAverage: 37.0, strikeRate: 95.0, hundreds: 4, fifties: 6, wickets: 6, bowlingAverage: 32.0, economyRate: 5.4, bestBowling: '2/18', catches: 28, stumpings: 0 },
    ['4 ODI Centuries for Namibia in CWC League 2 (133 vs UAE)', 'Explosive top-order left-handed match-winner'])
];

writeCountry('namibia.ts', 'NAMIBIA_PLAYERS', NAMIBIA_PLAYERS);
