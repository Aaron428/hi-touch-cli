#! /usr/bin/env node

const importLocal = require('import-local');

if(importLocal(__filename)) {
  require('npmlog').info('cli', 'you are using touch-cli local version')
} else {
  require('../lib')(process.argv.slice(2))
}
