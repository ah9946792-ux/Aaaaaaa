const { p, writeCountry } = require('./player_builder_base');

// 10. AFGHANISTAN (AFG) - 31 players
const AFGHANISTAN_PLAYERS = [
  // Legendary (81-90)
  p('afg_rashid_khan', 'Rashid Khan', 'Rashid Khan (Magician)', 'Afghanistan', 'AFG', 25, '1998-09-20', 'Active', 'LEGENDARY', 89, 'Bowler', 'World-Famous Leg Spin Magician', 'Right-hand bat', 'Right-arm leg break',
    { battingAbility: 75, technique: 68, timing: 80, power: 94, shotSelection: 72, strikeRotation: 76, runningBetweenWickets: 88 },
    { bowlingAbility: 98, pace: 58, accuracy: 98, swing: 15, seam: 15, spin: 98, variation: 99, control: 98 },
    { fielding: 92, catching: 95, throwing: 94, groundFielding: 92, reaction: 96 }, null,
    'Gujarat Titans (18 Crore Retention) / Afghanistan T20I Captain', 'Indian Premier League', 5000, 1000,
    { matches: 285, runs: 3200, highestScore: 79, battingAverage: 21.0, strikeRate: 140.0, hundreds: 0, fifties: 9, wickets: 615, bowlingAverage: 18.2, economyRate: 4.8, bestBowling: '7/18', catches: 110, stumpings: 0 },
    ['Global Icon — Fastest to 100 T20I Wickets and 100 ODI Wickets', '7/18 vs West Indies in Gros Islet', 'Led Afghanistan to 2024 T20 World Cup Semi-Final (Beat AUS, NZ, BAN)']),

  p('afg_mohammad_nabi', 'Mohammad Nabi', 'M. Nabi (The President)', 'Afghanistan', 'AFG', 39, '1985-01-01', 'Active', 'LEGENDARY', 85, 'All-Rounder', 'Off Spin All-Rounder', 'Right-hand bat', 'Right-arm off break',
    { battingAbility: 82, technique: 78, timing: 84, power: 90, shotSelection: 80, strikeRotation: 84, runningBetweenWickets: 84 },
    { bowlingAbility: 86, pace: 48, accuracy: 92, swing: 15, seam: 15, spin: 88, variation: 85, control: 92 },
    { fielding: 88, catching: 92, throwing: 88, groundFielding: 86, reaction: 88 }, null,
    'Mumbai Indians / MI Emirates', 'Indian Premier League', 3800, 760,
    { matches: 312, runs: 6800, highestScore: 136, battingAverage: 28.5, strikeRate: 98.0, hundreds: 2, fifties: 30, wickets: 310, bowlingAverage: 29.5, economyRate: 4.4, bestBowling: '5/17', catches: 165, stumpings: 0 },
    ['"The President" — Founding Pioneer of Afghanistan Cricket', 'Former #1 Ranked ICC ODI All-Rounder', '2024 T20 World Cup Semi-Finalist']),

  // Superstar (71-80)
  p('afg_rahmanullah_gurbaz', 'Rahmanullah Gurbaz', 'R. Gurbaz', 'Afghanistan', 'AFG', 22, '2001-11-28', 'Active', 'SUPERSTAR', 79, 'Wicketkeeper-Batter', 'Attacking WK-Batter', 'Right-hand bat', 'Right-arm medium',
    { battingAbility: 86, technique: 82, timing: 88, power: 94, shotSelection: 82, strikeRotation: 84, runningBetweenWickets: 90 },
    { bowlingAbility: 10, pace: 25, accuracy: 20, swing: 15, seam: 15, spin: 20, variation: 20, control: 20 },
    { fielding: 90, catching: 92, throwing: 88, groundFielding: 90, reaction: 94 },
    { wicketkeeping: 90, catching: 92, stumping: 92, reflexes: 94 },
    'Kolkata Knight Riders (IPL Champion 2024)', 'Indian Premier League', 4200, 840,
    { matches: 115, runs: 4200, highestScore: 151, battingAverage: 37.0, strikeRate: 115.0, hundreds: 9, fifties: 18, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 88, stumpings: 24 },
    ['Highest Run-Scorer in 2024 ICC Men\'s T20 World Cup (281 runs)', 'IPL 2024 Champion with KKR (Played Final)', '151 vs Pakistan in Hambantota']),

  p('afg_fazalhaq_farooqi', 'Fazalhaq Farooqi', 'F. Farooqi', 'Afghanistan', 'AFG', 23, '2000-09-22', 'Active', 'SUPERSTAR', 79, 'Bowler', 'Left-Arm Fast-Medium Inswinger', 'Right-hand bat', 'Left-arm fast-medium',
    { battingAbility: 25, technique: 20, timing: 25, power: 45, shotSelection: 22, strikeRotation: 24, runningBetweenWickets: 52 },
    { bowlingAbility: 88, pace: 88, accuracy: 88, swing: 96, seam: 86, spin: 15, variation: 86, control: 88 },
    { fielding: 82, catching: 85, throwing: 88, groundFielding: 82, reaction: 84 }, null,
    'Sunrisers Hyderabad', 'Indian Premier League', 4100, 820,
    { matches: 82, runs: 65, highestScore: 12, battingAverage: 5.0, strikeRate: 50.0, hundreds: 0, fifties: 0, wickets: 148, bowlingAverage: 18.5, economyRate: 5.0, bestBowling: '5/9', catches: 22, stumpings: 0 },
    ['Leading Wicket-Taker in 2024 ICC Men\'s T20 World Cup (17 wickets at 9.41 average)', '5/9 vs Uganda & 4/17 vs New Zealand in T20 WC 2024']),

  p('afg_ibrahim_zadran', 'Ibrahim Zadran', 'I. Zadran', 'Afghanistan', 'AFG', 22, '2001-12-12', 'Active', 'SUPERSTAR', 78, 'Batter', 'Top-Order Classical Anchor', 'Right-hand bat', 'Right-arm medium-fast',
    { battingAbility: 86, technique: 90, timing: 88, power: 78, shotSelection: 90, strikeRotation: 90, runningBetweenWickets: 90 },
    { bowlingAbility: 20, pace: 30, accuracy: 25, swing: 15, seam: 15, spin: 20, variation: 20, control: 20 },
    { fielding: 88, catching: 92, throwing: 88, groundFielding: 88, reaction: 90 }, null,
    'Afghanistan National Team', 'National', 3900, 780,
    { matches: 88, runs: 3600, highestScore: 162, battingAverage: 45.0, strikeRate: 80.0, hundreds: 7, fifties: 18, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 48, stumpings: 0 },
    ['First Afghan in History to score a World Cup Century (129* vs AUS in Mumbai 2023)', 'Second Highest Run-Scorer in 2024 T20 World Cup (231 runs)']),

  p('afg_naveen_ul_haq', 'Naveen-ul-Haq', 'Naveen-ul-Haq', 'Afghanistan', 'AFG', 24, '1999-09-23', 'Active', 'SUPERSTAR', 77, 'Bowler', 'Fast-Medium Slower Ball Specialist', 'Right-hand bat', 'Right-arm medium-fast',
    { battingAbility: 35, technique: 30, timing: 35, power: 55, shotSelection: 32, strikeRotation: 35, runningBetweenWickets: 60 },
    { bowlingAbility: 86, pace: 84, accuracy: 86, swing: 80, seam: 82, spin: 15, variation: 94, control: 86 },
    { fielding: 84, catching: 88, throwing: 86, groundFielding: 84, reaction: 86 }, null,
    'Lucknow Super Giants', 'Indian Premier League', 3600, 720,
    { matches: 85, runs: 120, highestScore: 18, battingAverage: 8.0, strikeRate: 75.0, hundreds: 0, fifties: 0, wickets: 138, bowlingAverage: 20.2, economyRate: 5.6, bestBowling: '4/20', catches: 28, stumpings: 0 },
    ['13 Wickets in 2024 T20 World Cup (Heroic 4/26 vs BAN to qualify for Semi-Finals)', 'Back-of-the-Hand Slower Ball Master']),

  p('afg_noor_ahmad', 'Noor Ahmad', 'Noor Ahmad', 'Afghanistan', 'AFG', 19, '2005-01-03', 'Active', 'SUPERSTAR', 77, 'Bowler', 'Left-Arm Mystery Wrist Spin', 'Right-hand bat', 'Left-arm wrist spin',
    { battingAbility: 30, technique: 25, timing: 30, power: 50, shotSelection: 28, strikeRotation: 30, runningBetweenWickets: 55 },
    { bowlingAbility: 86, pace: 55, accuracy: 88, swing: 15, seam: 15, spin: 94, variation: 94, control: 88 },
    { fielding: 82, catching: 84, throwing: 84, groundFielding: 82, reaction: 84 }, null,
    'Gujarat Titans (10 Crore Auction)', 'Indian Premier League', 3800, 760,
    { matches: 58, runs: 85, highestScore: 15, battingAverage: 6.0, strikeRate: 60.0, hundreds: 0, fifties: 0, wickets: 92, bowlingAverage: 22.0, economyRate: 6.0, bestBowling: '4/10', catches: 18, stumpings: 0 },
    ['Teenage Wrist Spin Sensation (16 Wickets for GT in IPL 2023 Final run)', 'Lethal Googly & Wrong-un Specialist']),

  p('afg_azmatullah_omarzai', 'Azmatullah Omarzai', 'A. Omarzai', 'Afghanistan', 'AFG', 24, '2000-03-24', 'Active', 'SUPERSTAR', 77, 'All-Rounder', 'Fast Bowling All-Rounder', 'Right-hand bat', 'Right-arm medium-fast',
    { battingAbility: 82, technique: 80, timing: 84, power: 88, shotSelection: 80, strikeRotation: 82, runningBetweenWickets: 86 },
    { bowlingAbility: 82, pace: 86, accuracy: 82, swing: 88, seam: 84, spin: 15, variation: 80, control: 82 },
    { fielding: 86, catching: 90, throwing: 88, groundFielding: 86, reaction: 88 }, null,
    'Gujarat Titans / Peshawar Zalmi', 'Indian Premier League', 3700, 740,
    { matches: 68, runs: 1850, highestScore: 149, battingAverage: 42.0, strikeRate: 98.0, hundreds: 2, fifties: 9, wickets: 62, bowlingAverage: 27.5, economyRate: 5.4, bestBowling: '4/56', catches: 32, stumpings: 0 },
    ['353 runs at 70.6 average in 2023 World Cup (including 97* vs SA and 62 vs AUS)', '149* vs Sri Lanka in Pallekele', 'ICC Men\'s ODI Team of the Year 2023']),

  // Star (61-70)
  p('afg_mujeeb_ur_rahman', 'Mujeeb Ur Rahman', 'Mujeeb Ur Rahman', 'Afghanistan', 'AFG', 23, '2001-03-28', 'Active', 'STAR', 70, 'Bowler', 'Mystery Spinner', 'Right-hand bat', 'Right-arm off break',
    { battingAbility: 38, technique: 32, timing: 38, power: 60, shotSelection: 34, strikeRotation: 36, runningBetweenWickets: 56 },
    { bowlingAbility: 84, pace: 50, accuracy: 90, swing: 15, seam: 15, spin: 92, variation: 92, control: 90 },
    { fielding: 80, catching: 82, throwing: 82, groundFielding: 80, reaction: 82 }, null,
    'Kolkata Knight Riders / Melbourne Renegades', 'Indian Premier League', 2200, 440,
    { matches: 135, runs: 380, highestScore: 27, battingAverage: 8.5, strikeRate: 65.0, hundreds: 0, fifties: 0, wickets: 215, bowlingAverage: 23.5, economyRate: 4.6, bestBowling: '5/20', catches: 32, stumpings: 0 },
    ['5/20 vs Scotland in T20 World Cup', 'Master of Carrom Ball, Googly, and Off Break']),

  p('afg_gulbadin_naib', 'Gulbadin Naib', 'G. Naib (The Bodybuilder)', 'Afghanistan', 'AFG', 33, '1991-04-08', 'Active', 'STAR', 70, 'All-Rounder', 'Power All-Rounder', 'Right-hand bat', 'Right-arm medium-fast',
    { battingAbility: 76, technique: 72, timing: 78, power: 90, shotSelection: 74, strikeRotation: 76, runningBetweenWickets: 82 },
    { bowlingAbility: 74, pace: 80, accuracy: 76, swing: 74, seam: 76, spin: 15, variation: 80, control: 76 },
    { fielding: 84, catching: 88, throwing: 88, groundFielding: 84, reaction: 86 }, null,
    'Delhi Capitals', 'Indian Premier League', 2100, 420,
    { matches: 145, runs: 2600, highestScore: 82, battingAverage: 24.5, strikeRate: 115.0, hundreds: 0, fifties: 11, wickets: 105, bowlingAverage: 31.0, economyRate: 5.6, bestBowling: '6/43', catches: 52, stumpings: 0 },
    ['Player of the Match in Historic Win vs Australia (4/20 in T20 WC 2024)', 'Bicep Flex Celebration']),

  p('afg_hashmatullah_shahidi', 'Hashmatullah Shahidi', 'H. Shahidi', 'Afghanistan', 'AFG', 29, '1994-11-04', 'Active', 'STAR', 70, 'Batter', 'Middle-Order Anchor & ODI Captain', 'Left-hand bat', 'Right-arm off break',
    { battingAbility: 82, technique: 86, timing: 82, power: 72, shotSelection: 84, strikeRotation: 86, runningBetweenWickets: 86 },
    { bowlingAbility: 15, pace: 25, accuracy: 20, swing: 15, seam: 15, spin: 20, variation: 20, control: 20 },
    { fielding: 84, catching: 88, throwing: 84, groundFielding: 84, reaction: 86 }, null,
    'Afghanistan ODI & Test Captain', 'National', 2200, 440,
    { matches: 125, runs: 4200, highestScore: 200, battingAverage: 38.0, strikeRate: 68.0, hundreds: 3, fifties: 26, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 45, stumpings: 0 },
    ['Afghanistan\'s First Test Double Centurion (200* vs ZIM in Abu Dhabi 2021)', 'Captain of Historic 2023 World Cup Campaign (Beat ENG, PAK, SL, NED)']),

  p('afg_najibullah_zadran', 'Najibullah Zadran', 'N. Zadran', 'Afghanistan', 'AFG', 31, '1993-02-28', 'Active', 'STAR', 68, 'Batter', 'Middle-Order Power Finisher', 'Left-hand bat', 'Right-arm off break',
    { battingAbility: 76, technique: 70, timing: 78, power: 94, shotSelection: 72, strikeRotation: 74, runningBetweenWickets: 84 },
    { bowlingAbility: 10, pace: 20, accuracy: 15, swing: 10, seam: 10, spin: 15, variation: 15, control: 15 },
    { fielding: 84, catching: 88, throwing: 86, groundFielding: 84, reaction: 86 }, null,
    'Afghanistan National Team', 'National', 1700, 340,
    { matches: 185, runs: 3950, highestScore: 104, battingAverage: 29.0, strikeRate: 128.0, hundreds: 1, fifties: 20, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 68, stumpings: 0 },
    ['Clutch 6-Hitter with 140+ T20I Strike Rate', 'Century vs Ireland in Dehradun'])
];

