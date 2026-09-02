const fs = require('fs');
const path = require('path');

// Ensure scripts have executed
require('./generate_pakistan');
require('./generate_australia');
require('./generate_england');
require('./generate_southafrica');
require('./generate_westindies');
require('./generate_newzealand');
require('./generate_srilanka');
require('./generate_afg_zim');
require('./generate_ire_sco_ned');
require('./generate_final_6');

console.log('All generators ran successfully.');
