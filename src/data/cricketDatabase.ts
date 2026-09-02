import {
  DreamPlayer,
  GlobalCricketPlayer,
  GlobalMarketPlayer,
  PlayingRole,
  PlayerTier,
} from '../types';
import { GLOBAL_PLAYERS_DATABASE } from './players';

export interface DistrictInfo {
  name: string;
  clubs: string[];
}

export interface DivisionInfo {
  name: string;
  districts: DistrictInfo[];
}

export interface CountryStructure {
  country: string;
  code: string;
  divisions: DivisionInfo[];
  domesticClubs: string[];
  nationalTeammates: string[];
}

export const COUNTRIES_DATA: CountryStructure[] = [
  {
    country: 'Bangladesh',
    code: 'BAN',
    divisions: [
      {
        name: 'Dhaka',
        districts: [
          { name: 'Mirpur', clubs: ['Mirpur Gladiators', 'Sher-e-Bangla CC', 'Dhaka Young Stars'] },
          { name: 'Dhanmondi', clubs: ['Dhanmondi Dynamos', 'Abahani Youth Academy', 'Lakeside Pioneers'] },
          { name: 'Gulshan', clubs: ['Gulshan Warriors', 'North End CC', 'Banani Royals'] },
          { name: 'Gazipur', clubs: ['Gazipur Tigers', 'Bhawal CC', 'Tongi Strikers'] },
          { name: 'Narayanganj', clubs: ['Narayanganj Dockers', 'Shitalakshya CC', 'Osmani Fighters'] },
        ],
      },
      {
        name: 'Chittagong',
        districts: [
          { name: 'Chittagong Sadar', clubs: ['Port City Titans', 'Karnaphuli CC', 'Anderkilla XI'] },
          { name: "Cox's Bazar", clubs: ['Bay Watchers CC', 'Beach City Strikers', 'Himchari XI'] },
          { name: 'Comilla', clubs: ['Comilla Victorians Academy', 'Maynamati CC', 'Gomti Smashers'] },
          { name: 'Noakhali', clubs: ['Noakhali Warriors', 'Coastal CC', 'Maijdee Lions'] },
        ],
      },
      {
        name: 'Sylhet',
        districts: [
          { name: 'Sylhet Sadar', clubs: ['Surma Strikers', 'Tea Valley CC', 'Hazrat Shahjalal XI'] },
          { name: 'Moulvibazar', clubs: ['Moulvibazar Knights', 'Monu River CC', 'Sreemangal XI'] },
          { name: 'Habiganj', clubs: ['Habiganj Challengers', 'Khowai CC', 'Madhabpur Lions'] },
        ],
      },
      {
        name: 'Rajshahi',
        districts: [
          { name: 'Rajshahi Sadar', clubs: ['Silk City Kings', 'Padma Pride CC', 'Varendra Warriors'] },
          { name: 'Bogra', clubs: ['Bogra Blasters', 'Karatoa CC', 'Mahasthangarh XI'] },
          { name: 'Pabna', clubs: ['Pabna Pioneers', 'Ichamati CC', 'Paksey Knights'] },
        ],
      },
      {
        name: 'Khulna',
        districts: [
          { name: 'Khulna Sadar', clubs: ['Sundarbans Roar', 'Rupsha Tigers CC', 'Khulna Titans Academy'] },
          { name: 'Jessore', clubs: ['Jessore Jets', 'Bhairab CC', 'Benapole XI'] },
          { name: 'Kushtia', clubs: ['Lalon CC', 'Kushtia Kings', 'Gorai Warriors'] },
        ],
      },
      {
        name: 'Barisal',
        districts: [
          { name: 'Barisal Sadar', clubs: ['Kirtankhola Kings', 'Barisal Burners Club', 'Bonoful CC'] },
          { name: 'Bhola', clubs: ['Island Warriors CC', 'Meghna Strikers', 'Bhola Titans'] },
        ],
      },
      {
        name: 'Rangpur',
        districts: [
          { name: 'Rangpur Sadar', clubs: ['Rangpur Riders Academy', 'Teesta Titans CC', 'Tajhat Kings'] },
          { name: 'Dinajpur', clubs: ['Dinajpur Dynamos', 'Kantaji CC', 'Punarbhaba XI'] },
        ],
      },
      {
        name: 'Mymensingh',
        districts: [
          { name: 'Mymensingh Sadar', clubs: ['Brahmaputra Blue CC', 'Zainul CC', 'Mymensingh Panthers'] },
          { name: 'Jamalpur', clubs: ['Jamalpur Jaguars', 'Brahmaputra Lions', 'Melandah XI'] },
        ],
      },
    ],
    domesticClubs: [
      'Abahani Limited Dhaka',
      'Mohammedan Sporting Club',
      'Prime Bank Cricket Club',
      'Sheikh Jamal Dhanmondi Club',
      'Legends of Rupganj',
      'Gazi Group Cricketers',
      'Brothers Union',
      'Prime Doleshwar SC',
    ],
    nationalTeammates: [
      'Shakib Al Hasan',
      'Tamim Iqbal',
      'Mushfiqur Rahim',
      'Litton Das',
      'Mustafizur Rahman',
      'Taskin Ahmed',
      'Mehidy Hasan Miraz',
      'Najmul Hossain Shanto',
      'Towhid Hridoy',
      'Shoriful Islam',
      'Mahmudullah',
      'Tanzid Hasan',
      'Rishad Hossain',
      'Hasan Mahmud',
    ],
  },
  {
    country: 'India',
    code: 'IND',
    divisions: [
      {
        name: 'Maharashtra',
        districts: [
          { name: 'Mumbai City', clubs: ['Wankhede Warriors', 'Bandra Blasters', 'Shivaji Park Gymkhana'] },
          { name: 'Pune', clubs: ['Pune Panthers', 'Deccan Gymkhana', 'Shivajinagar CC'] },
          { name: 'Nagpur', clubs: ['Vidarbha Vipers', 'Orange City CC', 'Sitabuldi XI'] },
        ],
      },
      {
        name: 'Karnataka',
        districts: [
          { name: 'Bengaluru Urban', clubs: ['Chinnaswamy Challengers', 'Cubbon Park CC', 'Indiranagar XI'] },
          { name: 'Mysuru', clubs: ['Mysore Palace Kings', 'Chamundi CC', 'KRS Strikers'] },
        ],
      },
      {
        name: 'Delhi NCR',
        districts: [
          { name: 'Central Delhi', clubs: ['Feroz Shah CC', 'Connaught Strikers', 'Kotla Kings'] },
          { name: 'South Delhi', clubs: ['Hauz Khas CC', 'Saket Smashers', 'Greater Kailash XI'] },
        ],
      },
      {
        name: 'Tamil Nadu',
        districts: [
          { name: 'Chennai', clubs: ['Chepauk Champions', 'Marina Bay CC', 'Mylapore Strikers'] },
          { name: 'Coimbatore', clubs: ['Kovai Kings', 'Siruvani CC', 'RS Puram XI'] },
        ],
      },
      {
        name: 'West Bengal',
        districts: [
          { name: 'Kolkata', clubs: ['Eden Gardens CC', 'Kalighat Club', 'Mohun Bagan CC'] },
          { name: 'Howrah', clubs: ['Howrah Bridge CC', 'Shibpur Strikers', 'Belur XI'] },
        ],
      },
    ],
    domesticClubs: [
      'Mumbai Ranji Team',
      'Karnataka State XI',
      'Tamil Nadu Cricket Team',
      'Delhi State Cricket Team',
      'Bengal Ranji Squad',
      'Saurashtra State Team',
    ],
    nationalTeammates: [
      'Rohit Sharma',
      'Virat Kohli',
      'Jasprit Bumrah',
      'Shubman Gill',
      'Ravindra Jadeja',
      'KL Rahul',
      'Hardik Pandya',
      'Mohammed Siraj',
      'Kuldeep Yadav',
      'Rishabh Pant',
      'Yashasvi Jaiswal',
      'Suryakumar Yadav',
      'Axar Patel',
      'Arshdeep Singh',
    ],
  },
  {
    country: 'Australia',
    code: 'AUS',
    divisions: [
      {
        name: 'New South Wales',
        districts: [
          { name: 'Sydney Metro', clubs: ['SCG Strikers', 'Bondi Bay CC', 'Parramatta Patriots'] },
          { name: 'Newcastle', clubs: ['Hunter Valley CC', 'Newcastle Knights CC', 'Port Hunter XI'] },
        ],
      },
      {
        name: 'Victoria',
        districts: [
          { name: 'Melbourne Central', clubs: ['MCG Masters', 'Yarra CC', 'St Kilda Strikers'] },
          { name: 'Geelong', clubs: ['Kardinia Kings', 'Corio Bay CC', 'Bell Peninsula XI'] },
        ],
      },
      {
        name: 'Queensland',
        districts: [
          { name: 'Brisbane', clubs: ['Gabba Gladiators', 'River City CC', 'Gold Coast Strikers'] },
        ],
      },
      {
        name: 'Western Australia',
        districts: [
          { name: 'Perth', clubs: ['WACA Warriors', 'Fremantle CC', 'Swan River XI'] },
        ],
      },
    ],
    domesticClubs: [
      'New South Wales Blues',
      'Victoria Bushrangers',
      'Queensland Bulls',
      'Western Australia Warriors',
      'South Australia Redbacks',
      'Tasmanian Tigers',
    ],
    nationalTeammates: [
      'Pat Cummins',
      'Steve Smith',
      'Mitchell Starc',
      'Travis Head',
      'Marnus Labuschagne',
      'Josh Hazlewood',
      'Glenn Maxwell',
      'David Warner',
      'Mitchell Marsh',
      'Adam Zampa',
      'Alex Carey',
      'Cameron Green',
    ],
  },
  {
    country: 'England',
    code: 'ENG',
    divisions: [
      {
        name: 'Greater London',
        districts: [
          { name: 'St Johns Wood', clubs: ["Lord's CC", 'Marylebone Academy', 'Regent Park XI'] },
          { name: 'Kennington', clubs: ['The Oval Champions', 'Vauxhall CC', 'Thames Strikers'] },
        ],
      },
      {
        name: 'Yorkshire',
        districts: [
          { name: 'Leeds', clubs: ['Headingley Heroes', 'White Rose CC', 'Kirkstall XI'] },
        ],
      },
      {
        name: 'Lancashire',
        districts: [
          { name: 'Manchester', clubs: ['Old Trafford Titans', 'Red Rose CC', 'Salford Strikers'] },
        ],
      },
      {
        name: 'Warwickshire',
        districts: [
          { name: 'Birmingham', clubs: ['Edgbaston Eagles', 'Brummie Strikers', 'Solihull CC'] },
        ],
      },
    ],
    domesticClubs: [
      'Surrey County Cricket Club',
      'Yorkshire County Cricket Club',
      'Lancashire Cricket Club',
      'Warwickshire CCC',
      'Somerset CCC',
      'Hampshire Cricket',
    ],
    nationalTeammates: [
      'Joe Root',
      'Ben Stokes',
      'Harry Brook',
      'Jofra Archer',
      'Jos Buttler',
      'Jonny Bairstow',
      'Mark Wood',
      'Adil Rashid',
      'Gus Atkinson',
      'Sam Curran',
      'Liam Livingstone',
    ],
  },
  {
    country: 'Pakistan',
    code: 'PAK',
    divisions: [
      {
        name: 'Punjab',
        districts: [
          { name: 'Lahore', clubs: ['Gaddafi Gladiators', 'Model Town CC', 'Mall Road XI'] },
          { name: 'Rawalpindi', clubs: ['Pindi Express CC', 'Ayub Park XI', 'Potohar Strikers'] },
        ],
      },
      {
        name: 'Sindh',
        districts: [
          { name: 'Karachi', clubs: ['National Stadium CC', 'Clifton Champions', 'Nazimabad XI'] },
        ],
      },
      {
        name: 'KPK',
        districts: [
          { name: 'Peshawar', clubs: ['Peshawar Panthers', 'Khyber CC', 'Hayatabad XI'] },
        ],
      },
    ],
    domesticClubs: [
      'SNGPL Cricket Team',
      'WAPDA Cricket Team',
      'KRL Cricket Team',
      'State Bank of Pakistan Team',
      'Karachi Whites',
      'Lahore Whites',
    ],
    nationalTeammates: [
      'Babar Azam',
      'Shaheen Afridi',
      'Mohammad Rizwan',
      'Naseem Shah',
      'Shadab Khan',
      'Fakhar Zaman',
      'Haris Rauf',
      'Saim Ayub',
      'Agha Salman',
      'Aamer Jamal',
    ],
  },
  {
    country: 'South Africa',
    code: 'SA',
    divisions: [
      {
        name: 'Gauteng',
        districts: [
          { name: 'Johannesburg', clubs: ['Wanderers Warriors', 'Sandton Strikers', 'Soweto CC'] },
        ],
      },
      {
        name: 'Western Cape',
        districts: [
          { name: 'Cape Town', clubs: ['Newlands Knights', 'Table Mountain CC', 'Camps Bay XI'] },
        ],
      },
    ],
    domesticClubs: [
      'Lions Cricket',
      'Western Province',
      'Titans Cricket',
      'Dolphins Cricket',
      'Warriors Cricket',
    ],
    nationalTeammates: [
      'Kagiso Rabada',
      'Heinrich Klaasen',
      'Quinton de Kock',
      'Aiden Markram',
      'David Miller',
      'Keshav Maharaj',
      'Anrich Nortje',
      'Marco Jansen',
    ],
  },
  {
    country: 'New Zealand',
    code: 'NZ',
    divisions: [
      {
        name: 'Auckland Region',
        districts: [
          { name: 'Auckland City', clubs: ['Eden Park Eagles', 'Waitemata CC', 'Ponsonby XI'] },
        ],
      },
      {
        name: 'Canterbury',
        districts: [
          { name: 'Christchurch', clubs: ['Hagley Oval CC', 'Avon Strikers', 'Riccarton XI'] },
        ],
      },
    ],
    domesticClubs: [
      'Auckland Aces',
      'Canterbury Kings',
      'Wellington Firebirds',
      'Otago Volts',
      'Central Stags',
      'Northern Brave',
    ],
    nationalTeammates: [
      'Kane Williamson',
      'Trent Boult',
      'Rachin Ravindra',
      'Devon Conway',
      'Mitchell Santner',
      'Daryl Mitchell',
      'Tim Southee',
      'Matt Henry',
    ],
  },
  {
    country: 'West Indies',
    code: 'WI',
    divisions: [
      {
        name: 'Barbados',
        districts: [
          { name: 'Bridgetown', clubs: ['Kensington Oval CC', 'Carlisle Bay XI', 'Cave Hill CC'] },
        ],
      },
      {
        name: 'Jamaica',
        districts: [
          { name: 'Kingston', clubs: ['Sabina Park Smashers', 'Blue Mountain CC', 'Halfway Tree XI'] },
        ],
      },
    ],
    domesticClubs: [
      'Barbados Pride',
      'Guyana Harpy Eagles',
      'Jamaica Scorpions',
      'Trinidad & Tobago Red Force',
      'Leeward Islands Hurricanes',
    ],
    nationalTeammates: [
      'Nicholas Pooran',
      'Andre Russell',
      'Shai Hope',
      'Alzarri Joseph',
      'Shimron Hetmyer',
      'Gudakesh Motie',
      'Akeal Hosein',
      'Rovman Powell',
    ],
  },
  {
    country: 'Sri Lanka',
    code: 'SL',
    divisions: [
      {
        name: 'Western Province',
        districts: [
          { name: 'Colombo', clubs: ['Premadasa Panthers', 'Sinhalese SC', 'Nondescripts CC'] },
        ],
      },
      {
        name: 'Central Province',
        districts: [
          { name: 'Kandy', clubs: ['Pallekele Strikers', 'Kandy CC', 'Hill Country XI'] },
        ],
      },
    ],
    domesticClubs: [
      'Sinhalese Sports Club (SSC)',
      'Colombo Cricket Club (CCC)',
      'Nondescripts Cricket Club (NCC)',
      'Tamil Union C&AC',
    ],
    nationalTeammates: [
      'Wanindu Hasaranga',
      'Pathum Nissanka',
      'Kusal Mendis',
      'Maheesh Theekshana',
      'Matheesha Pathirana',
      'Charith Asalanka',
      'Dasun Shanaka',
    ],
  },
  {
    country: 'Afghanistan',
    code: 'AFG',
    divisions: [
      {
        name: 'Kabul Province',
        districts: [
          { name: 'Kabul City', clubs: ['Kabul Eagles', 'Chaman-e-Hozori CC', 'Paghman Strikers'] },
        ],
      },
      {
        name: 'Nangarhar',
        districts: [
          { name: 'Jalalabad', clubs: ['Spinghar Tigers', 'Nangarhar Lions', 'Khyber Pass XI'] },
        ],
      },
    ],
    domesticClubs: [
      'Band-e-Amir Dragons',
      'Boost Defenders',
      'Mis Ainak Knights',
      'Speen Ghar Tigers',
      'Amo Sharks',
    ],
    nationalTeammates: [
      'Rashid Khan',
      'Rahmanullah Gurbaz',
      'Mohammad Nabi',
      'Fazalhaq Farooqi',
      'Azmatullah Omarzai',
      'Noor Ahmad',
      'Ibrahim Zadran',
      'Naveen-ul-Haq',
    ],
  },
];

