const fs = require('fs');
const path = require('path');
const { p } = require('./player_builder_base');

// We will write modular builders for all 20 countries to ensure 100% data integrity and standard schemas.
console.log('Starting full 20-country global cricket database generator...');
