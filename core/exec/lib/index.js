'use strict';

const Package = require('@touch-cli/package');
const log = require('@touch-cli/log')

const SETTINGS = {
  init: '@touch-cli/init'
}

function exec() {
  
  let targetPath = process.env.CLI_TARGET_PATH;
  // const homePath = process.env.CLI_HOME_PATH;
  
  log.verbose('targetPath', targetPath);
  // log.verbose('homePath', homePath);
  if (!targetPath) {
    // 生成缓存路径
    targetPath = ''; 
  }
  const cmdObj = arguments[arguments.length - 1]
  const packageName = SETTINGS[cmdObj.name()];
  const packageVersion = 'latest'
  const options = {
    targetPath,
    packageName,
    packageVersion,
  };
  const pkg = new Package(options);
  console.log(pkg.getRootFilePath());
  // console.log(pkg);
  // console.log(process.env.CLI_TARGET_PATH)
}


module.exports = exec;