export interface FranchiseLeague {
  id: string;
  name: string;
  shortName: string;
  country: string;
  teams: Array<{ name: string; city: string }>;
}

export const FRANCHISE_LEAGUES: FranchiseLeague[] = [
  {
    id: 'bpl',
    name: 'Bangladesh Premier League',
    shortName: 'BPL',
    country: 'Bangladesh',
    teams: [
      { name: 'Dhaka Dominators', city: 'Dhaka' },
      { name: 'Comilla Victorians', city: 'Comilla' },
      { name: 'Sylhet Strikers', city: 'Sylhet' },
      { name: 'Fortune Barishal', city: 'Barishal' },
      { name: 'Rangpur Riders', city: 'Rangpur' },
      { name: 'Chattogram Challengers', city: 'Chittagong' },
      { name: 'Khulna Tigers', city: 'Khulna' },
    ],
  },
  {
    id: 'ipl',
    name: 'Indian Premier League',
    shortName: 'IPL',
    country: 'India',
    teams: [
      { name: 'Chennai Super Kings', city: 'Chennai' },
      { name: 'Mumbai Indians', city: 'Mumbai' },
      { name: 'Royal Challengers Bengaluru', city: 'Bengaluru' },
      { name: 'Kolkata Knight Riders', city: 'Kolkata' },
      { name: 'Gujarat Titans', city: 'Ahmedabad' },
      { name: 'Rajasthan Royals', city: 'Jaipur' },
      { name: 'Delhi Capitals', city: 'Delhi' },
      { name: 'Sunrisers Hyderabad', city: 'Hyderabad' },
    ],
  },
  {
    id: 'psl',
    name: 'Pakistan Super League',
    shortName: 'PSL',
    country: 'Pakistan',
    teams: [
      { name: 'Lahore Qalandars', city: 'Lahore' },
      { name: 'Karachi Kings', city: 'Karachi' },
      { name: 'Islamabad United', city: 'Islamabad' },
      { name: 'Peshawar Zalmi', city: 'Peshawar' },
      { name: 'Multan Sultans', city: 'Multan' },
      { name: 'Quetta Gladiators', city: 'Quetta' },
    ],
  },
  {
    id: 'bbl',
    name: 'Big Bash League',
    shortName: 'Big Bash',
    country: 'Australia',
    teams: [
      { name: 'Sydney Sixers', city: 'Sydney' },
      { name: 'Perth Scorchers', city: 'Perth' },
      { name: 'Melbourne Stars', city: 'Melbourne' },
      { name: 'Adelaide Strikers', city: 'Adelaide' },
      { name: 'Brisbane Heat', city: 'Brisbane' },
      { name: 'Hobart Hurricanes', city: 'Hobart' },
    ],
  },
  {
    id: 'the_hundred',
    name: 'The Hundred',
    shortName: 'The Hundred',
    country: 'England',
    teams: [
      { name: 'London Spirit', city: 'London' },
      { name: 'Oval Invincibles', city: 'London' },
      { name: 'Manchester Originals', city: 'Manchester' },
      { name: 'Northern Superchargers', city: 'Leeds' },
      { name: 'Trent Rockets', city: 'Nottingham' },
      { name: 'Southern Brave', city: 'Southampton' },
    ],
  },
  {
    id: 'sa20',
    name: 'SA20 League',
    shortName: 'SA20',
    country: 'South Africa',
    teams: [
      { name: 'Sunrisers Eastern Cape', city: 'Gqeberha' },
      { name: 'Durban Super Giants', city: 'Durban' },
      { name: 'MI Cape Town', city: 'Cape Town' },
      { name: 'Joburg Super Kings', city: 'Johannesburg' },
      { name: 'Paarl Royals', city: 'Paarl' },
      { name: 'Pretoria Capitals', city: 'Pretoria' },
    ],
  },
  {
    id: 'cpl',
    name: 'Caribbean Premier League',
    shortName: 'CPL',
    country: 'West Indies',
    teams: [
      { name: 'Trinbago Knight Riders', city: 'Trinidad' },
      { name: 'Guyana Amazon Warriors', city: 'Guyana' },
      { name: 'Barbados Royals', city: 'Barbados' },
      { name: 'Jamaica Tallawahs', city: 'Jamaica' },
      { name: 'St Lucia Kings', city: 'St Lucia' },
    ],
  },
  {
    id: 'mlc',
    name: 'Major League Cricket',
    shortName: 'MLC',
    country: 'USA',
    teams: [
      { name: 'MI New York', city: 'New York' },
      { name: 'Texas Super Kings', city: 'Dallas' },
      { name: 'Seattle Orcas', city: 'Seattle' },
      { name: 'San Francisco Unicorns', city: 'San Francisco' },
      { name: 'Washington Freedom', city: 'Washington' },
      { name: 'LA Knight Riders', city: 'Los Angeles' },
    ],
  },
];

