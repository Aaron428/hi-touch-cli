'use strict';

const log = require('npmlog')

log.level = process.env.LOG_LEVEL || 'info'

log.addLevel('success', 2000, { fg: 'green', bold: true })

log.heading = 'hi-touch'
log.headingStyle = {bold: true};

module.exports = log;
