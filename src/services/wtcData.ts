import { StandardCountryCode, WTCTableEntry, WTCFixture } from '../types';

export interface WTCCountryInfo {
  code: StandardCountryCode;
  name: string;
  flag: string;
  shortName: string;
  rating: number;
  primaryColor: string;
  accentColor: string;
  homeVenues: Array<{
    name: string;
    city: string;
    pitch: 'GREEN' | 'PACE_FRIENDLY' | 'SPIN_FRIENDLY' | 'DRY' | 'BATTING' | 'BALANCED';
    weather: 'SUNNY' | 'PARTLY_CLOUDY' | 'CLOUDY' | 'HUMID' | 'WINDY';
  }>;
}

export const WTC_COUNTRIES: WTCCountryInfo[] = [
  {
    code: 'IND',
    name: 'India',
    flag: '🇮🇳',
    shortName: 'IND',
    rating: 92,
    primaryColor: 'from-blue-600 to-indigo-900',
    accentColor: '#3b82f6',
    homeVenues: [
      { name: 'Eden Gardens', city: 'Kolkata', pitch: 'SPIN_FRIENDLY', weather: 'HUMID' },
      { name: 'Wankhede Stadium', city: 'Mumbai', pitch: 'BATTING', weather: 'SUNNY' },
      { name: 'M. Chinnaswamy Stadium', city: 'Bengaluru', pitch: 'BATTING', weather: 'PARTLY_CLOUDY' },
      { name: 'MA Chidambaram Stadium (Chepauk)', city: 'Chennai', pitch: 'DRY', weather: 'HUMID' },
    ],
  },
  {
    code: 'AUS',
    name: 'Australia',
    flag: '🇦🇺',
    shortName: 'AUS',
    rating: 91,
    primaryColor: 'from-amber-500 to-emerald-900',
    accentColor: '#f59e0b',
    homeVenues: [
      { name: 'Melbourne Cricket Ground (MCG)', city: 'Melbourne', pitch: 'BALANCED', weather: 'PARTLY_CLOUDY' },
      { name: 'Sydney Cricket Ground (SCG)', city: 'Sydney', pitch: 'SPIN_FRIENDLY', weather: 'SUNNY' },
      { name: 'The Gabba', city: 'Brisbane', pitch: 'PACE_FRIENDLY', weather: 'HUMID' },
      { name: 'Adelaide Oval', city: 'Adelaide', pitch: 'BATTING', weather: 'SUNNY' },
      { name: 'Optus Stadium (Perth)', city: 'Perth', pitch: 'PACE_FRIENDLY', weather: 'SUNNY' },
    ],
  },
  {
    code: 'ENG',
    name: 'England',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    shortName: 'ENG',
    rating: 89,
    primaryColor: 'from-red-600 to-slate-900',
    accentColor: '#ef4444',
    homeVenues: [
      { name: "Lord's Cricket Ground", city: 'London', pitch: 'GREEN', weather: 'CLOUDY' },
      { name: 'The Oval', city: 'London', pitch: 'BALANCED', weather: 'PARTLY_CLOUDY' },
      { name: 'Headingley', city: 'Leeds', pitch: 'GREEN', weather: 'CLOUDY' },
      { name: 'Edgbaston', city: 'Birmingham', pitch: 'BALANCED', weather: 'PARTLY_CLOUDY' },
    ],
  },
  {
    code: 'SA',
    name: 'South Africa',
    flag: '🇿🇦',
    shortName: 'SA',
    rating: 88,
    primaryColor: 'from-emerald-600 to-yellow-900',
    accentColor: '#10b981',
    homeVenues: [
      { name: 'The Wanderers Stadium', city: 'Johannesburg', pitch: 'PACE_FRIENDLY', weather: 'SUNNY' },
      { name: 'SuperSport Park', city: 'Centurion', pitch: 'PACE_FRIENDLY', weather: 'SUNNY' },
      { name: 'Newlands Cricket Ground', city: 'Cape Town', pitch: 'GREEN', weather: 'WINDY' },
      { name: "Kingsmead", city: 'Durban', pitch: 'BALANCED', weather: 'HUMID' },
    ],
  },
  {
    code: 'NZ',
    name: 'New Zealand',
    flag: '🇳🇿',
    shortName: 'NZ',
    rating: 87,
    primaryColor: 'from-slate-700 to-black',
    accentColor: '#06b6d4',
    homeVenues: [
      { name: 'Basin Reserve', city: 'Wellington', pitch: 'GREEN', weather: 'WINDY' },
      { name: 'Hagley Oval', city: 'Christchurch', pitch: 'GREEN', weather: 'CLOUDY' },
      { name: 'Seddon Park', city: 'Hamilton', pitch: 'BALANCED', weather: 'PARTLY_CLOUDY' },
      { name: 'Eden Park', city: 'Auckland', pitch: 'BATTING', weather: 'SUNNY' },
    ],
  },
  {
    code: 'PAK',
    name: 'Pakistan',
    flag: '🇵🇰',
    shortName: 'PAK',
    rating: 86,
    primaryColor: 'from-emerald-700 to-teal-950',
    accentColor: '#059669',
    homeVenues: [
      { name: 'Gaddafi Stadium', city: 'Lahore', pitch: 'BATTING', weather: 'SUNNY' },
      { name: 'National Bank Stadium', city: 'Karachi', pitch: 'DRY', weather: 'HUMID' },
      { name: 'Rawalpindi Cricket Stadium', city: 'Rawalpindi', pitch: 'BALANCED', weather: 'SUNNY' },
      { name: 'Multan Cricket Stadium', city: 'Multan', pitch: 'SPIN_FRIENDLY', weather: 'SUNNY' },
    ],
  },
  {
    code: 'SL',
    name: 'Sri Lanka',
    flag: '🇱🇰',
    shortName: 'SL',
    rating: 84,
    primaryColor: 'from-blue-700 to-amber-950',
    accentColor: '#38bdf8',
    homeVenues: [
      { name: 'Galle International Stadium', city: 'Galle', pitch: 'SPIN_FRIENDLY', weather: 'HUMID' },
      { name: 'Sinhalese Sports Club (SSC)', city: 'Colombo', pitch: 'BATTING', weather: 'HUMID' },
      { name: 'R. Premadasa Stadium', city: 'Colombo', pitch: 'DRY', weather: 'HUMID' },
    ],
  },
  {
    code: 'WI',
    name: 'West Indies',
    flag: '🌴',
    shortName: 'WI',
    rating: 83,
    primaryColor: 'from-rose-800 to-amber-950',
    accentColor: '#f43f5e',
    homeVenues: [
      { name: 'Kensington Oval', city: 'Bridgetown, Barbados', pitch: 'PACE_FRIENDLY', weather: 'SUNNY' },
      { name: "Queen's Park Oval", city: 'Port of Spain, Trinidad', pitch: 'BALANCED', weather: 'HUMID' },
      { name: 'Sabina Park', city: 'Kingston, Jamaica', pitch: 'PACE_FRIENDLY', weather: 'SUNNY' },
      { name: 'Sir Vivian Richards Stadium', city: 'North Sound, Antigua', pitch: 'BALANCED', weather: 'WINDY' },
    ],
  },
  {
    code: 'BAN',
    name: 'Bangladesh',
    flag: '🇧🇩',
    shortName: 'BAN',
    rating: 82,
    primaryColor: 'from-emerald-800 to-red-950',
    accentColor: '#10b981',
    homeVenues: [
      { name: 'Sher-e-Bangla National Cricket Stadium', city: 'Mirpur, Dhaka', pitch: 'SPIN_FRIENDLY', weather: 'HUMID' },
      { name: 'Zahur Ahmed Chowdhury Stadium', city: 'Chattogram', pitch: 'BATTING', weather: 'HUMID' },
      { name: 'Sylhet International Cricket Stadium', city: 'Sylhet', pitch: 'GREEN', weather: 'PARTLY_CLOUDY' },
    ],
  },
];

