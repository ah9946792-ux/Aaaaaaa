const { p, writeCountry } = require('./player_builder_base.cjs');
const fs = require('fs');
const path = require('path');

console.log('Generating Canada (35) and completing England (35) & Australia (35)...');

const CANADA_PLAYERS = [
  p('can_saad_bin_zafar', 'Saad Bin Zafar', 'Saad Bin Zafar', 'Canada', 'CAN', 37, '1986-11-10', 'Active', 'SUPERSTAR', 84, 'All-Rounder', 'Canada Captain & Historic 4-4-0-2 in T20I Final (World Record)', 'Left-hand bat', 'Slow left-arm orthodox',
    { battingAbility: 82, technique: 84, timing: 84, power: 86, shotSelection: 84, strikeRotation: 86, runningBetweenWickets: 90 },
    { bowlingAbility: 88, pace: 48, accuracy: 99, swing: 15, seam: 15, spin: 92, variation: 88, control: 99 },
    { fielding: 96, catching: 98, throwing: 94, groundFielding: 96, reaction: 96 }, null,
    'Toronto Nationals (GT20 Champions) / Canada Captain', 'Global T20 Canada', 4200, 840,
    { matches: 85, runs: 1450, highestScore: 78, battingAverage: 26.0, strikeRate: 98.0, hundreds: 0, fifties: 5, wickets: 110, bowlingAverage: 19.5, economyRate: 4.1, bestBowling: '5/18', catches: 45, stumpings: 0 },
    ['World Record: Bowled 4 maiden overs with 2 wickets (4-4-0-2) in a T20I match vs Panama in 2021', 'Captained Canada in the 2024 ICC Men\'s T20 World Cup in USA & West Indies', 'Man of the Match in inaugural Global T20 Canada final (79* off 48 balls)']),

  p('can_nicholas_kirton', 'Nicholas Kirton', 'Nicholas Kirton', 'Canada', 'CAN', 26, '1998-05-06', 'Active', 'SUPERSTAR', 84, 'Batter', 'Canada 2024 T20 World Cup Hero & 51 vs USA & 49 vs Ireland', 'Left-hand bat', 'Right-arm off break',
    { battingAbility: 90, technique: 88, timing: 92, power: 94, shotSelection: 88, strikeRotation: 90, runningBetweenWickets: 95 },
    { bowlingAbility: 40, pace: 45, accuracy: 65, swing: 15, seam: 15, spin: 65, variation: 60, control: 65 },
    { fielding: 96, catching: 98, throwing: 95, groundFielding: 96, reaction: 96 }, null,
    'Toronto Nationals / Barbados Pride / Canada Star', 'Global T20 Canada / CPL', 4400, 880,
    { matches: 42, runs: 1250, highestScore: 73, battingAverage: 38.0, strikeRate: 142.0, hundreds: 0, fifties: 8, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 28, stumpings: 0 },
    ['Player of the Match in Canada\'s historic 2024 T20 World Cup victory vs Ireland in New York (49 off 35 balls on tough pitch)', 'Blistering 51 off 31 balls vs USA in tournament opener in Dallas', 'First-class batter for Barbados in West Indies domestic cricket']),

  p('can_aaron_johnson', 'Aaron Johnson', 'Aaron Johnson', 'Canada', 'CAN', 33, '1991-03-16', 'Active', 'SUPERSTAR', 82, 'Batter', '121* vs Oman & 109* vs Bahrain (Fastest Associate Centuries)', 'Right-hand bat', 'Right-arm off break',
    { battingAbility: 90, technique: 84, timing: 90, power: 99, shotSelection: 84, strikeRotation: 88, runningBetweenWickets: 92 },
    { bowlingAbility: 10, pace: 20, accuracy: 15, swing: 10, seam: 10, spin: 15, variation: 15, control: 15 },
    { fielding: 94, catching: 96, throwing: 92, groundFielding: 94, reaction: 95 }, null,
    'Brampton Wolves / Canada Destructive Opener', 'Global T20 Canada', 4100, 820,
    { matches: 48, runs: 1750, highestScore: 121, battingAverage: 38.5, strikeRate: 148.0, hundreds: 3, fifties: 9, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 25, stumpings: 0 },
    ['Explosive 109* off 69 balls vs Bahrain and 121* off 59 balls vs Oman', '52 off 44 balls vs Pakistan in 2024 T20 World Cup in New York', 'One of the highest career strike rates in Associate T20I cricket']),

  p('can_navneet_dhaliwal', 'Navneet Dhaliwal', 'Navneet Dhaliwal', 'Canada', 'CAN', 35, '1988-10-10', 'Active', 'SUPERSTAR', 82, 'Batter', '61 off 44 balls vs USA in 2024 World Cup Opener & Longtime Captain', 'Right-hand bat', 'Right-arm medium-fast',
    { battingAbility: 88, technique: 90, timing: 90, power: 88, shotSelection: 90, strikeRotation: 90, runningBetweenWickets: 92 },
    { bowlingAbility: 50, pace: 75, accuracy: 78, swing: 78, seam: 74, spin: 10, variation: 70, control: 78 },
    { fielding: 95, catching: 97, throwing: 92, groundFielding: 95, reaction: 95 }, null,
    'Vancouver Knights / Canada Former Captain', 'Global T20 Canada', 4000, 800,
    { matches: 65, runs: 2100, highestScore: 140, battingAverage: 36.0, strikeRate: 128.0, hundreds: 2, fifties: 12, wickets: 12, bowlingAverage: 26.0, economyRate: 5.2, bestBowling: '3/24', catches: 38, stumpings: 0 },
    ['Scored 61 off 44 balls in Canada\'s historic 2024 T20 World Cup opener vs USA in Dallas', 'Captained Canada in ICC T20 World Cup Qualifiers', '140 in ICC Americas tournament']),

  p('can_dillon_heyliger', 'Dillon Heyliger', 'Dillon Heyliger', 'Canada', 'CAN', 34, '1989-10-21', 'Active', 'SUPERSTAR', 82, 'All-Rounder', '2/18 vs Ireland & 2/18 vs Pakistan in 2024 T20 World Cup & 140 km/h', 'Right-hand bat', 'Right-arm fast-medium',
    { battingAbility: 80, technique: 78, timing: 80, power: 92, shotSelection: 78, strikeRotation: 80, runningBetweenWickets: 88 },
    { bowlingAbility: 88, pace: 88, accuracy: 96, swing: 92, seam: 92, spin: 10, variation: 92, control: 96 },
    { fielding: 95, catching: 97, throwing: 95, groundFielding: 95, reaction: 96 }, null,
    'Montreal Tigers (GT20 Champions) / Canada Strike Pacer', 'Global T20 Canada', 4200, 840,
    { matches: 58, runs: 680, highestScore: 58, battingAverage: 22.0, strikeRate: 135.0, hundreds: 0, fifties: 2, wickets: 75, bowlingAverage: 18.5, economyRate: 4.8, bestBowling: '5/16', catches: 25, stumpings: 0 },
    ['Phenomenal spell of 2/18 in Canada\'s famous World Cup win vs Ireland (dismissed Balbirnie and Dockrell)', '2/18 in 4 overs vs Pakistan in New York', '5/16 vs Argentina in T20I']),

  p('can_kaleem_sana', 'Kaleem Sana', 'Kaleem Sana', 'Canada', 'CAN', 30, '1994-01-01', 'Active', 'SUPERSTAR', 82, 'Bowler', '142 km/h Express Left-Arm Swing & 5/43 in CWC Qualifier & GT20 MVP', 'Right-hand bat', 'Left-arm fast-medium',
    { battingAbility: 30, technique: 25, timing: 30, power: 60, shotSelection: 28, strikeRotation: 30, runningBetweenWickets: 68 },
    { bowlingAbility: 90, pace: 92, accuracy: 94, swing: 98, seam: 94, spin: 10, variation: 90, control: 94 },
    { fielding: 94, catching: 96, throwing: 94, groundFielding: 94, reaction: 95 }, null,
    'Montreal Tigers / Canada Pace Spearhead', 'Global T20 Canada', 4200, 840,
    { matches: 45, runs: 120, highestScore: 22, battingAverage: 8.0, strikeRate: 60.0, hundreds: 0, fifties: 0, wickets: 78, bowlingAverage: 18.0, economyRate: 4.4, bestBowling: '5/43', catches: 16, stumpings: 0 },
    ['5/43 vs Jersey in ICC Cricket World Cup Qualifier Play-off', 'Leading wicket-taker in Global T20 Canada with fierce in-swing to right handers', 'Dismissed Rohit Sharma and Babar Azam in warmups/internationals']),

  p('can_jeremy_gordon', 'Jeremy Gordon', 'Jeremy Gordon', 'Canada', 'CAN', 37, '1987-01-20', 'Active', 'SUPERSTAR', 80, 'Bowler', '145 km/h Express Spearhead & 2/16 vs Ireland & 6/43 vs Jersey', 'Right-hand bat', 'Right-arm fast',
    { battingAbility: 25, technique: 20, timing: 25, power: 65, shotSelection: 22, strikeRotation: 25, runningBetweenWickets: 65 },
    { bowlingAbility: 88, pace: 94, accuracy: 92, swing: 90, seam: 92, spin: 10, variation: 88, control: 92 },
    { fielding: 92, catching: 95, throwing: 94, groundFielding: 92, reaction: 94 }, null,
    'Brampton Wolves / Canada Fast Bowler', 'Global T20 Canada', 3800, 760,
    { matches: 52, runs: 140, highestScore: 24, battingAverage: 7.0, strikeRate: 60.0, hundreds: 0, fifties: 0, wickets: 85, bowlingAverage: 20.0, economyRate: 4.6, bestBowling: '6/43', catches: 15, stumpings: 0 },
    ['6/43 vs Jersey in ICC CWC Qualifier Play-off', 'Express 145 km/h hostile bouncers in 2024 T20 World Cup win vs Ireland (2/16 in 4 overs)']),

  p('can_john_davison', 'John Davison', 'John Davison', 'Canada', 'CAN', 54, '1970-05-09', 'Retired', 'ICON', 90, 'All-Rounder', 'Legendary 67-Ball World Cup Century vs WI (Fastest at 2003 World Cup)', 'Right-hand bat', 'Right-arm off break',
    { battingAbility: 94, technique: 90, timing: 96, power: 99, shotSelection: 90, strikeRotation: 90, runningBetweenWickets: 92 },
    { bowlingAbility: 88, pace: 48, accuracy: 96, swing: 15, seam: 15, spin: 92, variation: 88, control: 96 },
    { fielding: 95, catching: 97, throwing: 94, groundFielding: 95, reaction: 96 }, null,
    'Canada All-Time Greatest Icon & Captain', 'National', 5200, 1040,
    { matches: 75, runs: 2450, highestScore: 111, battingAverage: 33.0, strikeRate: 110.0, hundreds: 2, fifties: 11, wickets: 85, bowlingAverage: 22.0, economyRate: 3.8, bestBowling: '5/15', catches: 35, stumpings: 0 },
    ['Scored the fastest century in World Cup history at the time (111 off 67 balls with 6 sixes vs West Indies at Centurion in 2003)', '52 off 31 balls vs New Zealand at 2007 World Cup', '17 wickets in First-Class cricket match (8/61 & 9/76) for Canada in ICC Intercontinental Cup']),

  p('can_ashish_bagai', 'Ashish Bagai', 'Ashish Bagai', 'Canada', 'CAN', 42, '1982-01-26', 'Retired', 'LEGENDARY', 86, 'Wicketkeeper-Batter', 'Canada World Cup Captain (2003, 2007, 2011) & 137* vs Scotland', 'Right-hand bat', 'Right-arm off break',
    { battingAbility: 90, technique: 92, timing: 92, power: 84, shotSelection: 92, strikeRotation: 94, runningBetweenWickets: 94 },
    { bowlingAbility: 10, pace: 20, accuracy: 15, swing: 10, seam: 10, spin: 15, variation: 15, control: 15 },
    { fielding: 98, catching: 99, throwing: 95, groundFielding: 96, reaction: 99 },
    { wicketkeeping: 98, catching: 99, stumping: 98, reflexes: 99 },
    'Canada All-Time Greatest Wicketkeeper & Captain', 'National', 4500, 900,
    { matches: 115, runs: 3600, highestScore: 137, battingAverage: 38.5, strikeRate: 75.0, hundreds: 4, fifties: 22, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 112, stumpings: 24 },
    ['Played in 3 Cricket World Cups (2003, 2007, 2011) and captained in 2011', '137* vs Scotland in ICC Intercontinental Cup', 'Over 3,600 runs and 130 dismissals for Canada']),

  p('can_rizwan_cheema', 'Rizwan Cheema', 'Rizwan Cheema', 'Canada', 'CAN', 45, '1978-08-15', 'Retired', 'LEGENDARY', 85, 'All-Rounder', 'Legendary Power Hitter & 130 vs Bermuda & 2011 World Cup Star', 'Right-hand bat', 'Right-arm medium-fast',
    { battingAbility: 88, technique: 82, timing: 88, power: 99, shotSelection: 82, strikeRotation: 84, runningBetweenWickets: 88 },
    { bowlingAbility: 84, pace: 82, accuracy: 90, swing: 90, seam: 86, spin: 10, variation: 86, control: 90 },
    { fielding: 94, catching: 96, throwing: 94, groundFielding: 94, reaction: 95 }, null,
    'Canada Legendary Power Hitter', 'National', 3900, 780,
    { matches: 82, runs: 2450, highestScore: 130, battingAverage: 30.0, strikeRate: 135.0, hundreds: 2, fifties: 14, wickets: 65, bowlingAverage: 24.0, economyRate: 4.8, bestBowling: '4/28', catches: 35, stumpings: 0 },
    ['Famous for monster six-hitting in 2011 World Cup in India & Sri Lanka', '89 off 61 balls on ODI debut vs West Indies', '130 off 84 balls vs Bermuda']),

  p('can_pargat_singh', 'Pargat Singh', 'Pargat Singh', 'Canada', 'CAN', 32, '1992-04-13', 'Active', 'STAR', 78, 'Batter', '102 vs UAE in Harare World Cup Qualifier & Steady No. 3', 'Right-hand bat', 'Right-arm off break',
    { battingAbility: 86, technique: 88, timing: 88, power: 86, shotSelection: 88, strikeRotation: 90, runningBetweenWickets: 92 },
    { bowlingAbility: 60, pace: 48, accuracy: 75, swing: 15, seam: 15, spin: 75, variation: 70, control: 75 },
    { fielding: 94, catching: 96, throwing: 92, groundFielding: 94, reaction: 95 }, null,
    'Surrey Jaguars / Canada Top Order', 'Global T20 Canada', 3500, 700,
    { matches: 38, runs: 1150, highestScore: 102, battingAverage: 34.0, strikeRate: 95.0, hundreds: 1, fifties: 6, wickets: 8, bowlingAverage: 28.0, economyRate: 4.9, bestBowling: '2/18', catches: 20, stumpings: 0 },
    ['102 off 96 balls vs UAE in 2023 ICC World Cup Qualifier in Harare', 'Rock at No. 3 in 2024 T20 World Cup victory vs Ireland']),

  p('can_shreyas_movva', 'Shreyas Movva', 'Shreyas Movva', 'Canada', 'CAN', 30, '1993-09-04', 'Active', 'STAR', 76, 'Wicketkeeper-Batter', '37 vs Ireland in World Cup Win & 68 vs Namibia in Windhoek', 'Right-hand bat', 'Right-arm off break',
    { battingAbility: 84, technique: 86, timing: 86, power: 84, shotSelection: 86, strikeRotation: 88, runningBetweenWickets: 92 },
    { bowlingAbility: 10, pace: 20, accuracy: 15, swing: 10, seam: 10, spin: 15, variation: 15, control: 15 },
    { fielding: 96, catching: 98, throwing: 94, groundFielding: 96, reaction: 98 },
    { wicketkeeping: 96, catching: 98, stumping: 96, reflexes: 98 },
    'Montreal Tigers / Canada Wicketkeeper', 'Global T20 Canada', 3400, 680,
    { matches: 42, runs: 850, highestScore: 68, battingAverage: 29.0, strikeRate: 110.0, hundreds: 0, fifties: 4, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 45, stumpings: 12 },
    ['Crucial 37 runs in 2024 T20 World Cup win vs Ireland in New York', 'Flawless glovework standing up to the stumps in international matches']),

  p('can_ravinderpal_singh', 'Ravinderpal Singh', 'Ravinderpal Singh', 'Canada', 'CAN', 35, '1988-10-14', 'Active', 'STAR', 78, 'Batter', '101 off 48 balls on T20I Debut (World Record for Debut Century)', 'Right-hand bat', 'Right-arm medium',
    { battingAbility: 88, technique: 82, timing: 88, power: 98, shotSelection: 82, strikeRotation: 84, runningBetweenWickets: 90 },
    { bowlingAbility: 30, pace: 40, accuracy: 50, swing: 15, seam: 15, spin: 50, variation: 45, control: 50 },
    { fielding: 94, catching: 96, throwing: 92, groundFielding: 94, reaction: 95 }, null,
    'Vancouver Knights / Canada Power Finisher', 'Global T20 Canada', 3500, 700,
    { matches: 38, runs: 980, highestScore: 101, battingAverage: 31.0, strikeRate: 155.0, hundreds: 1, fifties: 5, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 18, stumpings: 0 },
    ['First player in T20I history to score a century on debut (101 off 48 balls with 10 sixes vs Cayman Islands in 2019)', 'Drafted in CPL by Barbados Tridents']),

  p('can_junaid_siddiqui_can', 'Junaid Siddiqui (CAN)', 'Junaid Siddiqui', 'Canada', 'CAN', 39, '1985-03-25', 'Active', 'STAR', 76, 'Bowler', 'Leg-Spin Wizard & 2024 World Cup Squad & 4/30 in CWC League 2', 'Right-hand bat', 'Right-arm leg break',
    { battingAbility: 35, technique: 30, timing: 35, power: 60, shotSelection: 32, strikeRotation: 35, runningBetweenWickets: 68 },
    { bowlingAbility: 86, pace: 50, accuracy: 94, swing: 15, seam: 15, spin: 94, variation: 92, control: 94 },
    { fielding: 92, catching: 95, throwing: 90, groundFielding: 92, reaction: 94 }, null,
    'Toronto Nationals / Canada Veteran Leggy', 'Global T20 Canada', 3200, 640,
    { matches: 45, runs: 210, highestScore: 33, battingAverage: 10.0, strikeRate: 65.0, hundreds: 0, fifties: 0, wickets: 60, bowlingAverage: 22.0, economyRate: 4.4, bestBowling: '4/30', catches: 15, stumpings: 0 },
    ['Veteran leg-spinner in 2024 T20 World Cup squad', 'Sharp googly and drifting leg-breaks']),

  p('can_henry_osinde', 'Henry Osinde', 'Henry Osinde', 'Canada', 'CAN', 45, '1978-10-17', 'Retired', 'LEGENDARY', 85, 'Bowler', '4/26 vs Kenya in 2011 World Cup & 142 km/h Express Spearhead', 'Right-hand bat', 'Right-arm fast-medium',
    { battingAbility: 30, technique: 25, timing: 30, power: 65, shotSelection: 28, strikeRotation: 30, runningBetweenWickets: 65 },
    { bowlingAbility: 88, pace: 90, accuracy: 94, swing: 94, seam: 92, spin: 10, variation: 88, control: 94 },
    { fielding: 92, catching: 95, throwing: 92, groundFielding: 92, reaction: 94 }, null,
    'Canada 2007 & 2011 World Cup Spearhead', 'National', 3800, 760,
    { matches: 68, runs: 280, highestScore: 37, battingAverage: 8.0, strikeRate: 50.0, hundreds: 0, fifties: 0, wickets: 95, bowlingAverage: 22.0, economyRate: 4.5, bestBowling: '4/26', catches: 18, stumpings: 0 },
    ['Man of the Match with 4/26 in Canada\'s famous 2011 World Cup win vs Kenya in Delhi', 'Played in 2007 and 2011 ICC Cricket World Cups']),

  p('can_sunil_dhaniram', 'Sunil Dhaniram', 'Sunil Dhaniram', 'Canada', 'CAN', 55, '1968-10-17', 'Retired', 'LEGENDARY', 85, 'All-Rounder', '5/32 vs Bermuda & 2007 World Cup Star & Guyana First-Class Hero', 'Left-hand bat', 'Slow left-arm orthodox',
    { battingAbility: 86, technique: 88, timing: 88, power: 86, shotSelection: 88, strikeRotation: 88, runningBetweenWickets: 86 },
    { bowlingAbility: 88, pace: 48, accuracy: 98, swing: 15, seam: 15, spin: 92, variation: 88, control: 98 },
    { fielding: 94, catching: 96, throwing: 90, groundFielding: 94, reaction: 95 }, null,
    'Canada 2007 World Cup Star', 'National', 3900, 780,
    { matches: 75, runs: 1950, highestScore: 92, battingAverage: 28.0, strikeRate: 75.0, hundreds: 0, fifties: 11, wickets: 88, bowlingAverage: 21.0, economyRate: 3.8, bestBowling: '5/32', catches: 35, stumpings: 0 },
    ['Key all-rounder at 2007 World Cup in West Indies', '5/32 vs Bermuda in Toronto', 'Over 1,900 runs and 80 wickets for Canada']),

  p('can_geoff_barnett', 'Geoff Barnett', 'Geoff Barnett', 'Canada', 'CAN', 40, '1984-02-03', 'Retired', 'STAR', 74, 'Batter', '101 vs Bermuda & Central Districts (NZ) First-Class Opener', 'Left-hand bat', 'Right-arm medium',
    { battingAbility: 86, technique: 88, timing: 90, power: 84, shotSelection: 88, strikeRotation: 88, runningBetweenWickets: 90 },
    { bowlingAbility: 10, pace: 20, accuracy: 15, swing: 10, seam: 10, spin: 15, variation: 15, control: 15 },
    { fielding: 94, catching: 96, throwing: 90, groundFielding: 94, reaction: 95 }, null,
    'Central Districts / Canada 2007 World Cup', 'Plunket Shield', 3000, 600,
    { matches: 45, runs: 1450, highestScore: 101, battingAverage: 33.0, strikeRate: 74.0, hundreds: 1, fifties: 9, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 22, stumpings: 0 },
    ['101 vs Bermuda in Toronto', 'Played for Central Districts in New Zealand First-Class cricket before starring for Canada at 2007 World Cup']),

  p('can_haninder_dhillon', 'Haninder Dhillon', 'Haninder Dhillon', 'Canada', 'CAN', 44, '1980-03-08', 'Retired', 'STAR', 70, 'Batter', '2003 World Cup Middle Order Batter & 55 vs Kenya', 'Right-hand bat', 'Right-arm off break',
    { battingAbility: 82, technique: 84, timing: 84, power: 80, shotSelection: 84, strikeRotation: 84, runningBetweenWickets: 86 },
    { bowlingAbility: 10, pace: 20, accuracy: 15, swing: 10, seam: 10, spin: 15, variation: 15, control: 15 },
    { fielding: 92, catching: 95, throwing: 90, groundFielding: 92, reaction: 94 }, null,
    'Canada 2003 World Cup Squad', 'National', 2400, 480,
    { matches: 38, runs: 850, highestScore: 55, battingAverage: 24.0, strikeRate: 60.0, hundreds: 0, fifties: 3, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 15, stumpings: 0 },
    ['Member of Canada team at 2003 World Cup in South Africa', 'Scored 55 vs Kenya in Nairobi']),

  p('can_abdool_samad', 'Abdool Samad', 'Abdool Samad', 'Canada', 'CAN', 45, '1979-05-30', 'Retired', 'STAR', 72, 'Wicketkeeper-Batter', '130 vs Bermuda & 2003 World Cup Opener & Keeper', 'Right-hand bat', 'Right-arm off break',
    { battingAbility: 84, technique: 84, timing: 86, power: 84, shotSelection: 84, strikeRotation: 86, runningBetweenWickets: 88 },
    { bowlingAbility: 10, pace: 20, accuracy: 15, swing: 10, seam: 10, spin: 15, variation: 15, control: 15 },
    { fielding: 95, catching: 97, throwing: 92, groundFielding: 94, reaction: 96 },
    { wicketkeeping: 95, catching: 97, stumping: 95, reflexes: 96 },
    'Canada 2003 World Cup Opener', 'National', 2700, 540,
    { matches: 45, runs: 1250, highestScore: 130, battingAverage: 27.0, strikeRate: 68.0, hundreds: 1, fifties: 6, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 38, stumpings: 8 },
    ['Opened batting and kept wicket in 2003 World Cup', '130 vs Bermuda in ICC Americas Championship']),

  p('can_harvir_baidwan', 'Harvir Baidwan', 'Harvir Baidwan', 'Canada', 'CAN', 37, '1987-07-31', 'Retired', 'SUPERSTAR', 82, 'Bowler', 'Leading Wicket-Taker at 2011 World Cup for Canada (13 Wickets)', 'Right-hand bat', 'Right-arm medium-fast',
    { battingAbility: 50, technique: 45, timing: 50, power: 75, shotSelection: 48, strikeRotation: 50, runningBetweenWickets: 70 },
    { bowlingAbility: 88, pace: 84, accuracy: 96, swing: 94, seam: 92, spin: 10, variation: 92, control: 96 },
    { fielding: 94, catching: 96, throwing: 92, groundFielding: 94, reaction: 95 }, null,
    'Canada 2011 World Cup Leading Wicket-Taker', 'National', 3900, 780,
    { matches: 62, runs: 580, highestScore: 42, battingAverage: 14.0, strikeRate: 75.0, hundreds: 0, fifties: 0, wickets: 92, bowlingAverage: 21.5, economyRate: 4.8, bestBowling: '5/44', catches: 22, stumpings: 0 },
    ['Canada\'s leading wicket taker at 2011 Cricket World Cup with 13 wickets (including 3/35 vs Pakistan and 3/59 vs Australia)', '5/44 vs Ireland in ICC Intercontinental Cup']),

  p('can_khurram_chohan', 'Khurram Chohan', 'Khurram Chohan', 'Canada', 'CAN', 44, '1980-02-22', 'Retired', 'STAR', 74, 'Bowler', '140 km/h Fast Seamer in 2011 World Cup & Lahore First-Class Star', 'Right-hand bat', 'Right-arm fast-medium',
    { battingAbility: 30, technique: 25, timing: 30, power: 65, shotSelection: 28, strikeRotation: 30, runningBetweenWickets: 65 },
    { bowlingAbility: 86, pace: 88, accuracy: 92, swing: 92, seam: 90, spin: 10, variation: 86, control: 92 },
    { fielding: 92, catching: 95, throwing: 92, groundFielding: 92, reaction: 94 }, null,
    'Canada 2011 World Cup Bowler', 'National', 3000, 600,
    { matches: 48, runs: 240, highestScore: 25, battingAverage: 8.0, strikeRate: 55.0, hundreds: 0, fifties: 0, wickets: 65, bowlingAverage: 23.5, economyRate: 4.7, bestBowling: '4/20', catches: 15, stumpings: 0 },
    ['Dismissed Ricky Ponting in 2011 World Cup in Bangalore', 'Over 200 first-class wickets in Pakistan and Canada']),

  p('can_hiral_patel', 'Hiral Patel', 'Hiral Patel', 'Canada', 'CAN', 33, '1991-08-10', 'Active', 'STAR', 72, 'All-Rounder', '54 off 37 balls vs Australia (Lee/Johnson) in 2011 World Cup', 'Right-hand bat', 'Slow left-arm orthodox',
    { battingAbility: 84, technique: 82, timing: 86, power: 90, shotSelection: 82, strikeRotation: 84, runningBetweenWickets: 90 },
    { bowlingAbility: 78, pace: 48, accuracy: 88, swing: 15, seam: 15, spin: 86, variation: 82, control: 88 },
    { fielding: 94, catching: 96, throwing: 92, groundFielding: 94, reaction: 95 }, null,
    'Canada 2011 World Cup Teen Star', 'Global T20 Canada', 2800, 560,
    { matches: 42, runs: 950, highestScore: 88, battingAverage: 25.0, strikeRate: 110.0, hundreds: 0, fifties: 5, wickets: 25, bowlingAverage: 26.0, economyRate: 5.1, bestBowling: '3/18', catches: 18, stumpings: 0 },
    ['Famous 54 off 37 balls vs Brett Lee, Mitchell Johnson and Shaun Tait in 2011 World Cup in Bangalore at age 19', 'Left-arm orthodox spin']),

  p('can_manny_aulakh', 'Manny Aulakh', 'Manny Aulakh', 'Canada', 'CAN', 32, '1991-11-17', 'Retired', 'STAR', 68, 'Bowler', 'Fast Bowler in 2012 World T20 Qualifier & 3/17 vs Nepal', 'Right-hand bat', 'Right-arm medium-fast',
    { battingAbility: 20, technique: 15, timing: 20, power: 50, shotSelection: 18, strikeRotation: 20, runningBetweenWickets: 60 },
    { bowlingAbility: 84, pace: 85, accuracy: 90, swing: 90, seam: 88, spin: 10, variation: 84, control: 90 },
    { fielding: 88, catching: 92, throwing: 90, groundFielding: 88, reaction: 90 }, null,
    'Canada National', 'National', 2200, 440,
    { matches: 28, runs: 45, highestScore: 12, battingAverage: 4.0, strikeRate: 35.0, hundreds: 0, fifties: 0, wickets: 34, bowlingAverage: 24.0, economyRate: 4.8, bestBowling: '3/17', catches: 8, stumpings: 0 },
    ['3/17 vs Nepal in ICC World T20 Qualifier in UAE', 'Sharp hit-the-deck pace bowling']),

  p('can_zubin_surkari', 'Zubin Surkari', 'Zubin Surkari', 'Canada', 'CAN', 44, '1980-02-26', 'Retired', 'STAR', 70, 'Batter', '139 vs Cayman Islands & 2011 World Cup Middle Order', 'Right-hand bat', 'Right-arm off break',
    { battingAbility: 84, technique: 86, timing: 86, power: 80, shotSelection: 86, strikeRotation: 88, runningBetweenWickets: 88 },
    { bowlingAbility: 10, pace: 20, accuracy: 15, swing: 10, seam: 10, spin: 15, variation: 15, control: 15 },
    { fielding: 94, catching: 96, throwing: 90, groundFielding: 94, reaction: 95 }, null,
    'Canada 2011 World Cup Squad', 'National', 2600, 520,
    { matches: 42, runs: 1100, highestScore: 139, battingAverage: 29.0, strikeRate: 66.0, hundreds: 1, fifties: 5, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 20, stumpings: 0 },
    ['139 vs Cayman Islands in ICC Americas Championship', 'Played in 2011 World Cup matches in Delhi and Colombo']),

  p('can_parveen_kumar', 'Parveen Kumar', 'Parveen Kumar', 'Canada', 'CAN', 34, '1989-12-10', 'Active', 'STAR', 70, 'Bowler', 'Slow Left-Arm Orthodox & 3/16 vs Bahrain', 'Left-hand bat', 'Slow left-arm orthodox',
    { battingAbility: 35, technique: 30, timing: 35, power: 60, shotSelection: 32, strikeRotation: 35, runningBetweenWickets: 68 },
    { bowlingAbility: 86, pace: 48, accuracy: 94, swing: 15, seam: 15, spin: 90, variation: 86, control: 94 },
    { fielding: 92, catching: 95, throwing: 90, groundFielding: 92, reaction: 94 }, null,
    'Canada National', 'World Cricket League', 2400, 480,
    { matches: 28, runs: 95, highestScore: 18, battingAverage: 8.0, strikeRate: 50.0, hundreds: 0, fifties: 0, wickets: 38, bowlingAverage: 21.0, economyRate: 4.2, bestBowling: '3/16', catches: 10, stumpings: 0 },
    ['Tight left-arm spinner in ICC World Cricket League Division 3 title run', 'Under 4.3 career economy rate']),

  p('can_cecilm_pervez', 'Cecil Pervez', 'Cecil Pervez', 'Canada', 'CAN', 41, '1983-04-12', 'Retired', 'STAR', 70, 'Bowler', 'Right-Arm Fast-Medium & 4/29 vs Argentina', 'Right-hand bat', 'Right-arm medium-fast',
    { battingAbility: 25, technique: 20, timing: 25, power: 60, shotSelection: 22, strikeRotation: 25, runningBetweenWickets: 65 },
    { bowlingAbility: 84, pace: 85, accuracy: 92, swing: 92, seam: 88, spin: 10, variation: 84, control: 92 },
    { fielding: 90, catching: 94, throwing: 90, groundFielding: 90, reaction: 92 }, null,
    'Canada Veteran Pacer', 'National', 2400, 480,
    { matches: 40, runs: 120, highestScore: 16, battingAverage: 6.0, strikeRate: 45.0, hundreds: 0, fifties: 0, wickets: 52, bowlingAverage: 23.0, economyRate: 4.5, bestBowling: '4/29', catches: 12, stumpings: 0 },
    ['4/29 in ICC Americas Division 1', 'Longtime seam bowler for Canada']),

  p('can_ammar_khalid', 'Ammar Khalid', 'Ammar Khalid', 'Canada', 'CAN', 35, '1989-01-20', 'Active', 'STAR', 70, 'Bowler', 'Right-Arm Fast Seamer & 4/17 in ICC League 2', 'Right-hand bat', 'Right-arm fast-medium',
    { battingAbility: 20, technique: 15, timing: 20, power: 50, shotSelection: 18, strikeRotation: 20, runningBetweenWickets: 60 },
    { bowlingAbility: 86, pace: 88, accuracy: 90, swing: 90, seam: 90, spin: 10, variation: 86, control: 90 },
    { fielding: 90, catching: 94, throwing: 92, groundFielding: 90, reaction: 92 }, null,
    'Montreal Tigers / Canada', 'Global T20 Canada', 2500, 500,
    { matches: 22, runs: 35, highestScore: 10, battingAverage: 5.0, strikeRate: 40.0, hundreds: 0, fifties: 0, wickets: 30, bowlingAverage: 21.0, economyRate: 4.8, bestBowling: '4/17', catches: 8, stumpings: 0 },
    ['4/17 in ICC Americas T20 Qualifier', 'Hit-the-deck fast bowler for Montreal Tigers in GT20 Canada']),

  p('can_harsh_thaker', 'Harsh Thaker', 'Harsh Thaker', 'Canada', 'CAN', 26, '1997-10-24', 'Active', 'SUPERSTAR', 82, 'All-Rounder', '111* vs UAE & 5/20 vs Ireland & Top All-Rounder in League 2', 'Right-hand bat', 'Right-arm off break',
    { battingAbility: 88, technique: 88, timing: 90, power: 86, shotSelection: 88, strikeRotation: 90, runningBetweenWickets: 92 },
    { bowlingAbility: 88, pace: 50, accuracy: 98, swing: 15, seam: 15, spin: 92, variation: 90, control: 98 },
    { fielding: 96, catching: 98, throwing: 94, groundFielding: 96, reaction: 96 }, null,
    'Vancouver Knights / Canada Leading All-Rounder', 'Global T20 Canada', 4100, 820,
    { matches: 52, runs: 1450, highestScore: 111, battingAverage: 38.0, strikeRate: 85.0, hundreds: 2, fifties: 7, wickets: 68, bowlingAverage: 19.5, economyRate: 3.9, bestBowling: '5/20', catches: 28, stumpings: 0 },
    ['Scored 111* off 113 balls and took 3/28 in same match vs UAE in Dubai in 2024', 'Sensational 5/20 vs Ireland in ODI series', 'One of the top-ranked all-rounders in ICC Men\'s Cricket World Cup League 2']),

  p('can_rayyan_pathan', 'Rayyan Pathan', 'Rayyan Pathan', 'Canada', 'CAN', 32, '1991-12-06', 'Active', 'STAR', 74, 'Batter', '107* vs Bahamas & Explosive Power Striker', 'Right-hand bat', 'Right-arm medium-fast',
    { battingAbility: 86, technique: 82, timing: 86, power: 96, shotSelection: 82, strikeRotation: 84, runningBetweenWickets: 90 },
    { bowlingAbility: 50, pace: 78, accuracy: 75, swing: 75, seam: 72, spin: 10, variation: 70, control: 75 },
    { fielding: 94, catching: 96, throwing: 92, groundFielding: 94, reaction: 95 }, null,
    'Vancouver Knights / Canada Power Striker', 'Global T20 Canada', 3100, 620,
    { matches: 35, runs: 950, highestScore: 107, battingAverage: 32.0, strikeRate: 145.0, hundreds: 1, fifties: 5, wickets: 8, bowlingAverage: 28.0, economyRate: 5.6, bestBowling: '2/15', catches: 18, stumpings: 0 },
    ['107* off 62 balls with 9 sixes vs Bahamas in T20I', 'Powerplay destructive hitter']),

  p('can_ishwar_jot_sohi', 'Ishwarjot Sohi', 'Ishwarjot Sohi', 'Canada', 'CAN', 22, '2002-04-14', 'Active', 'STAR', 70, 'Bowler', 'Left-Arm Fast-Medium & Canada U19 Spearhead & 3/24 in GT20', 'Right-hand bat', 'Left-arm medium-fast',
    { battingAbility: 25, technique: 20, timing: 25, power: 55, shotSelection: 22, strikeRotation: 25, runningBetweenWickets: 65 },
    { bowlingAbility: 84, pace: 85, accuracy: 90, swing: 92, seam: 90, spin: 10, variation: 86, control: 90 },
    { fielding: 92, catching: 95, throwing: 90, groundFielding: 92, reaction: 94 }, null,
    'Toronto Nationals', 'Global T20 Canada', 2300, 460,
    { matches: 18, runs: 45, highestScore: 12, battingAverage: 6.0, strikeRate: 40.0, hundreds: 0, fifties: 0, wickets: 24, bowlingAverage: 22.0, economyRate: 5.1, bestBowling: '3/24', catches: 8, stumpings: 0 },
    ['Led Canada U19 pace attack at 2022 U19 World Cup in West Indies', 'Left-arm swing']),

  p('can_akhil_kumar', 'Akhil Kumar', 'Akhil Kumar', 'Canada', 'CAN', 23, '2001-07-22', 'Active', 'STAR', 70, 'Bowler', 'Right-Arm Fast Bowler & 3/20 vs USA', 'Right-hand bat', 'Right-arm fast-medium',
    { battingAbility: 25, technique: 20, timing: 25, power: 55, shotSelection: 22, strikeRotation: 25, runningBetweenWickets: 65 },
    { bowlingAbility: 84, pace: 86, accuracy: 90, swing: 90, seam: 90, spin: 10, variation: 84, control: 90 },
    { fielding: 90, catching: 94, throwing: 92, groundFielding: 90, reaction: 92 }, null,
    'Vancouver Knights', 'Global T20 Canada', 2300, 460,
    { matches: 16, runs: 30, highestScore: 10, battingAverage: 5.0, strikeRate: 40.0, hundreds: 0, fifties: 0, wickets: 20, bowlingAverage: 23.0, economyRate: 5.4, bestBowling: '3/20', catches: 6, stumpings: 0 },
    ['Emerging young fast bowler with seam movement and yorker skills']),

  p('can_nicholas_standford', 'Nicholas Standford', 'Nicholas Standford', 'Canada', 'CAN', 37, '1987-05-18', 'Retired', 'STAR', 68, 'Batter', 'Canada Middle Order Strokeplay & 65 vs USA', 'Right-hand bat', 'Right-arm off break',
    { battingAbility: 82, technique: 82, timing: 84, power: 80, shotSelection: 82, strikeRotation: 84, runningBetweenWickets: 86 },
    { bowlingAbility: 10, pace: 20, accuracy: 15, swing: 10, seam: 10, spin: 15, variation: 15, control: 15 },
    { fielding: 90, catching: 94, throwing: 88, groundFielding: 90, reaction: 92 }, null,
    'Canada National', 'National', 2100, 420,
    { matches: 25, runs: 580, highestScore: 65, battingAverage: 24.0, strikeRate: 68.0, hundreds: 0, fifties: 2, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 10, stumpings: 0 },
    ['65 vs USA in ICC Americas Division 1', 'Solid middle-order presence']),

  p('can_asif_mulla', 'Asif Mulla', 'Asif Mulla', 'Canada', 'CAN', 44, '1980-03-05', 'Retired', 'STAR', 70, 'Wicketkeeper-Batter', '2007 World Cup Wicketkeeper & 57 vs Bermuda', 'Right-hand bat', 'Right-arm medium',
    { battingAbility: 82, technique: 84, timing: 84, power: 78, shotSelection: 84, strikeRotation: 86, runningBetweenWickets: 88 },
    { bowlingAbility: 10, pace: 20, accuracy: 15, swing: 10, seam: 10, spin: 15, variation: 15, control: 15 },
    { fielding: 95, catching: 97, throwing: 90, groundFielding: 94, reaction: 96 },
    { wicketkeeping: 95, catching: 97, stumping: 95, reflexes: 96 },
    'Canada 2007 World Cup Wicketkeeper', 'National', 2500, 500,
    { matches: 35, runs: 750, highestScore: 57, battingAverage: 25.0, strikeRate: 62.0, hundreds: 0, fifties: 3, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 32, stumpings: 6 },
    ['Wicketkeeper for Canada in the 2007 Cricket World Cup in St Lucia', '57 vs Bermuda in Toronto']),

  p('can_don_maxwell', 'Don Maxwell', 'Don Maxwell', 'Canada', 'CAN', 58, '1966-02-14', 'Retired', 'STAR', 68, 'All-Rounder', 'Pioneer Canada All-Rounder & 4/30 in 1997 ICC Trophy', 'Right-hand bat', 'Right-arm medium-fast',
    { battingAbility: 78, technique: 76, timing: 78, power: 82, shotSelection: 76, strikeRotation: 78, runningBetweenWickets: 84 },
    { bowlingAbility: 82, pace: 80, accuracy: 88, swing: 88, seam: 86, spin: 10, variation: 80, control: 88 },
    { fielding: 90, catching: 94, throwing: 88, groundFielding: 90, reaction: 92 }, null,
    'Canada Pioneer', 'National', 2200, 440,
    { matches: 32, runs: 650, highestScore: 58, battingAverage: 22.0, strikeRate: 65.0, hundreds: 0, fifties: 2, wickets: 35, bowlingAverage: 23.0, economyRate: 3.8, bestBowling: '4/30', catches: 14, stumpings: 0 },
    ['Represented Canada in 1994 and 1997 ICC Trophy campaigns in Kenya and Malaysia', 'Seam and swing bowler']),

  p('can_danny_singh', 'Danny Singh', 'Danny Singh', 'Canada', 'CAN', 56, '1968-04-10', 'Retired', 'STAR', 68, 'Bowler', '1997 ICC Trophy Spearhead & 4/22 vs Fiji', 'Right-hand bat', 'Right-arm fast-medium',
    { battingAbility: 20, technique: 15, timing: 20, power: 50, shotSelection: 18, strikeRotation: 20, runningBetweenWickets: 60 },
    { bowlingAbility: 84, pace: 85, accuracy: 90, swing: 92, seam: 88, spin: 10, variation: 84, control: 90 },
    { fielding: 88, catching: 92, throwing: 90, groundFielding: 88, reaction: 90 }, null,
    'Canada 1997 ICC Trophy', 'National', 2200, 440,
    { matches: 28, runs: 55, highestScore: 12, battingAverage: 5.0, strikeRate: 40.0, hundreds: 0, fifties: 0, wickets: 36, bowlingAverage: 22.0, economyRate: 3.6, bestBowling: '4/22', catches: 8, stumpings: 0 },
    ['Spearheaded Canada\'s pace bowling attack in 1997 ICC Trophy in Kuala Lumpur', 'Economy under 3.7'])
];

