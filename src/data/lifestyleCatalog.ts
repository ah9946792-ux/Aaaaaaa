import { LifestyleItem } from '../types';

export const LIFESTYLE_CATALOG: LifestyleItem[] = [
  // --- GEAR & BATS ---
  {
    id: 'life_bat_pro',
    name: 'Grade 1 English Willow Pro Bat',
    category: 'gear',
    price: 3500,
    icon: 'Sword',
    prestigeBoost: 25,
    description: 'Custom handcrafted cleft with monstrous 42mm edges and supreme sweet spot.',
    purchased: false,
  },
  {
    id: 'life_kit_titanium',
    name: 'Titanium Guard & Carbon Armor Set',
    category: 'kit',
    price: 2200,
    icon: 'Shield',
    prestigeBoost: 15,
    description: 'Ultra-lightweight high-impact protection pads, gloves, and helmet.',
    purchased: false,
  },
  {
    id: 'life_spikes_signature',
    name: 'Custom Signature Fast Spikes',
    category: 'gear',
    price: 1800,
    icon: 'Zap',
    prestigeBoost: 12,
    description: 'Bespoke grip footwear engineered for rapid crease agility and explosive bowling.',
    purchased: false,
  },

  // --- HOUSING ---
  {
    id: 'life_house_condo',
    name: 'Downtown High-Rise Penthouse',
    category: 'housing',
    price: 45000,
    icon: 'Building',
    prestigeBoost: 150,
    description: 'Panoramic city skyline views, personal gym, recovery spa, and infinity pool.',
    purchased: false,
  },
  {
    id: 'life_house_estate',
    name: 'Private Countryside Mansion & Net Pitch',
    category: 'housing',
    price: 120000,
    icon: 'Home',
    prestigeBoost: 400,
    description: 'Exclusive 10-acre estate with private floodlit cricket training ground and biometric lab.',
    purchased: false,
  },

  // --- VEHICLES ---
  {
    id: 'life_car_sports',
    name: 'V8 Twin-Turbo Sports Coupe',
    category: 'vehicle',
    price: 35000,
    icon: 'Car',
    prestigeBoost: 110,
    description: 'Matte black aerodynamic powerhouse with 650 horsepower and launch control.',
    purchased: false,
  },
  {
    id: 'life_car_hyper',
    name: 'Carbon-Chassis Exotic Hypercar',
    category: 'vehicle',
    price: 180000,
    icon: 'Flame',
    prestigeBoost: 550,
    description: 'Ultra-exclusive track monster turning heads at every stadium red carpet.',
    purchased: false,
  },

  // --- LUXURY ---
  {
    id: 'life_lux_watch',
    name: 'Chronograph Tourbillon Timepiece',
    category: 'luxury',
    price: 15000,
    icon: 'Watch',
    prestigeBoost: 60,
    description: 'Limited edition luxury Swiss movement crafted from titanium and rose gold.',
    purchased: false,
  },
  {
    id: 'life_lux_jet',
    name: 'Private Jet Flight Membership',
    category: 'luxury',
    price: 90000,
    icon: 'Plane',
    prestigeBoost: 320,
    description: 'Fly anywhere in the world on-demand between international tours and franchise leagues.',
    purchased: false,
  },
];