writeCountry('afghanistan.ts', 'AFGHANISTAN_PLAYERS', AFGHANISTAN_PLAYERS);

// 11. ZIMBABWE (ZIM) - 31 players
const ZIMBABWE_PLAYERS = [
  // Legendary (81-90)
  p('zim_andy_flower', 'Andy Flower', 'A. Flower', 'Zimbabwe', 'ZIM', 56, '1968-04-28', 'Retired', 'LEGENDARY', 89, 'Wicketkeeper-Batter', 'Master WK-Batter & Reverse Sweep Pioneer', 'Left-hand bat', 'Right-arm off break',
    { battingAbility: 96, technique: 98, timing: 96, power: 80, shotSelection: 98, strikeRotation: 96, runningBetweenWickets: 92 },
    { bowlingAbility: 15, pace: 25, accuracy: 20, swing: 15, seam: 15, spin: 20, variation: 20, control: 20 },
    { fielding: 92, catching: 96, throwing: 88, groundFielding: 90, reaction: 94 },
    { wicketkeeping: 95, catching: 96, stumping: 95, reflexes: 96 },
    'Royal Challengers Bengaluru (Head Coach)', 'Indian Premier League', 4600, 920,
    { matches: 276, runs: 11580, highestScore: 232, battingAverage: 44.5, strikeRate: 72.0, hundreds: 16, fifties: 82, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 300, stumpings: 47 },
    ['Zimbabwe\'s Greatest Ever Batsman (Test Average 51.54)', '232* vs India in Nagpur (Master of the Reverse Sweep)', 'Ranked #1 Test Batsman in the World in 2001']),

  p('zim_heath_streak', 'Heath Streak', 'H. Streak', 'Zimbabwe', 'ZIM', 49, '1974-03-16', 'Retired', 'LEGENDARY', 87, 'All-Rounder', 'Fast Bowling All-Rounder & Captain', 'Right-hand bat', 'Right-arm fast-medium',
    { battingAbility: 78, technique: 78, timing: 78, power: 84, shotSelection: 78, strikeRotation: 80, runningBetweenWickets: 82 },
    { bowlingAbility: 90, pace: 84, accuracy: 94, swing: 92, seam: 90, spin: 15, variation: 84, control: 92 },
    { fielding: 86, catching: 90, throwing: 88, groundFielding: 86, reaction: 88 }, null,
    'Zimbabwe (Historic Icon)', 'National', 4000, 800,
    { matches: 254, runs: 4934, highestScore: 127, battingAverage: 25.5, strikeRate: 72.0, hundreds: 1, fifties: 24, wickets: 455, bowlingAverage: 28.5, economyRate: 3.6, bestBowling: '6/73', catches: 62, stumpings: 0 },
    ['Zimbabwe\'s All-Time Leading Wicket-Taker (216 Test & 239 ODI Wickets)', '1999 World Cup Super Six Captain']),

  // Superstar (71-80)
  p('zim_sikandar_raza', 'Sikandar Raza', 'S. Raza', 'Zimbabwe', 'ZIM', 38, '1986-04-24', 'Active', 'SUPERSTAR', 80, 'All-Rounder', 'Off Spin Power All-Rounder', 'Right-hand bat', 'Right-arm off break',
    { battingAbility: 85, technique: 84, timing: 88, power: 94, shotSelection: 86, strikeRotation: 88, runningBetweenWickets: 90 },
    { bowlingAbility: 85, pace: 50, accuracy: 90, swing: 15, seam: 15, spin: 90, variation: 92, control: 90 },
    { fielding: 90, catching: 94, throwing: 92, groundFielding: 90, reaction: 92 }, null,
    'Punjab Kings / Zimbabwe T20I Captain', 'Indian Premier League', 4500, 900,
    { matches: 245, runs: 7400, highestScore: 135, battingAverage: 37.0, strikeRate: 110.0, hundreds: 8, fifties: 44, wickets: 215, bowlingAverage: 26.5, economyRate: 4.8, bestBowling: '4/8', catches: 95, stumpings: 0 },
    ['ICC Men\'s T20I Cricketer of the Year Nominee', 'Hero of 2022 T20 World Cup (Defended 1 run vs Pakistan in Perth with 3/25)', 'Fastest Century in T20I History by a Full Member (133* off 43 balls vs Gambia 2024)']),

  p('zim_sean_williams', 'Sean Williams', 'S. Williams', 'Zimbabwe', 'ZIM', 37, '1986-09-26', 'Active', 'SUPERSTAR', 77, 'All-Rounder', 'Left-Arm Spin All-Rounder', 'Left-hand bat', 'Slow left-arm orthodox',
    { battingAbility: 84, technique: 86, timing: 86, power: 80, shotSelection: 86, strikeRotation: 88, runningBetweenWickets: 86 },
    { bowlingAbility: 78, pace: 48, accuracy: 85, swing: 15, seam: 15, spin: 80, variation: 78, control: 85 },
    { fielding: 86, catching: 90, throwing: 86, groundFielding: 86, reaction: 88 }, null,
    'Zimbabwe National Team', 'National', 3600, 720,
    { matches: 232, runs: 6850, highestScore: 174, battingAverage: 36.5, strikeRate: 85.0, hundreds: 9, fifties: 42, wickets: 145, bowlingAverage: 35.0, economyRate: 4.6, bestBowling: '4/21', catches: 88, stumpings: 0 },
    ['174 off 101 balls vs USA (Fastest 150 for Zimbabwe in ODI History)', '151 vs Sri Lanka in Test Cricket']),

  p('zim_craig_ervine', 'Craig Ervine', 'C. Ervine', 'Zimbabwe', 'ZIM', 39, '1985-08-19', 'Active', 'SUPERSTAR', 76, 'Batter', 'Top-Order Batter & ODI/Test Captain', 'Left-hand bat', 'Right-arm off break',
    { battingAbility: 82, technique: 85, timing: 84, power: 76, shotSelection: 84, strikeRotation: 86, runningBetweenWickets: 86 },
    { bowlingAbility: 15, pace: 25, accuracy: 20, swing: 15, seam: 15, spin: 20, variation: 20, control: 20 },
    { fielding: 86, catching: 90, throwing: 86, groundFielding: 86, reaction: 88 }, null,
    'Zimbabwe National Captain', 'National', 3300, 660,
    { matches: 210, runs: 6200, highestScore: 160, battingAverage: 34.0, strikeRate: 74.0, hundreds: 7, fifties: 35, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 95, stumpings: 0 },
    ['Captain who led Zimbabwe to historic ODI Series Win in Sri Lanka', '160 vs New Zealand in Bulawayo']),

  p('zim_blessing_muzarabani', 'Blessing Muzarabani', 'B. Muzarabani', 'Zimbabwe', 'ZIM', 27, '1996-10-02', 'Active', 'SUPERSTAR', 77, 'Bowler', 'Fast Bowler (Steep Bounce)', 'Right-hand bat', 'Right-arm fast-medium',
    { battingAbility: 32, technique: 28, timing: 32, power: 55, shotSelection: 30, strikeRotation: 30, runningBetweenWickets: 55 },
    { bowlingAbility: 86, pace: 88, accuracy: 88, swing: 84, seam: 92, spin: 10, variation: 84, control: 88 },
    { fielding: 84, catching: 86, throwing: 88, groundFielding: 82, reaction: 84 }, null,
    'Karachi Kings / Multan Sultans', 'Pakistan Super League', 3600, 720,
    { matches: 115, runs: 280, highestScore: 30, battingAverage: 8.0, strikeRate: 60.0, hundreds: 0, fifties: 0, wickets: 175, bowlingAverage: 23.5, economyRate: 4.8, bestBowling: '5/49', catches: 30, stumpings: 0 },
    ['6ft 8in Giant Fast Bowler with Searing Bounce', 'Super Over Victory vs Pakistan in Rawalpindi (2020)', 'PSL Champion with Multan Sultans']),

  p('zim_richard_ngarava', 'Richard Ngarava', 'R. Ngarava', 'Zimbabwe', 'ZIM', 26, '1997-12-28', 'Active', 'SUPERSTAR', 76, 'Bowler', 'Left-Arm Fast Bowler', 'Left-hand bat', 'Left-arm fast-medium',
    { battingAbility: 35, technique: 30, timing: 35, power: 65, shotSelection: 32, strikeRotation: 35, runningBetweenWickets: 58 },
    { bowlingAbility: 85, pace: 88, accuracy: 85, swing: 90, seam: 85, spin: 15, variation: 82, control: 85 },
    { fielding: 82, catching: 84, throwing: 88, groundFielding: 82, reaction: 84 }, null,
    'Multan Sultans', 'Pakistan Super League', 3400, 680,
    { matches: 98, runs: 320, highestScore: 38, battingAverage: 10.0, strikeRate: 75.0, hundreds: 0, fifties: 0, wickets: 145, bowlingAverage: 24.0, economyRate: 5.0, bestBowling: '5/28', catches: 25, stumpings: 0 },
    ['Lethal Left-Arm Angle and Early Inswing', 'Key Spearhead in T20 WC 2022 Super 12 Qualification']),

  // Star (61-70)
  p('zim_ryan_burl', 'Ryan Burl', 'R. Burl', 'Zimbabwe', 'ZIM', 30, '1994-04-15', 'Active', 'STAR', 70, 'All-Rounder', 'Leg Spin Power All-Rounder', 'Left-hand bat', 'Right-arm leg break',
    { battingAbility: 76, technique: 72, timing: 78, power: 92, shotSelection: 74, strikeRotation: 76, runningBetweenWickets: 84 },
    { bowlingAbility: 76, pace: 50, accuracy: 78, swing: 15, seam: 15, spin: 82, variation: 80, control: 78 },
    { fielding: 88, catching: 92, throwing: 88, groundFielding: 88, reaction: 90 }, null,
    'Sylhet Strikers', 'Bangladesh Premier League', 2100, 420,
    { matches: 125, runs: 2400, highestScore: 83, battingAverage: 28.0, strikeRate: 125.0, hundreds: 0, fifties: 11, wickets: 85, bowlingAverage: 27.5, economyRate: 6.5, bestBowling: '5/10', catches: 58, stumpings: 0 },
    ['5/10 in 3 Overs vs Australia in Historic Townsville ODI Win (2022)', 'Hit 34 runs in one over off Nasum Ahmed (5 Sixes & 1 Four vs BAN 2022)']),

  p('zim_wellington_masakadza', 'Wellington Masakadza', 'W. Masakadza', 'Zimbabwe', 'ZIM', 30, '1993-10-04', 'Active', 'STAR', 68, 'Bowler', 'Left-Arm Orthodox Spinner', 'Left-hand bat', 'Slow left-arm orthodox',
    { battingAbility: 55, technique: 54, timing: 55, power: 65, shotSelection: 54, strikeRotation: 58, runningBetweenWickets: 65 },
    { bowlingAbility: 76, pace: 48, accuracy: 85, swing: 15, seam: 15, spin: 80, variation: 78, control: 85 },
    { fielding: 84, catching: 88, throwing: 84, groundFielding: 84, reaction: 86 }, null,
    'Mashonaland Eagles', 'Logan Cup', 1700, 340,
    { matches: 88, runs: 650, highestScore: 48, battingAverage: 15.0, strikeRate: 65.0, hundreds: 0, fifties: 0, wickets: 105, bowlingAverage: 28.5, economyRate: 4.6, bestBowling: '4/11', catches: 35, stumpings: 0 },
    ['Consistent economical left-arm orthodox spinner']),

  p('zim_clive_madande', 'Clive Madande', 'C. Madande', 'Zimbabwe', 'ZIM', 24, '2000-04-12', 'Active', 'STAR', 68, 'Wicketkeeper-Batter', 'Finisher WK-Batter', 'Right-hand bat', 'Right-arm off break',
    { battingAbility: 74, technique: 72, timing: 76, power: 84, shotSelection: 74, strikeRotation: 78, runningBetweenWickets: 84 },
    { bowlingAbility: 10, pace: 20, accuracy: 15, swing: 10, seam: 10, spin: 15, variation: 15, control: 15 },
    { fielding: 84, catching: 88, throwing: 84, groundFielding: 84, reaction: 88 },
    { wicketkeeping: 86, catching: 88, stumping: 86, reflexes: 88 },
    'Matabeleland Tuskers', 'Logan Cup', 1600, 320,
    { matches: 48, runs: 850, highestScore: 74, battingAverage: 26.0, strikeRate: 115.0, hundreds: 0, fifties: 3, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 48, stumpings: 8 },
    ['74* vs Ireland in ODI victory', 'Young Zimbabwe First-Choice Wicketkeeper'])
];

writeCountry('zimbabwe.ts', 'ZIMBABWE_PLAYERS', ZIMBABWE_PLAYERS);
