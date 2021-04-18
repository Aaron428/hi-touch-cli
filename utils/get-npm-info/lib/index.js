'use strict';

const axios = require('axios')
const urlJoin = require('url-join')
const semver = require('semver')

function getNpmInfo(npmName, registry) {
  if (!npmName) return null;
  const registryUrl = registry || getDefaultRegistry();
  const npmInfoUrl = urlJoin(registryUrl, npmName);
  console.log(npmInfoUrl);
}

function getDefaultRegistry(isOrigin=false) {
  return isOrigin
    ? 'https://registry.npmjs.org'
    : 'https://registry.npm.toabo.org';
}


module.exports = {
  getNpmInfo,
};