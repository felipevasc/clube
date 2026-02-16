import fs from 'fs';
import * as lu from './node_modules/react-icons/lu/index.mjs';

const keys = Object.keys(lu).sort();
fs.writeFileSync('lu_icons.txt', keys.join('\n'));
console.log('Saved ' + keys.length + ' icons to lu_icons.txt');