// Starter Player ID set from GLOBAL_PLAYERS_DATABASE
export const STARTER_PLAYER_IDS = new Set([
  'ban_mohammad_naim',
  'ind_tilak_varma',
  'ind_rinku_singh',
  'afg_sediqullah_atal',
  'ban_jaker_ali_anik',
  'afg_ikram_alikhil',
  'ban_shamim_hossain_patwary',
  'ban_mohammad_saifuddin',
  'pak_saim_ayub',
  'pak_aamer_jamal',
  'ban_hasan_mahmud',
  'ban_tanzim_hasan_sakib',
  'ind_mayank_yadav',
  'ind_ravi_bishnoi',
  'pak_abbas_afridi',
  'sa_kwena_maphaka',
  'afg_allah_ghazanfar',
]);

/**
 * Calculates player tier from overall rating
 */
export function calculatePlayerTier(rating: number): PlayerTier {
  if (rating >= 93) return 6 as PlayerTier; // Legend
  if (rating >= 89) return 5 as PlayerTier; // World-Class
  if (rating >= 84) return 4 as PlayerTier; // Star
  if (rating >= 78) return 3 as PlayerTier; // International
  if (rating >= 71) return 2 as PlayerTier; // Domestic Pro
  return 1 as PlayerTier; // Local Talent
}