// Initial WTC Standings template
export const INITIAL_WTC_STANDINGS: WTCTableEntry[] = [
  { countryCode: 'AUS', countryName: 'Australia', flag: '🇦🇺', seriesPlayed: 0, seriesTotal: 6, matchesPlayed: 0, won: 0, lost: 0, drawn: 0, tied: 0, penaltyPoints: 0, points: 0, maxPossiblePoints: 0, pct: 0, rank: 1 },
  { countryCode: 'IND', countryName: 'India', flag: '🇮🇳', seriesPlayed: 0, seriesTotal: 6, matchesPlayed: 0, won: 0, lost: 0, drawn: 0, tied: 0, penaltyPoints: 0, points: 0, maxPossiblePoints: 0, pct: 0, rank: 2 },
  { countryCode: 'ENG', countryName: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', seriesPlayed: 0, seriesTotal: 6, matchesPlayed: 0, won: 0, lost: 0, drawn: 0, tied: 0, penaltyPoints: 0, points: 0, maxPossiblePoints: 0, pct: 0, rank: 3 },
  { countryCode: 'SA', countryName: 'South Africa', flag: '🇿🇦', seriesPlayed: 0, seriesTotal: 6, matchesPlayed: 0, won: 0, lost: 0, drawn: 0, tied: 0, penaltyPoints: 0, points: 0, maxPossiblePoints: 0, pct: 0, rank: 4 },
  { countryCode: 'NZ', countryName: 'New Zealand', flag: '🇳🇿', seriesPlayed: 0, seriesTotal: 6, matchesPlayed: 0, won: 0, lost: 0, drawn: 0, tied: 0, penaltyPoints: 0, points: 0, maxPossiblePoints: 0, pct: 0, rank: 5 },
  { countryCode: 'PAK', countryName: 'Pakistan', flag: '🇵🇰', seriesPlayed: 0, seriesTotal: 6, matchesPlayed: 0, won: 0, lost: 0, drawn: 0, tied: 0, penaltyPoints: 0, points: 0, maxPossiblePoints: 0, pct: 0, rank: 6 },
  { countryCode: 'SL', countryName: 'Sri Lanka', flag: '🇱🇰', seriesPlayed: 0, seriesTotal: 6, matchesPlayed: 0, won: 0, lost: 0, drawn: 0, tied: 0, penaltyPoints: 0, points: 0, maxPossiblePoints: 0, pct: 0, rank: 7 },
  { countryCode: 'WI', countryName: 'West Indies', flag: '🌴', seriesPlayed: 0, seriesTotal: 6, matchesPlayed: 0, won: 0, lost: 0, drawn: 0, tied: 0, penaltyPoints: 0, points: 0, maxPossiblePoints: 0, pct: 0, rank: 8 },
  { countryCode: 'BAN', countryName: 'Bangladesh', flag: '🇧🇩', seriesPlayed: 0, seriesTotal: 6, matchesPlayed: 0, won: 0, lost: 0, drawn: 0, tied: 0, penaltyPoints: 0, points: 0, maxPossiblePoints: 0, pct: 0, rank: 9 },
];

export interface RealWTCSeriesBlueprint {
  id: string;
  seriesName: string;
  homeTeam: StandardCountryCode;
  awayTeam: StandardCountryCode;
  numberOfTests: number;
  seasonLabel: string;
  dates: Array<{ start: string; end: string }>;
}

// Official WTC 2025-27 FTP Cycle Series Pairings
export const REAL_WTC_SERIES_BLUEPRINT: RealWTCSeriesBlueprint[] = [
  // 2025 Series
  {
    id: 'series_eng_ind_2025',
    seriesName: 'India Tour of England (5 Tests - Pataudi Trophy)',
    homeTeam: 'ENG',
    awayTeam: 'IND',
    numberOfTests: 5,
    seasonLabel: 'June – August 2025',
    dates: [
      { start: '2025-06-20', end: '2025-06-24' },
      { start: '2025-07-02', end: '2025-07-06' },
      { start: '2025-07-16', end: '2025-07-20' },
      { start: '2025-07-30', end: '2025-08-03' },
      { start: '2025-08-13', end: '2025-08-17' },
    ],
  },
  {
    id: 'series_pak_ban_2025',
    seriesName: 'Bangladesh Tour of Pakistan (2 Tests)',
    homeTeam: 'PAK',
    awayTeam: 'BAN',
    numberOfTests: 2,
    seasonLabel: 'August 2025',
    dates: [
      { start: '2025-08-21', end: '2025-08-25' },
      { start: '2025-08-30', end: '2025-09-03' },
    ],
  },
  {
    id: 'series_ind_ban_2025',
    seriesName: 'Bangladesh Tour of India (2 Tests)',
    homeTeam: 'IND',
    awayTeam: 'BAN',
    numberOfTests: 2,
    seasonLabel: 'September – October 2025',
    dates: [
      { start: '2025-09-19', end: '2025-09-23' },
      { start: '2025-09-27', end: '2025-10-01' },
    ],
  },
  {
    id: 'series_ind_nz_2025',
    seriesName: 'New Zealand Tour of India (3 Tests)',
    homeTeam: 'IND',
    awayTeam: 'NZ',
    numberOfTests: 3,
    seasonLabel: 'October – November 2025',
    dates: [
      { start: '2025-10-16', end: '2025-10-20' },
      { start: '2025-10-24', end: '2025-10-28' },
      { start: '2025-11-01', end: '2025-11-05' },
    ],
  },
  {
    id: 'series_ban_sa_2025',
    seriesName: 'South Africa Tour of Bangladesh (2 Tests)',
    homeTeam: 'BAN',
    awayTeam: 'SA',
    numberOfTests: 2,
    seasonLabel: 'October – November 2025',
    dates: [
      { start: '2025-10-21', end: '2025-10-25' },
      { start: '2025-10-29', end: '2025-11-02' },
    ],
  },
  {
    id: 'series_aus_ind_2025',
    seriesName: 'Border-Gavaskar Trophy (India in Australia, 5 Tests)',
    homeTeam: 'AUS',
    awayTeam: 'IND',
    numberOfTests: 5,
    seasonLabel: 'November 2025 – January 2026',
    dates: [
      { start: '2025-11-22', end: '2025-11-26' },
      { start: '2025-12-06', end: '2025-12-10' },
      { start: '2025-12-14', end: '2025-12-18' },
      { start: '2025-12-26', end: '2025-12-30' },
      { start: '2026-01-03', end: '2026-01-07' },
    ],
  },
  {
    id: 'series_wi_ban_2025',
    seriesName: 'Bangladesh Tour of West Indies (2 Tests)',
    homeTeam: 'WI',
    awayTeam: 'BAN',
    numberOfTests: 2,
    seasonLabel: 'November – December 2025',
    dates: [
      { start: '2025-11-22', end: '2025-11-26' },
      { start: '2025-11-30', end: '2025-12-04' },
    ],
  },
  {
    id: 'series_sa_sl_2025',
    seriesName: 'Sri Lanka Tour of South Africa (2 Tests)',
    homeTeam: 'SA',
    awayTeam: 'SL',
    numberOfTests: 2,
    seasonLabel: 'November – December 2025',
    dates: [
      { start: '2025-11-27', end: '2025-12-01' },
      { start: '2025-12-05', end: '2025-12-09' },
    ],
  },
  {
    id: 'series_nz_eng_2025',
    seriesName: 'England Tour of New Zealand (3 Tests)',
    homeTeam: 'NZ',
    awayTeam: 'ENG',
    numberOfTests: 3,
    seasonLabel: 'November – December 2025',
    dates: [
      { start: '2025-11-28', end: '2025-12-02' },
      { start: '2025-12-06', end: '2025-12-10' },
      { start: '2025-12-14', end: '2025-12-18' },
    ],
  },
  {
    id: 'series_sa_pak_2025',
    seriesName: 'Pakistan Tour of South Africa (2 Tests)',
    homeTeam: 'SA',
    awayTeam: 'PAK',
    numberOfTests: 2,
    seasonLabel: 'December 2025 – January 2026',
    dates: [
      { start: '2025-12-26', end: '2025-12-30' },
      { start: '2026-01-03', end: '2026-01-07' },
    ],
  },

  // 2026 Series
  {
    id: 'series_sl_aus_2026',
    seriesName: 'Australia Tour of Sri Lanka (2 Tests - Warne-Muralitharan Trophy)',
    homeTeam: 'SL',
    awayTeam: 'AUS',
    numberOfTests: 2,
    seasonLabel: 'January – February 2026',
    dates: [
      { start: '2026-01-29', end: '2026-02-02' },
      { start: '2026-02-06', end: '2026-02-10' },
    ],
  },
  {
    id: 'series_ban_sl_2026',
    seriesName: 'Sri Lanka Tour of Bangladesh (2 Tests)',
    homeTeam: 'BAN',
    awayTeam: 'SL',
    numberOfTests: 2,
    seasonLabel: 'March 2026',
    dates: [
      { start: '2026-03-08', end: '2026-03-12' },
      { start: '2026-03-18', end: '2026-03-22' },
    ],
  },
  {
    id: 'series_eng_pak_2026',
    seriesName: 'Pakistan Tour of England (3 Tests)',
    homeTeam: 'ENG',
    awayTeam: 'PAK',
    numberOfTests: 3,
    seasonLabel: 'July – August 2026',
    dates: [
      { start: '2026-07-09', end: '2026-07-13' },
      { start: '2026-07-23', end: '2026-07-27' },
      { start: '2026-08-06', end: '2026-08-10' },
    ],
  },
  {
    id: 'series_ban_aus_2026',
    seriesName: 'Australia Tour of Bangladesh (2 Tests)',
    homeTeam: 'BAN',
    awayTeam: 'AUS',
    numberOfTests: 2,
    seasonLabel: 'August – September 2026',
    dates: [
      { start: '2026-08-25', end: '2026-08-29' },
      { start: '2026-09-04', end: '2026-09-08' },
    ],
  },
  {
    id: 'series_ind_wi_2026',
    seriesName: 'West Indies Tour of India (2 Tests)',
    homeTeam: 'IND',
    awayTeam: 'WI',
    numberOfTests: 2,
    seasonLabel: 'October 2026',
    dates: [
      { start: '2026-10-08', end: '2026-10-12' },
      { start: '2026-10-18', end: '2026-10-22' },
    ],
  },
  {
    id: 'series_ind_sa_2026',
    seriesName: 'South Africa Tour of India (2 Tests)',
    homeTeam: 'IND',
    awayTeam: 'SA',
    numberOfTests: 2,
    seasonLabel: 'November 2026',
    dates: [
      { start: '2026-11-12', end: '2026-11-16' },
      { start: '2026-11-22', end: '2026-11-26' },
    ],
  },
  {
    id: 'series_aus_eng_2026',
    seriesName: 'The Ashes (England in Australia, 5 Tests)',
    homeTeam: 'AUS',
    awayTeam: 'ENG',
    numberOfTests: 5,
    seasonLabel: 'November 2026 – January 2027',
    dates: [
      { start: '2026-11-20', end: '2026-11-24' },
      { start: '2026-12-04', end: '2026-12-08' },
      { start: '2026-12-17', end: '2026-12-21' },
      { start: '2026-12-26', end: '2026-12-30' },
      { start: '2027-01-04', end: '2027-01-08' },
    ],
  },
  {
    id: 'series_sa_aus_2027',
    seriesName: 'Australia Tour of South Africa (3 Tests)',
    homeTeam: 'SA',
    awayTeam: 'AUS',
    numberOfTests: 3,
    seasonLabel: 'February – March 2027',
    dates: [
      { start: '2027-02-12', end: '2027-02-16' },
      { start: '2027-02-22', end: '2027-02-26' },
      { start: '2027-03-05', end: '2027-03-09' },
    ],
  },
  {
    id: 'series_nz_pak_2027',
    seriesName: 'Pakistan Tour of New Zealand (2 Tests)',
    homeTeam: 'NZ',
    awayTeam: 'PAK',
    numberOfTests: 2,
    seasonLabel: 'March 2027',
    dates: [
      { start: '2027-03-12', end: '2027-03-16' },
      { start: '2027-03-22', end: '2027-03-26' },
    ],
  },
];

// Helper: Generate all fixtures for a user's chosen country
export function generateWTCFixturesForCountry(userCountry: StandardCountryCode): WTCFixture[] {
  const allFixtures: WTCFixture[] = [];
  let counter = 1;

  for (const series of REAL_WTC_SERIES_BLUEPRINT) {
    const isUserSeries = series.homeTeam === userCountry || series.awayTeam === userCountry;
    const homeInfo = WTC_COUNTRIES.find((c) => c.code === series.homeTeam)!;

    for (let testIdx = 0; testIdx < series.numberOfTests; testIdx++) {
      const dates = series.dates[testIdx] || {
        start: '2026-06-01',
        end: '2026-06-05',
      };

      const venueIdx = testIdx % homeInfo.homeVenues.length;
      const venueData = homeInfo.homeVenues[venueIdx];

      allFixtures.push({
        id: `wtc_${series.id}_test_${testIdx + 1}`,
        seriesId: series.id,
        seriesName: series.seriesName,
        matchNumberInSeries: testIdx + 1,
        totalMatchesInSeries: series.numberOfTests,
        homeTeam: series.homeTeam,
        awayTeam: series.awayTeam,
        venue: `${venueData.name}, ${venueData.city}`,
        city: venueData.city,
        pitch: venueData.pitch,
        weather: venueData.weather,
        startDate: dates.start,
        endDate: dates.end,
        status: 'scheduled',
        isUserMatch: isUserSeries,
      });

      counter++;
    }
  }

  // Sort chronologically by start date
  allFixtures.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  return allFixtures;
}

// Generate the WTC Final fixture
export function generateWTCFinalFixture(team1: StandardCountryCode, team2: StandardCountryCode): WTCFixture {
  return {
    id: 'wtc_final_2027_lords',
    seriesId: 'wtc_final_2027',
    seriesName: 'ICC World Test Championship 2025–27 Final',
    matchNumberInSeries: 1,
    totalMatchesInSeries: 1,
    homeTeam: team1,
    awayTeam: team2,
    venue: "Lord's Cricket Ground, London",
    city: 'London, England',
    pitch: 'BALANCED',
    weather: 'SUNNY',
    startDate: '2027-06-11',
    endDate: '2027-06-15',
    status: 'scheduled',
    isUserMatch: true,
    isFinal: true,
  };
}