writeCountry('canada.ts', 'CANADA_PLAYERS', CANADA_PLAYERS);

// Now let's handle England (add 5 players to england.ts)
const EXTRA_ENGLAND_PLAYERS = [
  p('eng_moeen_ali', 'Moeen Ali', 'Moeen Ali (Mo)', 'England', 'ENG', 37, '1987-06-18', 'Retired', 'ICON', 88, 'All-Rounder', 'Dual World Cup Champion (2019 ODI & 2022 T20) & CSK IPL Champion & 3,000+ Runs & 200+ Wickets', 'Left-hand bat', 'Right-arm off break',
    { battingAbility: 90, technique: 92, timing: 96, power: 95, shotSelection: 90, strikeRotation: 92, runningBetweenWickets: 92 },
    { bowlingAbility: 88, pace: 50, accuracy: 96, swing: 15, seam: 15, spin: 94, variation: 92, control: 96 },
    { fielding: 96, catching: 98, throwing: 95, groundFielding: 96, reaction: 96 }, null,
    'Warwickshire / Chennai Super Kings / England Legend', 'County Championship / IPL', 4800, 960,
    { matches: 298, runs: 6850, highestScore: 155, battingAverage: 30.0, strikeRate: 125.0, hundreds: 8, fifties: 28, wickets: 366, bowlingAverage: 28.0, economyRate: 4.8, bestBowling: '6/53', catches: 110, stumpings: 0 },
    ['2019 ICC Cricket World Cup Champion & 2022 ICC Men\'s T20 World Cup Champion', 'Test Hat-trick vs South Africa at The Oval in 2017', 'Over 3,000 Test runs and 200 Test wickets', '5x IPL & franchise champion with Chennai Super Kings']),

  p('eng_chris_woakes', 'Chris Woakes', 'Chris Woakes (Wizard)', 'England', 'ENG', 35, '1989-03-02', 'Active', 'SUPERSTAR', 86, 'All-Rounder', 'Dual World Cup Champion (2019 & 2022) & Player of the Series 2023 Ashes & Lord\'s Centurion', 'Right-hand bat', 'Right-arm fast-medium',
    { battingAbility: 84, technique: 86, timing: 88, power: 88, shotSelection: 86, strikeRotation: 86, runningBetweenWickets: 90 },
    { bowlingAbility: 92, pace: 88, accuracy: 99, swing: 99, seam: 96, spin: 10, variation: 92, control: 99 },
    { fielding: 96, catching: 98, throwing: 95, groundFielding: 96, reaction: 96 }, null,
    'Warwickshire / England Seam King', 'County Championship / Test', 4600, 920,
    { matches: 225, runs: 3450, highestScore: 137, battingAverage: 26.0, strikeRate: 85.0, hundreds: 1, fifties: 11, wickets: 360, bowlingAverage: 27.5, economyRate: 4.2, bestBowling: '6/17', catches: 85, stumpings: 0 },
    ['Player of the Series in 2023 Ashes with 19 wickets at 18.14', 'Opening spell of 3/37 in 2019 World Cup Final vs New Zealand at Lord\'s', 'Scored Test century (137*) and took 6/17 at Lord\'s (Honours board double)']),

  p('eng_eoin_morgan', 'Eoin Morgan', 'Eoin Morgan (Morgs)', 'England', 'ENG', 37, '1986-09-10', 'Retired', 'ICON', 90, 'Batter', '2019 World Cup Winning Captain & World Record 17 Sixes in an ODI (148 vs AFG)', 'Left-hand bat', 'Right-arm medium',
    { battingAbility: 92, technique: 90, timing: 94, power: 99, shotSelection: 92, strikeRotation: 94, runningBetweenWickets: 94 },
    { bowlingAbility: 10, pace: 20, accuracy: 15, swing: 10, seam: 10, spin: 15, variation: 15, control: 15 },
    { fielding: 96, catching: 98, throwing: 94, groundFielding: 96, reaction: 96 }, null,
    'Middlesex / KKR (IPL Finalist Captain) / England 2019 World Cup Captain', 'National', 5200, 1040,
    { matches: 379, runs: 10850, highestScore: 148, battingAverage: 38.0, strikeRate: 110.0, hundreds: 16, fifties: 64, wickets: 0, bowlingAverage: 0, economyRate: 0, bestBowling: '0/0', catches: 145, stumpings: 0 },
    ['Captained England to their historic first-ever ICC Cricket World Cup triumph in 2019', 'World Record for Most Sixes in an ODI Innings (17 sixes in 148 off 71 balls vs Afghanistan at Old Trafford)', 'England\'s all-time record run-scorer and match-winner in limited-overs cricket']),

  p('eng_andrew_flintoff', 'Andrew Flintoff', 'Andrew Flintoff (Freddie)', 'England', 'ENG', 46, '1977-12-06', 'Retired', 'ICON', 91, 'All-Rounder', 'Legendary 2005 Ashes Hero & ICC Player of the Year & 150 km/h Reverse Swing Master', 'Right-hand bat', 'Right-arm fast',
    { battingAbility: 90, technique: 88, timing: 92, power: 99, shotSelection: 88, strikeRotation: 90, runningBetweenWickets: 92 },
    { bowlingAbility: 94, pace: 95, accuracy: 96, swing: 99, seam: 95, spin: 10, variation: 94, control: 96 },
    { fielding: 98, catching: 99, throwing: 98, groundFielding: 98, reaction: 98 }, null,
    'Lancashire / Chennai Super Kings / England All-Time Legend', 'National', 5400, 1080,
    { matches: 227, runs: 7350, highestScore: 167, battingAverage: 32.0, strikeRate: 85.0, hundreds: 8, fifties: 44, wickets: 395, bowlingAverage: 26.5, economyRate: 3.8, bestBowling: '5/19', catches: 110, stumpings: 0 },
    ['Player of the Series in the iconic 2005 Ashes series (402 runs and 24 wickets)', 'ICC Cricketer of the Year (Sir Garfield Sobers Trophy) in 2005', 'Iconic reverse swing bowling at 93+ mph and blistering counter-attacking batting']),

  p('eng_paul_collingwood', 'Paul Collingwood', 'Paul Collingwood (Colly)', 'England', 'ENG', 48, '1976-05-26', 'Retired', 'LEGENDARY', 87, 'All-Rounder', 'Captained England to 2010 ICC World T20 Title & 3x Ashes Winner & 206 vs AUS in Adelaide', 'Right-hand bat', 'Right-arm medium',
    { battingAbility: 88, technique: 92, timing: 90, power: 84, shotSelection: 92, strikeRotation: 94, runningBetweenWickets: 95 },
    { bowlingAbility: 82, pace: 78, accuracy: 94, swing: 90, seam: 88, spin: 10, variation: 92, control: 94 },
    { fielding: 99, catching: 99, throwing: 98, groundFielding: 99, reaction: 99 }, null,
    'Durham / Delhi Daredevils / England 2010 T20 World Cup Winning Captain', 'National', 4600, 920,
    { matches: 300, runs: 9450, highestScore: 206, battingAverage: 37.0, strikeRate: 75.0, hundreds: 15, fifties: 46, wickets: 145, bowlingAverage: 32.0, economyRate: 4.4, bestBowling: '6/31', catches: 180, stumpings: 0 },
    ['First England Captain to win a global ICC Men\'s trophy (2010 ICC World Twenty20 in West Indies)', 'Scored double century (206) in Adelaide Ashes Test', 'Regarded as one of the greatest backward point fielders in cricket history (180+ international catches)'])
];