/**
 * Converts a GlobalCricketPlayer to a DreamPlayer for Dream Team Mode
 */
export function convertGlobalToDreamPlayer(
  p: GlobalCricketPlayer,
  forceStarter?: boolean
): DreamPlayer {
  const batting = p.batting_attributes?.battingAbility ?? p.overall_rating;
  const bowling = p.bowling_attributes?.bowlingAbility ?? 25;
  const fielding = p.fielding_attributes?.fielding ?? 75;

  let rarity: 'Bronze' | 'Silver' | 'Gold' | 'Diamond' | 'Legend' = 'Bronze';
  if (p.category === 'LEGENDARY' || p.overall_rating >= 89) {
    rarity = 'Legend';
  } else if (p.category === 'SUPERSTAR' || p.overall_rating >= 84) {
    rarity = 'Diamond';
  } else if (p.overall_rating >= 78) {
    rarity = 'Gold';
  } else if (p.overall_rating >= 71) {
    rarity = 'Silver';
  }

  const marketValue = p.market_value || Math.round(p.overall_rating * 40);

  // Generate deterministic jersey number from player_id
  let hash = 0;
  for (let i = 0; i < p.player_id.length; i++) {
    hash = (hash * 31 + p.player_id.charCodeAt(i)) % 99;
  }
  const jerseyNumber = (Math.abs(hash) % 99) + 1;

  const isStarter =
    forceStarter !== undefined ? forceStarter : STARTER_PLAYER_IDS.has(p.player_id);

  return {
    id: p.player_id,
    name: p.name,
    country: p.country,
    countryCode: p.country_code,
    category: p.category,
    age: p.age,
    role: p.primary_role,
    roleSubType: p.secondary_role || p.primary_role,
    rating: p.overall_rating,
    baseRating: p.base_rating,
    maxUpgrade: p.max_upgrade,
    upgradeLevel: p.upgrade_level,
    careerStatus: p.career_status === 'Retired' ? 'Retired' : 'Active',
    batting,
    bowling,
    fielding,
    marketValue,
    form:
      p.form_status === 'Excellent'
        ? 'Excellent'
        : p.form_status === 'Good'
        ? 'Good'
        : p.form_status === 'Average'
        ? 'Average'
        : 'Good',
    rarity,
    isStarter,
    jerseyNumber,
  };
}

