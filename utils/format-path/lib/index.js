'use strict';


const path = require('path')

module.exports = function formatPath(p) {
  if (p) {
    return path.rep === '/' ? p : p.replace(/\\/g, '/');
  }
  return p;
}