// Append EXTRA_ENGLAND_PLAYERS into england.ts
const engPath = path.join(__dirname, '../src/data/players/england.ts');
let engContent = fs.readFileSync(engPath, 'utf-8');
// Find closing bracket
const lastEngBracket = engContent.lastIndexOf('];');
if (lastEngBracket !== -1) {
  const extraEngStr = EXTRA_ENGLAND_PLAYERS.map(player => '  ' + JSON.stringify(player, null, 2).replace(/\n/g, '\n  ')).join(',\n') + '\n';
  engContent = engContent.slice(0, lastEngBracket).trimEnd() + ',\n' + extraEngStr + '];\n';
  fs.writeFileSync(engPath, engContent, 'utf-8');
  console.log('Updated england.ts with 5 extra players (Total: 35).');
}

// Now let's handle Australia (add Steve Waugh to make it 35)
const EXTRA_AUS_PLAYER = p('aus_steve_waugh', 'Steve Waugh', 'Steve Waugh (Tugga)', 'Australia', 'AUS', 59, '1965-06-02', 'Retired', 'ICON', 92, 'Batter', '1999 World Cup Winning Captain & 168 Tests & 10,927 Test Runs (32 Centuries) & Ice Man', 'Right-hand bat', 'Right-arm medium',
  { battingAbility: 96, technique: 98, timing: 95, power: 88, shotSelection: 98, strikeRotation: 95, runningBetweenWickets: 95 },
  { bowlingAbility: 82, pace: 80, accuracy: 94, swing: 92, seam: 90, spin: 10, variation: 94, control: 94 },
  { fielding: 98, catching: 99, throwing: 95, groundFielding: 98, reaction: 98 }, null,
  'New South Wales / Australia Legendary Captain', 'National', 5800, 1160,
  { matches: 493, runs: 18496, highestScore: 200, battingAverage: 45.0, strikeRate: 75.0, hundreds: 35, fifties: 95, wickets: 287, bowlingAverage: 34.0, economyRate: 4.1, bestBowling: '5/28', catches: 223, stumpings: 0 },
  ['Captained Australia to victory in the 1999 ICC Cricket World Cup (famous 120* vs South Africa at Headingley)', 'Led Australia to a World Record 16 consecutive Test match victories', '10,927 Test runs in 168 Tests with 32 centuries and 287 international wickets', 'Legendary back-to-the-wall grit and master of the back-of-the-hand slower ball']);

const ausPath = path.join(__dirname, '../src/data/players/australia.ts');
let ausContent = fs.readFileSync(ausPath, 'utf-8');
const lastAusBracket = ausContent.lastIndexOf('];');
if (lastAusBracket !== -1) {
  const extraAusStr = '  ' + JSON.stringify(EXTRA_AUS_PLAYER, null, 2).replace(/\n/g, '\n  ') + '\n';
  ausContent = ausContent.slice(0, lastAusBracket).trimEnd() + ',\n' + extraAusStr + '];\n';
  fs.writeFileSync(ausPath, ausContent, 'utf-8');
  console.log('Updated australia.ts with Steve Waugh (Total: 35).');
}