/**
 * Converts a GlobalCricketPlayer to a GlobalMarketPlayer for Manager Career & Transfer Market
 */
export function convertGlobalToMarketPlayer(
  p: GlobalCricketPlayer,
  existingState?: Partial<GlobalMarketPlayer>
): GlobalMarketPlayer {
  const tier = calculatePlayerTier(p.overall_rating);

  const batting = p.batting_attributes?.battingAbility ?? p.overall_rating;
  const bowling = p.bowling_attributes?.bowlingAbility ?? 25;
  const fielding = p.fielding_attributes?.fielding ?? 75;

  // Tier based financial requirements
  const tierMultipliers: Record<number, { signing: number; salary: number; minRep: number; minClubTier: number }> = {
    6: { signing: 12000, salary: 2200, minRep: 400, minClubTier: 5 },
    5: { signing: 7500, salary: 1400, minRep: 280, minClubTier: 4 },
    4: { signing: 4200, salary: 850, minRep: 190, minClubTier: 3 },
    3: { signing: 2200, salary: 500, minRep: 120, minClubTier: 2 },
    2: { signing: 1100, salary: 280, minRep: 60, minClubTier: 1 },
    1: { signing: 450, salary: 120, minRep: 0, minClubTier: 1 },
  };

  const config = tierMultipliers[tier] || tierMultipliers[1];
  const signingCost = p.market_value || Math.round(config.signing * (p.overall_rating / 80));
  const salaryPerSeason = p.salary_expectation || Math.round(config.salary * (p.overall_rating / 80));

  return {
    id: p.player_id,
    name: p.name,
    country: p.country,
    countryCode: p.country_code,
    category: p.category,
    age: p.age,
    role: p.primary_role,
    roleSubType: p.secondary_role || p.primary_role,
    rating: p.overall_rating,
    baseRating: p.base_rating,
    maxUpgrade: p.max_upgrade,
    upgradeLevel: p.upgrade_level,
    careerStatus: p.career_status === 'Retired' ? 'Retired' : 'Active',
    batting,
    bowling,
    fielding,
    tier,
    minReputationRequired: config.minRep,
    minClubTierLevel: config.minClubTier,
    signingCost,
    salaryPerSeason,
    ownershipState: existingState?.ownershipState || (p.career_status === 'Retired' ? 'RETIRED' : 'AVAILABLE'),
    ownerClubId: existingState?.ownerClubId || null,
    ownerClubName: existingState?.ownerClubName || null,
    ownerManagerName: existingState?.ownerManagerName || null,
    signedAt: existingState?.signedAt || null,
    contractYears: existingState?.contractYears || 2,
    ownershipHistory: existingState?.ownershipHistory || [],
  };
}

// Authoritative Master Player Database for Dream Team & Opponents generated from all 704 global players
export const MASTER_PLAYER_DATABASE: DreamPlayer[] = GLOBAL_PLAYERS_DATABASE.map((p) =>
  convertGlobalToDreamPlayer(p)
);
